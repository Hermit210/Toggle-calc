import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Scale } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-white flex items-center justify-center">
      <div className="text-center px-4 py-8 max-w-md mx-auto">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="bg-mint-500 p-3 md:p-4 rounded-2xl shadow-lg">
            <Scale className="h-8 w-8 md:h-12 md:w-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
          <span className="text-mint-600">LexMint</span>
        </h1>
        
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
          AI Legal Assistant - Get intelligent legal guidance and answers to your legal questions
        </p>
        
        <Link href="/chat">
          <Button variant="mint-primary" size="lg" className="w-full sm:w-auto touch-target">
            <MessageCircle className="mr-2 h-5 w-5" />
            Start Chatting
          </Button>
        </Link>
        
        <p className="text-xs md:text-sm text-gray-500 mt-4 md:mt-6 px-2 leading-relaxed">
          ⚠️ This is not legal advice. Always consult with a qualified attorney for specific legal matters.
        </p>
      </div>
    </div>
  )
}