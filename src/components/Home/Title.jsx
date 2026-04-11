import React from 'react'
import { useTheme } from '../../context/ThemContext'

const Title = ({ title, description }) => {
  const [theme] = useTheme();

  const isLight = theme === 'ligth';

  return (
    <div className={`text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8`}>
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 ${
        isLight ? 'text-slate-800' : 'text-white'
      }`}>
        {title}
      </h2>
      <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${
        isLight ? 'text-slate-600' : 'text-slate-300'
      }`}>
        {description}
      </p>
    </div>
  )
}

export default Title
