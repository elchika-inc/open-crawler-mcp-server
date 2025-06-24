import axios from 'axios';
import * as cheerio from 'cheerio';
import { RobotsChecker } from './robots.js';

export interface CrawlResult {
  url: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface CrawlOptions {
  selector?: string;
  textOnly?: boolean;
}

export class WebCrawler {
  private readonly robotsChecker = new RobotsChecker();
  private readonly rateLimiter = new Map<string, number>();
  private readonly maxPageSize = 10 * 1024 * 1024; // 10MB
  private readonly userAgent = 'OpenCrawlerMCP/1.0';

  async crawlPage(url: string, options: CrawlOptions = {}): Promise<CrawlResult> {
    const { selector, textOnly = true } = options;

    // Normalize URL to HTTPS if possible
    const normalizedUrl = this.normalizeUrl(url);
    
    // Check robots.txt
    const robotsCheck = await this.robotsChecker.checkRobotsTxt(normalizedUrl);
    if (!robotsCheck.allowed) {
      throw new Error(`Crawling not allowed by robots.txt for ${normalizedUrl}`);
    }

    // Apply rate limiting
    await this.applyRateLimit(normalizedUrl, robotsCheck.crawlDelay);

    try {
      const response = await axios.get(normalizedUrl, {
        timeout: 30000,
        maxContentLength: this.maxPageSize,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive'
        }
      });

      if (response.data.length > this.maxPageSize) {
        throw new Error(`Page size exceeds maximum limit of ${this.maxPageSize} bytes`);
      }

      const $ = cheerio.load(response.data);
      
      // Extract title
      const title = $('title').text().trim() || 'No Title';

      // Extract content based on selector
      let content: string;
      if (selector) {
        const selectedElements = $(selector);
        if (selectedElements.length === 0) {
          throw new Error(`No elements found for selector: ${selector}`);
        }
        content = textOnly 
          ? selectedElements.text().trim()
          : selectedElements.html() || '';
      } else {
        // Remove script and style elements
        $('script, style, nav, header, footer, aside').remove();
        
        // Get main content
        const mainContent = $('main, article, .content, #content').first();
        const targetElement = mainContent.length > 0 ? mainContent : $('body');
        
        content = textOnly
          ? targetElement.text().replace(/\s+/g, ' ').trim()
          : targetElement.html() || '';
      }

      if (!content) {
        throw new Error('No content extracted from the page');
      }

      return {
        url: response.request.res.responseUrl || normalizedUrl,
        title,
        content,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout');
        }
        if (error.response) {
          throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
        }
        if (error.request) {
          throw new Error('Network error: Unable to reach the server');
        }
      }
      throw error;
    }
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Prefer HTTPS
      if (urlObj.protocol === 'http:') {
        urlObj.protocol = 'https:';
      }
      return urlObj.toString();
    } catch {
      // If URL parsing fails, try adding https://
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }
      return url;
    }
  }

  private async applyRateLimit(url: string, crawlDelay: number): Promise<void> {
    const urlObj = new URL(url);
    const host = urlObj.host;
    const now = Date.now();
    const lastRequest = this.rateLimiter.get(host) || 0;
    const delayMs = crawlDelay * 1000;
    
    const timeSinceLastRequest = now - lastRequest;
    if (timeSinceLastRequest < delayMs) {
      const waitTime = delayMs - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.rateLimiter.set(host, Date.now());
  }

  clearCache(): void {
    this.robotsChecker.clearCache();
    this.rateLimiter.clear();
  }
}