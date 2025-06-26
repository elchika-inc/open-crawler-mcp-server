import { expect, test, describe } from "bun:test";

describe('WebCrawler', () => {
  test('should have the correct class structure', () => {
    const { WebCrawler } = require('../../src/utils/crawler.js');
    
    const crawler = new WebCrawler();
    expect(crawler).toBeDefined();
    expect(typeof crawler.crawlPage).toBe('function');
    expect(typeof crawler.clearCache).toBe('function');
  });

  test('should have proper method signatures', () => {
    const { WebCrawler } = require('../../src/utils/crawler.js');
    
    const crawler = new WebCrawler();
    
    // Check that crawlPage method exists and can be called
    expect(crawler.crawlPage).toBeDefined();
    expect(typeof crawler.crawlPage).toBe('function');
    
    // Check that clearCache method exists and can be called
    expect(crawler.clearCache).toBeDefined();
    expect(typeof crawler.clearCache).toBe('function');
  });

  test('should not throw when clearing cache', () => {
    const { WebCrawler } = require('../../src/utils/crawler.js');
    
    const crawler = new WebCrawler();
    expect(() => crawler.clearCache()).not.toThrow();
  });
});