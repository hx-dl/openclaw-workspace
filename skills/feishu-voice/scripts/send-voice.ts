#!/usr/bin/env npx ts-node
/**
 * Feishu Voice Sender - Send voice messages to Feishu
 */

import * as fs from 'fs';
import { execSync } from 'child_process';

// Feishu app configuration (set via environment variables)
const FEISHU_APP_ID = process.env.FEISHU_APP_ID || 'YOUR_APP_ID';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || 'YOUR_APP_SECRET';

// Voice configuration
const VOICE_CONFIG = {
  speaker: process.env.VOICE_SPEAKER || 'zh_female_peiqi_uranus_bigtts',
  speechRate: parseInt(process.env.VOICE_RATE || '-20')
};

// Feishu API response type
interface FeishuResponse {
  code: number;
  msg: string;
  data?: {
    tenant_access_token?: string;
    file_key?: string;
    [key: string]: any;
  };
}

// Get tenant access token
async function getTenantToken(): Promise<string> {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET
    })
  });
  
  const data = await response.json() as FeishuResponse;
  if (data.code !== 0) {
    throw new Error(`Failed to get token: ${data.msg}`);
  }
  
  return data.data?.tenant_access_token || '';
}

// Generate TTS audio
async function generateTTS(text: string): Promise<string> {
  console.log('Generating voice...');
  
  // Adjust this path to your TTS script location
  const scriptPath = '/workspace/projects/workspace/skills/coze-voice-gen/scripts/tts.ts';
  const cmd = `npx ts-node ${scriptPath} --text "${text}" --speaker ${VOICE_CONFIG.speaker} --speech-rate ${VOICE_CONFIG.speechRate}`;
  
  const result = execSync(cmd, { encoding: 'utf-8', cwd: '/workspace/projects/workspace' });
  
  const urlMatch = result.match(/https:\/\/[^\s]+/);
  if (!urlMatch) {
    throw new Error('Failed to generate voice: could not get audio URL');
  }
  
  return urlMatch[0];
}

// Download file
async function downloadFile(url: string, outputPath: string): Promise<void> {
  execSync(`wget -q "${url}" -O ${outputPath}`);
}

// Convert to opus format
function convertToOpus(mp3Path: string, opusPath: string): void {
  execSync(`ffmpeg -i ${mp3Path} -c:a libopus -b:a 24k ${opusPath} -y`);
}

// Upload opus file
async function uploadOpus(filePath: string, token: string): Promise<{file_key: string, duration: number}> {
  console.log('Uploading to Feishu...');
  
  const fileSize = fs.statSync(filePath).size;
  const fileContent = fs.readFileSync(filePath);
  
  const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);
  const formData = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file_type"\r\n\r\nopus\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file_name"\r\n\r\nvoice.opus\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="voice.opus"\r\nContent-Type: audio/opus\r\n\r\n`),
    fileContent,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);
  
  const response = await fetch('https://open.feishu.cn/open-apis/im/v1/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: formData
  });
  
  const data = await response.json() as FeishuResponse;
  if (data.code !== 0) {
    throw new Error(`Upload failed: ${data.msg}`);
  }
  
  // Calculate duration in milliseconds
  const duration = Math.ceil(fileSize / (24 * 1024 / 8) * 1000);
  
  return {
    file_key: data.data?.file_key || '',
    duration: duration > 0 ? duration : 5000
  };
}

// Send voice message
async function sendVoiceMessage(
  receiveId: string,
  receiveType: 'user' | 'chat',
  fileKey: string,
  duration: number,
  token: string
): Promise<void> {
  console.log('Sending voice message...');
  
  const receiveIdType = receiveType === 'user' ? 'open_id' : 'chat_id';
  
  const content = JSON.stringify({
    file_key: fileKey,
    duration: duration
  });
  
  const response = await fetch(`https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=${receiveIdType}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      receive_id: receiveId,
      msg_type: 'audio',
      content: content
    })
  });
  
  const data = await response.json() as FeishuResponse;
  if (data.code !== 0) {
    throw new Error(`Send failed: ${data.msg}`);
  }
  
  console.log('Voice message sent successfully!');
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let text = '';
  let toType: 'user' | 'chat' = 'user';
  let toId = '';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--text' && i + 1 < args.length) {
      text = args[++i];
    } else if (args[i] === '--to' && i + 1 < args.length) {
      toType = args[++i] as 'user' | 'chat';
    } else if (args[i] === '--id' && i + 1 < args.length) {
      toId = args[++i];
    }
  }
  
  if (!text || !toId) {
    console.log(`
Feishu Voice Sender

Usage:
  npx ts-node send-voice.ts --text "message" --to user|chat --id "recipient-id"

Examples:
  # Send to user
  npx ts-node send-voice.ts --text "Hello" --to user --id ou_xxxxxx

  # Send to group
  npx ts-node send-voice.ts --text "Hi everyone" --to chat --id oc_xxxxxx

Environment variables:
  FEISHU_APP_ID       - Your Feishu app ID
  FEISHU_APP_SECRET   - Your Feishu app secret
  VOICE_SPEAKER       - Voice speaker ID (default: zh_female_peiqi_uranus_bigtts)
  VOICE_RATE          - Speech rate adjustment (default: -20)
`);
    process.exit(1);
  }
  
  try {
    console.log('Sending voice message...\n');
    
    // 1. Generate TTS
    const audioUrl = await generateTTS(text);
    console.log('Audio generated');
    
    // 2. Download MP3
    const tempDir = '/tmp/feishu-voice';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const mp3Path = `${tempDir}/voice_${Date.now()}.mp3`;
    await downloadFile(audioUrl, mp3Path);
    
    // 3. Convert to opus
    const opusPath = mp3Path.replace('.mp3', '.opus');
    convertToOpus(mp3Path, opusPath);
    
    // 4. Get token
    const token = await getTenantToken();
    
    // 5. Upload file
    const { file_key, duration } = await uploadOpus(opusPath, token);
    
    // 6. Send message
    await sendVoiceMessage(toId, toType, file_key, duration, token);
    
    // 7. Clean up temp files
    fs.unlinkSync(mp3Path);
    fs.unlinkSync(opusPath);
    
    console.log('\nDone!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);
