export interface JsonRpcError {
  code: number;
  message: string;
}

export class ErrorHandler {
  static createError(code: number, message: string): JsonRpcError {
    return { code, message };
  }

  static classifyError(error: Error): JsonRpcError {
    const message = error.message;
    
    if (message.includes('robots.txt')) {
      return this.createError(-32003, `Robots.txt violation: ${message}`);
    }
    
    if (message.includes('timeout')) {
      return this.createError(-32004, `Rate limit or timeout: ${message}`);
    }
    
    if (message.includes('exceeds maximum limit')) {
      return this.createError(-32005, `Size exceeded: ${message}`);
    }
    
    if (message.includes('Network error') || message.includes('HTTP')) {
      return this.createError(-32001, `Network error: ${message}`);
    }
    
    if (message.includes('No elements found') || message.includes('No content')) {
      return this.createError(-32002, `Parse error: ${message}`);
    }
    
    return this.createError(-32000, `Unknown error: ${message}`);
  }
}