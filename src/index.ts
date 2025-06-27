#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { handleCrawlPage, crawlPageTool } from './tools/crawl-page.js';
import { handleCheckRobots, checkRobotsTool } from './tools/check-robots.js';
import { ErrorHandler } from './utils/error-handler.js';

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
    const tools = [
      { tool: crawlPageTool, handler: handleCrawlPage },
      { tool: checkRobotsTool, handler: handleCheckRobots }
    ];

    tools.forEach(({ tool, handler }) => {
      this.server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema: tool.inputSchema as any,
        },
        async (args: any) => {
          try {
            const result = await handler(args);
            return ErrorHandler.formatToolResponse(result);
          } catch (error) {
            ErrorHandler.handleToolError(error);
          }
        }
      );
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