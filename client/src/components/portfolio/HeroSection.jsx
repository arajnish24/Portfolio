import React, { useState } from "react";
import { Sparkles, Terminal, Globe } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const HeroSection = ({ owner, handleTrackDownload }) => {
  const [showQr, setShowQr] = useState(false);

  return (
    <section className="container mx-auto px-6 max-w-7xl pt-16 md:pt-24 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="space-y-6 max-w-2xl text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-900/60 text-xs font-semibold text-blue-400">
          <Sparkles className="h-4 w-4 animate-spin" />
          <span>Open For Recruitment</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Hi, I'm <span className="text-premium-gradient">{owner.name}</span>
        </h1>

        <p className="text-lg md:text-xl font-bold text-slate-300 font-sans">
          {owner.profession}
        </p>

        <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light font-sans">
          {owner.bio}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={owner.resumeUrl || "/Updated_Resume.pdf"}
            target="_blank"
            rel="noreferrer"
            onClick={handleTrackDownload}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 px-8 rounded-2xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 hover:scale-[1.02] cursor-pointer"
          >
            <Terminal className="h-4 w-4" />
            <span>Explore Resume CV</span>
          </a>

          <a
            href="#contact"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold py-3.5 px-8 rounded-2xl text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Hire Me</span>
          </a>

          <button
            onClick={() => setShowQr(!showQr)}
            className="p-3 bg-slate-950 border border-slate-900 rounded-2xl text-slate-500 hover:text-white cursor-pointer"
            title="Share portfolio QR Code"
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>

        {showQr && (
          <div className="glass-panel p-4 rounded-3xl border border-slate-850 w-fit space-y-2 animate-premium-float mt-4">
            <QRCodeSVG
              value={window.location.href}
              size={128}
              bgColor="#0b0f19"
              fgColor="#ffffff"
              includeMargin
            />
            <span className="text-[10px] text-slate-500 font-bold block text-center font-mono">
              SCAN TO VISIT MOBILE
            </span>
          </div>
        )}
      </div>

      {/* Hero Image / Badge */}
      <div className="relative shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10 p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
        <img
          src={
            owner.profileImage ||
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400"
          }
          alt={owner.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </section>
  );
};

export default HeroSection;
