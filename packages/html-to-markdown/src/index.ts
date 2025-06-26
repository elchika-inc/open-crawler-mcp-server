import * as cheerio from 'cheerio';

export interface HtmlToMarkdownOptions {
  includeTitle?: boolean;
  title?: string;
}

export class HtmlToMarkdownConverter {
  
  /**
   * Convert HTML content to Markdown format
   */
  static convert(html: string, options: HtmlToMarkdownOptions = {}): string {
    const $ = cheerio.load(html);
    return this.toMarkdown($, options);
  }

  /**
   * Convert to Markdown format with comprehensive element support
   */
  private static toMarkdown($: cheerio.CheerioAPI, options: HtmlToMarkdownOptions): string {
    let markdown = '';
    
    // Add title if provided and requested
    if (options.includeTitle && options.title) {
      markdown += `# ${options.title}\n\n`;
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
        case 'strong':
        case 'b':
          const strongText = $el.text().trim();
          if (strongText) {
            markdown += `**${strongText}**`;
          }
          break;
        case 'em':
        case 'i':
          const emText = $el.text().trim();
          if (emText) {
            markdown += `*${emText}*`;
          }
          break;
        case 'br':
          markdown += '\n';
          break;
        case 'hr':
          markdown += '\n---\n\n';
          break;
      }
    });
    
    return markdown.trim();
  }
}