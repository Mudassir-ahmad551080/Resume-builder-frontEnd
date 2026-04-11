import React from 'react'
import { BookUserIcon, MessageSquareQuote } from 'lucide-react'
import Title from '../Home/Title.jsx'
import Test from './Test.jsx'
import { useTheme } from '../../context/ThemContext.jsx'

const Testimonials = () => {
  const [theme] = useTheme();
  return (
    <section
      id="testimonials"
      className={`py-20 md:py-32 relative overflow-hidden ${
        theme === 'ligth'
          ? 'bg-gradient-to-b from-slate-50 to-white'
          : 'bg-gradient-to-b from-slate-900 to-slate-800'
      }`}
    >
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            theme === 'ligth'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            <MessageSquareQuote className="w-4 h-4" />
            <span>Testimonials</span>
          </div>

          <Title
            title="Loved by Professionals Worldwide"
            description="Join thousands of satisfied users who landed their dream jobs with our AI-powered resume builder."
          />
        </div>

        {/* Testimonials Marquee */}
        <Test />
      </div>
    </section>
  )
}

export default Testimonials
