import axios from 'axios';
import robotsParser from 'robots-parser';
import { HttpConfig } from './http-config.js';

export interface RobotsCheckResult {
  allowed: boolean;
  crawlDelay: number;
}

export class RobotsChecker {
  private robotsCache = new Map<string, any>();

  async checkRobotsTxt(url: string): Promise<RobotsCheckResult> {
    try {
      const urlObj = new URL(url);
      const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
      
      let robots = this.robotsCache.get(urlObj.host);
      
      if (!robots) {
        try {
          const response = await axios.get(robotsUrl, {
            timeout: HttpConfig.ROBOTS_TIMEOUT,
            headers: HttpConfig.getRobotsHeaders()
          });
          
          robots = robotsParser(robotsUrl, response.data);
          this.robotsCache.set(urlObj.host, robots);
        } catch (error) {
          console.warn(`Failed to fetch robots.txt for ${urlObj.host}:`, error);
          return { allowed: true, crawlDelay: 1 };
        }
      }

      const allowed = robots.isAllowed(url, HttpConfig.USER_AGENT) !== false;
      const crawlDelay = robots.getCrawlDelay(HttpConfig.USER_AGENT) || 1;

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