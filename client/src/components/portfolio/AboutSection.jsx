import React from "react";
import { Briefcase, BookOpen } from "lucide-react";

const AboutSection = ({ experiences, educations }) => {
  return (
    <section id="about" className="container mx-auto px-6 max-w-7xl space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Biography & <span className="text-premium-gradient">Milestones</span>
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          My academic training and career progression details
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Experience */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-blue-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5 font-sans">
            <Briefcase className="h-4.5 w-4.5" />
            <span>Work Experience</span>
          </h3>
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="relative pl-6 border-l border-slate-900 space-y-1.5"
              >
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-blue-500 rounded-full" />
                <div className="flex items-center justify-between text-xs font-bold font-sans">
                  <span className="text-white">{exp.position}</span>
                  <span className="text-slate-500">
                    {exp.joiningDate} - {exp.leavingDate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  {exp.company} — {exp.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-purple-400 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5 font-sans">
            <BookOpen className="h-4.5 w-4.5" />
            <span>Education Records</span>
          </h3>
          <div className="space-y-6">
            {educations.map((edu, idx) => (
              <div
                key={idx}
                className="relative pl-6 border-l border-slate-900 space-y-1.5"
              >
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-purple-500 rounded-full" />
                <div className="flex items-center justify-between text-xs font-bold font-sans">
                  <span className="text-white">{edu.degree}</span>
                  <span className="text-slate-500">{edu.duration}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{edu.college}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
