import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ProfessionalTemplate = ({ data, accentColor }) => {
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
      <ul className="list-disc pl-5 space-y-1 text-gray-600 leading-relaxed text-sm">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 p-10 min-h-screen font-sans shadow-sm border border-gray-100">
      {/* Header Section - Simple & Elegant */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        <p className="text-lg font-medium mb-6" style={{ color: accentColor }}>
          {data?.personal_info?.profession || "Profession"}
        </p>

        {/* Contact Info Bar */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin size={14} className="text-gray-400" />
              <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="hover:text-gray-800 underline decoration-gray-300 underline-offset-2">
                LinkedIn
              </a>
            </div>
          )}
        </div>
      </header>

      <div className="space-y-10">
        {/* Professional Summary */}
        {(data.professionalSummary || data.professional_summary) && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-900 border-b pb-1" style={{ borderColor: accentColor }}>
              Professional Summary
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              {renderDescription(data.professionalSummary || data.professional_summary)}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-900 border-b pb-1" style={{ borderColor: accentColor }}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800 text-sm">{exp.position}</h3>
                    <span className="text-xs text-gray-400 italic">
                      {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-2 text-gray-600">{exp.company}</p>
                  {exp.description && renderDescription(exp.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-900 border-b pb-1" style={{ borderColor: accentColor }}>
              Education
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <div className="text-sm">
                    <span className="font-bold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <p className="text-gray-500">{edu.institute}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(edu.graduation_date)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-gray-900 border-b pb-1" style={{ borderColor: accentColor }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="text-sm text-gray-600 flex items-center gap-1.5">
                  <span style={{ color: accentColor }} className="text-[10px]">●</span> {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-900 border-b pb-1" style={{ borderColor: accentColor }}>
              Projects
            </h2>
            <div className="space-y-5">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800 text-sm">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-gray-800 transition-colors underline">Visit Project</a>
                    )}
                  </div>
                  <p className="text-xs italic mb-2 text-gray-500">{project.type}</p>
                  {project.description && renderDescription(project.description)}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
