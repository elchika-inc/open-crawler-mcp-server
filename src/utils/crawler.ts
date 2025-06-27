import axios from 'axios';
import { RobotsChecker } from './robots.js';
import { ContentFormatter, OutputFormat } from './formatters.js';
import { HttpConfig } from './http-config.js';
import { RateLimiter } from './rate-limiter.js';
import { ContentExtractor } from './content-extractor.js';
import { URLNormalizer } from './url-normalizer.js';
import { NetworkError, RobotsError } from './error-handler.js';

export interface CrawlResult {
  url: string;
  title: string;
  content: string;
  format: OutputFormat;
  timestamp: string;
}

export interface CrawlOptions {
  selector?: string;
  textOnly?: boolean;
  format?: OutputFormat;
}

export class WebCrawler {
  private readonly robotsChecker = new RobotsChecker();
  private readonly rateLimiter = new RateLimiter();
  private readonly contentExtractor = new ContentExtractor();

  async crawlPage(url: string, options: CrawlOptions = {}): Promise<CrawlResult> {
    const { selector, format = 'text' } = options;

    // Normalize URL to HTTPS if possible
    const normalizedUrl = URLNormalizer.normalize(url);
    
    // Check robots.txt
    const robotsCheck = await this.robotsChecker.checkRobotsTxt(normalizedUrl);
    if (!robotsCheck.allowed) {
      throw new RobotsError(`Crawling not allowed by robots.txt for ${normalizedUrl}`);
    }

    // Apply rate limiting
    await this.rateLimiter.waitForNextRequest();

    try {
      const response = await axios.get(normalizedUrl, {
        timeout: HttpConfig.DEFAULT_TIMEOUT,
        headers: HttpConfig.getCrawlHeaders()
      });

      // Extract content
      const extractedContent = this.contentExtractor.extractContent(response.data, { selector });

      // Convert content to requested format
      const formattedContent = ContentFormatter.format(response.data, format, extractedContent.title);

      return {
        url: response.request.res.responseUrl || normalizedUrl,
        title: extractedContent.title,
        content: formattedContent.content,
        format: formattedContent.format,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      // Re-throw custom errors as-is
      if (error instanceof RobotsError || error instanceof NetworkError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new NetworkError('Request timeout');
        }
        if (error.response) {
          throw new NetworkError(`HTTP ${error.response.status}: ${error.response.statusText}`);
        }
        if (error.request) {
          throw new NetworkError('Network error: Unable to reach the server');
        }
      }
      throw error;
    }
  }

  clearCache(): void {
    this.robotsChecker.clearCache();
    this.rateLimiter.clearState();
  }
}