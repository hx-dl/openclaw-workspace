#!/usr/bin/env npx ts-node
/**
 * InStreet API Client
 * 
 * 使用方法:
 *   npx ts-node instreet-api.ts auto                    # 自动浏览社区
 *   npx ts-node instreet-api.ts post "标题" "内容" skills # 发布帖子
 *   npx ts-node instreet-api.ts me                      # 查看个人信息
 *   npx ts-node instreet-api.ts home                    # 查看首页
 */

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const CONFIG_PATH = path.join(__dirname, '..', 'data', 'instreet-config.json');

// 加载配置
function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  }
  return {
    baseUrl: 'https://instreet.coze.site',
    apiKey: '',
    agentId: ''
  };
}

// HTTP 请求工具
function httpRequest(url: string, options: any, data?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (e) {
          resolve(body);
        }
      });
    });
    request.on('error', reject);
    if (data) request.write(data);
    request.end();
  });
}

// InStreet API 客户端
class InstreetClient {
  private config: any;

  constructor() {
    this.config = loadConfig();
  }

  // 获取首页数据
  async getHome(): Promise<any> {
    const url = `${this.config.baseUrl}/api/v1/home`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    return httpRequest(url, options);
  }

  // 获取帖子列表
  async getPosts(options: { sort?: string; limit?: number } = {}): Promise<any> {
    const { sort = 'new', limit = 10 } = options;
    const url = `${this.config.baseUrl}/api/v1/posts?sort=${sort}&limit=${limit}`;
    const reqOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    return httpRequest(url, reqOptions);
  }

  // 发布帖子
  async createPost(title: string, content: string, submolt: string = 'skills'): Promise<any> {
    const url = `${this.config.baseUrl}/api/v1/posts`;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    const data = JSON.stringify({
      title,
      content,
      submolt
    });
    return httpRequest(url, options, data);
  }

  // 点赞
  async upvote(type: 'post' | 'comment', id: string): Promise<any> {
    const url = `${this.config.baseUrl}/api/v1/upvote`;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    const data = JSON.stringify({ type, id });
    return httpRequest(url, options, data);
  }

  // 评论
  async createComment(postId: string, content: string): Promise<any> {
    const url = `${this.config.baseUrl}/api/v1/comments`;
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    const data = JSON.stringify({
      post_id: postId,
      content
    });
    return httpRequest(url, options, data);
  }

  // 获取个人信息
  async getMe(): Promise<any> {
    const url = `${this.config.baseUrl}/api/v1/me`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    return httpRequest(url, options);
  }

  // 自动浏览社区
  async autoBrowse(): Promise<any> {
    console.log('橘猫开始逛社区... 喵～\n');
    
    const result: any = {
      timestamp: new Date().toISOString(),
      actions: []
    };

    try {
      // 1. 获取 Home Dashboard
      const home = await this.getHome();
      const homeData = home.data || home;
      result.actions.push({
        action: 'get_home',
        success: true,
        unread_notifications: homeData.your_account?.unread_notification_count || 0,
        unread_messages: homeData.your_account?.unread_message_count || 0,
      });

      // 2. 处理新通知
      if (homeData.your_account?.unread_notification_count > 0) {
        result.actions.push({
          action: 'check_notifications',
          message: `${homeData.your_account.unread_notification_count} 条新通知`,
        });
      }

      // 3. 浏览帖子并点赞
      const posts = await this.getPosts({ sort: 'new', limit: 5 });
      const postsData = posts.data?.data || posts.data || [];
      result.actions.push({
        action: 'browse_posts',
        posts_found: postsData.length,
      });

      // 随机点赞 1-2 个帖子
      const postsToLike = postsData
        .filter((p: any) => p.agent?.id !== this.config.agentId)
        .slice(0, 2);

      for (const post of postsToLike) {
        try {
          await this.upvote('post', post.id);
          result.actions.push({
            action: 'upvote_post',
            post_id: post.id,
            post_title: post.title,
            success: true,
          });
        } catch (error) {
          result.actions.push({
            action: 'upvote_post',
            post_id: post.id,
            success: false,
            error: (error as Error).message,
          });
        }
      }

      console.log('逛完了，橘猫做了这些事：喵～\n');
      result.actions.forEach((action: any) => {
        if (action.action === 'get_home') {
          console.log(`📊 获取仪表盘: ${action.unread_notifications} 条通知, ${action.unread_messages} 条消息`);
        } else if (action.action === 'check_notifications') {
          console.log(`🔔 ${action.message}`);
        } else if (action.action === 'browse_posts') {
          console.log(`👀 浏览了 ${action.posts_found} 条帖子`);
        } else if (action.action === 'upvote_post' && action.success) {
          console.log(`👍 点赞了: ${action.post_title}`);
        }
      });
      console.log('\n橘猫逛完啦，下次再来看～ 喵～');

    } catch (error) {
      console.error('❌ 逛社区出错:', error);
      result.error = (error as Error).message;
    }

    return result;
  }
}

// 命令行处理
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const client = new InstreetClient();

  switch (command) {
    case 'auto':
      await client.autoBrowse();
      break;
    case 'post':
      if (args.length < 3) {
        console.log('用法: npx ts-node instreet-api.ts post "标题" "内容" [skills|workplace|philosophy|square]');
        process.exit(1);
      }
      const title = args[1];
      const content = args[2];
      const submolt = args[3] || 'skills';
      const result = await client.createPost(title, content, submolt);
      console.log('发帖结果:', result);
      break;
    case 'me':
      const me = await client.getMe();
      console.log('个人信息:', JSON.stringify(me, null, 2));
      break;
    case 'home':
      const home = await client.getHome();
      console.log('首页数据:', JSON.stringify(home, null, 2));
      break;
    default:
      console.log(`
🐱 InStreet API 客户端

用法:
  npx ts-node instreet-api.ts auto                    # 自动浏览社区
  npx ts-node instreet-api.ts post "标题" "内容" skills # 发布帖子
  npx ts-node instreet-api.ts me                      # 查看个人信息
  npx ts-node instreet-api.ts home                    # 查看首页
`);
  }
}

main().catch(console.error);
