import * as cheerio from 'cheerio';

export interface StructuredContent {
  headings: Array<{ level: number; text: string }>;
  paragraphs: string[];
  links: Array<{ text: string; url: string }>;
  images: Array<{ alt: string; src: string }>;
  lists: Array<{ type: 'ordered' | 'unordered'; items: string[] }>;
}

export interface HtmlToJsonOptions {
  includeTitle?: boolean;
  title?: string;
}

export class HtmlToJsonConverter {
  
  /**
   * Convert HTML content to structured JSON format
   */
  static convert(html: string, options: HtmlToJsonOptions = {}): string {
    const $ = cheerio.load(html);
    const structured = this.extractStructuredContent($);
    
    const result = {
      title: options.includeTitle && options.title ? options.title : null,
      content: structured
    };
    
    return JSON.stringify(result, null, 2);
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