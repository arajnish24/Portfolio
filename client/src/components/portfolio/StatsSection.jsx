import React from "react";

const StatsSection = ({ projectsCount }) => {
  return (
    <section className="container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900/10 border border-slate-900 p-6 rounded-3xl text-center">
        <div>
          <span className="text-3xl font-extrabold text-white block">1+</span>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
            Years Experience
          </span>
        </div>
        <div>
          <span className="text-3xl font-extrabold text-blue-400 block">
            {projectsCount}
          </span>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
            Projects Published
          </span>
        </div>
        <div>
          <span className="text-3xl font-extrabold text-purple-400 block">
            3+
          </span>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
            Happy Clients
          </span>
        </div>
        <div>
          <span className="text-3xl font-extrabold text-amber-400 block">
            2+
          </span>
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
            Industry Awards
          </span>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
