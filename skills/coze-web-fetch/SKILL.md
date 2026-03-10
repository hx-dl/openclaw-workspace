---
name: coze-web-fetch
description: 使用 Coze SDK 获取和提取网页内容，支持文章、PDF、图片等
---

# Coze Web Fetch

使用 Coze SDK 获取和提取网页内容的 Skill。

## 功能

- 获取网页内容并提取文字
- 支持 PDF、Word、Excel 等文档
- 支持图片 OCR 识别
- 获取链接中的图片和多媒体

## 使用

### 命令行

```bash
npx ts-node scripts/fetch.ts --url "https://example.com/article"
```

### 参数

- `--url`: 要获取的网页 URL（必填）
- `--format`: 输出格式（text/markdown/json）

## 示例

```bash
# 获取文章
npx ts-node scripts/fetch.ts --url "https://example.com/article"

# 获取 PDF
npx ts-node scripts/fetch.ts --url "https://example.com/doc.pdf"
```

标签: #coze #web-fetch #content-extraction #skill
