import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const renderDescription = (content, isSummary = false) => {
    if (!content) return null;
    const items = content.split("\n").filter((item) => item.trim() !== "");

    return (
      <ul className={`list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1 ${isSummary ? "list-none ml-0" : ""}`}>
        {items.map((item, index) => (
          <li key={index} className={isSummary ? "mb-2" : ""}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="max-w-5xl mx-auto bg-white text-zinc-800 shadow-lg rounded-lg overflow-hidden">
      {/* Professional Header */}
      <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-8">
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          {data.personal_info?.image && typeof data.personal_info.image === "string" ? (
            <div className="flex-shrink-0">
              <img
                src={data.personal_info.image}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-lg border-4 border-white shadow-xl"
                style={{ background: accentColor + "70" }}
              />
            </div>
          ) : data.personal_info?.image && typeof data.personal_info.image === "object" ? (
            <div className="flex-shrink-0">
              <img
                src={URL.createObjectURL(data.personal_info.image)}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-lg border-4 border-white shadow-xl"
              />
            </div>
          ) : null}

          {/* Name & Profession */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              {data.personal_info?.full_name || "Your Name"}
            </h1>
            <p className="text-lg text-slate-300 font-medium">
              {data?.personal_info?.profession || "Profession"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4">
        {/* Left Sidebar */}
        <aside className="col-span-1 bg-slate-50 border-r border-slate-200 p-6 space-y-8">
          {/* Contact */}
          <section>
            <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-300 pb-2">
              Contact
            </h2>
            <div className="space-y-3 text-sm">
              {data.personal_info?.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700">{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-start gap-3">
                  <Mail size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700 break-all">{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700">{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.linkedin && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={data.personal_info?.linkedin}
                  className="flex items-start gap-3 hover:opacity-70 transition-opacity"
                >
                  <Linkedin size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700 break-all text-xs">
                    {data.personal_info.linkedin.split("https://www.")[1]
                      ? data.personal_info.linkedin.split("https://www.")[1]
                      : data.personal_info.linkedin}
                  </span>
                </a>
              )}
              {data.personal_info?.website && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={data.personal_info?.website}
                  className="flex items-start gap-3 hover:opacity-70 transition-opacity"
                >
                  <Globe size={16} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span className="text-slate-700 break-all text-xs">
                    {data.personal_info.website.split("https://")[1]
                      ? data.personal_info.website.split("https://")[1]
                      : data.personal_info.website}
                  </span>
                </a>
              )}
            </div>
          </section>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-300 pb-2">
                Education
              </h2>
              <div className="space-y-5">
                {data.education.map((edu, index) => (
                  <div key={index} className="space-y-1">
                    <p className="font-semibold text-slate-900">
                      {edu.degree}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      {edu.field}
                    </p>
                    <p className="text-xs text-slate-500">
                      {edu.institute}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(edu.graduation_date)}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs text-slate-600">
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.marks && (
                      <p className="text-xs text-slate-600">
                        Marks: {edu.marks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-300 pb-2">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white text-slate-700 text-xs font-medium rounded-full border border-slate-200 shadow-sm"
                    style={{ borderColor: accentColor + "40" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Right Content */}
        <main className="col-span-3 p-8 space-y-8">
          {/* Summary */}
          {(data.professionalSummary || data.professional_summary) && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor + "30" }}>
                Professional Summary
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed">
                {renderDescription(
                  data.professionalSummary || data.professional_summary
                )}
              </div>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wide mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor + "30" }}>
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-4 border-l-2" style={{ borderColor: accentColor + "40" }}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                      <h3 className="font-bold text-slate-900 text-base">
                        {exp.position}
                      </h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-3" style={{ color: accentColor }}>
                      {exp.company}
                    </p>
                    <div className="text-sm text-slate-700">
                      {renderDescription(exp.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wide mb-4 pb-2 border-b-2" style={{ color: accentColor, borderColor: accentColor + "30" }}>
                Projects
              </h2>
              <div className="space-y-5">
                {data.projects.map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {project.name}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium w-fit">
                        {project.type}
                      </span>
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm inline-flex items-center gap-1 hover:underline"
                        style={{ color: accentColor }}
                      >
                        <Globe size={14} />
                        {project.link}
                      </a>
                    )}
                    <div className="text-sm text-slate-700">
                      {renderDescription(project.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;

