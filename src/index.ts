#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { crawlPageTool, handleCrawlPage } from './tools/crawl-page.js';
import { checkRobotsTool, handleCheckRobots } from './tools/check-robots.js';

class WebCrawlerMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
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

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [crawlPageTool, checkRobotsTool],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'crawl_page':
            const crawlResult = await handleCrawlPage(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(crawlResult, null, 2),
                },
              ],
            };

          case 'check_robots':
            const robotsResult = await handleCheckRobots(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(robotsResult, null, 2),
                },
              ],
            };

          default:
            throw {
              code: -32601,
              message: `Unknown tool: ${name}`,
            };
        }
      } catch (error) {
        // If error is already a JSON-RPC error, re-throw it
        if (typeof error === 'object' && error !== null && 'code' in error) {
          throw error;
        }

        // Otherwise, wrap it in a generic error
        throw {
          code: -32000,
          message: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });
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