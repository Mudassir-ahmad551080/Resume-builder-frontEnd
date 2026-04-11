import { Briefcase, Plus, Sparkles, Trash2, Loader2, Calendar, Building2, User } from "lucide-react";
import React, { useState } from 'react';
import { useTheme } from "../context/ThemContext";
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';

const ExperienceForm = ({ data, onChange }) => {
  const [theme] = useTheme();
  const isLight = theme === 'ligth';
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
            isLight ? 'text-slate-800' : 'text-white'
          }`}>
            <Briefcase className={`w-5 h-5 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
            Professional Experience
          </h3>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
          isLight
            ? 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isLight ? 'bg-slate-200' : 'bg-slate-700'
          }`}>
            <Briefcase className={`w-8 h-8 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <h4 className={`text-lg font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>No experience added yet</h4>
          <p className={`text-sm text-center max-w-sm mb-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Start building your resume by adding your past work experience, internships, or freelance projects.
          </p>
          <button
            onClick={addExperience}
            className={`font-medium flex items-center gap-1 ${
              isLight ? 'text-green-600 hover:text-green-700' : 'text-green-400 hover:text-green-500'
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
                isLight
                  ? 'bg-white border border-slate-200 hover:shadow-xl'
                  : 'bg-slate-800/80 border border-slate-700 hover:shadow-xl hover:shadow-slate-900/50'
              }`}
            >
              {/* Card Header & Delete */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    isLight
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <h4 className={`text-lg font-semibold ${
                    isLight ? 'text-slate-800' : 'text-white'
                  }`}>
                    {experience.position || "Untitled Position"}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className={`p-2 rounded-full transition-colors ${
                    isLight
                      ? 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                      : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
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
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    <User size={12} /> Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      isLight
                        ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                        : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-slate-500'
                    }`}
                    value={experience.position || ""}
                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    <Building2 size={12} /> Employer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google Inc."
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      isLight
                        ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                        : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-slate-500'
                    }`}
                    value={experience.company || ""}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    <Calendar size={12} /> Start Date
                  </label>
                  <input
                    type="month"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      isLight
                        ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800'
                        : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white'
                    }`}
                    value={experience.start_date || ""}
                    onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    <Calendar size={12} /> End Date
                  </label>
                  <input
                    type="month"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all ${
                      experience.is_current
                        ? `${isLight ? 'bg-slate-100' : 'bg-slate-800'} ${isLight ? 'border-slate-200' : 'border-slate-700'} ${isLight ? 'text-slate-400' : 'text-slate-500'} cursor-not-allowed`
                        : isLight
                          ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800'
                          : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white'
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
                    isLight ? 'text-green-600 border-slate-300' : 'text-green-400 border-slate-600'
                  }`}
                  checked={experience.is_current || false}
                  onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                />
                <label className={`text-sm cursor-pointer ${
                  isLight ? 'text-slate-700' : 'text-slate-300'
                }`}>
                  I am currently working here
                </label>
              </div>

              {/* Description Section with AI */}
              <div className={`rounded-xl p-4 ${
                isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-900/50 border border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-semibold ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
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
                    isLight
                      ? 'bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'bg-slate-900 border border-slate-700 text-slate-300 placeholder-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  }`}
                  placeholder="• Developed new features for the frontend using React...\n• Collaborated with backend team to optimize API endpoints..."
                />
                <p className={`text-xs mt-2 flex items-center gap-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
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
