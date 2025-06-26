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

/**
 * Interface for content formatters (Open/Closed Principle)
 */
export interface ContentFormatterInterface {
  format(html: string, options?: ConverterOptions): string;
  getSupportedFormat(): OutputFormat;
}

/**
 * Text content formatter
 */
export class TextFormatter implements ContentFormatterInterface {
  format(html: string, options?: ConverterOptions): string {
    return HtmlToTextConverter.convert(html, { 
      normalizeWhitespace: true, 
      ...options 
    });
  }

  getSupportedFormat(): OutputFormat {
    return 'text';
  }
}

/**
 * Markdown content formatter
 */
export class MarkdownFormatter implements ContentFormatterInterface {
  format(html: string, options?: ConverterOptions): string {
    return HtmlToMarkdownConverter.convert(html, options);
  }

  getSupportedFormat(): OutputFormat {
    return 'markdown';
  }
}

/**
 * XML content formatter
 */
export class XmlFormatter implements ContentFormatterInterface {
  format(html: string, options?: ConverterOptions): string {
    return HtmlToXmlConverter.convert(html, options);
  }

  getSupportedFormat(): OutputFormat {
    return 'xml';
  }
}

/**
 * JSON content formatter
 */
export class JsonFormatter implements ContentFormatterInterface {
  format(html: string, options?: ConverterOptions): string {
    return HtmlToJsonConverter.convert(html, options);
  }

  getSupportedFormat(): OutputFormat {
    return 'json';
  }
}

/**
 * Registry for content formatters (follows Open/Closed Principle)
 */
export class FormatterRegistry {
  private static formatters = new Map<OutputFormat, ContentFormatterInterface>();

  static {
    // Register default formatters
    this.register(new TextFormatter());
    this.register(new MarkdownFormatter());
    this.register(new XmlFormatter());
    this.register(new JsonFormatter());
  }

  /**
   * Register a new formatter (Open for extension)
   */
  static register(formatter: ContentFormatterInterface): void {
    this.formatters.set(formatter.getSupportedFormat(), formatter);
  }

  /**
   * Format content using registered formatters
   */
  static format(html: string, format: OutputFormat, title?: string): FormattedContent {
    const formatter = this.formatters.get(format);
    if (!formatter) {
      throw new Error(`Unsupported format: ${format}. Available formats: ${Array.from(this.formatters.keys()).join(', ')}`);
    }

    const options: ConverterOptions = { includeTitle: true, title };
    const content = formatter.format(html, options);

    return {
      format,
      content
    };
  }

  /**
   * Get all supported formats
   */
  static getSupportedFormats(): OutputFormat[] {
    return Array.from(this.formatters.keys());
  }
}

/**
 * Legacy formatter for backward compatibility
 * @deprecated Use FormatterRegistry instead
 */
export class ContentFormatter {
  private static getOptions(title?: string): ConverterOptions {
    return { includeTitle: true, title };
  }
  
  /**
   * Convert HTML content to specified format
   * @deprecated Use FormatterRegistry.format() instead
   */
  static format(html: string, format: OutputFormat, title?: string): FormattedContent {
    return FormatterRegistry.format(html, format, title);
  }
}