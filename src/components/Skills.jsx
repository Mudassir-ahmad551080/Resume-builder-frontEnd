import React, { useState } from 'react';
import { Plus, Sparkles, X } from 'lucide-react';

const Skills = ({ data = [], onChange }) => {

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
      'bg-white border border-slate-200'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${
          'text-slate-800'
        }`}>
          <Sparkles className={`w-5 h-5 text-green-600}`} />
          Skills
        </h3>
        <p className={`text-sm mt-1 text-slate-500}`}>
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
            'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
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
                'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200'
              }`}
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className={`p-0.5 rounded-full transition-colors ${
                  'hover:bg-green-200 text-green-600'
                }`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className={`mt-8 flex flex-col items-center text-center ${
          'text-slate-400'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            'bg-slate-100'
          }`}>
            <Sparkles className={`h-6 w-6 text-slate-400}`} />
          </div>
          <p className={`text-sm font-medium text-slate-500}`}>No skills added yet</p>
          <p className={`text-xs mt-1 text-slate-400}`}>
            Start by adding your technical or soft skills above
          </p>
        </div>
      )}
    </div>
  );
};

export default Skills;


