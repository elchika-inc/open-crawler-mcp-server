# Open Crawler MCP Server

[![license](https://img.shields.io/npm/l/open-crawler-mcp-server)](https://github.com/naoto24kawa/open-clawler-mcp-server/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/open-crawler-mcp-server)](https://www.npmjs.com/package/open-crawler-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/open-crawler-mcp-server)](https://www.npmjs.com/package/open-crawler-mcp-server)
[![GitHub stars](https://img.shields.io/github/stars/naoto24kawa/open-clawler-mcp-server)](https://github.com/naoto24kawa/open-clawler-mcp-server)

A Model Context Protocol (MCP) server for web crawling and text extraction from web pages.

## Features

- **crawl_page**: Extract text content from web pages with optional CSS selectors
- **check_robots**: Check robots.txt compliance before crawling
- Rate limiting and robots.txt compliance
- Maximum page size protection (10MB)
- Support for both text-only and HTML extraction

## Installation

```bash
npm install
npm run build
```

## Usage

### Running the server

```bash
npm start
# or for development
npm run dev
```

### Available Tools

#### crawl_page

Extracts text content from a web page.

**Parameters:**
- `url` (required): Target URL to crawl
- `selector` (optional): CSS selector for specific content extraction
- `text_only` (optional): Extract only text content (default: true)

**Example:**
```json
{
  "name": "crawl_page",
  "arguments": {
    "url": "https://example.com",
    "selector": "article",
    "text_only": true
  }
}
```

#### check_robots

Check if a URL is allowed to be crawled according to robots.txt.

**Parameters:**
- `url` (required): URL to check for crawling permission

**Example:**
```json
{
  "name": "check_robots",
  "arguments": {
    "url": "https://example.com/page"
  }
}
```

## Configuration

The server automatically:
- Respects robots.txt files
- Applies rate limiting (minimum 1 second between requests)
- Limits page size to 10MB
- Prefers HTTPS connections
- Uses appropriate User-Agent string

## Error Codes

- `-32001`: Network error
- `-32002`: Parse error
- `-32003`: Robots.txt violation
- `-32004`: Rate limit or timeout
- `-32005`: Page size exceeded

## Architecture

All crawling operations are performed locally on the MCP server to minimize AI token consumption. The server handles:

- HTTP/HTTPS requests
- HTML parsing and text extraction
- Robots.txt parsing and compliance
- Rate limiting management
- Error handling

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT