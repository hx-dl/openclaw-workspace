---
name: coze-web-search
description: 使用 Coze SDK 进行网页搜索，获取搜索结果和 AI 摘要
---

# Coze Web Search

使用 Coze SDK 进行网页搜索的 Skill。

## 功能

- 网页搜索
- 获取 AI 摘要
- 时间过滤（最近一天/一周/一月）
- 站点限定搜索

## 使用

### 命令行

```bash
npx ts-node scripts/search.ts -q "搜索关键词"
npx ts-node scripts/search.ts -q "OpenAI" --time-range 1d
npx ts-node scripts/search.ts -q "TypeScript" --site github.com
```

### 参数

- `-q, --query`: 搜索关键词（必填）
- `--time-range`: 时间范围（1d/1w/1m）
- `--site`: 限定站点
- `--count`: 结果数量（默认 10）

## 示例

```bash
# 搜索小米热搜
npx ts-node scripts/search.ts -q "小米 微博热搜" --time-range 1d --count 10

# 搜索技术文档
npx ts-node scripts/search.ts -q "React 19" --site react.dev
```

标签: #coze #web-search #search #skill
