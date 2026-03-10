#!/usr/bin/env npx ts-node
/**
 * Skill Creator
 * 
 * 使用方法:
 *   npx ts-node creator.ts create
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface SkillConfig {
  name: string;
  description: string;
  category: string;
  hasCLI: boolean;
}

// 读取用户输入
function readLine(prompt: string): string {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(prompt, (answer: string) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// 创建目录
function createDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 生成 SKILL.md
function generateSKILLMD(config: SkillConfig): string {
  return `---
name: ${config.name}
description: ${config.description}
---

# ${config.name}

${config.description}

## 功能

- 功能1
- 功能2
- 功能3

## 使用

### 命令行

\`\`\`bash
npx ts-node scripts/main.ts
\`\`\`

### 参数

- \`--param1\`: 参数说明
- \`--param2\`: 参数说明

## 示例

\`\`\`bash
# 示例1
npx ts-node scripts/main.ts --param1 value

# 示例2
npx ts-node scripts/main.ts --param2 value
\`\`\`

标签: #${config.category} #${config.name} #skill
`;
}

// 生成 package.json
function generatePackageJSON(config: SkillConfig): string {
  return JSON.stringify({
    name: config.name,
    version: "1.0.0",
    description: config.description,
    main: "scripts/main.ts",
    scripts: config.hasCLI ? {
      "start": "npx ts-node scripts/main.ts"
    } : {},
    keywords: [config.category, config.name, "skill"],
    author: "",
    license: "MIT"
  }, null, 2);
}

// 生成主脚本
function generateMainTS(config: SkillConfig): string {
  return `#!/usr/bin/env npx ts-node
/**
 * ${config.name}
 * 
 * ${config.description}
 */

interface Options {
  // 添加参数类型
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = {};
  
  // 解析参数
  for (let i = 0; i < args.length; i++) {
    // 添加参数解析逻辑
  }
  
  return options;
}

async function main() {
  const options = parseArgs();
  
  console.log('🚀 ${config.name} 启动...');
  // 添加主逻辑
  
  console.log('✅ 完成！');
}

main().catch(console.error);
`;
}

// 创建 Skill
async function createSkill(): Promise<void> {
  console.log('🎨 Skill Creator - 创建新 Skill\n');
  
  // 收集信息
  const name = await readLine('? Skill name: ');
  if (!name) {
    console.error('❌ Skill name 不能为空');
    process.exit(1);
  }
  
  const description = await readLine('? Description: ');
  const category = await readLine('? Category (utility/communication/ai): ') || 'utility';
  const hasCLI = (await readLine('? Create CLI tool? (y/n): ')).toLowerCase() === 'y';
  
  const config: SkillConfig = {
    name,
    description: description || `${name} skill`,
    category,
    hasCLI
  };
  
  // 创建目录
  const skillDir = path.join(__dirname, '..', '..', name);
  createDir(skillDir);
  createDir(path.join(skillDir, 'scripts'));
  
  // 生成文件
  fs.writeFileSync(
    path.join(skillDir, 'SKILL.md'),
    generateSKILLMD(config)
  );
  
  fs.writeFileSync(
    path.join(skillDir, 'package.json'),
    generatePackageJSON(config)
  );
  
  if (hasCLI) {
    fs.writeFileSync(
      path.join(skillDir, 'scripts', 'main.ts'),
      generateMainTS(config)
    );
  }
  
  console.log(`\n✅ Skill created at: skills/${name}/`);
  console.log('\n目录结构:');
  console.log(`  skills/${name}/`);
  console.log('  ├── SKILL.md');
  console.log('  ├── package.json');
  if (hasCLI) {
    console.log('  └── scripts/');
    console.log('      └── main.ts');
  }
}

// 主函数
async function main() {
  const command = process.argv[2];
  
  if (command === 'create') {
    await createSkill();
  } else {
    console.log(`
🎨 Skill Creator - 创建 OpenClaw Skills

用法:
  npx ts-node creator.ts create

命令:
  create    创建新 Skill

示例:
  npx ts-node creator.ts create
`);
  }
}

main();
