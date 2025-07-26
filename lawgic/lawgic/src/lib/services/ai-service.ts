export interface AIRequest {
  query: string
  context?: string
  type: 'chat' | 'document-analysis' | 'faq'
}

export interface AIResponse {
  answer: string
  confidence: number
}

class AIService {
  async sendQuery(request: AIRequest): Promise<AIResponse> {
    // Simulate AI response for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const responses = [
      "I understand you're asking about legal matters. While I can provide general information, please remember this is not legal advice. For your specific situation, I'd recommend consulting with a qualified attorney who can review your particular circumstances.",
      "That's a great legal question! Based on general legal principles, here's what I can tell you... However, laws vary by jurisdiction and individual circumstances can significantly impact the outcome. It's always best to consult with a local attorney.",
      "Legal matters can be complex, and I want to make sure you get accurate information. While I can provide some general guidance on this topic, the specifics of your situation may require professional legal advice from a qualified attorney.",
      "Thank you for your question about legal matters. I can offer some general information on this topic, but please keep in mind that this is for educational purposes only and not legal advice. For your specific situation, consulting with an attorney would be the best course of action."
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    return {
      answer: `${randomResponse}\n\n**Important Disclaimer:** This information is for general educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for specific legal matters.`,
      confidence: 0.8
    }
  }
}

export const aiService = new AIService()