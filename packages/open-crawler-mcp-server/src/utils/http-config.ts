export class HttpConfig {
  static readonly USER_AGENT = 'OpenCrawlerMCP/1.0';
  static readonly DEFAULT_TIMEOUT = 30000;
  static readonly ROBOTS_TIMEOUT = 10000;

  static getCrawlHeaders(): Record<string, string> {
    return {
      'User-Agent': this.USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'DNT': '1',
      'Connection': 'keep-alive'
    };
  }

  static getRobotsHeaders(): Record<string, string> {
    return {
      'User-Agent': this.USER_AGENT
    };
  }
}