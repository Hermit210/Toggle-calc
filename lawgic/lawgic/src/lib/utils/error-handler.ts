export interface AppError {
  id: string
  type: 'api' | 'validation' | 'network' | 'file' | 'blockchain'
  message: string
  details?: string
  timestamp: Date
  isRetryable: boolean
}

export interface FileError extends Error {
  code: string
  file?: File
}

export interface NetworkError extends Error {
  status?: number
  statusText?: string
}

export class ErrorHandler {
  static handleAPIError(error: any): AppError {
    return {
      id: this.generateErrorId(),
      type: 'api',
      message: error.message || 'An API error occurred',
      details: error.code || error.status?.toString(),
      timestamp: new Date(),
      isRetryable: error.status !== 401 && error.status !== 403,
    }
  }

  static handleFileError(error: FileError): AppError {
    const messages: Record<string, string> = {
      'FILE_TOO_LARGE': 'File size exceeds the maximum limit',
      'INVALID_FILE_TYPE': 'File type is not supported',
      'FILE_CORRUPTED': 'File appears to be corrupted',
      'UPLOAD_FAILED': 'File upload failed',
    }

    return {
      id: this.generateErrorId(),
      type: 'file',
      message: messages[error.code] || 'File processing error',
      details: error.message,
      timestamp: new Date(),
      isRetryable: error.code !== 'INVALID_FILE_TYPE',
    }
  }

  static handleNetworkError(error: NetworkError): AppError {
    return {
      id: this.generateErrorId(),
      type: 'network',
      message: 'Network connection error',
      details: error.statusText || error.message,
      timestamp: new Date(),
      isRetryable: true,
    }
  }

  static handleValidationError(message: string, details?: string): AppError {
    return {
      id: this.generateErrorId(),
      type: 'validation',
      message,
      details,
      timestamp: new Date(),
      isRetryable: false,
    }
  }

  static displayError(error: AppError): void {
    // In a real app, this would integrate with a toast/notification system
    console.error(`[${error.type.toUpperCase()}] ${error.message}`, {
      id: error.id,
      details: error.details,
      timestamp: error.timestamp,
      isRetryable: error.isRetryable,
    })
  }

  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          break
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1)
        await this.sleep(waitTime)
      }
    }

    throw lastError!
  }

  private static generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Custom error classes
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class FileProcessingError extends Error {
  constructor(message: string, public code: string, public file?: File) {
    super(message)
    this.name = 'FileProcessingError'
  }
}