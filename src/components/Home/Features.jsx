import React from 'react'
import { Zap, Shield, Download, Sparkles, FileText, CheckCircle } from 'lucide-react'
import Title from './Title'
import { useTheme } from '../../context/ThemContext'

const Features = () => {
    const [theme] = useTheme()

    const features = [
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: 'AI-Powered Writing',
            description: 'Get intelligent suggestions to improve your resume content with AI assistance.',
            color: 'from-violet-500 to-purple-500',
            bgColor: 'bg-violet-50 dark:bg-violet-500/10',
            borderColor: 'border-violet-200 dark:border-violet-500/30',
            hoverBg: 'hover:bg-violet-50 dark:hover:bg-violet-500/20',
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: 'Smart Templates',
            description: 'Choose from 50+ professional templates designed for ATS optimization.',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-500/10',
            borderColor: 'border-green-200 dark:border-green-500/30',
            hoverBg: 'hover:bg-green-50 dark:hover:bg-green-500/20',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'ATS Friendly',
            description: 'All resumes are optimized to pass Applicant Tracking Systems.',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-500/10',
            borderColor: 'border-blue-200 dark:border-blue-500/30',
            hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-500/20',
        },
        {
            icon: <Download className="w-6 h-6" />,
            title: 'One-Click Export',
            description: 'Download your resume in PDF, Word, or share via a unique link.',
            color: 'from-orange-500 to-amber-500',
            bgColor: 'bg-orange-50 dark:bg-orange-500/10',
            borderColor: 'border-orange-200 dark:border-orange-500/30',
            hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-500/20',
        },
    ]

    const stats = [
        { value: '50K+', label: 'Active Users' },
        { value: '100+', label: 'Templates' },
        { value: '95%', label: 'Success Rate' },
        { value: '4.9', label: 'User Rating' },
    ]

    return (
        <section id="features" className={`py-20 md:py-32 relative overflow-hidden ${
            theme === 'ligth'
                ? 'bg-gradient-to-b from-white to-slate-50'
                : 'bg-gradient-to-b from-slate-900 to-slate-800'
        }`}>
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                        theme === 'ligth'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                        <Zap className="w-4 h-4" />
                        <span>Powerful Features</span>
                    </div>

                    <Title
                        title="Everything You Need to Succeed"
                        description="From AI-powered writing to ATS optimization, we've got everything covered to help you land your dream job."
                    />
                </div>

                {/* Stats Section */}
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 p-8 rounded-3xl ${
                    theme === 'ligth'
                        ? 'bg-white shadow-xl shadow-slate-200/50 border border-slate-200'
                        : 'bg-slate-800/50 shadow-xl shadow-slate-900/50 border border-slate-700'
                }`}>
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent`}>
                                {stat.value}
                            </div>
                            <div className={`mt-1 text-sm ${theme === 'ligth' ? 'text-slate-600' : 'text-slate-400'}`}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 ${
                                theme === 'ligth'
                                    ? `${feature.bgColor} ${feature.borderColor} hover:shadow-xl hover:shadow-slate-300/50`
                                    : `bg-slate-800/50 ${feature.borderColor} hover:shadow-xl hover:shadow-slate-900/50`
                            } ${feature.hoverBg} hover:-translate-y-2`}
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            {/* Content */}
                            <h3 className={`text-xl font-semibold mb-3 ${
                                theme === 'ligth' ? 'text-slate-800' : 'text-white'
                            }`}>
                                {feature.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${
                                theme === 'ligth' ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                                {feature.description}
                            </p>

                            {/* Hover Arrow */}
                            <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ${
                                theme === 'ligth' ? 'text-green-600' : 'text-green-400'
                            }`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Feature - Image + Text */}
                <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        {/* Main Image */}
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80"
                                alt="Resume Builder Dashboard"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Floating Card */}
                        <div className={`absolute -bottom-6 -right-6 p-4 rounded-2xl shadow-xl ${
                            theme === 'ligth'
                                ? 'bg-white border border-slate-200'
                                : 'bg-slate-800 border border-slate-700'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`font-semibold ${theme === 'ligth' ? 'text-slate-800' : 'text-white'}`}>
                                        Resume Score: 95%
                                    </p>
                                    <p className={`text-sm ${theme === 'ligth' ? 'text-slate-500' : 'text-slate-400'}`}>
                                        ATS Optimized
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-3xl -z-10"></div>
                    </div>

                    <div className="space-y-6">
                        <h2 className={`text-3xl md:text-4xl font-bold leading-tight ${
                            theme === 'ligth' ? 'text-slate-800' : 'text-white'
                        }`}>
                            Create Your Perfect Resume in Minutes
                        </h2>
                        <p className={`text-lg leading-relaxed ${
                            theme === 'ligth' ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                            Our intuitive builder guides you through every step, ensuring your resume showcases your skills, experience, and achievements in the best possible light.
                        </p>

                        <ul className="space-y-4">
                            {[
                                'Drag & drop interface for easy customization',
                                'Real-time preview as you edit',
                                'Auto-save your progress automatically',
                                'Export to PDF, Word, or share online',
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0`}>
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className={theme === 'ligth' ? 'text-slate-700' : 'text-slate-300'}>
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
