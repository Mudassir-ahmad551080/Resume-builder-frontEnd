import { Plus, Trash2, Folder, Link as LinkIcon, Code } from 'lucide-react';
import React from 'react'
import { useTheme } from '../context/ThemContext';

const ProjectForm = ({ data, onChange }) => {
  const [theme] = useTheme();
  const isLight = theme === 'ligth';

  const addProject = () => {
    const newProject = {
      name: '',
      type: '',
      link: '',
      code_link: '',
      description: '',
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${
            isLight ? 'text-slate-800' : 'text-white'
          }`}>
            <Folder className={`w-5 h-5 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
            Projects
          </h3>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Showcase your best work and portfolio projects.
          </p>
        </div>
        <button
          onClick={addProject}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
        >
          <Plus size={16} />
          Add Project
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
            <Folder className={`w-8 h-8 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <h4 className={`text-lg font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>No projects added yet</h4>
          <p className={`text-sm text-center max-w-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Add your best projects to impress potential employers.
          </p>
          <button
            onClick={addProject}
            className={`mt-4 font-medium flex items-center gap-1 ${
              isLight ? 'text-green-600 hover:text-green-700' : 'text-green-400 hover:text-green-500'
            }`}
          >
            Click here to add your first project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((project, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-lg transition-all duration-300 p-6 ${
                isLight
                  ? 'bg-white border border-slate-200 hover:shadow-xl'
                  : 'bg-slate-800/80 border border-slate-700 hover:shadow-xl hover:shadow-slate-900/50'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <h4 className={`font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    {project.name || "Untitled Project"}
                  </h4>
                </div>
                <button
                  onClick={() => removeProject(index)}
                  className={`p-2 rounded-full transition-colors ${
                    isLight
                      ? 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                      : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                  }`}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Project Name */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. E-commerce Platform"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      isLight
                        ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                        : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-slate-500'
                    }`}
                    value={project.name || ""}
                    onChange={(e) => updateProject(index, "name", e.target.value)}
                  />
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Project Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Web App, Mobile App"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      isLight
                        ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                        : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-slate-500'
                    }`}
                    value={project.type || ""}
                    onChange={(e) => updateProject(index, "type", e.target.value)}
                  />
                </div>

                {/* Links Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Live Link */}
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      <LinkIcon size={12} /> Live Link
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com"
                      className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                        isLight
                          ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                          : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-slate-500'
                      }`}
                      value={project.link || ""}
                      onChange={(e) => updateProject(index, "link", e.target.value)}
                    />
                  </div>

                  {/* Code Link */}
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1 ${
                      isLight ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      <Code size={12} /> Code Link
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                        isLight
                          ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                          : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-slate-500'
                      }`}
                      value={project.code_link || ""}
                      onChange={(e) => updateProject(index, "code_link", e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className={`text-xs font-semibold uppercase tracking-wide ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what the project does, your role, and key achievements..."
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 resize-y min-h-[100px] ${
                      isLight
                        ? 'bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-slate-800 placeholder-slate-400'
                        : 'bg-slate-900 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-white placeholder-slate-500'
                    }`}
                    value={project.description || ""}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
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

export default ProjectForm
