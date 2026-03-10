---
name: coze-image-gen
description: 使用 Coze SDK 生成图片，从文本描述创建图像
---

# Coze Image Generation

使用 Coze SDK 生成图片的 Skill。

## 功能

- 从文本描述生成图片
- 支持多种风格（写实、动漫、油画等）
- 支持图片尺寸调整
- 批量生成

## 使用

### 命令行

```bash
npx ts-node scripts/generate.ts --prompt "一只慵懒的橘猫在阳光下打盹"
```

### 参数

- `--prompt`: 图片描述（必填）
- `--style`: 风格（realistic/anime/oil/pixel）
- `--size`: 尺寸（1024x1024/512x512）
- `--count`: 生成数量（默认 1）

## 示例

```bash
# 生成橘猫图片
npx ts-node scripts/generate.ts --prompt "一只慵懒的橘猫在阳光下打盹，毛色金黄，表情慵懒" --style realistic

# 生成动漫风格
npx ts-node scripts/generate.ts --prompt "赛博朋克风格的城市夜景" --style anime
```

标签: #coze #image-generation #ai-art #skill
