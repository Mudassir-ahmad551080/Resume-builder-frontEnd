import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../public/logo.svg';
import { ReactTyped } from "react-typed";
import { useSelector } from 'react-redux';
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react';

const Hero = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useSelector(state => state.auth);
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const handleScroll = () => {
            if (window.scrollY < lastScrollY && window.scrollY > 50) {
                setShowNavbar(true);
            } else if (window.scrollY > lastScrollY) {
                setShowNavbar(false);
            } else if (window.scrollY <= 50) {
                setShowNavbar(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const prefetchLayout = () => {
        import('../../pages/Layout.jsx');
    }

    const logos = [
        'https://i.pinimg.com/736x/9e/ab/c5/9eabc54fbe3cd7a6931695dcce52cc82.jpg',
        'https://i.pinimg.com/736x/fa/76/9b/fa769ba2fd25c9bdd269a736e0942218.jpg',
        'https://i.pinimg.com/736x/89/6c/5b/896c5bae8a9ef75618c6f6969a4248cd.jpg',
        'https://i.pinimg.com/1200x/f4/22/30/f42230e621c19fea5815dde7a09ed83c.jpg',
    ];

    const navbarClasses = `
        z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm
        transition-all duration-500 ease-in-out
        fixed top-0 backdrop-blur-xl shadow-lg
        ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        bg-white/80 border-b border-slate-200/50
    `;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-1/4 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Navbar */}
            <nav className={navbarClasses}>
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Resume Builder" className="h-10 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {[
                        { name: 'Home', href: '#' },
                        { name: 'Features', href: '#features' },
                        { name: 'Reviews', href: '#testimonials' },
                        { name: 'Contact', href: '#cta' }
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="relative text-sm font-medium transition-colors duration-300 group text-slate-600 hover:text-green-600"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <Link
                            to='/app'
                            onMouseEnter={prefetchLayout}
                            className="group relative px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Dashboard
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                    ) : (
                        <>
                            <Link
                                to='/app?state=login'
                                onMouseEnter={prefetchLayout}
                                className="px-5 py-2 font-medium rounded-full border-2 transition-all duration-300 border-slate-300 text-slate-700 hover:border-green-500 hover:text-green-600"
                            >
                                Login
                            </Link>
                            <Link
                                to='/app?state=register'
                                onMouseEnter={prefetchLayout}
                                className="group relative px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(true)}
                    className="md:hidden p-2 rounded-lg transition-colors hover:bg-slate-100"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 ${
                menuOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
            }`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)}></div>
                <div className={`absolute right-0 top-0 h-full w-80 transform transition-transform duration-500 ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                } bg-white`}>
                    <div className="p-6">
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mt-12 space-y-4">
                            {[
                                { name: 'Home', href: '#' },
                                { name: 'Features', href: '#features' },
                                { name: 'Reviews', href: '#testimonials' },
                                { name: 'Contact', href: '#cta' }
                            ].map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="block py-3 px-4 text-lg font-medium rounded-lg transition-colors text-slate-700 hover:bg-green-50 hover:text-green-600"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        <div className="mt-8 space-y-3">
                            {user ? (
                                <Link
                                    to='/app'
                                    className="block w-full py-3 text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-full"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to='/app?state=login'
                                        className="block w-full py-3 text-center font-medium rounded-full border-2 border-slate-300 text-slate-700"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to='/app?state=register'
                                        className="block w-full py-3 text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-full"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className={`relative pt-32 pb-20 px-4 md:px-16 lg:px-24 xl:px-40 transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                {/* Floating Badge */}
                <div className="flex justify-center mb-8">
                    <div className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-slate-700">Now with AI-powered resume analysis</span>
                        <ChevronDown className="w-4 h-4 text-slate-500 group-hover:translate-y-1 transition-transform" />
                    </div>
                </div>

                {/* Main Headline */}
                <div className="text-center max-w-5xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900">
                        <span className="block mb-2">Land Your Dream Job</span>
                        <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                            <ReactTyped
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
                                strings={["With AI-Powered Resume", "With Smart Templates", "With Professional Design"]}
                                typeSpeed={50}
                                backSpeed={30}
                                backDelay={1500}
                                loop
                            />
                        </span>
                    </h1>

                    <p className="mt-8 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-slate-600">
                        Create stunning, ATS-optimized resumes that help you stand out from the crowd and land your dream job faster.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                    <Link
                        to='/app'
                        onMouseEnter={prefetchLayout}
                        className="group relative px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 hover:from-green-600 hover:via-emerald-600 hover:to-green-600 text-white font-semibold rounded-full shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-500 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Create Your Resume
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>

                    <button className="group flex items-center gap-3 px-8 py-4 font-semibold rounded-full border-2 transition-all duration-300 border-slate-300 text-slate-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch Demo
                    </button>
                </div>

                {/* Social Proof */}
                <div className="flex flex-col items-center mt-16">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[
                                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
                                'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
                                'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200',
                            ].map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt={`User ${i + 1}`}
                                    className="w-10 h-10 rounded-full border-3 border-white object-cover shadow-lg hover:scale-110 hover:z-10 transition-all duration-300"
                                />
                            ))}
                            <div className="w-10 h-10 rounded-full border-3 border-white bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                10K+
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                            <strong className="text-slate-900">4.9/5</strong> from 10,000+ users
                        </span>
                    </div>
                </div>

                {/* Trusted By Brands */}
                <div className="mt-20">
                    <p className="text-center text-sm font-medium mb-8 text-slate-500">
                        Trusted by professionals from leading companies
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        {logos.map((logo, index) => (
                            <img
                                key={index}
                                src={logo}
                                alt="Company logo"
                                className="h-10 md:h-12 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .delay-1000 {
                    animation-delay: 1s;
                }
                .delay-500 {
                    animation-delay: 0.5s;
                }
            `}</style>
        </div>
    );
};

export default Hero;
