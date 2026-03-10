---
name: coze-voice-gen
description: Coze Voice Generation - 使用 Coze API 生成语音
---

# Coze Voice Generation

使用 Coze API 生成语音的 Skill。

## 功能

- 文字转语音（TTS）
- 支持多种音色
- 可调节语速

## 使用

### 命令行

```bash
npx ts-node scripts/tts.ts --text "你好" --speaker zh_female_peiqi_uranus_bigtts --speech-rate -20
```

### 参数

- `--text`: 要转换的文字
- `--speaker`: 音色 ID
- `--speech-rate`: 语速调整（-50 到 50）

## 音色推荐

- `zh_female_peiqi_uranus_bigtts` - 俏皮可爱
- `saturn_zh_female_tiaopigongzhu_tob` - 年轻女声
- `zh_male_m191_uranus_bigtts` - 年轻男声

标签: #coze #voice #tts
