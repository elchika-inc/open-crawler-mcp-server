/**
 * URL normalization utility
 */
export class URLNormalizer {
  /**
   * Normalize URL by ensuring proper format
   * @param url - The URL to normalize
   * @param forceHttps - Whether to force HTTPS (default: false)
   */
  static normalize(url: string, forceHttps: boolean = false): string {
    try {
      // If URL doesn't start with protocol, assume https
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      // Convert http to https only if forceHttps is true
      if (forceHttps && url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      
      // Create URL object to validate and normalize
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch (error) {
      throw new Error(`Invalid URL format: ${url}`);
    }
  }

  /**
   * Extract domain from URL
   */
  static getDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      throw new Error(`Invalid URL format: ${url}`);
    }
  }

  /**
   * Get robots.txt URL for a given domain
   */
  static getRobotsUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/robots.txt`;
    } catch (error) {
      throw new Error(`Invalid URL format: ${url}`);
    }
  }
}