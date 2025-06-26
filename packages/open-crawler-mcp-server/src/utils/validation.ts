import { ErrorHandler } from './error-handler.js';

export class ParameterValidator {
  static validateUrl(url: any): void {
    if (!url || typeof url !== 'string') {
      throw ErrorHandler.createError(
        -32602,
        'Invalid parameters: url is required and must be a string'
      );
    }
  }

  static validateSelector(selector: any): void {
    if (selector && typeof selector !== 'string') {
      throw ErrorHandler.createError(
        -32602,
        'Invalid parameters: selector must be a string'
      );
    }
  }

  static validateBoolean(value: any, fieldName: string): void {
    if (value !== undefined && typeof value !== 'boolean') {
      throw ErrorHandler.createError(
        -32602,
        `Invalid parameters: ${fieldName} must be a boolean`
      );
    }
  }

  static validateFormat(format: any): void {
    const validFormats = ['text', 'markdown', 'xml', 'json'];
    if (format && !validFormats.includes(format)) {
      throw ErrorHandler.createError(
        -32602,
        'Invalid parameters: format must be one of text, markdown, xml, json'
      );
    }
  }
}