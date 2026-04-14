import React from 'react'

const Title = ({ title, description }) => {
  return (
    <div className={`text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8`}>
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 ${
        'text-slate-800'
      }`}>
        {title}
      </h2>
      <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${
        'text-slate-600'
      }`}>
        {description}
      </p>
    </div>
  )
}

export default Title




