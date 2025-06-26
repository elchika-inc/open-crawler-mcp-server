# @elchika-inc/html-to-xml

Convert HTML content to structured XML format using Cheerio.

## Installation

```bash
npm install @elchika-inc/html-to-xml
```

## Usage

```typescript
import { HtmlToXmlConverter } from '@elchika-inc/html-to-xml';

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
const xml = HtmlToXmlConverter.convert(html);
console.log(xml);
// Output:
// <?xml version="1.0" encoding="UTF-8"?>
// <document>
//   <content>
//     <headings>
//       <heading level="1"><![CDATA[Hello World]]></heading>
//     </headings>
//     <paragraphs>
//       <paragraph><![CDATA[This is a paragraph.]]></paragraph>
//     </paragraphs>
//     <links>
//       <link url="https://example.com"><![CDATA[Link]]></link>
//     </links>
//     <images>
//       <image src="image.jpg" alt="Example image"/>
//     </images>
//     <lists>
//       <list type="unordered">
//         <item><![CDATA[Item 1]]></item>
//         <item><![CDATA[Item 2]]></item>
//       </list>
//     </lists>
//   </content>
// </document>

// With title
const xmlWithTitle = HtmlToXmlConverter.convert(html, {
  includeTitle: true,
  title: 'My Document'
});
```

## XML Structure

The generated XML follows this structure:

- `<document>` - Root element
  - `<title>` - Optional title (if provided)
  - `<content>` - Main content container
    - `<headings>` - Contains all heading elements
    - `<paragraphs>` - Contains all paragraph text
    - `<links>` - Contains all links with URLs
    - `<images>` - Contains all images with sources
    - `<lists>` - Contains all lists (ordered/unordered)

## API

### `HtmlToXmlConverter.convert(html, options?)`

Convert HTML to structured XML.

**Options:**
- `includeTitle` (boolean, default: false) - Include title element
- `title` (string) - Title to include if `includeTitle` is true

## License

MIT