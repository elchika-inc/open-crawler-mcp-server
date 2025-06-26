import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RobotsChecker } from '../utils/robots.js';

export const checkRobotsTool: Tool = {
  name: 'check_robots',
  description: 'Check if a URL is allowed to be crawled according to robots.txt',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL to check for crawling permission'
      }
    },
    required: ['url']
  }
};

export async function handleCheckRobots(args: any): Promise<any> {
  const { url } = args;
  
  if (!url || typeof url !== 'string') {
    throw {
      code: -32602,
      message: 'Invalid parameters: url is required and must be a string'
    };
  }

  try {
    const robotsChecker = new RobotsChecker();
    const result = await robotsChecker.checkRobotsTxt(url);
    
    return {
      allowed: result.allowed,
      crawl_delay: result.crawlDelay
    };
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    throw {
      code: -32001,
      message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}