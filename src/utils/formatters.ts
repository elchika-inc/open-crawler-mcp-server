import { HtmlToMarkdownConverter } from '@elchika-inc/html-to-markdown';
import { HtmlToJsonConverter } from '@elchika-inc/html-to-json';
import { HtmlToXmlConverter } from '@elchika-inc/html-to-xml';
import { HtmlToTextConverter } from '@elchika-inc/html-to-text';

export type OutputFormat = 'text' | 'markdown' | 'xml' | 'json';

export interface FormattedContent {
  format: OutputFormat;
  content: string;
}

interface ConverterOptions {
  includeTitle: boolean;
  title?: string;
}

export class ContentFormatter {
  private static getOptions(title?: string): ConverterOptions {
    return { includeTitle: true, title };
  }
  
  /**
   * Convert HTML content to specified format
   */
  static format(html: string, format: OutputFormat, title?: string): FormattedContent {
    const options = this.getOptions(title);
    
    switch (format) {
      case 'text':
        return {
          format: 'text',
          content: HtmlToTextConverter.convert(html, { 
            normalizeWhitespace: true, 
            ...options 
          })
        };
      
      case 'markdown':
        return {
          format: 'markdown',
          content: HtmlToMarkdownConverter.convert(html, options)
        };
      
      case 'xml':
        return {
          format: 'xml',
          content: HtmlToXmlConverter.convert(html, options)
        };
      
      case 'json':
        return {
          format: 'json',
          content: HtmlToJsonConverter.convert(html, options)
        };
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}