import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ParameterValidator } from '../utils/validation.js';
import { ErrorHandler } from '../utils/error-handler.js';
import { ServiceRegistry } from '../services/service-registry.js';

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
  
  ParameterValidator.validateUrl(url);

  try {
    const robotsChecker = ServiceRegistry.getRobotsChecker();
    const result = await robotsChecker.checkRobotsTxt(url);
    
    return {
      allowed: result.allowed,
      crawl_delay: result.crawlDelay
    };
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    throw ErrorHandler.createError(
      -32001,
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}