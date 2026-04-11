import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Code,
  User,
  Award,
  ExternalLink,
} from "lucide-react";

const ModerCardTemplate = ({ data, accentColor = "#10b981" }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const [year, month] = dateStr.split("-");
      return new Date(year, month - 1).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const renderDescription = (content) => {
    if (!content) return null;
    const items = content.split("\n").filter((item) => item.trim() !== "");
    return (
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-slate-700 text-[13px] leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }}></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  const SectionTitle = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
        <Icon className="w-4 h-4" style={{ color: accentColor }} />
      </div>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">{title}</h2>
    </div>
  );

  return (
    <div className="w-full bg-slate-50 font-sans antialiased p-4">
      <div className="max-w-[210mm] mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* HEADER - Modern Card Style */}
        <header className="relative">
          {/* Accent Bar */}
          <div className="h-2 w-full" style={{ backgroundColor: accentColor }}></div>

          <div className="px-8 py-6">
            <div className="flex items-start justify-between">
              {/* Name & Profession */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                  {data.personal_info?.full_name || "Your Name"}
                </h1>
                <p className="text-base font-medium mb-4" style={{ color: accentColor }}>
                  {data.personal_info?.profession || "Professional Title"}
                </p>

                {/* Contact Info - Modern Grid */}
                <div className="flex flex-wrap gap-4">
                  {data.personal_info?.email && (
                    <a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-[12px]">
                      <Mail size={14} className="text-slate-400" />
                      <span>{data.personal_info.email}</span>
                    </a>
                  )}
                  {data.personal_info?.phone && (
                    <a href={`tel:${data.personal_info.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-[12px]">
                      <Phone size={14} className="text-slate-400" />
                      <span>{data.personal_info.phone}</span>
                    </a>
                  )}
                  {data.personal_info?.location && (
                    <span className="flex items-center gap-2 text-slate-600 text-[12px]">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{data.personal_info.location}</span>
                    </span>
                  )}
                </div>

                {/* Links Row */}
                <div className="flex flex-wrap gap-4 mt-3">
                  {data.personal_info?.linkedin && (
                    <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-[12px]">
                      <Linkedin size={14} style={{ color: accentColor }} />
                      <span className="underline underline-offset-2">{data.personal_info.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>
                    </a>
                  )}
                  {data.personal_info?.website && (
                    <a href={data.personal_info.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-[12px]">
                      <Globe size={14} style={{ color: accentColor }} />
                      <span className="underline underline-offset-2">{data.personal_info.website.replace(/https?:\/\/(www\.)?/, '')}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Decorative Element */}
              <div className="hidden md:block">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-lg" style={{ borderColor: accentColor }}>
                  {data.personal_info?.image ? (
                    <img src={data.personal_info.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="px-8 pb-8 space-y-8">
          {/* PROFILE SECTION */}
          {(data.professionalSummary || data.professional_summary) && (
            <section>
              <SectionTitle title="Professional Summary" icon={User} />
              <div className="bg-slate-50 rounded-xl p-5 border-l-4" style={{ borderLeftColor: accentColor }}>
                <div className="text-[14px] leading-relaxed text-slate-700">
                  {renderDescription(data.professionalSummary || data.professional_summary)}
                </div>
              </div>
            </section>
          )}

          {/* EXPERIENCE SECTION */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionTitle title="Work Experience" icon={Briefcase} />
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-slate-100 hover:border-l-2 transition-colors" style={{ borderLeftColor: index === 0 ? accentColor : undefined }}>
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-white border-2" style={{ borderColor: accentColor }}></div>

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-[15px] font-bold text-slate-900">{exp.position}</h3>
                        <p className="text-[13px] font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>

                    <div className="text-[13px]">
                      {renderDescription(exp.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SKILLS SECTION */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <SectionTitle title="Skills & Expertise" icon={Code} />
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-[12px] font-medium border-2 transition-all hover:shadow-md"
                    style={{
                      backgroundColor: `${accentColor}10`,
                      borderColor: `${accentColor}30`,
                      color: accentColor
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS SECTION */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <SectionTitle title="Featured Projects" icon={Award} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects.map((pro, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900 text-[14px]">{pro.name}</h3>
                      <div className="flex gap-2">
                        {pro.link && (
                          <a href={pro.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {pro.code_link && (
                          <a href={pro.code_link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                            <Code size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    {pro.type && (
                      <p className="text-[11px] font-medium mb-2" style={{ color: accentColor }}>{pro.type}</p>
                    )}
                    <div className="text-[12px]">
                      {renderDescription(pro.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION SECTION */}
          {data.education && data.education.length > 0 && (
            <section>
              <SectionTitle title="Education" icon={GraduationCap} />
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div>
                      <h3 className="text-[14px] font-bold text-slate-900">{edu.degree}</h3>
                      <p className="text-[13px] text-slate-600">{edu.institute}</p>
                      {(edu.gpa || edu.marks) && (
                        <div className="flex gap-3 mt-1">
                          {edu.gpa && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
                              GPA: {edu.gpa}
                            </span>
                          )}
                          {edu.marks && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
                              Marks: {edu.marks}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                      {formatDate(edu.graduation_date)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* FOOTER */}
        <footer className="px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Generated with Resume Builder
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ModerCardTemplate;
