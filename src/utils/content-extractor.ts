import * as cheerio from 'cheerio';
import { ParseError, SizeExceededError } from './error-handler.js';

export interface ExtractionOptions {
  selector?: string;
  maxSize?: number;
}

export interface ExtractedContent {
  title: string;
  content: string;
}

/**
 * Content extractor for web pages
 */
export class ContentExtractor {
  private readonly maxSizeBytes: number;

  constructor(maxSizeBytes: number = 10 * 1024 * 1024) { // 10MB default
    this.maxSizeBytes = maxSizeBytes;
  }

  /**
   * Extract content from HTML
   */
  extractContent(html: string, options: ExtractionOptions = {}): ExtractedContent {
    // Check size limit
    if (html.length > this.maxSizeBytes) {
      throw new SizeExceededError(`Content size (${html.length} bytes) exceeds maximum limit of ${this.maxSizeBytes} bytes`);
    }

    try {
      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      $('script, style, nav, header, footer, aside').remove();
      
      // Extract title
      const title = $('title').text() || $('h1').first().text() || 'Untitled';
      
      // Extract content based on selector
      let content: string;
      if (options.selector) {
        const selectedElements = $(options.selector);
        if (selectedElements.length === 0) {
          throw new ParseError(`No elements found for selector: ${options.selector}`);
        }
        content = selectedElements.text().trim();
      } else {
        // Default content extraction
        const bodyContent = $('body').text() || $.text();
        content = bodyContent.replace(/\s+/g, ' ').trim();
      }

      if (!content) {
        throw new ParseError('No content found on the page');
      }

      return {
        title: title.trim(),
        content
      };
    } catch (error) {
      if (error instanceof ParseError || error instanceof SizeExceededError) {
        throw error;
      }
      throw new ParseError(`Failed to extract content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}