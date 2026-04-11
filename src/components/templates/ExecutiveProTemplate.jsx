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
  Star,
} from "lucide-react";

const ExecutiveProTemplate = ({ data, accentColor = "#1e40af" }) => {
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
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-600">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }}></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full bg-slate-100 font-sans antialiased p-4">
      <div className="max-w-[210mm] mx-auto">
        <div className="flex flex-row shadow-2xl rounded-2xl overflow-hidden bg-white">

          {/* LEFT SIDEBAR - Fixed Width */}
          <aside className="w-72 flex-shrink-0 p-6 text-white" style={{ backgroundColor: accentColor }}>
            {/* Profile Image */}
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl">
                {data.personal_info?.image ? (
                  <img src={data.personal_info.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <User className="w-14 h-14 text-white/40" />
                  </div>
                )}
              </div>
            </div>

            {/* Name & Title */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold mb-1">{data.personal_info?.full_name || "Your Name"}</h1>
              <p className="text-sm text-white/80 font-medium">{data.personal_info?.profession || "Professional Title"}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">Contact</h3>
                <div className="space-y-2.5">
                  {data.personal_info?.email && (
                    <a href={`mailto:${data.personal_info.email}`} className="flex items-start gap-2 text-[11px] text-white/90 hover:text-white transition-colors">
                      <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{data.personal_info.email}</span>
                    </a>
                  )}
                  {data.personal_info?.phone && (
                    <a href={`tel:${data.personal_info.phone}`} className="flex items-center gap-2 text-[11px] text-white/90 hover:text-white transition-colors">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{data.personal_info.phone}</span>
                    </a>
                  )}
                  {data.personal_info?.location && (
                    <span className="flex items-center gap-2 text-[11px] text-white/90">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{data.personal_info.location}</span>
                    </span>
                  )}
                  {data.personal_info?.linkedin && (
                    <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] text-white/90 hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">LinkedIn</span>
                    </a>
                  )}
                  {data.personal_info?.website && (
                    <a href={data.personal_info.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] text-white/90 hover:text-white transition-colors">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            {data.skills && data.skills.length > 0 && (
              <div className="space-y-3 mb-6">
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                    <Code className="w-3.5 h-3.5" />
                    Skills
                  </h3>
                  <div className="space-y-2">
                    {data.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                        <span className="text-[11px] text-white/90">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Education in Sidebar */}
            {data.education && data.education.length > 0 && (
              <div className="space-y-3">
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {data.education.map((edu, index) => (
                      <div key={index}>
                        <p className="text-[11px] font-semibold text-white/90">{edu.degree}</p>
                        <p className="text-[10px] text-white/60">{edu.institute}</p>
                        <p className="text-[10px] text-white/50 mt-0.5">{formatDate(edu.graduation_date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-[10px] text-center text-white/40">Generated with Resume Builder</p>
            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <main className="flex-1 p-6 bg-white">
            {/* Summary Section */}
            {(data.professionalSummary || data.professional_summary) && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
                    <User className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Professional Summary</h2>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border-l-4 ml-9" style={{ borderLeftColor: accentColor }}>
                  {renderDescription(data.professionalSummary || data.professional_summary)}
                </div>
              </section>
            )}

            {/* Experience Section */}
            {data.experience && data.experience.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
                    <Briefcase className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Work Experience</h2>
                </div>
                <div className="ml-9 space-y-5">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 bg-white" style={{ borderColor: accentColor }}></div>

                      <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-[14px] font-bold text-slate-900">{exp.position}</h3>
                            <p className="text-[12px] font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                          </div>
                          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                            {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </span>
                        </div>
                        {exp.description && (
                          <div className="mt-3">
                            {renderDescription(exp.description)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {data.projects && data.projects.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
                    <Award className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Featured Projects</h2>
                </div>
                <div className="ml-9 grid grid-cols-2 gap-3">
                  {data.projects.map((pro, index) => (
                    <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-[13px] font-bold text-slate-900">{pro.name}</h3>
                        <div className="flex gap-1.5">
                          {pro.link && (
                            <a href={pro.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {pro.code_link && (
                            <a href={pro.code_link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                              <Code className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      {pro.type && (
                        <p className="text-[10px] font-semibold mb-2" style={{ color: accentColor }}>{pro.type}</p>
                      )}
                      {pro.description && (
                        <div className="text-[11px] text-slate-600 line-clamp-3">
                          {renderDescription(pro.description)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveProTemplate;
