import React, { useState } from 'react';
import { Plus, Sparkles, X } from 'lucide-react';
import { useTheme } from '../context/ThemContext';

const Skills = ({ data = [], onChange }) => {
  const [theme] = useTheme();
  const isLight = theme === 'ligth';
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill || data.includes(skill)) return;
    onChange([...data, skill]);
    setNewSkill('');
  };

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className={`rounded-2xl p-6 shadow-lg transition-all duration-300 ${
      isLight
        ? 'bg-white border border-slate-200'
        : 'bg-slate-800/80 border border-slate-700'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${
          isLight ? 'text-slate-800' : 'text-white'
        }`}>
          <Sparkles className={`w-5 h-5 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
          Skills
        </h3>
        <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Add your technical and soft skills
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Enter a skill and press Enter"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
            isLight
              ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
              : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-slate-500'
          }`}
        />

        <button
          type="button"
          onClick={addSkill}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Skills List */}
      {data.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {data.map((skill, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isLight
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200'
                  : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30'
              }`}
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className={`p-0.5 rounded-full transition-colors ${
                  isLight
                    ? 'hover:bg-green-200 text-green-600'
                    : 'hover:bg-green-500/30 text-green-400'
                }`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className={`mt-8 flex flex-col items-center text-center ${
          isLight ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isLight ? 'bg-slate-100' : 'bg-slate-700'
          }`}>
            <Sparkles className={`h-6 w-6 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <p className={`text-sm font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>No skills added yet</p>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            Start by adding your technical or soft skills above
          </p>
        </div>
      )}
    </div>
  );
};

export default Skills;
