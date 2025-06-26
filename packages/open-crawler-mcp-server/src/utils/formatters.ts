import * as cheerio from 'cheerio';
import { HtmlToMarkdownConverter } from '@elchika-inc/html-to-markdown';
import { HtmlToJsonConverter } from '@elchika-inc/html-to-json';
import { HtmlToXmlConverter } from '@elchika-inc/html-to-xml';
import { HtmlToTextConverter } from '@elchika-inc/html-to-text';

export type OutputFormat = 'text' | 'markdown' | 'xml' | 'json';

export interface FormattedContent {
  format: OutputFormat;
  content: string;
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
          content: HtmlToTextConverter.convert(html, { normalizeWhitespace: true, includeTitle: true, title })
        };
      
      case 'markdown':
        return {
          format: 'markdown',
          content: HtmlToMarkdownConverter.convert(html, { includeTitle: true, title })
        };
      
      case 'xml':
        return {
          format: 'xml',
          content: HtmlToXmlConverter.convert(html, { includeTitle: true, title })
        };
      
      case 'json':
        return {
          format: 'json',
          content: HtmlToJsonConverter.convert(html, { includeTitle: true, title })
        };
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }




}