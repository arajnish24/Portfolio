import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  Code,
  Download,
  Printer,
} from "lucide-react";

const ResumePrintPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio/owner")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="text-center py-20 text-xs text-slate-500">
        Loading CV details...
      </div>
    );
  if (!data)
    return (
      <div className="text-center py-20 text-xs text-slate-500">
        Owner not found.
      </div>
    );

  const { owner, skills, experiences, educations, certificates } = data;

  return (
    <div className="min-h-screen bg-[#080b11] text-white print:bg-white print:text-black">
      {/* Control panel - hidden during printing */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 flex items-center justify-between max-w-7xl mx-auto rounded-b-2xl print:hidden">
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-sm text-white">
            ATS-Optimized CV Layout
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold">
            Press "Print CV" to download or export as PDF.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
        >
          <Printer className="h-4 w-4" />
          <span>Print CV</span>
        </button>
      </div>

      {/* Main CV layout container */}
      <div className="container mx-auto px-6 py-12 max-w-4xl bg-slate-950 border border-slate-900 print:border-0 rounded-3xl print:rounded-none shadow-2xl space-y-8 print:p-0 print:my-0 print:bg-white print:text-black mt-6">
        {/* CV Header */}
        <div className="text-center border-b border-slate-900 print:border-slate-200 pb-6 space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight uppercase print:text-black">
            {owner.name}
          </h2>
          <p className="text-sm text-blue-400 font-bold uppercase tracking-wider print:text-blue-700">
            {owner.profession}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-semibold print:text-slate-600">
            {owner.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-500" /> {owner.email}
              </span>
            )}
            {owner.contactDetails?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-500" />{" "}
                {owner.contactDetails.phone}
              </span>
            )}
            {owner.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />{" "}
                {owner.location}
              </span>
            )}
            {owner.contactDetails?.github && (
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-slate-500" /> github.com/
                {owner.contactDetails.github}
              </span>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-900/60 print:border-slate-200 print:text-blue-700 pb-1 flex items-center gap-1.5">
            <span>Summary Profile</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light print:text-slate-700">
            {owner.bio}
          </p>
        </div>

        {/* CV Body Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column Left: Timelines */}
          <div className="md:col-span-2 space-y-6">
            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-900/60 print:border-slate-200 print:text-blue-700 pb-1 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>Work Experience</span>
              </h3>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp._id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white print:text-black">
                        {exp.position}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {exp.joiningDate} - {exp.leavingDate}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-400 font-semibold print:text-blue-700">
                      {exp.company} — {exp.location}
                    </p>

                    <ul className="list-disc list-inside text-[11px] text-slate-400 leading-relaxed font-light print:text-slate-600 space-y-0.5 pl-1">
                      {exp.responsibilities?.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-900/60 print:border-slate-200 print:text-blue-700 pb-1 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>Education Timeline</span>
              </h3>

              <div className="space-y-3">
                {educations.map((edu) => (
                  <div key={edu._id} className="text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-white print:text-black">
                        {edu.degree}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {edu.duration}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 print:text-slate-600">
                      {edu.college}
                    </p>
                    {(edu.cgpa || edu.percentage) && (
                      <span className="text-[10px] text-blue-400 font-semibold font-mono print:text-blue-700">
                        Grade:{" "}
                        {edu.cgpa ? `${edu.cgpa} CGPA` : `${edu.percentage}%`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column Right: Skills & Certs */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-900/60 print:border-slate-200 print:text-blue-700 pb-1 flex items-center gap-1.5">
                <Code className="h-4 w-4" />
                <span>Technical Skills</span>
              </h3>

              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill._id} className="text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300 print:text-slate-800">
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 print:bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 border-b border-slate-900/60 print:border-slate-200 print:text-blue-700 pb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>Certifications</span>
              </h3>

              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert._id} className="text-xs">
                    <p className="font-bold text-white print:text-black">
                      {cert.title}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {cert.organization} — {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePrintPage;
