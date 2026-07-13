import React from "react";

const GallerySection = ({ gallery }) => {
  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="container mx-auto px-6 max-w-7xl space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Events & <span className="text-premium-gradient">Gallery</span>
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          Moments from hackathons, technology speaking sessions, and achievements
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((g, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl overflow-hidden aspect-video border border-slate-900/60 shadow-md"
          >
            <img
              src={g.url}
              alt={g.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-all"
            />
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3 transition-opacity">
              <h6 className="font-bold text-xs text-white font-sans">{g.title}</h6>
              <span className="text-[9px] text-blue-400 font-semibold font-sans">
                {g.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
