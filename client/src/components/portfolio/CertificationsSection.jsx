import React from "react";
import { Link } from "react-router-dom";
import { Award, FileText } from "lucide-react";

const CertificationsSection = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section
      id="certificates"
      className="container mx-auto px-6 max-w-7xl space-y-10"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Licenses & <span className="text-premium-gradient">Certifications</span>
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          Verified credentials and professional certifications
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, idx) => (
          <Link
            key={idx}
            to={`/certificates/${cert._id}`}
            target="_blank"
            className="glass-panel p-6 rounded-2xl border border-slate-900 flex items-start gap-4 hover:border-slate-800 hover:bg-slate-900/15 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer text-left"
          >
            <div className="w-14 h-14 bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center group-hover:border-slate-800 transition-colors">
              {cert.image && !cert.image.toLowerCase().endsWith(".pdf") ? (
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
              ) : cert.image && cert.image.toLowerCase().endsWith(".pdf") ? (
                <FileText className="h-7 w-7 text-blue-500/80 group-hover:text-blue-400 transition-colors" />
              ) : (
                <Award className="h-7 w-7 text-blue-500/80 group-hover:text-blue-400 transition-colors" />
              )}
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors truncate font-sans">
                {cert.title}
              </h3>
              <p className="text-xs text-blue-400 font-semibold font-sans">
                {cert.organization}
              </p>
              {cert.date && (
                <p className="text-[10px] text-slate-500 font-medium font-sans">
                  Issued {cert.date}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CertificationsSection;
