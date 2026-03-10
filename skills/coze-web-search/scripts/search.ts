#!/usr/bin/env npx ts-node
/**
 * Coze Web Search
 * 
 * 使用方法:
 *   npx ts-node search.ts -q "搜索关键词"
 *   npx ts-node search.ts -q "小米" --time-range 1d
 */

import { CozeAPI } from 'coze-coding-dev-sdk';

interface SearchOptions {
  query: string;
  timeRange?: string;
  site?: string;
  count?: number;
}

function parseArgs(): SearchOptions {
  const args = process.argv.slice(2);
  let query = '';
  let timeRange: string | undefined;
  let site: string | undefined;
  let count = 10;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-q':
      case '--query':
        query = args[++i];
        break;
      case '--time-range':
        timeRange = args[++i];
        break;
      case '--site':
        site = args[++i];
        break;
      case '--count':
        count = parseInt(args[++i]);
        break;
    }
  }

  return { query, timeRange, site, count };
}

async function search(options: SearchOptions): Promise<void> {
  console.log(`🔍 搜索: ${options.query}`);
  
  if (options.timeRange) {
    console.log(`⏰ 时间范围: ${options.timeRange}`);
  }
  if (options.site) {
    console.log(`🌐 限定站点: ${options.site}`);
  }
  
  // 这里应该调用 Coze SDK 进行搜索
  // 由于需要配置，这里输出提示
  console.log('\n⚠️ 提示: 需要配置 COZE_TOKEN 环境变量');
  console.log('示例: export COZE_TOKEN="your-token"');
}

async function main() {
  const options = parseArgs();
  
  if (!options.query) {
    console.log(`
🔍 Coze Web Search

用法:
  npx ts-node search.ts -q "搜索关键词" [选项]

选项:
  -q, --query       搜索关键词（必填）
  --time-range      时间范围: 1d/1w/1m（可选）
  --site            限定站点（可选）
  --count           结果数量（默认: 10）

示例:
  npx ts-node search.ts -q "小米 热搜" --time-range 1d
  npx ts-node search.ts -q "TypeScript" --site github.com
`);
    process.exit(1);
  }
  
  await search(options);
}

main();
