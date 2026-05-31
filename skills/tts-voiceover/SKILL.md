---
name: tts-voiceover
description: Generate natural Chinese voiceover audio from scripts/text using Microsoft Edge TTS. Multiple voices, dual-layer pause control (sentence-end 0.6s / comma 0.2s). Use when user asks to generate voiceover, 配音, TTS, 语音, 朗读, or 念稿子.
---

# TTS Voiceover — 中文配音生成

Generate natural-sounding Chinese voiceover from text scripts. Powered by Microsoft Edge TTS (free, 300+ neural voices, no GPU needed). Outputs MP3 with automatic pause control.

## Quick Start

```bash
python ~/.claude/skills/tts-voiceover/scripts/tts.py edge "你的文案。"
```

Output: `D:/cc/tts_output.mp3`

## Voice Selection

```
女声: zh-CN-XiaoxiaoNeural(晓晓)  zh-CN-XiaoyiNeural(晓伊)
男声: zh-CN-YunyangNeural(云扬)   zh-CN-YunjianNeural(云健)
       zh-CN-YunxiNeural(云希)     zh-CN-YunxiaNeural(云霞)
台湾: zh-TW-HsiaoChenNeural(晓臻) zh-TW-YunJheNeural(云哲)
粤语: zh-HK-HiuGaaiNeural(晓佳)   zh-HK-WanLungNeural(云龙)
```

## Pause Control

Default pauses: 0.6s after `。！？` (sentence end), 0.2s after `，；、` (comma).

Customize:
```bash
# Full control: python tts.py edge <text> <voice> <output> <long_pause> <short_pause>
python ~/.claude/skills/tts-voiceover/scripts/tts.py edge \
  "第一句。第二句，半句。" zh-CN-XiaoxiaoNeural D:/cc/out.mp3 0.8 0.3
```

## Multiple Voice Samples

When user wants to compare voices, generate one sample per voice:
```bash
for v in zh-CN-XiaoxiaoNeural zh-CN-XiaoyiNeural zh-CN-YunyangNeural; do
  python ~/.claude/skills/tts-voiceover/scripts/tts.py edge \
    "测试文案。" $v D:/cc/voice_${v##*-}.mp3
done
```

## Important Notes

- Requires: `pip install edge-tts` (already installed)
- Requires: FFmpeg in PATH for pause splicing
- Output directory must exist (default D:/cc/)
- Always confirm the output file is generated before telling user
- If user wants different voices for different characters/sections, generate separately per voice
