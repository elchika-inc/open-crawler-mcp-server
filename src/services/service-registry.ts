import { WebCrawler } from '../utils/crawler.js';
import { RobotsChecker } from '../utils/robots.js';

export interface CrawlerService {
  crawlPage(url: string, options?: any): Promise<any>;
  clearCache(): void;
}

export interface RobotsService {
  checkRobotsTxt(url: string): Promise<any>;
  clearCache(): void;
}

export class ServiceRegistry {
  private static crawlerService: CrawlerService;
  private static robotsService: RobotsService;

  static getCrawler(): CrawlerService {
    if (!this.crawlerService) {
      this.crawlerService = new WebCrawler();
    }
    return this.crawlerService;
  }

  static getRobotsChecker(): RobotsService {
    if (!this.robotsService) {
      this.robotsService = new RobotsChecker();
    }
    return this.robotsService;
  }

  static setCrawler(service: CrawlerService): void {
    this.crawlerService = service;
  }

  static setRobotsChecker(service: RobotsService): void {
    this.robotsService = service;
  }
}