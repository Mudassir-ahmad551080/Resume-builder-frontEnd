import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemContext'
import logo from '../../../public/logo.svg'
import { Github, Linkedin, Twitter, Youtube, ArrowRight } from 'lucide-react'

const Footer = () => {
  const [theme] = useTheme()

  const footerLinks = {
    Product: [
      { name: 'Home', href: '/' },
      { name: 'Features', href: '#features' },
      { name: 'Templates', href: '#templates' },
      { name: 'Pricing', href: '#pricing' },
    ],
    Resources: [
      { name: 'Blog', href: '#blog' },
      { name: 'Community', href: '#community' },
      { name: 'Careers', href: '#careers' },
      { name: 'About', href: '#about' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
    ],
  }

  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com/Mudassir-ahmad551080', label: 'GitHub' },
    { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Youtube className="w-5 h-5" />, href: 'https://youtube.com', label: 'YouTube' },
  ]

  return (
    <footer className={`relative overflow-hidden ${
      theme === 'ligth'
        ? 'bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200'
        : 'bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800'
    }`}>
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-green-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              {theme === 'ligth' ? (
                <img src={logo} alt="Resume Builder" className="h-10 w-auto" />
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">resume</span>
                  <span className="bg-green-400 rounded-full h-2 w-2 mt-3"></span>
                </div>
              )}
            </Link>

            <p className={`text-sm leading-relaxed mb-6 max-w-md ${
              theme === 'ligth' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Build professional, ATS-optimized resumes that help you stand out and land your dream job. Join 50,000+ professionals who have successfully advanced their careers.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className={`text-sm font-medium ${theme === 'ligth' ? 'text-slate-800' : 'text-slate-300'}`}>
                Subscribe to our newsletter
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-2.5 rounded-full text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    theme === 'ligth'
                      ? 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                      : 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  }`}
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className={`text-sm font-semibold mb-4 ${
                theme === 'ligth' ? 'text-slate-800' : 'text-slate-300'
              }`}>
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className={`text-sm transition-colors duration-300 ${
                        theme === 'ligth'
                          ? 'text-slate-600 hover:text-green-600'
                          : 'text-slate-400 hover:text-green-400'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={`border-t ${theme === 'ligth' ? 'border-slate-200' : 'border-slate-800'}`}></div>

        {/* Bottom Section */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className={`text-sm ${theme === 'ligth' ? 'text-slate-600' : 'text-slate-500'}`}>
            © {new Date().getFullYear()} Resume Builder. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  theme === 'ligth'
                    ? 'bg-slate-200/50 hover:bg-green-500 hover:text-white text-slate-600'
                    : 'bg-slate-800 hover:bg-green-500 hover:text-white text-slate-400'
                }`}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
