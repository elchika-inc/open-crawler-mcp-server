# @elchika-inc/html-to-json

Convert HTML content to structured JSON format using Cheerio.

## Installation

```bash
npm install @elchika-inc/html-to-json
```

## Usage

```typescript
import { HtmlToJsonConverter } from '@elchika-inc/html-to-json';

const html = `
<h1>Hello World</h1>
<p>This is a paragraph.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
<a href="https://example.com">Link</a>
<img src="image.jpg" alt="Example image">
`;

// Basic conversion
const json = HtmlToJsonConverter.convert(html);
const parsed = JSON.parse(json);

console.log(parsed);
// Output:
// {
//   "title": null,
//   "content": {
//     "headings": [{ "level": 1, "text": "Hello World" }],
//     "paragraphs": ["This is a paragraph."],
//     "links": [{ "text": "Link", "url": "https://example.com" }],
//     "images": [{ "alt": "Example image", "src": "image.jpg" }],
//     "lists": [{ "type": "unordered", "items": ["Item 1", "Item 2"] }]
//   }
// }

// With title
const jsonWithTitle = HtmlToJsonConverter.convert(html, {
  includeTitle: true,
  title: 'My Document'
});
```

## Extracted Elements

- **Headings**: Level and text content
- **Paragraphs**: Text content
- **Links**: Text and URL
- **Images**: Alt text and source URL
- **Lists**: Type (ordered/unordered) and items

## API

### `HtmlToJsonConverter.convert(html, options?)`

Convert HTML to structured JSON.

**Options:**
- `includeTitle` (boolean, default: false) - Include title in output
- `title` (string) - Title to include if `includeTitle` is true

## Types

```typescript
interface StructuredContent {
  headings: Array<{ level: number; text: string }>;
  paragraphs: string[];
  links: Array<{ text: string; url: string }>;
  images: Array<{ alt: string; src: string }>;
  lists: Array<{ type: 'ordered' | 'unordered'; items: string[] }>;
}
```

## License

MIT