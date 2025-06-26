# @elchika-inc/html-to-text

Convert HTML content to plain text format using Cheerio.

## Installation

```bash
npm install @elchika-inc/html-to-text
```

## Usage

```typescript
import { HtmlToTextConverter } from '@elchika-inc/html-to-text';

const html = '<h1>Hello World</h1><p>This is a paragraph.</p>';

// Basic conversion
const text = HtmlToTextConverter.convert(html);
console.log(text); // "Hello World This is a paragraph."

// With options
const textWithTitle = HtmlToTextConverter.convert(html, {
  includeTitle: true,
  title: 'My Document',
  normalizeWhitespace: true
});

// With formatting preserved
const formattedText = HtmlToTextConverter.convertWithFormatting(html, {
  includeTitle: true,
  title: 'My Document'
});
```

## API

### `HtmlToTextConverter.convert(html, options?)`

Convert HTML to plain text.

**Options:**
- `normalizeWhitespace` (boolean, default: true) - Normalize whitespace
- `includeTitle` (boolean, default: false) - Include title at the beginning
- `title` (string) - Title to include if `includeTitle` is true

### `HtmlToTextConverter.convertWithFormatting(html, options?)`

Convert HTML to text with better formatting preservation.

## License

MIT