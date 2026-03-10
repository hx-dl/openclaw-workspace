# OpenClaw Workspace

OpenClaw 工作空间 - 统一管理所有技能和配置

## 目录结构

```
openclaw-workspace/
├── skills/                 # 所有技能目录
│   └── feishu-voice/      # 飞书语音消息发送技能
│       ├── SKILL.md       # 技能定义和使用说明
│       ├── package.json   # npm 配置
│       └── scripts/       # 可执行脚本
│           └── send-voice.ts
├── README.md              # 本文件
└── .gitignore            # Git 忽略配置
```

## Skills 列表

| 技能名称 | 描述 | 目录 |
|---------|------|------|
| feishu-voice | 发送飞书语音消息 | [skills/feishu-voice](./skills/feishu-voice) |

## 如何使用

### 克隆整个仓库

```bash
git clone https://github.com/hx-dl/openclaw-workspace.git
cd openclaw-workspace
```

### 使用特定技能

```bash
# 进入技能目录
cd skills/feishu-voice

# 查看使用说明
cat SKILL.md

# 执行技能
npx ts-node scripts/send-voice.ts --help
```

## 添加新技能

1. 在 `skills/` 目录下创建新文件夹
2. 添加 `SKILL.md` 文件（遵循 [agentskills.io](https://agentskills.io) 规范）
3. 添加必要的脚本和配置文件
4. 更新本 README.md 中的技能列表

## 规范

所有技能遵循 [Agent Skills 规范](https://agentskills.io)：
- 每个技能必须包含 `SKILL.md`（带 YAML frontmatter）
- 技能名称简短清晰
- 描述说明何时使用该技能
- 提供详细的使用说明和示例

## License

MIT
