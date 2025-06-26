export interface JsonRpcError {
  code: number;
  message: string;
}

/**
 * Simplified error types for MCP server
 */
export enum ErrorType {
  UNKNOWN = -32000,
  NETWORK = -32001,
  PARSE = -32002,
  ROBOTS = -32003,
  RATE_LIMIT = -32004,
  SIZE_EXCEEDED = -32005,
}

/**
 * Custom error classes for better error handling
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export class RobotsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RobotsError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class SizeExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SizeExceededError';
  }
}

export class ErrorHandler {
  static createError(code: number, message: string): JsonRpcError {
    return { code, message };
  }

  static createTypedError(type: ErrorType, message: string): JsonRpcError {
    return { code: type, message };
  }

  /**
   * Simplified error classification based on error type rather than string matching
   */
  static classifyError(error: Error): JsonRpcError {
    // Use error type for classification instead of string matching
    if (error instanceof NetworkError) {
      return this.createTypedError(ErrorType.NETWORK, error.message);
    }
    
    if (error instanceof ParseError) {
      return this.createTypedError(ErrorType.PARSE, error.message);
    }
    
    if (error instanceof RobotsError) {
      return this.createTypedError(ErrorType.ROBOTS, error.message);
    }
    
    if (error instanceof RateLimitError) {
      return this.createTypedError(ErrorType.RATE_LIMIT, error.message);
    }
    
    if (error instanceof SizeExceededError) {
      return this.createTypedError(ErrorType.SIZE_EXCEEDED, error.message);
    }
    
    // Fallback to string matching for backward compatibility
    const message = error.message;
    
    if (message.includes('robots.txt')) {
      return this.createTypedError(ErrorType.ROBOTS, message);
    }
    
    if (message.includes('timeout') || message.includes('rate limit')) {
      return this.createTypedError(ErrorType.RATE_LIMIT, message);
    }
    
    if (message.includes('exceeds maximum limit') || message.includes('too large')) {
      return this.createTypedError(ErrorType.SIZE_EXCEEDED, message);
    }
    
    if (message.includes('network') || message.includes('HTTP') || message.includes('fetch')) {
      return this.createTypedError(ErrorType.NETWORK, message);
    }
    
    if (message.includes('parse') || message.includes('No elements found') || message.includes('No content')) {
      return this.createTypedError(ErrorType.PARSE, message);
    }
    
    return this.createTypedError(ErrorType.UNKNOWN, message);
  }
}