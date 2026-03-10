#!/usr/bin/env npx ts-node
/**
 * Coze Web Fetch
 * 
 * 使用方法:
 *   npx ts-node fetch.ts --url "https://example.com"
 */

import { CozeAPI } from 'coze-coding-dev-sdk';

interface FetchOptions {
  url: string;
  format?: string;
}

function parseArgs(): FetchOptions {
  const args = process.argv.slice(2);
  let url = '';
  let format = 'text';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
        url = args[++i];
        break;
      case '--format':
        format = args[++i];
        break;
    }
  }

  return { url, format };
}

async function fetchContent(options: FetchOptions): Promise<void> {
  console.log(`📥 获取: ${options.url}`);
  console.log(`📄 格式: ${options.format}`);
  
  // 这里应该调用 Coze SDK 获取内容
  console.log('\n⚠️ 提示: 需要配置 COZE_TOKEN 环境变量');
}

async function main() {
  const options = parseArgs();
  
  if (!options.url) {
    console.log(`
📥 Coze Web Fetch

用法:
  npx ts-node fetch.ts --url "网页地址" [选项]

选项:
  --url       网页地址（必填）
  --format    输出格式: text/markdown/json（默认: text）

示例:
  npx ts-node fetch.ts --url "https://example.com/article"
  npx ts-node fetch.ts --url "https://example.com/doc.pdf"
`);
    process.exit(1);
  }
  
  await fetchContent(options);
}

main();
