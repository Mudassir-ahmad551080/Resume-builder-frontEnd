import React from 'react';
import ClassicTemplate from './templates/ClassicTemplate.jsx';
import ModernTemplate from './templates/ModernTemplate.jsx';
import MinimallmageTemplate from './templates/MinimalImageTemplate.jsx';
import MinimalTemplate from './templates/MinimalTemplate.jsx';
import { useTheme } from '../context/ThemContext.jsx';
import ModernCardTemplate from './templates/ModernCardTemplate.jsx';
import SimpleTemplate from './templates/SimpleTemplate.jsx';
import ExecutiveProTemplate from './templates/ExecutiveProTemplate.jsx';

const ResumePreview = ({ data, template, accentColor, classes = '', isLoading = false }) => {
  const [theme] = useTheme();
  const isLight = theme === 'ligth';

  const renderTamplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case 'minimal':
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case 'minimal-image':
        return <MinimallmageTemplate data={data} accentColor={accentColor} />;
      case 'modern-card-template':
        return <ModernCardTemplate data={data} accentColor={accentColor} />;
      case 'executive-pro':
        return <ExecutiveProTemplate data={data} accentColor={accentColor} />;
      case 'simple':
        return <SimpleTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  const ResumeSkeleton = () => (
    <div className={`w-full min-h-[800px] p-8 animate-pulse ${
      isLight ? 'bg-white' : 'bg-slate-800'
    }`}>
      <div className={`flex items-center gap-4 mb-8 border-b pb-6 ${isLight ? 'border-slate-200' : 'border-slate-700'}`}>
        <div className={`w-20 h-20 rounded-full ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
        <div className="space-y-3 flex-1">
          <div className={`h-6 rounded w-1/3 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
          <div className={`h-4 rounded w-1/4 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
          <div className="flex gap-4 mt-2">
            <div className={`h-3 rounded w-20 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
            <div className={`h-3 rounded w-20 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
          </div>
        </div>
      </div>
      <div className="mb-8 space-y-2">
        <div className={`h-4 rounded w-full ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
        <div className={`h-4 rounded w-full ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
        <div className={`h-4 rounded w-3/4 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
      </div>
      <div className="mb-8">
        <div className={`h-5 rounded w-1/4 mb-4 ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`}></div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className={`h-4 rounded w-1/3 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
                <div className={`h-4 rounded w-1/6 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}></div>
              </div>
              <div className={`h-3 rounded w-full ${isLight ? 'bg-slate-100' : 'bg-slate-700'}`}></div>
              <div className={`h-3 rounded w-5/6 ${isLight ? 'bg-slate-100' : 'bg-slate-700'}`}></div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className={`h-5 rounded w-1/3 mb-4 ${isLight ? 'bg-slate-300' : 'bg-slate-600'}`}></div>
          <div className="flex flex-wrap gap-2">
            {[1,2,3,4].map(i => <div key={i} className={`h-8 w-20 rounded ${isLight ? 'bg-slate-100' : 'bg-slate-700'}`}></div>)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
      isLight
        ? 'bg-white border border-slate-200/50'
        : 'bg-slate-900 border border-slate-700/50'
    }`}>
      <div className="w-full">
        <div className={`relative max-w-3xl mx-auto transition-all duration-300 ${
          isLight ? 'bg-white' : 'bg-slate-900'
        }`}>
          <div className={`transform transition-transform duration-300 hover:scale-[1.01] text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-gray-900' : 'text-white'
          }`}>
            {isLoading ? <ResumeSkeleton /> : renderTamplate()}
          </div>

          {!isLoading && (
            <div
              className="absolute bottom-0 left-0 h-[3px] sm:h-1 w-full transition-all duration-300"
              style={{ backgroundColor: accentColor }}
            ></div>
          )}
        </div>
      </div>

      <style jsx>
        {`
          @page {
            size: letter;
            margin: 0;
          }

          @media print {
            body {
              background: white !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;
