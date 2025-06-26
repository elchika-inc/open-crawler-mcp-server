import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { OutputFormat } from '../utils/formatters.js';
import { ParameterValidator } from '../utils/validation.js';
import { ErrorHandler } from '../utils/error-handler.js';
import { ServiceRegistry } from '../services/service-registry.js';

export const crawlPageTool: Tool = {
  name: 'crawl_page',
  description: 'Extract content from a web page in specified format (automatically checks robots.txt)',
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
        description: 'Whether to extract only text content (deprecated, use format instead)',
        default: true
      },
      format: {
        type: 'string',
        enum: ['text', 'markdown', 'xml', 'json'],
        description: 'Output format for the content (default: text)',
        default: 'text'
      }
    },
    required: ['url']
  }
};

export async function handleCrawlPage(args: any): Promise<any> {
  const { url, selector, text_only = true, format = 'text' } = args;
  
  ParameterValidator.validateUrl(url);
  ParameterValidator.validateSelector(selector);
  ParameterValidator.validateBoolean(text_only, 'text_only');
  ParameterValidator.validateFormat(format);

  try {
    const crawler = ServiceRegistry.getCrawler();
    const result = await crawler.crawlPage(url, { selector, textOnly: text_only, format: format as OutputFormat });
    
    return {
      url: result.url,
      title: result.title,
      content: result.content,
      format: result.format,
      timestamp: result.timestamp
    };
  } catch (error) {
    console.error('Error crawling page:', error);
    
    if (error instanceof Error) {
      throw ErrorHandler.classifyError(error);
    }
    
    throw ErrorHandler.createError(-32000, 'Unknown error');
  }
}