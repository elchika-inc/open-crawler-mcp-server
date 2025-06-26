#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { handleCrawlPage } from './tools/crawl-page.js';
import { handleCheckRobots } from './tools/check-robots.js';
import { ToolErrorHandler } from './utils/tool-error-handler.js';
import { ResponseFormatter } from './utils/response-formatter.js';

// Zod schemas for tool parameters
const crawlPageSchema = {
  url: z.string().url().describe('The URL of the page to crawl'),
  selector: z.string().optional().describe('Optional CSS selector to extract specific content'),
  text_only: z.boolean().optional().default(true).describe('Whether to extract only text content (deprecated, use format instead)'),
  format: z.enum(['text', 'markdown', 'xml', 'json']).optional().default('text').describe('Output format for the content')
};

const checkRobotsSchema = {
  url: z.string().url().describe('The URL to check for crawling permission')
};

class WebCrawlerMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer(
      {
        name: 'open-crawler-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupTools();
  }

  private setupTools(): void {
    // Register crawl_page tool with enhanced metadata
    this.server.registerTool(
      'crawl_page',
      {
        title: 'Web Page Crawler',
        description: 'Extract content from a web page in specified format (automatically checks robots.txt)',
        inputSchema: crawlPageSchema,
      },
      async (args) => {
        try {
          const result = await handleCrawlPage(args);
          return ResponseFormatter.formatToolResponse(result);
        } catch (error) {
          ToolErrorHandler.handleToolError(error);
        }
      }
    );

    // Register check_robots tool with enhanced metadata
    this.server.registerTool(
      'check_robots',
      {
        title: 'Robots.txt Checker',
        description: 'Check if a URL is allowed to be crawled according to robots.txt',
        inputSchema: checkRobotsSchema,
      },
      async (args) => {
        try {
          const result = await handleCheckRobots(args);
          return ResponseFormatter.formatToolResponse(result);
        } catch (error) {
          ToolErrorHandler.handleToolError(error);
        }
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    
    try {
      await this.server.connect(transport);
      console.error('Open Crawler MCP Server running on stdio');
      
      // Keep the process alive
      process.stdin.resume();
    } catch (error) {
      console.error('Failed to connect transport:', error);
      process.exit(1);
    }
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.error('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
const server = new WebCrawlerMCPServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});