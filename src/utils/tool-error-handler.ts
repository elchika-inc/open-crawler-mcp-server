/**
 * Common error handling utility for MCP tools
 */
export class ToolErrorHandler {
  /**
   * Handle errors in tool execution, re-throwing MCP errors as-is and wrapping other errors
   */
  static handleToolError(error: any): never {
    // If error is already a JSON-RPC error, re-throw it as-is
    if (typeof error === 'object' && error !== null && 'code' in error) {
      throw error;
    }
    
    // Wrap other errors in a generic MCP error
    throw {
      code: -32000,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}