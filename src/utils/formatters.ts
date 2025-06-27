import { HtmlToMarkdownConverter } from '@elchika-inc/html-to-markdown';
import { HtmlToJsonConverter } from '@elchika-inc/html-to-json';
import { HtmlToXmlConverter } from '@elchika-inc/html-to-xml';
import { HtmlToTextConverter } from '@elchika-inc/html-to-text';

export type OutputFormat = 'text' | 'markdown' | 'xml' | 'json';

export interface FormattedContent {
  format: OutputFormat;
  content: string;
}

interface FormatOptions {
  includeTitle?: boolean;
  title?: string;
}

/**
 * Simple content formatter using functions instead of complex class hierarchy
 */
export class ContentFormatter {
  /**
   * Convert HTML content to specified format
   */
  static format(html: string, format: OutputFormat, title?: string): FormattedContent {
    const options: FormatOptions = { includeTitle: true, title };
    
    let content: string;
    
    switch (format) {
      case 'text':
        content = HtmlToTextConverter.convert(html, { 
          normalizeWhitespace: true, 
          ...options 
        });
        break;
      case 'markdown':
        content = HtmlToMarkdownConverter.convert(html, options);
        break;
      case 'xml':
        content = HtmlToXmlConverter.convert(html, options);
        break;
      case 'json':
        content = HtmlToJsonConverter.convert(html, options);
        break;
      default:
        throw new Error(`Unsupported format: ${format}. Available formats: text, markdown, xml, json`);
    }
    
    return {
      format,
      content
    };
  }
}