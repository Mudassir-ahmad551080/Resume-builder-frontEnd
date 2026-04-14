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

  // Helper function to convert text with newlines into bullet points
  const renderDescription = (content, isSummary = false) => {
    if (!content) return null;
    const items = content.split("\n").filter((item) => item.trim() !== "");
    
    // Summary usually looks better as a standard block if it's short, 
    // but this enforces bullets for consistency as requested.
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
    <div className="max-w-5xl mx-auto bg-white text-zinc-800">
      <div className="grid grid-cols-3">
        <div className="col-span-1 py-10">
          {/* Image */}
          {data.personal_info?.image && typeof data.personal_info.image === "string" ? (
            <div className="mb-6 ">
              <img
                src={data.personal_info.image}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mx-auto"
                style={{ background: accentColor + "70" }}
              />
            </div>
          ) : data.personal_info?.image && typeof data.personal_info.image === "object" ? (
            <div className="mb-6">
              <img
                src={URL.createObjectURL(data.personal_info.image)}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          ) : null}
        </div>

        {/* Name + Title */}
        <div className="col-span-2 flex flex-col justify-center py-10 px-8">
          <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
            {data?.personal_info?.profession || "Profession"}
          </p>
        </div>

        {/* Left Sidebar */}
        <aside className="col-span-1 border-r border-gray-400 flex flex-col p-0 pt-0">
          {/* Contact */}
          <section className="mb-10 ">
            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
              CONTACT
            </h2>
            <div className="space-y-2 text-sm">
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2 mr-1 md:mr-0">
                  <Phone size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center gap-2 ">
                  <Mail size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.location}</span>
                </div>
              )}
              {data.personal_info?.linkedin && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={data.personal_info?.linkedin}
                  className="flex items-center gap-2"
                >
                  <Linkedin className="size-4" />
                  <span className="break-all text-xs">
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
                  className="flex items-center gap-2"
                >
                  <Globe className="size-4" />
                  <span className="break-all text-xs">
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
            <section className="mb-8">
              <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                EDUCATION
              </h2>
              <div className="space-y-4 text-sm">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-semibold uppercase">
                      {edu.degree}
                    </p>
                    <p className="font-semibold mr-2">
                      {edu.field}
                    </p>
                    <p className="text-zinc-600 mt-1 mb-1 mr-2 flex flex-wrap">
                      {edu.institute}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(edu.graduation_date)}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.marks && (
                      <p className="text-sm text-gray-600">
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
              <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                SKILLS
              </h2>
              <ul className="space-y-1 text-sm">
                {data.skills.map((skill, index) => (
                  <li key={index}>
                    • {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right Content */}
        <main className="col-span-2 p-8 pt-0">
          {/* Summary */}
          {(data.professionalSummary || data.professional_summary) && (
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                PROFESSIONAL SUMMARY
              </h2>
              <div>
              {renderDescription(
                data.professionalSummary || data.professional_summary
              )}
            </div>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: accentColor }}>
                EXPERIENCE
              </h2>
              <div className="space-y-6 mb-8">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-zinc-900">
                        {exp.position}
                      </h3>
                      <span className="text-xs ml-3 text-zinc-500">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: accentColor }}>
                      {exp.company}
                    </p>
                    <div>
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
              <h2 className="text-sm uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
                PROJECTS
              </h2>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-md font-medium text-zinc-800 mt-3">
                      {project.name}
                    </h3>
                    <p className="text-sm mb-1" style={{ color: accentColor }}>
                      {project.type}
                    </p>
                    <a href={project.link} target="_blank" rel="noreferrer" className="text-sm mb-1 block" style={{ color: accentColor }}>
                      {project.link}
                    </a>
                    <div>
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

