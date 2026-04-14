import { Briefcase, Plus, Sparkles, Trash2, Loader2, Calendar, Building2, User } from "lucide-react";
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [loadingIndex, setLoadingIndex] = useState(null);

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleEnhanceDescription = async (index) => {
    const currentDescription = data[index].description;
    if (!currentDescription) {
      toast.error("Please write some description text first!");
      return;
    }
    setLoadingIndex(index);
    try {
      const response = await api.post('/api/ai/enhance-job-desc',
        { usercontent: currentDescription },
        { headers: { Authorization: token } }
      );
      if (response.data && response.data.enhancedJobDescription) {
        updateExperience(index, "description", response.data.enhancedJobDescription);
        toast.success("Job description enhanced successfully!");
      }
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast.error("Failed to enhance description.");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${
            'text-slate-800'
          }`}>
            <Briefcase className={`w-5 h-5 text-green-600}`} />
            Professional Experience
          </h3>
          <p className={`text-sm mt-1 text-slate-500}`}>
            Detail your career history to showcase your expertise.
          </p>
        </div>
        <button
          onClick={addExperience}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
        >
          <Plus size={16} />
          Add Position
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-12 px-4 rounded-2xl border-2 border-dashed transition-colors ${
          'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            'bg-slate-200'
          }`}>
            <Briefcase className={`w-8 h-8 text-slate-400}`} />
          </div>
          <h4 className={`text-lg font-medium text-slate-700}`}>No experience added yet</h4>
          <p className={`text-sm text-center max-w-sm mb-6 text-slate-500}`}>
            Start building your resume by adding your past work experience, internships, or freelance projects.
          </p>
          <button
            onClick={addExperience}
            className={`font-medium flex items-center gap-1 ${
              'text-green-600 hover:text-green-700'
            }`}
          >
            Click here to add your first job
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((experience, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-lg transition-all duration-300 p-6 ${
                'bg-white border border-slate-200 hover:shadow-xl'
              }`}
            >
              {/* Card Header & Delete */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <h4 className={`text-lg font-semibold ${
                    'text-slate-800'
                  }`}>
                    {experience.position || "Untitled Position"}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className={`p-2 rounded-full transition-colors ${
                    'text-slate-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Position Title */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                    'text-slate-500'
                  }`}>
                    <User size={12} /> Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                    }`}
                    value={experience.position || ""}
                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                    'text-slate-500'
                  }`}>
                    <Building2 size={12} /> Employer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google Inc."
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                    }`}
                    value={experience.company || ""}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                    'text-slate-500'
                  }`}>
                    <Calendar size={12} /> Start Date
                  </label>
                  <input
                    type="month"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800'
                    }`}
                    value={experience.start_date || ""}
                    onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                    'text-slate-500'
                  }`}>
                    <Calendar size={12} /> End Date
                  </label>
                  <input
                    type="month"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                      experience.is_current
                        ? `bg-slate-100} border-slate-200} text-slate-400} cursor-not-allowed`
                        : 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800'
                    }`}
                    disabled={experience.is_current}
                    value={experience.end_date || ""}
                    onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                  />
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  className={`w-5 h-5 rounded transition-colors ${
                    'text-green-600 border-slate-300'
                  }`}
                  checked={experience.is_current || false}
                  onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                />
                <label className={`text-sm cursor-pointer ${
                  'text-slate-700'
                }`}>
                  I am currently working here
                </label>
              </div>

              {/* Description Section with AI */}
              <div className={`rounded-xl p-4 ${
                'bg-slate-50 border border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-semibold ${
                    'text-slate-700'
                  }`}>
                    Responsibilities & Achievements
                  </label>

                  <button
                    type="button"
                    onClick={() => handleEnhanceDescription(index)}
                    disabled={loadingIndex === index}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${
                      loadingIndex === index
                        ? 'bg-green-100 text-green-700 cursor-wait'
                        : `bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/30`
                    }`}
                  >
                    {loadingIndex === index ? (
                      <Loader2 className="animate-spin w-3 h-3" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {loadingIndex === index ? "Improving..." : "Enhance with AI"}
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={experience.description || ''}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  className={`w-full p-3 text-sm rounded-xl outline-none transition-all resize-y min-h-[100px] ${
                    'bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  }`}
                  placeholder="â€¢ Developed new features for the frontend using React...\nâ€¢ Collaborated with backend team to optimize API endpoints..."
                />
                <p className={`text-xs mt-2 flex items-center gap-1 ${
                  'text-slate-500'
                }`}>
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  Tip: Write a rough draft, then let AI polish it for you.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;


