import { expect, test, describe } from "bun:test";

describe('check-robots tool', () => {
  test('should have the correct tool definition', () => {
    const { checkRobotsTool } = require('../../src/tools/check-robots.js');
    
    expect(checkRobotsTool.name).toBe('check_robots');
    expect(checkRobotsTool.description).toContain('robots.txt');
    expect(checkRobotsTool.inputSchema.required).toContain('url');
  });

  test('should validate required parameters', async () => {
    const { handleCheckRobots } = require('../../src/tools/check-robots.js');
    
    try {
      await handleCheckRobots({});
      expect(false).toBe(true); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe(-32602);
      expect(error.message).toContain('url is required');
    }
  });

  test('should validate parameter types', async () => {
    const { handleCheckRobots } = require('../../src/tools/check-robots.js');
    
    try {
      await handleCheckRobots({ url: 123 });
      expect(false).toBe(true); // Should not reach here
    } catch (error: any) {
      expect(error.code).toBe(-32602);
      expect(error.message).toContain('must be a string');
    }
  });
});