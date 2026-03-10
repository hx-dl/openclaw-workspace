---
name: feishu-voice
description: Send voice messages to Feishu (Lark) - convert text to speech and send as voice bubbles, not file attachments
---

# Feishu Voice

Send voice messages to Feishu users and groups. This skill converts text to speech and sends it as a proper voice message (voice bubble) rather than a file attachment.

## When to use this skill

Use this skill when you need to:
- Send voice messages to Feishu users or groups
- Convert text to speech and deliver it as a voice bubble
- Automate voice notifications or alerts

## Requirements

- ffmpeg installed (for audio format conversion)
- Feishu app credentials (App ID and App Secret)
- Coze voice generation SDK or similar TTS service

## How to send a voice message

### 1. Set up environment variables

```bash
export FEISHU_APP_ID="your-app-id"
export FEISHU_APP_SECRET="your-app-secret"
```

### 2. Send voice to a user

```bash
npx ts-node scripts/send-voice.ts \
  --text "Hello, this is a voice message" \
  --to user \
  --id "ou_xxxxxx"
```

### 3. Send voice to a group chat

```bash
npx ts-node scripts/send-voice.ts \
  --text "Hello everyone" \
  --to chat \
  --id "oc_xxxxxx"
```

## How it works

The skill follows this process:
1. Generate MP3 audio using TTS (text-to-speech)
2. Convert MP3 to Opus format using ffmpeg
3. Upload the Opus file to Feishu to get a file_key
4. Send the voice message using the file_key

## Important notes

- **Audio format**: Feishu only accepts Opus format for voice messages. MP3 files will be treated as regular file attachments.
- **Duration unit**: The duration parameter must be in milliseconds, not seconds.
- **File type**: When uploading, the file_type must be set to "opus" and Content-Type must be "audio/opus".

## Voice speakers

The skill supports multiple voice speakers. Check the full list at:
https://www.volcengine.com/docs/6561/1257544?lang=zh

Popular options:
- `zh_female_peiqi_uranus_bigtts` - Playful and cute (佩奇猪)
- `saturn_zh_female_tiaopigongzhu_tob` - Young female voice (调皮公主)
- `zh_male_m191_uranus_bigtts` - Young male voice (云舟)

## Examples

### Smart customer service
```bash
npx ts-node scripts/send-voice.ts \
  --text "Welcome! How can I help you today?" \
  --to user \
  --id "target-user-id"
```

### Schedule reminder
```bash
npx ts-node scripts/send-voice.ts \
  --text "Your meeting starts in 5 minutes" \
  --to user \
  --id "target-user-id"
```

### Weather report
```bash
npx ts-node scripts/send-voice.ts \
  --text "Good morning! Today will be sunny with a high of 25 degrees." \
  --to chat \
  --id "target-group-id"
```

## Troubleshooting

**Issue**: Voice message shows as a file instead of a voice bubble
- **Solution**: Make sure the audio is converted to Opus format. MP3 files will always show as file attachments.

**Issue**: Duration shows incorrectly (e.g., 15000s instead of 15s)
- **Solution**: The duration parameter must be in milliseconds. Multiply seconds by 1000.

**Issue**: Upload fails
- **Solution**: Verify that file_type is set to "opus" and Content-Type is "audio/opus".

## Security notes

- Never hardcode credentials in the code
- Use environment variables for App ID and App Secret
- Keep your credentials secure and don't commit them to version control
