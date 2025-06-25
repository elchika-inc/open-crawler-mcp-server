import * as cheerio from 'cheerio';

export type OutputFormat = 'text' | 'markdown' | 'xml' | 'json';

export interface FormattedContent {
  format: OutputFormat;
  content: string;
}

export interface StructuredContent {
  headings: Array<{ level: number; text: string }>;
  paragraphs: string[];
  links: Array<{ text: string; url: string }>;
  images: Array<{ alt: string; src: string }>;
  lists: Array<{ type: 'ordered' | 'unordered'; items: string[] }>;
}

export class ContentFormatter {
  
  /**
   * Convert HTML content to specified format
   */
  static format(html: string, format: OutputFormat, title?: string): FormattedContent {
    const $ = cheerio.load(html);
    
    switch (format) {
      case 'text':
        return {
          format: 'text',
          content: $.text().replace(/\s+/g, ' ').trim()
        };
      
      case 'markdown':
        return {
          format: 'markdown',
          content: this.toMarkdown($, title)
        };
      
      case 'xml':
        return {
          format: 'xml',
          content: this.toXML($, title)
        };
      
      case 'json':
        return {
          format: 'json',
          content: JSON.stringify(this.toStructuredJSON($, title), null, 2)
        };
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Convert to Markdown format
   */
  private static toMarkdown($: cheerio.CheerioAPI, title?: string): string {
    let markdown = '';
    
    // Add title if provided
    if (title) {
      markdown += `# ${title}\n\n`;
    }
    
    // Process elements in order
    $('body *').each((_, element) => {
      const $el = $(element);
      const tagName = element.tagName?.toLowerCase();
      
      switch (tagName) {
        case 'h1':
          markdown += `# ${$el.text().trim()}\n\n`;
          break;
        case 'h2':
          markdown += `## ${$el.text().trim()}\n\n`;
          break;
        case 'h3':
          markdown += `### ${$el.text().trim()}\n\n`;
          break;
        case 'h4':
          markdown += `#### ${$el.text().trim()}\n\n`;
          break;
        case 'h5':
          markdown += `##### ${$el.text().trim()}\n\n`;
          break;
        case 'h6':
          markdown += `###### ${$el.text().trim()}\n\n`;
          break;
        case 'p':
          const pText = $el.text().trim();
          if (pText) {
            markdown += `${pText}\n\n`;
          }
          break;
        case 'a':
          const href = $el.attr('href');
          const linkText = $el.text().trim();
          if (href && linkText) {
            markdown += `[${linkText}](${href})`;
          }
          break;
        case 'img':
          const src = $el.attr('src');
          const alt = $el.attr('alt') || '';
          if (src) {
            markdown += `![${alt}](${src})\n\n`;
          }
          break;
        case 'ul':
          $el.find('li').each((_, li) => {
            markdown += `- ${$(li).text().trim()}\n`;
          });
          markdown += '\n';
          break;
        case 'ol':
          $el.find('li').each((i, li) => {
            markdown += `${i + 1}. ${$(li).text().trim()}\n`;
          });
          markdown += '\n';
          break;
        case 'blockquote':
          const quoteText = $el.text().trim();
          if (quoteText) {
            markdown += `> ${quoteText}\n\n`;
          }
          break;
        case 'code':
          markdown += `\`${$el.text()}\``;
          break;
        case 'pre':
          markdown += `\`\`\`\n${$el.text()}\n\`\`\`\n\n`;
          break;
      }
    });
    
    return markdown.trim();
  }

  /**
   * Convert to XML format
   */
  private static toXML($: cheerio.CheerioAPI, title?: string): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<document>\n';
    
    if (title) {
      xml += `  <title><![CDATA[${title}]]></title>\n`;
    }
    
    xml += '  <content>\n';
    
    // Extract structured content
    const structured = this.extractStructuredContent($);
    
    // Add headings
    if (structured.headings.length > 0) {
      xml += '    <headings>\n';
      structured.headings.forEach(heading => {
        xml += `      <heading level="${heading.level}"><![CDATA[${heading.text}]]></heading>\n`;
      });
      xml += '    </headings>\n';
    }
    
    // Add paragraphs
    if (structured.paragraphs.length > 0) {
      xml += '    <paragraphs>\n';
      structured.paragraphs.forEach(paragraph => {
        xml += `      <paragraph><![CDATA[${paragraph}]]></paragraph>\n`;
      });
      xml += '    </paragraphs>\n';
    }
    
    // Add links
    if (structured.links.length > 0) {
      xml += '    <links>\n';
      structured.links.forEach(link => {
        xml += `      <link url="${link.url}"><![CDATA[${link.text}]]></link>\n`;
      });
      xml += '    </links>\n';
    }
    
    // Add images
    if (structured.images.length > 0) {
      xml += '    <images>\n';
      structured.images.forEach(image => {
        xml += `      <image src="${image.src}" alt="${image.alt}"/>\n`;
      });
      xml += '    </images>\n';
    }
    
    // Add lists
    if (structured.lists.length > 0) {
      xml += '    <lists>\n';
      structured.lists.forEach(list => {
        xml += `      <list type="${list.type}">\n`;
        list.items.forEach(item => {
          xml += `        <item><![CDATA[${item}]]></item>\n`;
        });
        xml += '      </list>\n';
      });
      xml += '    </lists>\n';
    }
    
    xml += '  </content>\n';
    xml += '</document>';
    
    return xml;
  }

  /**
   * Convert to structured JSON format
   */
  private static toStructuredJSON($: cheerio.CheerioAPI, title?: string): any {
    const structured = this.extractStructuredContent($);
    
    return {
      title: title || null,
      content: structured
    };
  }

  /**
   * Extract structured content from HTML
   */
  private static extractStructuredContent($: cheerio.CheerioAPI): StructuredContent {
    const headings: Array<{ level: number; text: string }> = [];
    const paragraphs: string[] = [];
    const links: Array<{ text: string; url: string }> = [];
    const images: Array<{ alt: string; src: string }> = [];
    const lists: Array<{ type: 'ordered' | 'unordered'; items: string[] }> = [];
    
    // Extract headings
    $('h1, h2, h3, h4, h5, h6').each((_, element) => {
      const $el = $(element);
      const level = parseInt(element.tagName.substring(1));
      const text = $el.text().trim();
      if (text) {
        headings.push({ level, text });
      }
    });
    
    // Extract paragraphs
    $('p').each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        paragraphs.push(text);
      }
    });
    
    // Extract links
    $('a[href]').each((_, element) => {
      const $el = $(element);
      const href = $el.attr('href');
      const text = $el.text().trim();
      if (href && text) {
        links.push({ text, url: href });
      }
    });
    
    // Extract images
    $('img[src]').each((_, element) => {
      const $el = $(element);
      const src = $el.attr('src');
      const alt = $el.attr('alt') || '';
      if (src) {
        images.push({ alt, src });
      }
    });
    
    // Extract unordered lists
    $('ul').each((_, element) => {
      const items: string[] = [];
      $(element).find('li').each((_, li) => {
        const text = $(li).text().trim();
        if (text) {
          items.push(text);
        }
      });
      if (items.length > 0) {
        lists.push({ type: 'unordered', items });
      }
    });
    
    // Extract ordered lists
    $('ol').each((_, element) => {
      const items: string[] = [];
      $(element).find('li').each((_, li) => {
        const text = $(li).text().trim();
        if (text) {
          items.push(text);
        }
      });
      if (items.length > 0) {
        lists.push({ type: 'ordered', items });
      }
    });
    
    return { headings, paragraphs, links, images, lists };
  }
}