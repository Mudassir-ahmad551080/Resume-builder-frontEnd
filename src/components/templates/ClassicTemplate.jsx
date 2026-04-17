import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const renderDescription = (content) => {
    if (!content) return null;
    const items = content.split("\n").filter((item) => item.trim() !== "");
    return (
      <ul className="list-disc pl-5 space-y-1 text-gray-700 leading-relaxed text-sm">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 shadow-sm border border-gray-200">
      {/* Header Section */}
      <header className="text-center mb-8">
        {data.personal_info?.image && (
          <div className="mb-4 flex justify-center">
            <img
              src={typeof data.personal_info.image === "string" ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)}
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full border-4"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}
        <h1 className="text-3xl font-serif font-bold mb-1" style={{ color: accentColor }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-lg italic text-gray-600 mb-4">
          {data?.personal_info?.profession || "Profession"}
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500 border-t border-b py-3 border-gray-100">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="size-3" /> <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="size-3" /> <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-3" /> <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-800">
              <Linkedin className="size-3" /> <span>LinkedIn</span>
            </a>
          )}
        </div>
      </header>

      <div className="space-y-8">
        {/* Professional Summary */}
        {(data.professionalSummary || data.professional_summary) && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: accentColor, color: accentColor }}>
              Professional Summary
            </h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              {renderDescription(data.professionalSummary || data.professional_summary)}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: accentColor, color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                    <span className="text-xs text-gray-500">{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{exp.company}</p>
                  {exp.description && renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: accentColor, color: accentColor }}>
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <p className="text-sm text-gray-600">{edu.institute}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(edu.graduation_date)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: accentColor, color: accentColor }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="text-sm text-gray-700">
                  <span style={{ color: accentColor }} className="mr-1">●</span> {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;
