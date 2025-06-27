import { ParameterValidator } from '../utils/validation.js';
import { ErrorHandler } from '../utils/error-handler.js';
import { RobotsChecker } from '../utils/robots.js';

export const checkRobotsSchema = {
  type: 'object' as const,
  properties: {
    url: {
      type: 'string' as const,
      description: 'The URL to check for crawling permission'
    }
  },
  required: ['url'] as const
};

export const checkRobotsTool = {
  name: 'check_robots',
  description: 'Check if a URL is allowed to be crawled according to robots.txt',
  inputSchema: checkRobotsSchema
};

const robotsChecker = new RobotsChecker();

export async function handleCheckRobots(args: any): Promise<any> {
  const { url } = args;
  
  ParameterValidator.validateUrl(url);

  try {
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