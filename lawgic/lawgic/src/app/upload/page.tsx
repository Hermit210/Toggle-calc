"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react"
import { aiService } from "@/lib/services/ai-service"
import { ErrorHandler } from "@/lib/utils/error-handler"

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  analysis?: string
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      return validTypes.includes(file.type) && file.size <= maxSize
    })

    const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0
    }))

    setFiles(prev => [...prev, ...uploadedFiles])

    // Process each file
    uploadedFiles.forEach(uploadedFile => {
      processFile(uploadedFile)
    })
  }

  const processFile = async (uploadedFile: UploadedFile) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, progress }
            : f
        ))
      }

      // Change status to processing
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'processing', progress: 100 }
          : f
      ))

      // Extract text from file (simplified - in real app would use proper PDF parsing)
      const text = await extractTextFromFile(uploadedFile.file)
      
      // Send to AI for analysis
      const response = await aiService.sendQuery({
        query: `Please analyze this legal document and provide a summary of key clauses, potential issues, and important sections:\n\n${text}`,
        type: 'document-analysis'
      })

      // Update with completed analysis
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'completed', analysis: response.answer }
          : f
      ))

    } catch (error) {
      const appError = ErrorHandler.handleFileError(error as any)
      ErrorHandler.displayError(appError)
      
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'error', error: appError.message }
          : f
      ))
    }
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const text = e.target?.result as string
        // This is a simplified text extraction
        // In a real app, you'd use libraries like pdf-parse for PDFs
        resolve(text || `Document: ${file.name}\nContent: [Document content would be extracted here]`)
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      
      if (file.type === 'text/plain') {
        reader.readAsText(file)
      } else {
        // For other file types, we'll simulate content extraction
        setTimeout(() => {
          resolve(`Document: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\n\n[In a real implementation, this would contain the actual extracted text from the PDF or Word document]`)
        }, 1000)
      }
    })
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Document Analyzer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your legal documents and get AI-powered analysis of key clauses, potential issues, and important sections.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-mint-500 bg-mint-50' 
            : 'border-gray-300 hover:border-mint-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop your documents here
        </h3>
        <p className="text-gray-500 mb-4">
          or click to browse files
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="mint-outline" className="cursor-pointer">
            Choose Files
          </Button>
        </label>
        <p className="text-xs text-gray-400 mt-4">
          Supports PDF, DOC, DOCX, TXT files up to 10MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Uploaded Documents</h2>
          
          {files.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-mint-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">{file.file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {(file.status === 'uploading' || file.status === 'processing') && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                      {file.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                    </span>
                    <span>{file.progress}%</span>
                  </div>
                  <Progress value={file.progress} variant="mint" />
                </div>
              )}

              {/* Analysis Results */}
              {file.status === 'completed' && file.analysis && (
                <div className="bg-mint-50 border border-mint-200 rounded-lg p-4">
                  <h4 className="font-medium text-mint-800 mb-2">Analysis Results</h4>
                  <div className="text-sm text-mint-700 whitespace-pre-wrap">
                    {file.analysis}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {file.status === 'error' && file.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Error</h4>
                  <p className="text-sm text-red-700">{file.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Important:</strong> This analysis is for informational purposes only and does not constitute legal advice. 
          Always consult with a qualified attorney for specific legal matters.
        </p>
      </div>
    </div>
  )
}