import React from 'react'
import { Sparkles } from 'lucide-react'

const Banner = () => {

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className={`w-full py-3 text-center relative ${
        'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500'
      }`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center gap-2 text-sm font-medium text-white">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="px-3 py-0.5 rounded-lg bg-white/20 backdrop-blur-sm">
            New
          </span>
          <span className="hidden sm:inline">
            AI-powered resume analysis is now available —
          </span>
          <span className="sm:hidden">AI Feature Added!</span>
          <a
            href="#features"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-0.5 rounded-lg bg-white text-green-600 hover:bg-green-50 transition-colors font-semibold"
          >
            Try it now
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: shimmer 2s ease-in-out infinite;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  )
}

export default Banner



