import { expect, test, describe } from "bun:test";

describe('WebCrawlerMCPServer', () => {
  test('should export server components', () => {
    // Test that the main index file exports exist
    expect(() => require('../src/index.js')).not.toThrow();
  });

  test('should have tool definitions', () => {
    const { crawlPageTool } = require('../src/tools/crawl-page.js');
    const { checkRobotsTool } = require('../src/tools/check-robots.js');
    
    expect(crawlPageTool).toBeDefined();
    expect(checkRobotsTool).toBeDefined();
    
    expect(crawlPageTool.name).toBe('crawl_page');
    expect(checkRobotsTool.name).toBe('check_robots');
  });

  test('should have tool handlers', () => {
    const { handleCrawlPage } = require('../src/tools/crawl-page.js');
    const { handleCheckRobots } = require('../src/tools/check-robots.js');
    
    expect(typeof handleCrawlPage).toBe('function');
    expect(typeof handleCheckRobots).toBe('function');
  });
});