/**
 * Core data models for LexMint Legal Assistant
 * Based on design document specifications
 */

// Chat Interface Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

export interface Citation {
  source: string;
  url?: string;
  relevance: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// Document Analysis Types
export interface DocumentAnalysis {
  id: string;
  filename: string;
  uploadDate: Date;
  summary: string;
  keyClauses: Clause[];
  potentialIssues: Issue[];
  confidence: number;
}

export interface Clause {
  text: string;
  type: 'contract' | 'liability' | 'termination' | 'payment' | 'other';
  importance: 'high' | 'medium' | 'low';
  explanation: string;
}

export interface Issue {
  description: string;
  severity: 'critical' | 'warning' | 'info';
  recommendation: string;
}

export interface DocumentUpload {
  file: File;
  type: 'pdf' | 'docx' | 'txt';
  size: number;
}

export interface ProcessedDocument {
  text: string;
  metadata: {
    pages: number;
    wordCount: number;
    language: string;
  };
}

// FAQ Types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
}

export interface FAQCategory {
  name: string;
  slug: string;
  description: string;
  items: FAQItem[];
}

// API Integration Types
export interface AIRequest {
  query: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  answer: string;
  confidence: number;
  sources: string[];
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
}

// Blockchain Types (Optional)
export interface BlockchainQuery {
  queryHash: string;
  timestamp: number;
  anonymizedQuery: string;
  responseHash: string;
}

export interface BlockchainTransaction {
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  status: 'pending' | 'confirmed' | 'failed';
}

// Error Handling Types
export type AppErrorType = 'network' | 'validation' | 'processing' | 'blockchain';

export interface AppError {
  type: AppErrorType;
  message: string;
  details?: string;
  retryable: boolean;
}

// UI Component Props Types
export interface ErrorBoundaryProps {
  fallback: React.ComponentType<{error: Error; retry: () => void}>;
  onError?: (error: Error) => void;
}

export interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: AppError;
  success: boolean;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}