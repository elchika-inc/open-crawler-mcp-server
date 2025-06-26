# @elchika-inc/html-to-markdown

Convert HTML content to Markdown format using Cheerio.

## Installation

```bash
npm install @elchika-inc/html-to-markdown
```

## Usage

```typescript
import { HtmlToMarkdownConverter } from '@elchika-inc/html-to-markdown';

const html = '<h1>Hello World</h1><p>This is a <strong>paragraph</strong> with <em>formatting</em>.</p>';

// Basic conversion
const markdown = HtmlToMarkdownConverter.convert(html);
console.log(markdown);
// Output:
// # Hello World
// 
// This is a **paragraph** with *formatting*.

// With title
const markdownWithTitle = HtmlToMarkdownConverter.convert(html, {
  includeTitle: true,
  title: 'My Document'
});
```

## Supported Elements

- Headings (h1-h6)
- Paragraphs (p)
- Links (a)
- Images (img)
- Lists (ul, ol)
- Blockquotes
- Code blocks and inline code
- Bold and italic text
- Line breaks and horizontal rules

## API

### `HtmlToMarkdownConverter.convert(html, options?)`

Convert HTML to Markdown.

**Options:**
- `includeTitle` (boolean, default: false) - Include title at the beginning
- `title` (string) - Title to include if `includeTitle` is true

## License

MIT