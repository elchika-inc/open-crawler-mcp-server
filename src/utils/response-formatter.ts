/**
 * Common response formatting utility for MCP tools
 */
export class ResponseFormatter {
  /**
   * Format tool execution result as MCP tool response
   */
  static formatToolResponse(result: any) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
}