"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  isExpanded?: boolean
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is a contract and when do I need one?',
    answer: 'A contract is a legally binding agreement between two or more parties. You need a contract whenever you want to formalize an agreement that involves an exchange of goods, services, or money. Contracts help protect your interests and provide legal recourse if the other party fails to meet their obligations.',
    category: 'Contracts'
  },
  {
    id: '2',
    question: 'How do I protect my intellectual property?',
    answer: 'Intellectual property can be protected through various means: patents for inventions, trademarks for brand names and logos, copyrights for creative works, and trade secrets for confidential business information. The type of protection depends on what you\'re trying to protect.',
    category: 'Intellectual Property'
  },
  {
    id: '3',
    question: 'What should I do if I receive a cease and desist letter?',
    answer: 'Don\'t panic, but take it seriously. Read the letter carefully, understand what specific actions they want you to stop, and consider consulting with an attorney. Don\'t ignore it, as this could lead to more serious legal action. Document everything and avoid admitting fault.',
    category: 'Disputes'
  },
  {
    id: '4',
    question: 'How do I start a business legally?',
    answer: 'Starting a business involves several legal steps: choose a business structure (LLC, corporation, etc.), register your business name, obtain necessary licenses and permits, get an EIN from the IRS, open a business bank account, and consider business insurance. Requirements vary by location and industry.',
    category: 'Business Law'
  },
  {
    id: '5',
    question: 'What are my rights as an employee?',
    answer: 'Employee rights include fair wages (minimum wage and overtime), safe working conditions, freedom from discrimination and harassment, family and medical leave, and the right to organize. Specific rights may vary by state and company size.',
    category: 'Employment Law'
  },
  {
    id: '6',
    question: 'When do I need to hire a lawyer?',
    answer: 'Consider hiring a lawyer for complex legal matters, when facing criminal charges, during divorce proceedings, for business formation, when dealing with significant contracts, if you\'re being sued, or when you need to sue someone else. For simple matters, you might be able to handle them yourself.',
    category: 'General Legal'
  },
  {
    id: '7',
    question: 'What is the difference between a will and a trust?',
    answer: 'A will is a document that specifies how your assets should be distributed after death and goes through probate court. A trust is a legal arrangement where assets are held by a trustee for beneficiaries and can avoid probate, provide privacy, and offer more control over asset distribution.',
    category: 'Estate Planning'
  },
  {
    id: '8',
    question: 'How can I protect myself when signing a lease?',
    answer: 'Read the entire lease carefully, understand all terms and conditions, document the property\'s condition with photos, know your rights as a tenant, understand the security deposit terms, and consider having it reviewed by an attorney for expensive or long-term leases.',
    category: 'Real Estate'
  }
]

const categories = ['All', 'Contracts', 'Intellectual Property', 'Disputes', 'Business Law', 'Employment Law', 'General Legal', 'Estate Planning', 'Real Estate']

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>(faqData)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const toggleFAQ = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id 
        ? { ...faq, isExpanded: !faq.isExpanded }
        : faq
    ))
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-mint-500 p-3 rounded-xl">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Legal FAQ</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to common legal questions. These responses are for informational purposes only and do not constitute legal advice.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search FAQ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "mint-primary" : "mint-outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-xs font-medium text-mint-600 bg-mint-100 px-2 py-1 rounded">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <div className="ml-4">
                  {faq.isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {faq.isExpanded && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-medium text-yellow-800 mb-2">Important Legal Disclaimer</h3>
        <p className="text-sm text-yellow-700">
          The information provided in this FAQ is for general informational purposes only and does not constitute legal advice. 
          Laws vary by jurisdiction and individual circumstances. Always consult with a qualified attorney for specific legal matters 
          and before making any legal decisions.
        </p>
      </div>
    </div>
  )
}