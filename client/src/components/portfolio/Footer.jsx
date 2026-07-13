import React from "react";
import { Link } from "react-router-dom";

const Footer = ({
  newsletterEmail,
  setNewsletterEmail,
  newsletterSuccess,
  setNewsletterSuccess,
}) => {
  return (
    <footer className="border-t border-slate-900/60 pt-12 space-y-6">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <h5 className="font-extrabold text-sm text-white font-sans">
            Subscribe to Newsletter
          </h5>
          <p className="text-[10px] text-slate-500 font-sans">
            Get periodic notifications on full-stack architecture updates.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl py-2 px-4 text-xs focus:outline-none w-full md:w-64 text-white font-sans"
            placeholder="name@example.com"
          />
          <button
            onClick={() => {
              if (newsletterEmail) setNewsletterSuccess(true);
            }}
            className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer font-sans"
          >
            Join
          </button>
        </div>
      </div>

      {newsletterSuccess && (
        <p className="text-center text-[10px] text-emerald-400 font-bold font-sans">
          ✔ Registered successfully for newsletter!
        </p>
      )}

      <div className="border-t border-slate-950 py-6 text-center text-[10px] text-slate-600 font-semibold uppercase tracking-wider font-sans">
        © {new Date().getFullYear()} Portfolio platform. All Rights Reserved. •{" "}
        <Link to="/login" className="hover:underline text-slate-500 font-sans">
          Admin Workspace
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
