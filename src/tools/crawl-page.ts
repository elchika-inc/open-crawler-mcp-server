import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { WebCrawler } from '../utils/crawler.js';

export const crawlPageTool: Tool = {
  name: 'crawl_page',
  description: 'Extract text content from a web page (automatically checks robots.txt)',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The URL of the page to crawl'
      },
      selector: {
        type: 'string',
        description: 'Optional CSS selector to extract specific content'
      },
      text_only: {
        type: 'boolean',
        description: 'Whether to extract only text content (default: true)',
        default: true
      }
    },
    required: ['url']
  }
};

export async function handleCrawlPage(args: any): Promise<any> {
  const { url, selector, text_only = true } = args;
  
  if (!url || typeof url !== 'string') {
    throw {
      code: -32602,
      message: 'Invalid parameters: url is required and must be a string'
    };
  }

  if (selector && typeof selector !== 'string') {
    throw {
      code: -32602,
      message: 'Invalid parameters: selector must be a string'
    };
  }

  if (text_only !== undefined && typeof text_only !== 'boolean') {
    throw {
      code: -32602,
      message: 'Invalid parameters: text_only must be a boolean'
    };
  }

  try {
    const crawler = new WebCrawler();
    const result = await crawler.crawlPage(url, { selector, textOnly: text_only });
    
    return {
      url: result.url,
      title: result.title,
      content: result.content,
      timestamp: result.timestamp
    };
  } catch (error) {
    console.error('Error crawling page:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('robots.txt')) {
        throw {
          code: -32003,
          message: `Robots.txt violation: ${error.message}`
        };
      }
      
      if (error.message.includes('timeout')) {
        throw {
          code: -32004,
          message: `Rate limit or timeout: ${error.message}`
        };
      }
      
      if (error.message.includes('exceeds maximum limit')) {
        throw {
          code: -32005,
          message: `Size exceeded: ${error.message}`
        };
      }
      
      if (error.message.includes('Network error') || error.message.includes('HTTP')) {
        throw {
          code: -32001,
          message: `Network error: ${error.message}`
        };
      }
      
      if (error.message.includes('No elements found') || error.message.includes('No content')) {
        throw {
          code: -32002,
          message: `Parse error: ${error.message}`
        };
      }
    }
    
    throw {
      code: -32000,
      message: `Unknown error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}