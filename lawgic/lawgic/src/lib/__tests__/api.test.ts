/**
 * Unit tests for AI API integration service
 * Tests all API functions with mocked responses and error scenarios
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { queryAI, analyzeDocument, validateApiKey, checkApiHealth } from '../api';
import { AIRequest, AIResponse, AppError } from '@/types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables
const originalEnv = process.env;

describe('AI API Integration Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('queryAI', () => {
    const mockRequest: AIRequest = {
      query: 'What are the key elements of a valid contract?',
      maxTokens: 500,
      temperature: 0.7
    };

    const mockSuccessResponse: AIResponse = {
      answer: 'A valid contract requires offer, acceptance, consideration, and legal capacity.',
      confidence: 0.95,
      sources: ['Contract Law Basics', 'Legal Principles'],
      usage: {
        promptTokens: 50,
        completionTokens: 100
      }
    };

    it('should successfully query AI API with valid request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
        status: 200,
        statusText: 'OK'
      });

      const result = await queryAI(mockRequest);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSuccessResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 98148fc5498346289784c5879bfd9626'
          }),
          body: expect.stringContaining(mockRequest.query)
        })
      );
    });

    it('should include context in request when provided', async () => {
      const requestWithContext = {
        ...mockRequest,
        context: 'Previous conversation about employment law'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
        status: 200,
        statusText: 'OK'
      });

      await queryAI(requestWithContext);

      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);
      expect(requestBody.context).toBe(requestWithContext.context);
    });

    it('should handle authentication errors (401)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      const result = await queryAI(mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        type: 'network',
        message: 'Authentication failed',
        details: 'Invalid API key',
        retryable: false
      });
    });

    it('should handle rate limiting errors (429) with retry', async () => {
      // First call fails with rate limit
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });

      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
        status: 200,
        statusText: 'OK'
      });

      const result = await queryAI(mockRequest);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSuccessResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle server errors (500) with retry and eventual failure', async () => {
      // All retries fail
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const result = await queryAI(mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        type: 'network',
        message: 'Server error',
        details: 'Internal Server Error',
        retryable: true
      });
      expect(mockFetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should handle network errors with retry', async () => {
      // First two calls fail with network error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Third call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
        status: 200,
        statusText: 'OK'
      });

      const result = await queryAI(mockRequest);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSuccessResponse);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle validation errors (400) without retry', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      const result = await queryAI(mockRequest);

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        type: 'validation',
        message: 'Invalid request',
        details: 'Bad Request',
        retryable: false
      });
      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries for validation errors
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
        status: 200,
        statusText: 'OK'
      });

      const result = await queryAI(mockRequest);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('network');
    });
  });

  describe('analyzeDocument', () => {
    const mockDocumentText = 'This is a sample legal document with terms and conditions...';
    const mockFilename = 'contract.pdf';

    const mockAnalysisResponse: AIResponse = {
      answer: 'Document analysis complete',
      confidence: 0.88,
      sources: ['Document Analysis Engine'],
      usage: {
        promptTokens: 200,
        completionTokens: 150
      }
    };

    it('should successfully analyze document', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalysisResponse),
        status: 200,
        statusText: 'OK'
      });

      const result = await analyzeDocument(mockDocumentText, mockFilename);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAnalysisResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/analyze/document'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 98148fc5498346289784c5879bfd9626'
          }),
          body: expect.stringContaining(mockDocumentText)
        })
      );
    });

    it('should include correct analysis parameters in request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalysisResponse),
        status: 200,
        statusText: 'OK'
      });

      await analyzeDocument(mockDocumentText, mockFilename);

      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);
      
      expect(requestBody).toEqual({
        text: mockDocumentText,
        filename: mockFilename,
        analysis_type: 'legal_document',
        include_clauses: true,
        include_issues: true,
        include_summary: true
      });
    });

    it('should handle document analysis errors with retry', async () => {
      // First call fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable'
      });

      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalysisResponse),
        status: 200,
        statusText: 'OK'
      });

      const result = await analyzeDocument(mockDocumentText, mockFilename);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('validateApiKey', () => {
    it('should validate correct API key format', () => {
      const validKey = '98148fc5498346289784c5879bfd9626';
      expect(validateApiKey(validKey)).toBe(true);
    });

    it('should reject API key with wrong length', () => {
      const shortKey = '98148fc549834628';
      const longKey = '98148fc5498346289784c5879bfd9626extra';
      
      expect(validateApiKey(shortKey)).toBe(false);
      expect(validateApiKey(longKey)).toBe(false);
    });

    it('should reject API key with invalid characters', () => {
      const invalidKey = '98148fc5498346289784c5879bfd962g'; // 'g' is not hex
      expect(validateApiKey(invalidKey)).toBe(false);
    });

    it('should reject API key with uppercase characters', () => {
      const uppercaseKey = '98148FC5498346289784C5879BFD9626';
      expect(validateApiKey(uppercaseKey)).toBe(false);
    });

    it('should reject empty or null API key', () => {
      expect(validateApiKey('')).toBe(false);
      expect(validateApiKey(' '.repeat(32))).toBe(false);
    });
  });

  describe('checkApiHealth', () => {
    const mockHealthResponse = { status: 'healthy' };

    it('should successfully check API health', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHealthResponse),
        status: 200,
        statusText: 'OK'
      });

      const result = await checkApiHealth();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockHealthResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/health'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer 98148fc5498346289784c5879bfd9626'
          })
        })
      );
    });

    it('should handle health check failures', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable'
      });

      const result = await checkApiHealth();

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('network');
    });
  });

  describe('Retry Logic and Exponential Backoff', () => {
    it('should implement exponential backoff delays', async () => {
      const startTime = Date.now();
      
      // Mock all calls to fail
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await queryAI({ query: 'test' });

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should have delays: 1000ms + 2000ms = 3000ms minimum
      // Adding some tolerance for test execution time
      expect(totalTime).toBeGreaterThan(2500);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry non-retryable errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      const startTime = Date.now();
      await queryAI({ query: 'test' });
      const endTime = Date.now();

      // Should return immediately without retries
      expect(endTime - startTime).toBeLessThan(100);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Environment Configuration', () => {
    it('should use custom API base URL from environment', async () => {
      process.env.NEXT_PUBLIC_AI_API_URL = 'https://custom-api.example.com';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ answer: 'test', confidence: 1, sources: [], usage: { promptTokens: 1, completionTokens: 1 } }),
        status: 200,
        statusText: 'OK'
      });

      await queryAI({ query: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom-api.example.com/chat/completions',
        expect.any(Object)
      );
    });

    it('should fall back to default API URL when environment variable is not set', async () => {
      delete process.env.NEXT_PUBLIC_AI_API_URL;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ answer: 'test', confidence: 1, sources: [], usage: { promptTokens: 1, completionTokens: 1 } }),
        status: 200,
        statusText: 'OK'
      });

      await queryAI({ query: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/chat/completions',
        expect.any(Object)
      );
    });
  });
});