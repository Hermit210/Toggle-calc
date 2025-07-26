"use client"

import React from "react"
import Link from "next/link"
import { Scale } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-mint-500 p-2 rounded-lg">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">LexMint</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              AI-powered legal assistant providing intelligent document analysis and legal guidance.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Legal
            </h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-sm text-gray-600 hover:text-mint-700 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-gray-600 hover:text-mint-700 transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="block text-sm text-gray-600 hover:text-mint-700 transition-colors">
                Legal Disclaimer
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-sm text-gray-600 hover:text-mint-700 transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 hover:text-mint-700 transition-colors">
                Contact Us
              </Link>
              <Link href="/faq" className="block text-sm text-gray-600 hover:text-mint-700 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2024 LexMint. All rights reserved.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              <p className="text-xs text-yellow-800 font-medium">
                ⚠️ This is not legal advice. Consult a qualified attorney for legal matters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}