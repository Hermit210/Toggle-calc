/**
 * API integration utilities for LexMint Legal Assistant
 * Handles external AI API communication with proper error handling and retry logic
 */

import { AIRequest, AIResponse, AppError, ApiResponse } from '@/types';

// API Configuration
const AI_API_KEY = '98148fc5498346289784c5879bfd9626';
const AI_API_BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'https://api.example.com';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (attempt: number): number => 
  INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);

/**
 * Create standardized API error
 */
const createApiError = (
  type: AppError['type'],
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
 * Handle different types of HTTP errors
 */
const handleHttpError = (status: number, statusText: string): AppError => {
  switch (status) {
    case 401:
      return createApiError('network', 'Authentication failed', 'Invalid API key', false);
    case 429:
      return createApiError('network', 'Rate limit exceeded', 'Too many requests', true);
    case 400:
      return createApiError('validation', 'Invalid request', statusText, false);
    case 500:
    case 502:
    case 503:
    case 504:
      return createApiError('network', 'Server error', statusText, true);
    default:
      return createApiError('network', 'Request failed', `${status}: ${statusText}`, true);
  }
};

/**
 * Make HTTP request with retry logic and proper error handling
 */
const makeRequest = async <T>(
  url: string,
  options: RequestInit,
  attempt: number = 1
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = handleHttpError(response.status, response.statusText);
      
      // Retry for retryable errors
      if (error.retryable && attempt < MAX_RETRIES) {
        const delay = getRetryDelay(attempt);
        await sleep(delay);
        return makeRequest<T>(url, options, attempt + 1);
      }
      
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, data };

  } catch (networkError) {
    const error = createApiError(
      'network',
      'Network request failed',
      networkError instanceof Error ? networkError.message : 'Unknown network error',
      true
    );

    // Retry for network errors
    if (attempt < MAX_RETRIES) {
      const delay = getRetryDelay(attempt);
      await sleep(delay);
      return makeRequest<T>(url, options, attempt + 1);
    }

    return { success: false, error };
  }
};

/**
 * Send query to AI API for legal assistance
 */
export const queryAI = async (request: AIRequest): Promise<ApiResponse<AIResponse>> => {
  const url = `${AI_API_BASE_URL}/chat/completions`;
  
  const body = {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a legal assistant AI. Provide accurate, helpful legal information with proper citations. Always include disclaimers about seeking professional legal advice.'
      },
      {
        role: 'user',
        content: request.query
      }
    ],
    max_tokens: request.maxTokens || 1000,
    temperature: request.temperature || 0.7,
    ...(request.context && { context: request.context })
  };

  return makeRequest<AIResponse>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * Analyze document content using AI API
 */
export const analyzeDocument = async (
  documentText: string,
  filename: string
): Promise<ApiResponse<AIResponse>> => {
  const url = `${AI_API_BASE_URL}/analyze/document`;
  
  const body = {
    text: documentText,
    filename,
    analysis_type: 'legal_document',
    include_clauses: true,
    include_issues: true,
    include_summary: true
  };

  return makeRequest<AIResponse>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * Validate API key format
 */
export const validateApiKey = (key: string): boolean => {
  return /^[a-f0-9]{32}$/.test(key);
};

/**
 * Check API health/connectivity
 */
export const checkApiHealth = async (): Promise<ApiResponse<{ status: string }>> => {
  const url = `${AI_API_BASE_URL}/health`;
  
  return makeRequest<{ status: string }>(url, {
    method: 'GET',
  });
};