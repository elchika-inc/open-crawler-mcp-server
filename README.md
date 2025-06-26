# Open Crawler MCP Server

[![license](https://img.shields.io/npm/l/open-crawler-mcp-server)](https://github.com/elchika-inc/open-crawler-mcp-server/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/open-crawler-mcp-server)](https://www.npmjs.com/package/open-crawler-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/open-crawler-mcp-server)](https://www.npmjs.com/package/open-crawler-mcp-server)
[![GitHub stars](https://img.shields.io/github/stars/elchika-inc/open-crawler-mcp-server)](https://github.com/elchika-inc/open-crawler-mcp-server)

A Model Context Protocol (MCP) server for web crawling and content extraction from web pages with multiple output formats.

## Features

- **Multiple Output Formats**: Extract content as text, markdown, structured XML, or JSON
- **Smart Content Extraction**: CSS selector support for targeted content extraction
- **Robots.txt Compliance**: Automatic robots.txt checking and compliance
- **Rate Limiting**: Built-in rate limiting (1 second minimum between requests)
- **Size Protection**: Maximum page size limit (10MB) to prevent memory issues
- **Structured Content**: Extract headings, paragraphs, links, images, and lists separately
- **Error Handling**: Comprehensive error codes for different failure scenarios

## MCP Client Configuration

Add this server to your MCP client configuration:

```json
{
  "mcpServers": {
    "open-crawler": {
      "command": "npx",
      "args": ["@elchika-inc/open-crawler-mcp-server"]
    }
  }
}
```

## Available Tools

### crawl_page

Extracts content from a web page in multiple formats with automatic robots.txt compliance checking.

**Parameters:**

- `url` (required): Target URL to crawl
- `selector` (optional): CSS selector for specific content extraction
- `format` (optional): Output format - `text`, `markdown`, `xml`, or `json` (default: `text`)
- `text_only` (optional): Legacy parameter for text-only extraction (deprecated, use `format` instead)

**Output Formats:**

- **`text`**: Clean, plain text content with whitespace normalized
- **`markdown`**: Well-formatted Markdown with headings, links, images, and lists preserved
- **`xml`**: Structured XML with separate sections for headings, paragraphs, links, images, and lists
- **`json`**: Structured JSON object containing categorized content elements

**Examples:**

Basic text extraction:

```json
{
  "name": "crawl_page",
  "arguments": {
    "url": "https://example.com",
    "format": "text"
  }
}
```

Markdown extraction with CSS selector:

```json
{
  "name": "crawl_page",
  "arguments": {
    "url": "https://example.com",
    "selector": "article",
    "format": "markdown"
  }
}
```

Structured JSON extraction:

```json
{
  "name": "crawl_page",
  "arguments": {
    "url": "https://example.com",
    "format": "json"
  }
}
```

### check_robots

Validates if a URL is allowed to be crawled according to the site's robots.txt file.

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

## Error Handling

Common error scenarios:

- Network connection issues
- Invalid HTML or missing content
- Robots.txt restrictions
- Request timeouts or rate limits
- Content size too large (>10MB)

## License

MIT
