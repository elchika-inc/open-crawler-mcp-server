import { RateLimitError } from './error-handler.js';

/**
 * Simple rate limiter for web crawling
 */
export class RateLimiter {
  private lastRequestTime = 0;
  private readonly minDelayMs: number;

  constructor(minDelayMs: number = 1000) {
    this.minDelayMs = minDelayMs;
  }

  /**
   * Wait for the appropriate delay before allowing the next request
   */
  async waitForNextRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minDelayMs) {
      const delayNeeded = this.minDelayMs - timeSinceLastRequest;
      await this.delay(delayNeeded);
    }
    
    this.lastRequestTime = Date.now();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear the rate limiter state
   */
  clearState(): void {
    this.lastRequestTime = 0;
  }
}