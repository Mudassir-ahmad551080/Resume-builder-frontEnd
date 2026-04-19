import React from 'react'
import { GraduationCap, Plus, Trash2, School, Award } from 'lucide-react';

const EducationForm = ({ data, onChange }) => {

  const addEducation = () => {
    const newEducation = {
      institute: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
      marks: ''
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <GraduationCap className="w-5 h-5 text-green-600" />
            Education
          </h3>
          <p className="text-sm mt-1 text-slate-500">
            Add your educational background and qualifications.
          </p>
        </div>
        <button
          onClick={addEducation}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border-2 border-dashed transition-colors border-slate-200 bg-slate-50/50 hover:bg-slate-50">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-slate-200">
            <GraduationCap className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-medium text-slate-700">No education added yet</h4>
          <p className="text-sm text-center max-w-sm text-slate-500">
            Add your academic background to make your resume complete.
          </p>
          <button
            onClick={addEducation}
            className="mt-4 font-medium flex items-center gap-1 text-green-600 hover:text-green-700"
          >
            Click here to add your first education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-lg transition-all duration-300 p-6 bg-white border border-slate-200 hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold text-slate-800">
                    {education.degree || education.institute || "Education Entry"}
                  </h4>
                </div>
                <button
                  onClick={() => removeEducation(index)}
                  className="p-2 rounded-full transition-colors text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institute */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1 text-slate-500">
                    <School size={12} /> Institute
                  </label>
                  <input
                    type="text"
                    placeholder="University or School name"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400"
                    value={education.institute || ""}
                    onChange={(e) => updateEducation(index, "institute", e.target.value)}
                  />
                </div>

                {/* Degree */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1 text-slate-500">
                    <Award size={12} /> Degree
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bachelor's, Master's"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400"
                    value={education.degree || ""}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  />
                </div>

                {/* Field of Study */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400"
                    value={education.field || ""}
                    onChange={(e) => updateEducation(index, "field", e.target.value)}
                  />
                </div>

                {/* Graduation Date */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Graduation Date
                  </label>
                  <input
                    type="month"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800"
                    value={education.graduation_date || ""}
                    onChange={(e) => updateEducation(index, "graduation_date", e.target.value)}
                  />
                </div>

                {/* GPA */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    GPA (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.8"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400"
                    value={education.gpa || ""}
                    onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                  />
                </div>

                {/* Marks */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Marks (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 85%"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400"
                    value={education.marks || ""}
                    onChange={(e) => updateEducation(index, "marks", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm