/**
 * Validation utilities for LexMint Legal Assistant
 * Provides input validation and sanitization functions
 */

import { 
  MAX_FILE_SIZE, 
  SUPPORTED_FILE_TYPES, 
  SUPPORTED_MIME_TYPES,
  CHAT_CONFIG,
  REGEX_PATTERNS 
} from './constants';
import { createAppError } from './error-handling';
import { getFileExtension } from './utils';

/**
 * Validate file upload
 */
export const validateFile = (file: File) => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw createAppError(
      'validation',
      `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
      `File: ${file.name} (${file.size} bytes)`,
      false
    );
  }

  // Check file type by extension
  const extension = getFileExtension(file.name);
  if (!SUPPORTED_FILE_TYPES.includes(extension as any)) {
    throw createAppError(
      'validation',
      `Unsupported file type: ${extension}`,
      `Supported types: ${SUPPORTED_FILE_TYPES.join(', ')}`,
      false
    );
  }

  // Check MIME type
  if (!SUPPORTED_MIME_TYPES.includes(file.type as any)) {
    throw createAppError(
      'validation',
      'Invalid file format',
      `MIME type: ${file.type}`,
      false
    );
  }

  return true;
};

/**
 * Validate chat message
 */
export const validateChatMessage = (message: string) => {
  if (!message || message.trim().length === 0) {
    throw createAppError(
      'validation',
      'Message cannot be empty',
      undefined,
      false
    );
  }

  if (message.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
    throw createAppError(
      'validation',
      `Message exceeds ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} character limit`,
      `Current length: ${message.length}`,
      false
    );
  }

  return true;
};

/**
 * Validate email address
 */
export const validateEmail = (email: string) => {
  if (!email || !REGEX_PATTERNS.EMAIL.test(email)) {
    throw createAppError(
      'validation',
      'Invalid email address format',
      undefined,
      false
    );
  }

  return true;
};

/**
 * Validate API key format
 */
export const validateApiKey = (apiKey: string) => {
  if (!apiKey || !REGEX_PATTERNS.API_KEY.test(apiKey)) {
    throw createAppError(
      'validation',
      'Invalid API key format',
      'API key must be 32 hexadecimal characters',
      false
    );
  }

  return true;
};

/**
 * Validate blockchain transaction hash
 */
export const validateTransactionHash = (hash: string) => {
  if (!hash || !REGEX_PATTERNS.TRANSACTION_HASH.test(hash)) {
    throw createAppError(
      'validation',
      'Invalid transaction hash format',
      'Transaction hash must be 64 hexadecimal characters prefixed with 0x',
      false
    );
  }

  return true;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validate FAQ search query
 */
export const validateSearchQuery = (query: string) => {
  if (query.length > 100) {
    throw createAppError(
      'validation',
      'Search query too long',
      'Maximum 100 characters allowed',
      false
    );
  }

  return true;
};

/**
 * Validate document analysis request
 */
export const validateAnalysisRequest = (text: string, filename: string) => {
  if (!text || text.trim().length === 0) {
    throw createAppError(
      'validation',
      'Document text cannot be empty',
      `File: ${filename}`,
      false
    );
  }

  if (text.length < 50) {
    throw createAppError(
      'validation',
      'Document too short for meaningful analysis',
      'Minimum 50 characters required',
      false
    );
  }

  if (text.length > 100000) { // 100KB text limit
    throw createAppError(
      'validation',
      'Document too large for analysis',
      'Maximum 100,000 characters allowed',
      false
    );
  }

  return true;
};

/**
 * Validate phone number format
 */
export const validatePhoneNumber = (phone: string) => {
  if (!phone || !REGEX_PATTERNS.PHONE.test(phone)) {
    throw createAppError(
      'validation',
      'Invalid phone number format',
      undefined,
      false
    );
  }

  return true;
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    throw createAppError(
      'validation',
      'Invalid URL format',
      undefined,
      false
    );
  }
};

/**
 * Validate required fields in an object
 */
export const validateRequiredFields = <T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
) => {
  const missingFields = requiredFields.filter(field => 
    obj[field] === undefined || obj[field] === null || obj[field] === ''
  );

  if (missingFields.length > 0) {
    throw createAppError(
      'validation',
      'Missing required fields',
      `Required: ${missingFields.join(', ')}`,
      false
    );
  }

  return true;
};