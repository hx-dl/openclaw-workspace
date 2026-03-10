---
name: skill-creator
description: 创建和管理 OpenClaw Skills - 快速生成标准化的技能模板
---

# Skill Creator

创建和管理 OpenClaw Skills 的工具，帮助快速生成标准化的技能模板。

## 功能

- 交互式创建新 Skill
- 自动生成标准目录结构
- 创建 SKILL.md 模板
- 创建 package.json
- 创建示例脚本

## 使用

### 命令行

```bash
npx ts-node scripts/creator.ts create
```

### 交互式流程

1. 输入 Skill 名称
2. 输入描述
3. 选择类别
4. 是否创建命令行工具
5. 自动生成本地代码

## 生成的目录结构

```
skills/your-skill/
├── SKILL.md          # 技能定义文档
├── package.json      # NPM 配置
└── scripts/
    └── main.ts       # 主脚本（可选）
```

## SKILL.md 模板

自动生成符合 agentskills.io 规范的 SKILL.md：
- YAML frontmatter (name, description)
- 使用说明
- 示例代码
- 标签

## 示例

```bash
$ npx ts-node scripts/creator.ts create
? Skill name: my-awesome-skill
? Description: 我的 awesome 技能
? Category: utility
? Create CLI tool? (y/n): y
✅ Skill created at: skills/my-awesome-skill/
```

标签: #skill-creator #scaffolding #generator #skill
