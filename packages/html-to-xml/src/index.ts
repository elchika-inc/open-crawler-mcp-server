import * as cheerio from 'cheerio';

export interface StructuredContent {
  headings: Array<{ level: number; text: string }>;
  paragraphs: string[];
  links: Array<{ text: string; url: string }>;
  images: Array<{ alt: string; src: string }>;
  lists: Array<{ type: 'ordered' | 'unordered'; items: string[] }>;
}

export interface HtmlToXmlOptions {
  includeTitle?: boolean;
  title?: string;
}

export class HtmlToXmlConverter {
  
  /**
   * Convert HTML content to XML format
   */
  static convert(html: string, options: HtmlToXmlOptions = {}): string {
    const $ = cheerio.load(html);
    return this.toXML($, options);
  }

  /**
   * Convert to XML format with structured content
   */
  private static toXML($: cheerio.CheerioAPI, options: HtmlToXmlOptions): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<document>\n';
    
    if (options.includeTitle && options.title) {
      xml += `  <title><![CDATA[${options.title}]]></title>\n`;
    }
    
    xml += '  <content>\n';
    
    // Extract structured content using the same logic as JSON converter
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
   * Extract structured content from HTML (reuse logic from JSON converter)
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