import { Loader2, Sparkles, FileText } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';

const ProfessionalSummary = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleAIEnhance = async () => {
    if (!data) {
      toast.error("Please enter some text first!");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Enhance the following professional summary to make it more compelling and impactful:\n\n"${data}"`;
      const response = await api.post('/api/ai/enhance-pro-summ', { usercontent: prompt }, {
        headers: { Authorization: token }
      });

      if (response.data && response.data.enhancedSummary) {
        setResumeData(prev => ({
          ...prev,
          professionalSummary: response.data.enhancedSummary
        }));
        toast.success('Professional summary enhanced successfully!');
      }
    } catch (error) {
      console.error('Error enhancing professional summary:', error);
      toast.error('Failed to enhance professional summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 ${
      'bg-white border border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${
            'text-slate-800'
          }`}>
            <FileText className={`w-5 h-5 text-green-600}`} />
            Professional Summary
          </h3>
          <p className={`text-sm mt-1 text-slate-500}`}>
            Add a concise summary highlighting your key experience and skills.
          </p>
        </div>
        <button
          disabled={isGenerating}
          onClick={handleAIEnhance}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl shadow-lg transition-all ${
            isGenerating
              ? 'bg-slate-200 text-slate-500 cursor-wait'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/30 hover:shadow-green-500/50'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <Sparkles size={16} />
          )}
          {isGenerating ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>

      {/* Textarea */}
      <div>
        <textarea
          rows={7}
          value={data || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-4 rounded-xl text-sm outline-none transition-all duration-300 resize-none ${
            'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
          }`}
          placeholder="Write a compelling summary about your professional background, highlighting your years of experience, key strengths, and career achievements..."
        />
        <p className={`mt-3 text-xs flex items-center gap-1 ${
          'text-slate-500'
        }`}>
          <Sparkles className="w-3 h-3 text-yellow-500" />
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummary;


