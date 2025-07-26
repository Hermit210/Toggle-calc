/**
 * Application constants for LexMint Legal Assistant
 */

// File Upload Limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FILE_TYPES = ['pdf', 'docx', 'txt'] as const;
export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
] as const;

// API Configuration
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  ANALYZE: '/api/analyze',
  FAQ: '/api/faq',
  HEALTH: '/api/health'
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_MESSAGES_HISTORY: 50,
  TYPING_DELAY: 100,
  AUTO_SCROLL_DELAY: 100
} as const;

// UI Configuration
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300
} as const;

// Theme Colors (matching CSS variables)
export const THEME_COLORS = {
  MINT: {
    50: 'oklch(0.98 0.02 150)',
    100: 'oklch(0.95 0.05 150)',
    200: 'oklch(0.9 0.1 150)',
    300: 'oklch(0.85 0.12 150)',
    400: 'oklch(0.8 0.15 150)',
    500: 'oklch(0.75 0.18 150)', // Primary brand color
    600: 'oklch(0.65 0.2 150)',
    700: 'oklch(0.55 0.18 150)',
    800: 'oklch(0.45 0.15 150)',
    900: 'oklch(0.35 0.12 150)'
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
  UNSUPPORTED_FILE: `Unsupported file type. Please use: ${SUPPORTED_FILE_TYPES.join(', ')}`,
  PROCESSING_ERROR: 'Failed to process your request. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please check your configuration.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  ANALYSIS_COMPLETE: 'Document analysis completed',
  MESSAGE_SENT: 'Message sent successfully',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard'
} as const;

// FAQ Categories
export const FAQ_CATEGORIES = [
  'contracts',
  'employment',
  'property',
  'business',
  'family',
  'criminal',
  'intellectual-property',
  'general'
] as const;

// Blockchain Configuration (Optional)
export const BLOCKCHAIN_CONFIG = {
  NETWORK_ID: 1, // Ethereum mainnet
  GAS_LIMIT: 100000,
  GAS_PRICE_MULTIPLIER: 1.2,
  CONFIRMATION_BLOCKS: 3
} as const;

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  LCP_THRESHOLD: 2500, // Largest Contentful Paint (ms)
  FID_THRESHOLD: 100,  // First Input Delay (ms)
  CLS_THRESHOLD: 0.1,  // Cumulative Layout Shift
  TTFB_THRESHOLD: 600  // Time to First Byte (ms)
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'lexmint_chat_history',
  USER_PREFERENCES: 'lexmint_user_preferences',
  THEME_PREFERENCE: 'lexmint_theme',
  BLOCKCHAIN_CONSENT: 'lexmint_blockchain_consent'
} as const;

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  API_KEY: /^[a-f0-9]{32}$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/
} as const;