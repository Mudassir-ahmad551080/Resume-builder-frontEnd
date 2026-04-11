import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User, Upload, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTheme } from '../context/ThemContext'

const PersonalInfo = ({data, onchange, removeBackground, setRemoveBackground}) => {
  const [theme] = useTheme();
  const isLight = theme === 'ligth';

  const handleChange = (field, value) => {
    onchange({
      ...data,
      [field]: value,
    });
  }

  const fields = [
    {label: 'Full Name', key: 'full_name', required: true, icon: User, type: 'text'},
    {label: 'Email Address', key: 'email', required: true, icon: Mail, type: 'email'},
    {label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel'},
    {label: 'Location', key: 'location', icon: MapPin, type: 'text'},
    {label: 'Profession', key: 'profession', icon: BriefcaseBusiness, type: 'text'},
    {label: 'Linkedin Profile', key: 'linkedin', icon: Linkedin, type: 'url'},
    {label: 'Website Url', key: 'website', icon: Globe, type: 'url'},
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-2 ${
          isLight ? 'text-slate-800' : 'text-white'
        }`}>
          Personal Information
        </h3>
        <p className={`text-sm ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Get started with your personal information
        </p>
      </div>

      {/* Image Upload */}
      <div className={`flex flex-col items-center p-6 rounded-2xl transition-all duration-300 ${
        isLight
          ? 'bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-lg hover:shadow-slate-200/50'
          : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:shadow-lg hover:shadow-slate-900/50'
      }`}>
        <label className="flex flex-col items-center cursor-pointer group">
          {data.image ? (
            <div className="relative">
              <img
                src={
                  typeof data.image === "string"
                    ? data.image
                    : URL.createObjectURL(data.image)
                }
                alt="Profile"
                className="w-28 h-28 object-cover rounded-full border-4 border-green-500 shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleChange("image", null);
                }}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div className={`flex flex-col items-center p-4 rounded-full transition-all duration-300 ${
              isLight
                ? 'bg-slate-100 group-hover:bg-slate-200'
                : 'bg-slate-700 group-hover:bg-slate-600'
            }`}>
              <User className={`w-12 h-12 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>
          )}
          <span className={`mt-3 text-sm font-medium ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          } group-hover:text-green-600 transition-colors`}>
            {data.image ? 'Change Photo' : 'Upload Photo'}
          </span>
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </label>

        {typeof data.image === "object" && (
          <div className={`mt-4 flex items-center gap-3 p-3 rounded-xl ${
            isLight ? 'bg-slate-100' : 'bg-slate-700'
          }`}>
            <span className={`text-sm font-medium ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Remove Background
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground((prev) => !prev)}
                checked={removeBackground}
              />
              <div className={`w-11 h-6 rounded-full peer-checked:bg-green-500 transition-all duration-200 ${
                isLight ? 'bg-slate-300' : 'bg-slate-600'
              }`}></div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-md"></span>
            </label>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="space-y-2">
              <label className={`flex items-center gap-2 text-sm font-semibold ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <Icon className={`w-4 h-4 ${
                  isLight ? 'text-green-600' : 'text-green-400'
                }`} />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              <div className={`relative rounded-xl transition-all duration-300 ${
                isLight
                  ? 'bg-slate-50 border border-slate-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20'
                  : 'bg-slate-800 border border-slate-700 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20'
              }`}>
                <input
                  type={field.type}
                  value={data[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all duration-300 ${
                    isLight
                      ? 'text-slate-800 placeholder-slate-400'
                      : 'text-white placeholder-slate-500'
                  }`}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default PersonalInfo
