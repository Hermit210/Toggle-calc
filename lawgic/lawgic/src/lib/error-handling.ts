/**
 * Error handling utilities for LexMint Legal Assistant
 * Provides consistent error handling, logging, and user-friendly error messages
 */

import { AppError, AppErrorType } from '@/types';

/**
 * Create a standardized application error
 */
export const createAppError = (
  type: AppErrorType,
  message: string,
  details?: string,
  retryable: boolean = false
): AppError => ({
  type,
  message,
  details,
  retryable
});

/**
 * Convert unknown error to AppError
 */
export const normalizeError = (error: unknown): AppError => {
  if (error && typeof error === 'object' && 'type' in error) {
    return error as AppError;
  }

  if (error instanceof Error) {
    return createAppError('processing', error.message, error.stack, false);
  }

  if (typeof error === 'string') {
    return createAppError('processing', error, undefined, false);
  }

  return createAppError('processing', 'An unknown error occurred', undefined, false);
};

/**
 * Get user-friendly error message based on error type
 */
export const getUserFriendlyMessage = (error: AppError): string => {
  switch (error.type) {
    case 'network':
      if (error.message.includes('Rate limit')) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      if (error.message.includes('Authentication')) {
        return 'Authentication failed. Please check your API configuration.';
      }
      return 'Network error. Please check your connection and try again.';
    
    case 'validation':
      return error.message || 'Invalid input. Please check your data and try again.';
    
    case 'processing':
      if (error.message.includes('timeout')) {
        return 'Processing took too long. Please try with a smaller file or simpler query.';
      }
      if (error.message.includes('format')) {
        return 'Unsupported file format. Please use PDF, DOCX, or TXT files.';
      }
      return 'Processing error. Please try again or contact support.';
    
    case 'blockchain':
      if (error.message.includes('gas')) {
        return 'Blockchain transaction failed due to insufficient gas. Please try again.';
      }
      return 'Blockchain operation failed. The main features will continue to work normally.';
    
    default:
      return 'Something went wrong. Please try again.';
  }
};

/**
 * Log error with appropriate level and context
 * In production, this would integrate with a logging service
 */
export const logError = (
  error: AppError,
  context?: Record<string, any>
): void => {
  const logData = {
    timestamp: new Date().toISOString(),
    type: error.type,
    message: error.message,
    details: error.details,
    retryable: error.retryable,
    context,
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', logData);
  }

  // In production, send to logging service (e.g., Sentry, LogRocket)
  // This would be implemented based on the chosen logging solution
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToLoggingService(logData);
  }
};

/**
 * Error boundary helper for React components
 */
export const handleComponentError = (
  error: Error,
  errorInfo: { componentStack: string }
): AppError => {
  const appError = createAppError(
    'processing',
    'Component error occurred',
    `${error.message}\n${errorInfo.componentStack}`,
    true
  );

  logError(appError, { 
    originalError: error.name,
    componentStack: errorInfo.componentStack 
  });

  return appError;
};

/**
 * Async operation wrapper with error handling
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<{ data?: T; error?: AppError }> => {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    const appError = normalizeError(error);
    logError(appError, { context });
    return { error: appError };
  }
};

/**
 * Retry wrapper for operations that might fail temporarily
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: AppError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = normalizeError(error);
      
      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError!;
};

/**
 * File validation errors
 */
export const createFileValidationError = (
  message: string,
  filename?: string
): AppError => {
  return createAppError(
    'validation',
    message,
    filename ? `File: ${filename}` : undefined,
    false
  );
};

/**
 * Network connectivity check
 */
export const checkNetworkConnectivity = (): boolean => {
  return navigator.onLine;
};

/**
 * Get error recovery suggestions
 */
export const getRecoverySuggestions = (error: AppError): string[] => {
  const suggestions: string[] = [];

  switch (error.type) {
    case 'network':
      suggestions.push('Check your internet connection');
      if (error.retryable) {
        suggestions.push('Try again in a few moments');
      }
      if (error.message.includes('Rate limit')) {
        suggestions.push('Wait before making more requests');
      }
      break;

    case 'validation':
      suggestions.push('Check your input data');
      if (error.message.includes('file')) {
        suggestions.push('Ensure file is in supported format (PDF, DOCX, TXT)');
        suggestions.push('Check file size is under the limit');
      }
      break;

    case 'processing':
      suggestions.push('Try with a smaller file or simpler query');
      if (error.retryable) {
        suggestions.push('Retry the operation');
      }
      break;

    case 'blockchain':
      suggestions.push('Blockchain features are optional - main functionality continues to work');
      suggestions.push('Check your wallet connection if using blockchain features');
      break;
  }

  if (suggestions.length === 0) {
    suggestions.push('Contact support if the problem persists');
  }

  return suggestions;
};