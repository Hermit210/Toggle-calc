"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Loader2, Scale } from "lucide-react"
import { aiService } from "@/lib/services/ai-service"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isLoading?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm LexMint, your AI legal assistant. I can help you with legal questions and provide general legal guidance. How can I assist you today?\n\n**Please note:** I provide general information only, not legal advice. Always consult with a qualified attorney for specific legal matters.",
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      const response = await aiService.sendQuery({
        query: input.trim(),
        type: 'chat'
      })

      // Remove loading message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          content: response.answer,
          role: 'assistant',
          timestamp: new Date()
        }]
      })
    } catch (error) {
      // Remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
          role: 'assistant',
          timestamp: new Date()
        }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white border-b border-gray-200 px-3 py-3 md:px-4 md:py-3 flex items-center justify-between safe-area-inset-top">
        <div className="flex items-center space-x-3">
          <div className="bg-mint-500 p-1.5 md:p-2 rounded-lg">
            <Scale className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-semibold text-gray-900">LexMint</h1>
            <p className="text-xs md:text-sm text-gray-500">AI Legal Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Container - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto px-3 py-4 md:px-4 md:py-6 space-y-4 md:space-y-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-3 md:space-x-4">
              {/* Avatar */}
              <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-mint-500' 
                  : 'bg-gray-200'
              }`}>
                {message.role === 'user' ? (
                  <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                ) : (
                  <Bot className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-600" />
                )}
              </div>
              
              {/* Message Content */}
              <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {message.role === 'user' ? 'You' : 'LexMint'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  ) : (
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm md:text-base break-words">
                      {message.content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Mobile Optimized */}
      <div className="bg-white border-t border-gray-200 px-3 py-3 md:px-4 md:py-4 safe-area-inset-bottom">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-2 md:space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a legal question..."
                className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent text-base"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              variant="mint-primary" 
              disabled={!input.trim() || isLoading}
              className="px-3 py-2.5 md:px-4 md:py-3 min-w-[44px] touch-target"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          
          <p className="text-xs text-gray-500 mt-2 text-center px-2">
            ⚠️ This is not legal advice. Always consult with a qualified attorney for specific legal matters.
          </p>
        </div>
      </div>
    </div>
  )
}