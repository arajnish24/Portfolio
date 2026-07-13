import React from "react";

const SkillsSection = ({ skills }) => {
  return (
    <section id="skills" className="container mx-auto px-6 max-w-7xl space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Skills & <span className="text-premium-gradient">Proficiencies</span>
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          Visual breakdown of engineering proficiencies by categories
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-2xl border border-slate-900 space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-bold font-sans">
              <span className="text-slate-300">{skill.name}</span>
              <span className="text-blue-400 font-mono">{skill.level}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{ width: `${skill.level}%` }}
              />
            </div>
            <span className="text-[9px] bg-slate-900/60 border border-slate-800 text-slate-500 px-2 py-0.5 rounded font-semibold block w-fit font-sans">
              {skill.category || "Core"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
