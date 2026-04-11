import React from 'react'
import mudassir from '../../image/mudassir.png'
import ilyas from '../../image/ilyas.png'
import { useTheme } from '../../context/ThemContext'
import { Star, Quote } from 'lucide-react'

const Test = () => {
    const [theme] = useTheme();

    const cardsData = [
        {
            image: mudassir,
            name: 'Mudassir Ahmad',
            handle: '@mudassir_dev',
            role: 'Software Engineer',
            text: 'This resume builder helped me land interviews at top tech companies. The AI suggestions were incredibly helpful!',
            rating: 5,
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Anas Khan',
            handle: '@anaskhan',
            role: 'Product Manager',
            text: 'The templates are stunning and ATS-friendly. I got my resume shortlisted within days of applying.',
            rating: 5,
        },
        {
            image: ilyas,
            name: 'Ilyas Khan',
            handle: '@ilyaskhan',
            role: 'UX Designer',
            text: 'Best resume builder I have ever used. The customization options are endless and the interface is intuitive.',
            rating: 5,
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Yasir Ali',
            handle: '@yasiralih',
            role: 'Data Scientist',
            text: 'Got hired at my dream company! The AI-powered suggestions really made my resume stand out from the crowd.',
            rating: 5,
        },
    ];

    const CreateCard = ({ card }) => (
        <div className={`group relative p-6 rounded-2xl mx-4 shrink-0 transition-all duration-500 hover:scale-[1.02] ${
            theme === 'ligth'
                ? 'bg-white shadow-lg hover:shadow-xl border border-slate-200'
                : 'bg-slate-800/80 hover:shadow-xl border border-slate-700'
        }`}>
            {/* Quote Icon */}
            <div className={`absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity ${
                theme === 'ligth' ? 'text-green-600' : 'text-green-400'
            }`}>
                <Quote className="w-8 h-8" />
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(card.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>

            {/* Text */}
            <p className={`text-sm leading-relaxed mb-6 ${
                theme === 'ligth' ? 'text-slate-600' : 'text-slate-400'
            }`}>
                "{card.text}"
            </p>

            {/* User Info */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                        src={card.image}
                        alt={card.name}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p className={`font-semibold ${theme === 'ligth' ? 'text-slate-800' : 'text-white'}`}>
                        {card.name}
                    </p>
                    <p className={`text-xs ${theme === 'ligth' ? 'text-slate-500' : 'text-slate-500'}`}>
                        {card.role}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }

                .marquee-inner {
                    animation: marqueeScroll 30s linear infinite;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>

            {/* First Row */}
            <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
                {/* Gradient Fade Edges */}
                <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent"></div>
                <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent"></div>

                <div className="marquee-inner flex transform-gpu min-w-[200%] py-6">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={`row1-${index}`} card={card} />
                    ))}
                </div>
            </div>

            {/* Second Row - Reverse */}
            <div className="relative w-full max-w-6xl mx-auto overflow-hidden mt-4">
                <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent"></div>
                <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent"></div>

                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] py-6">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={`row2-${index}`} card={card} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Test
