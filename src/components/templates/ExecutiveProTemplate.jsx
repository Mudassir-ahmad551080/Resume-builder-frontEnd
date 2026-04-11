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
    } catch  {
      return dateStr;
    }
  };

  const renderDescription = (content) => {
    if (!content) return null;
    const items = content.split("\n").filter((item) => item.trim() !== "");
    return (
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-600"
          >
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            ></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full bg-slate-100 font-sans antialiased p-2 sm:p-4">
      <div className="max-w-[210mm] mx-auto">
        {/*
          KEY FIX 1: flex-col on mobile, flex-row on md+
          This stacks sidebar on top of content on small screens.
        */}
        <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden bg-white">

          {/* ── LEFT SIDEBAR ──────────────────────────────────────────
              KEY FIX 2:
              - Remove fixed w-72. Use w-full on mobile, w-64 on md+.
              - Reduce padding on mobile (p-4 sm:p-6).
              - Profile image and name/title go horizontal on mobile to save vertical space.
          */}
          <aside
            className="w-full md:w-64 lg:w-72 flex-shrink-0 p-4 sm:p-6 text-white"
            style={{ backgroundColor: accentColor }}
          >
            {/* Profile: stacked on md+, side-by-side on mobile */}
            <div className="flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-0 mb-4 md:mb-6">
              {/* Avatar */}
              <div className="flex-shrink-0 md:mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 md:mx-auto rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl">
                  {data.personal_info?.image ? (
                    <img
                      src={data.personal_info.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center">
                      <User className="w-10 h-10 md:w-14 md:h-14 text-white/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Title: left-aligned on mobile, centered on md+ */}
              <div className="text-left md:text-center md:mb-6">
                <h1 className="text-lg sm:text-xl font-bold mb-1">
                  {data.personal_info?.full_name || "Your Name"}
                </h1>
                <p className="text-xs sm:text-sm text-white/80 font-medium">
                  {data.personal_info?.profession || "Professional Title"}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                  Contact
                </h3>
                {/*
                  KEY FIX 3: On mobile, contact items go in a 2-col grid
                  to save vertical space. On md+ they stack single-column.
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-y-2.5 gap-x-3">
                  {data.personal_info?.email && (
                    <a
                      href={`mailto:${data.personal_info.email}`}
                      className="flex items-start gap-2 text-[11px] text-white/90 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{data.personal_info.email}</span>
                    </a>
                  )}
                  {data.personal_info?.phone && (
                    <a
                      href={`tel:${data.personal_info.phone}`}
                      className="flex items-center gap-2 text-[11px] text-white/90 hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{data.personal_info.phone}</span>
                    </a>
                  )}
                  {data.personal_info?.location && (
                    <span className="flex items-center gap-2 text-[11px] text-white/90">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{data.personal_info.location}</span>
                    </span>
                  )}
                  {data.personal_info?.linkedin && (
                    <a
                      href={data.personal_info.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[11px] text-white/90 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">LinkedIn</span>
                    </a>
                  )}
                  {data.personal_info?.website && (
                    <a
                      href={data.personal_info.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-[11px] text-white/90 hover:text-white transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section
                KEY FIX 4: Pills wrap in a flex-wrap row on mobile,
                single column list on md+. */}
            {data.skills && data.skills.length > 0 && (
              <div className="mb-6">
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                    <Code className="w-3.5 h-3.5" />
                    Skills
                  </h3>
                  {/* Mobile: pill wraps. md+: vertical list */}
                  <div className="flex flex-wrap gap-1.5 md:hidden">
                    {data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-[10px] text-white/90 bg-white/10 px-2 py-0.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="hidden md:flex flex-col space-y-2">
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

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <div className="border-t border-white/20 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Education
                  </h3>
                  {/*
                    KEY FIX 5: On mobile, education items go 2-col to
                    avoid a very long vertical sidebar.
                  */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
                    {data.education.map((edu, index) => (
                      <div key={index}>
                        <p className="text-[11px] font-semibold text-white/90">
                          {edu.degree}
                        </p>
                        <p className="text-[10px] text-white/60">{edu.institute}</p>
                        <p className="text-[10px] text-white/50 mt-0.5">
                          {formatDate(edu.graduation_date)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-[10px] text-center text-white/40">
                Generated with Resume Builder
              </p>
            </div>
          </aside>

          {/* ── RIGHT CONTENT AREA ──────────────────────────────────── */}
          <main className="flex-1 p-4 sm:p-6 bg-white min-w-0">

            {/* Summary Section */}
            {(data.professionalSummary || data.professional_summary) && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">
                    Professional Summary
                  </h2>
                </div>
                <div
                  className="bg-slate-50 rounded-xl p-3 sm:p-4 border-l-4 ml-8 sm:ml-9"
                  style={{ borderLeftColor: accentColor }}
                >
                  {renderDescription(
                    data.professionalSummary || data.professional_summary
                  )}
                </div>
              </section>
            )}

            {/* Experience Section */}
            {data.experience && data.experience.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">
                    Work Experience
                  </h2>
                </div>
                <div className="ml-8 sm:ml-9 space-y-4 sm:space-y-5">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative">
                      <div
                        className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 bg-white"
                        style={{ borderColor: accentColor }}
                      ></div>

                      <div className="bg-slate-50 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow">
                        {/*
                          KEY FIX 6: On mobile, date badge moves below the
                          title instead of floating right — prevents overflow.
                        */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 sm:gap-0 mb-2">
                          <div>
                            <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-900">
                              {exp.position}
                            </h3>
                            <p
                              className="text-[11px] sm:text-[12px] font-semibold"
                              style={{ color: accentColor }}
                            >
                              {exp.company}
                            </p>
                          </div>
                          <span className="self-start text-[10px] font-medium px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-600 whitespace-nowrap">
                            {formatDate(exp.start_date)} —{" "}
                            {exp.is_current ? "Present" : formatDate(exp.end_date)}
                          </span>
                        </div>
                        {exp.description && (
                          <div className="mt-2 sm:mt-3">
                            {renderDescription(exp.description)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section
                KEY FIX 7: grid-cols-1 on mobile, grid-cols-2 on sm+.
                Also min-w-0 on the grid to prevent overflow. */}
            {data.projects && data.projects.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accentColor }} />
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">
                    Featured Projects
                  </h2>
                </div>
                <div className="ml-8 sm:ml-9 grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                  {data.projects.map((pro, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100 hover:shadow-md transition-shadow min-w-0"
                    >
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="text-[13px] font-bold text-slate-900 min-w-0 truncate">
                          {pro.name}
                        </h3>
                        <div className="flex gap-1.5 flex-shrink-0">
                          {pro.link && (
                            <a
                              href={pro.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {pro.code_link && (
                            <a
                              href={pro.code_link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <Code className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      {pro.type && (
                        <p
                          className="text-[10px] font-semibold mb-2"
                          style={{ color: accentColor }}
                        >
                          {pro.type}
                        </p>
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