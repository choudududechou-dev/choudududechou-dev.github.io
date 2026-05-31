"""多音色配音工具 — ChatTTS + Edge-TTS 双引擎"""
import sys, os

def text_to_ssml(text, pause_ms=400):
    """将普通文本插入 <break> 标签控制停顿（不套 <speak>，由 edge-tts 自动套）"""
    import re
    text = re.sub(r'([。！？])\s*', rf'\1<break time="{pause_ms}ms"/>', text)
    text = re.sub(r'([，；、])\s*', rf'\1<break time="{pause_ms//2}ms"/>', text)
    return text

def tts_edge(text, voice="zh-CN-XiaoxiaoNeural", out="output.mp3",
             pause_long=0.6, pause_short=0.2):
    """Edge-TTS: 按标点自动分层停顿。句末长停顿，逗号短停顿"""
    import subprocess
    try:
        from edge_tts import Communicate
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "edge-tts"], check=True)
        from edge_tts import Communicate
    import asyncio
    import re

    # 按句末标点拆大段
    sentences = re.split(r'(?<=[。！？])\s*', text)
    sentences = [s.strip() for s in sentences if s.strip()]

    if len(sentences) <= 1:
        async def _gen():
            with open(out, "wb") as f:
                async for chunk in Communicate(text, voice).stream():
                    if chunk["type"] == "audio":
                        f.write(chunk["data"])
        asyncio.run(_gen())
    else:
        import tempfile
        tmpdir = tempfile.mkdtemp()
        parts = []
        for si, sent in enumerate(sentences):
            # 段内按逗号拆短句
            clauses = re.split(r'(?<=[，；、])\s*', sent)
            clauses = [c.strip() for c in clauses if c.strip()]
            for ci, clause in enumerate(clauses):
                part_file = os.path.join(tmpdir, f"p_{si:03d}_{ci:03d}.mp3")
                async def _gen_one(t=clause, pf=part_file):
                    with open(pf, "wb") as f:
                        async for chunk in Communicate(t, voice).stream():
                            if chunk["type"] == "audio":
                                f.write(chunk["data"])
                asyncio.run(_gen_one())
                parts.append(part_file)
                # 逗号间短停顿
                if ci < len(clauses) - 1:
                    silence = os.path.join(tmpdir, f"s_{si:03d}_{ci:03d}.mp3")
                    subprocess.run(["ffmpeg", "-y", "-f", "lavfi",
                        "-i", "anullsrc=r=24000:cl=mono", "-t", str(pause_short),
                        "-codec:a", "libmp3lame", "-b:a", "48k", silence],
                        capture_output=True, timeout=10)
                    parts.append(silence)
            # 句末长停顿
            if si < len(sentences) - 1:
                silence = os.path.join(tmpdir, f"sl_{si:03d}.mp3")
                subprocess.run(["ffmpeg", "-y", "-f", "lavfi",
                    "-i", "anullsrc=r=24000:cl=mono", "-t", str(pause_long),
                    "-codec:a", "libmp3lame", "-b:a", "48k", silence],
                    capture_output=True, timeout=10)
                parts.append(silence)

        concat_list = os.path.join(tmpdir, "concat.txt")
        with open(concat_list, "w") as f:
            for p in parts:
                f.write(f"file '{p}'\n")
        subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", concat_list, "-codec", "copy", out],
            capture_output=True, timeout=30)
        import shutil
        shutil.rmtree(tmpdir, ignore_errors=True)
    print(f"OK → {out}")

def tts_chattts(text, seed=2, speed=3, out="output.wav"):
    """ChatTTS: 最自然的中文对话语音，需GPU"""
    import torch, chattts, soundfile
    chat = chattts.Chat()
    chat.load(compile=False)
    torch.manual_seed(seed)
    params = chattts.Chat.Config(speed=speed, oral=3, laugh=0)
    wavs = chat.infer([text], params_refine_text=params, use_decoder=True)
    soundfile.write(out, wavs[0], 24000)
    print(f"ChatTTS (seed={seed}) → {out}")

def list_edge_voices():
    """列出中文音色"""
    zh_voices = {
        "女声（普通话）": [
            ("zh-CN-XiaoxiaoNeural", "晓晓 - 标准女声"),
            ("zh-CN-XiaoyiNeural", "晓伊 - 温柔女声"),
        ],
        "男声（普通话）": [
            ("zh-CN-YunyangNeural", "云扬 - 新闻男声"),
            ("zh-CN-YunjianNeural", "云健 - 运动男声"),
            ("zh-CN-YunxiNeural", "云希 - 活泼男声"),
            ("zh-CN-YunxiaNeural", "云霞 - 稳重男声"),
        ],
        "台湾女声": [
            ("zh-TW-HsiaoChenNeural", "晓臻"),
        ],
        "台湾男声": [
            ("zh-TW-YunJheNeural", "云哲"),
        ],
        "粤语女声": [
            ("zh-HK-HiuGaaiNeural", "晓佳"),
        ],
        "粤语男声": [
            ("zh-HK-WanLungNeural", "云龙"),
        ],
    }
    for cat, voices in zh_voices.items():
        print(f"\n=== {cat} ===")
        for vid, desc in voices:
            print(f"  {vid}")
            print(f"    {desc}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法:")
        print("  python tts_test.py edge <文本>                  — 默认晓晓+句末0.6s逗号0.2s")
        print("  python tts_test.py edge <文本> <音色> <输出> <长停> <短停>")
        print("  python tts_test.py list                         — 列出中文音色")
        print("\n示例:")
        print("  python tts_test.py edge '句1。句2。'  # 默认停顿 0.6/0.2")
        print("  python tts_test.py edge '句1。句2。' zh-CN-YunyangNeural out.mp3 0.8 0.3")
        print("\n音色速查：")
        print("  女: zh-CN-XiaoxiaoNeural(晓晓) zh-CN-XiaoyiNeural(晓伊)")
        print("  男: zh-CN-YunyangNeural(云扬) zh-CN-YunjianNeural(云健) zh-CN-YunxiNeural(云希)")
        print("  台: zh-TW-HsiaoChenNeural(晓臻)  粤: zh-HK-HiuGaaiNeural(晓佳)")
        sys.exit(0)

    cmd = sys.argv[1]
    if cmd == "list":
        list_edge_voices()
    elif cmd == "edge":
        text = sys.argv[2] if len(sys.argv) > 2 else "你好，这是一段测试语音。"
        voice = sys.argv[3] if len(sys.argv) > 3 else "zh-CN-XiaoxiaoNeural"
        outfile = sys.argv[4] if len(sys.argv) > 4 else "D:/cc/tts_output.mp3"
        pl = float(sys.argv[5]) if len(sys.argv) > 5 else 0.6
        ps = float(sys.argv[6]) if len(sys.argv) > 6 else 0.2
        tts_edge(text, voice, outfile, pl, ps)
    elif cmd == "ssml":
        if len(sys.argv) > 2 and os.path.isfile(sys.argv[2]):
            with open(sys.argv[2], encoding="utf-8") as f:
                text = f.read().strip()
        else:
            text = sys.argv[2] if len(sys.argv) > 2 else '<speak>你好<break time="500ms"/>世界</speak>'
        voice = sys.argv[3] if len(sys.argv) > 3 else "zh-CN-XiaoxiaoNeural"
        outfile = sys.argv[4] if len(sys.argv) > 4 else "D:/cc/tts_output.mp3"
        tts_edge(text, voice, outfile)
    elif cmd == "chattts":
        text = sys.argv[2] if len(sys.argv) > 2 else "你好，这是一段测试语音。"
        tts_chattts(text)
    else:
        print(f"未知命令: {cmd}")
