import * as cheerio from 'cheerio';
import { ParseError } from './error-handler.js';

export interface ExtractionOptions {
  selector?: string;
  maxSize?: number;
}

export interface ExtractedContent {
  title: string;
  content: string;
}

/**
 * Simple content extractor for web pages
 */
export class ContentExtractor {
  private readonly maxSizeBytes: number;

  constructor(maxSizeBytes: number = 1024 * 1024) { // 1MB default
    this.maxSizeBytes = maxSizeBytes;
  }

  /**
   * Extract content from HTML
   */
  extractContent(html: string, options: ExtractionOptions = {}): ExtractedContent {
    const { selector } = options;
    
    try {
      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      $('script, style, noscript, nav, footer, header, aside').remove();
      
      // Extract title
      const title = $('title').text() || $('h1').first().text() || 'Untitled';
      
      // Extract content based on selector
      let content: string;
      if (selector) {
        const selectedElements = $(selector);
        if (selectedElements.length === 0) {
          throw new ParseError(`No elements found for selector: ${selector}`);
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

      // Simple truncation if content exceeds size limit
      if (content.length > this.maxSizeBytes) {
        content = content.substring(0, this.maxSizeBytes) + '...';
      }

      return {
        title: title.trim(),
        content
      };
    } catch (error) {
      if (error instanceof ParseError) {
        throw error;
      }
      throw new ParseError(`Failed to extract content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}