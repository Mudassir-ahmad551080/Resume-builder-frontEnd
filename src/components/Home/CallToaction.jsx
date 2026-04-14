import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Sparkles } from 'lucide-react'

const CallToaction = () => {

  return (
    <section id="cta" className={`py-20 md:py-32 relative overflow-hidden ${
      'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-3xl overflow-hidden ${
          'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600'
        }`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Join 50,000+ professionals</span>
            </div>

            {/* Heading */}
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight`}>
              Ready to Land Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-emerald-200">
                Dream Job?
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Build a professional, ATS-optimized resume in minutes. Join thousands of job seekers who have successfully landed their dream careers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to='/app?state=register'
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Create Your Resume Now
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>

              <a
                href="https://github.com/Mudassir-ahmad551080"
                target='_blank'
                rel='noreferrer'
                className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                <span>Star on GitHub</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Free to get started</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: shimmer 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  )
}

export default CallToaction



