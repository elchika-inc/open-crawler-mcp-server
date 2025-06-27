import { OutputFormat } from '../utils/formatters.js';
import { ParameterValidator } from '../utils/validation.js';
import { ErrorHandler } from '../utils/error-handler.js';
import { WebCrawler } from '../utils/crawler.js';

export const crawlPageSchema = {
  type: 'object' as const,
  properties: {
    url: {
      type: 'string' as const,
      description: 'The URL of the page to crawl'
    },
    selector: {
      type: 'string' as const,
      description: 'Optional CSS selector to extract specific content'
    },
    text_only: {
      type: 'boolean' as const,
      description: 'Whether to extract only text content (deprecated, use format instead)',
      default: true
    },
    format: {
      type: 'string' as const,
      enum: ['text', 'markdown', 'xml', 'json'] as const,
      description: 'Output format for the content (default: text)',
      default: 'text'
    }
  },
  required: ['url'] as const
};

export const crawlPageTool = {
  name: 'crawl_page',
  description: 'Extract content from a web page in specified format (automatically checks robots.txt)',
  inputSchema: crawlPageSchema
};

const crawler = new WebCrawler();

export async function handleCrawlPage(args: any): Promise<any> {
  const { url, selector, text_only = true, format = 'text' } = args;
  
  ParameterValidator.validateUrl(url);
  ParameterValidator.validateSelector(selector);
  ParameterValidator.validateBoolean(text_only, 'text_only');
  ParameterValidator.validateFormat(format);

  try {
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