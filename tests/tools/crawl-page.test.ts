import { expect, test, describe } from "bun:test";

describe('crawl-page tool', () => {
  test('should have the correct tool definition', () => {
    const { crawlPageTool } = require('../../src/tools/crawl-page.js');
    
    expect(crawlPageTool.name).toBe('crawl_page');
    expect(crawlPageTool.description).toContain('web page');
    expect(crawlPageTool.inputSchema.required).toContain('url');
  });

  test('should validate required parameters', async () => {
    const { handleCrawlPage } = require('../../src/tools/crawl-page.js');
    
    try {
      await handleCrawlPage({});
      expect(false).toBe(true); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe(-32602);
      expect(error.message).toContain('url is required');
    }
  });

  test('should validate parameter types', async () => {
    const { handleCrawlPage } = require('../../src/tools/crawl-page.js');
    
    try {
      await handleCrawlPage({ url: 123 });
      expect(false).toBe(true); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe(-32602);
      expect(error.message).toContain('must be a string');
    }
  });

  test('should validate selector parameter type', async () => {
    const { handleCrawlPage } = require('../../src/tools/crawl-page.js');
    
    try {
      await handleCrawlPage({ url: 'https://example.com', selector: 123 });
      expect(false).toBe(true); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe(-32602);
      expect(error.message).toContain('selector must be a string');
    }
  });

  test('should validate format parameter type', async () => {
    const { handleCrawlPage } = require('../../src/tools/crawl-page.js');
    
    try {
      await handleCrawlPage({ url: 'https://example.com', format: 'invalid' });
      expect(false).toBe(true); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe(-32602);
      expect(error.message).toContain('format must be one of');
    }
  });
});