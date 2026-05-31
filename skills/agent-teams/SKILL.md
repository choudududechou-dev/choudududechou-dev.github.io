---
name: agent-teams
description: >
  Claude Code 多智能体协作框架。通过 Command → Agent → Skill 架构模式，
  让多个 AI Agent 并行工作、各司其职。Use when 用户提到多智能体、Agent Team、
  多个 Agent、协作、并行、多机器人、agent-teams、编排、orchestrator、
  子代理并行、同时执行、分工合作、multi-agent、team work。
---

# Agent Teams — 多智能体协作框架

让 Claude Code 内部多个 Agent 并行协作。

## 架构

```
Command → Agent A + Agent B + Agent C → 汇聚结果
```

| 组件 | 位置 | 作用 |
|------|------|------|
| Command | `.claude/commands/<name>.md` | 编排流程，调度 Agent 和 Skill |
| Agent | `.claude/agents/<name>.md` | 执行具体任务，有专属工具和技能 |
| Skill | `.claude/skills/<name>/SKILL.md` | 领域知识，被 Agent 预加载 |

## 快速开始

参考仓库中的完整示例：`D:\cc\claude-code-best-practice\agent-teams\`

```bash
cd D:\cc\claude-code-best-practice\agent-teams
claude
/time-orchestrator
```

## 创建新 Agent Team

1. 在项目目录下创建 `.claude/agents/<name>.md` — Agent 定义
2. 创建 `.claude/commands/<name>.md` — Command 编排
3. 创建 `.claude/skills/<name>/SKILL.md` — Skill 领域知识
4. Agent 通过 `skills:` 字段预加载 Skill
5. Command 通过 Agent 工具调用 Agent，通过 Skill 工具调用 Skill

## Agent 模板

```markdown
---
name: my-agent
description: 用途描述
tools: Bash, Read, Write
model: haiku
color: blue
maxTurns: 5
skills:
  - my-skill
---

你是 xxx agent。你的任务是...
```

## Command 模板

```markdown
---
description: 编排描述
model: haiku
---

# Command Name

## Step 1: 调 Agent
使用 Agent 工具，subagent_type: "my-agent"

## Step 2: 调 Skill
使用 Skill 工具，skill: "my-skill"
```

## 实用场景

- 电商上架：内容 Agent + 图片 Agent + 数据 Agent 并行
- 代码开发：前端 Agent + 后端 Agent + 测试 Agent 分工
- 内容创作：文案 Agent + 配图 Agent + 发布 Agent 联动
