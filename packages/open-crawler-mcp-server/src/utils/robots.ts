import axios from 'axios';
import robotsParser from 'robots-parser';

export interface RobotsCheckResult {
  allowed: boolean;
  crawlDelay: number;
}

export class RobotsChecker {
  private robotsCache = new Map<string, any>();
  private readonly userAgent = 'OpenCrawlerMCP/1.0';

  async checkRobotsTxt(url: string): Promise<RobotsCheckResult> {
    try {
      const urlObj = new URL(url);
      const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
      
      let robots = this.robotsCache.get(urlObj.host);
      
      if (!robots) {
        try {
          const response = await axios.get(robotsUrl, {
            timeout: 10000,
            headers: {
              'User-Agent': this.userAgent
            }
          });
          
          robots = robotsParser(robotsUrl, response.data);
          this.robotsCache.set(urlObj.host, robots);
        } catch (error) {
          console.warn(`Failed to fetch robots.txt for ${urlObj.host}:`, error);
          return { allowed: true, crawlDelay: 1 };
        }
      }

      const allowed = robots.isAllowed(url, this.userAgent) !== false;
      const crawlDelay = robots.getCrawlDelay(this.userAgent) || 1;

      return {
        allowed,
        crawlDelay: Math.max(crawlDelay, 1)
      };
    } catch (error) {
      console.error('Error checking robots.txt:', error);
      return { allowed: false, crawlDelay: 1 };
    }
  }

  clearCache(): void {
    this.robotsCache.clear();
  }
}