import * as cheerio from 'cheerio';

export interface HtmlToTextOptions {
  normalizeWhitespace?: boolean;
  includeTitle?: boolean;
  title?: string;
}

export class HtmlToTextConverter {
  
  /**
   * Convert HTML content to plain text format
   */
  static convert(html: string, options: HtmlToTextOptions = {}): string {
    const $ = cheerio.load(html);
    
    let text = '';
    
    // Add title if provided and requested
    if (options.includeTitle && options.title) {
      text += `${options.title}\n\n`;
    }
    
    // Extract text content
    text += $.text();
    
    // Normalize whitespace if requested (default behavior)
    if (options.normalizeWhitespace !== false) {
      text = text.replace(/\s+/g, ' ').trim();
    }
    
    return text;
  }

  /**
   * Convert HTML to text with more granular control over formatting
   */
  static convertWithFormatting(html: string, options: HtmlToTextOptions = {}): string {
    const $ = cheerio.load(html);
    let text = '';
    
    // Add title if provided and requested
    if (options.includeTitle && options.title) {
      text += `${options.title}\n\n`;
    }
    
    // Process elements to preserve some structure
    $('body').find('*').each((_, element) => {
      const $el = $(element);
      const tagName = element.tagName?.toLowerCase();
      
      // Add line breaks for block elements
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'li'].includes(tagName)) {
        const elementText = $el.text().trim();
        if (elementText) {
          text += elementText + '\n';
        }
      }
    });
    
    // Clean up excessive line breaks and whitespace
    text = text.replace(/\n\s*\n/g, '\n').trim();
    
    // Normalize whitespace if requested (default behavior)
    if (options.normalizeWhitespace !== false) {
      text = text.replace(/[ \t]+/g, ' ');
    }
    
    return text;
  }
}