import React from "react";
import { Share2, Copy, Check, Mail } from "lucide-react";

const ShareModal = ({
  sharingProject,
  setSharingProject,
  copied,
  handleCopyLink,
}) => {
  if (!sharingProject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-6">
      <div className="glass-panel p-6 max-w-md w-full rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-premium-float text-white relative">
        <button
          onClick={() => setSharingProject(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
        >
          &times;
        </button>

        <div className="space-y-1.5 text-center">
          <Share2 className="h-8 w-8 text-blue-400 mx-auto" />
          <h4 className="font-extrabold text-base text-white uppercase tracking-wide font-sans">
            Share Project
          </h4>
          <p className="text-xs text-slate-400 font-semibold font-sans">
            {sharingProject.title}
          </p>
        </div>

        {/* Copy Link Section */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-sans">
            Direct Project URL
          </span>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 p-2.5 rounded-xl">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/projects/${sharingProject._id}`}
              className="bg-transparent text-xs text-slate-300 font-mono focus:outline-none flex-1 truncate select-all"
            />
            <button
              onClick={() => handleCopyLink(sharingProject._id)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 rounded-lg transition-all flex items-center gap-1 text-[10px] cursor-pointer font-sans shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-sans">
            Share via Social Channels
          </span>
          <div className="grid grid-cols-3 gap-3">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Check out this project: ${sharingProject.title} - ${window.location.origin}/projects/${sharingProject._id}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-900/40 hover:border-emerald-800/80 rounded-2xl transition-all group cursor-pointer"
            >
              <span className="text-emerald-400 group-hover:scale-110 transition-transform">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.641-1.024-5.122-2.887-6.986-1.864-1.864-4.348-2.89-6.99-2.891-5.45 0-9.88 4.417-9.883 9.87-.001 1.93.502 3.81 1.457 5.429l-.982 3.585 3.676-.964zm10.702-7.077c-.293-.147-1.737-.857-2.004-.954-.268-.099-.463-.147-.659.147-.196.293-.757.954-.928 1.15-.171.195-.341.219-.634.073-.293-.147-1.238-.456-2.36-1.456-.872-.777-1.46-1.738-1.631-2.031-.171-.293-.018-.452.129-.597.132-.131.293-.341.44-.512.146-.171.195-.293.293-.488.098-.195.049-.366-.024-.512-.073-.147-.659-1.585-.902-2.17-.237-.574-.479-.496-.659-.505-.171-.007-.366-.008-.561-.008-.195 0-.512.073-.78.366-.268.293-1.024 1.001-1.024 2.44 0 1.439 1.049 2.83 1.195 3.025.147.195 2.062 3.149 4.996 4.413.698.301 1.244.481 1.667.615.7.222 1.339.19 1.843.115.56-.083 1.737-.708 1.982-1.391.244-.683.244-1.268.171-1.39-.073-.122-.268-.195-.561-.342z" />
                </svg>
              </span>
              <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors font-sans">
                WhatsApp
              </span>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(
                `${window.location.origin}/projects/${sharingProject._id}`
              )}&text=${encodeURIComponent(`Check out this project: ${sharingProject.title}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 bg-sky-950/20 hover:bg-sky-950/40 border border-sky-900/40 hover:border-sky-800/80 rounded-2xl transition-all group cursor-pointer"
            >
              <span className="text-sky-400 group-hover:scale-110 transition-transform">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0C5.352 0 0 5.344 0 11.928c0 6.584 5.352 11.928 11.944 11.928 6.593 0 11.944-5.344 11.944-11.928C23.888 5.344 18.537 0 11.944 0zm5.496 7.424c.176.88-.352 4.144-1.04 7.392-.28 1.312-.96 1.76-1.424 1.808-1.008.096-1.776-.656-2.752-1.296-1.52-1.008-2.384-1.632-3.856-2.608-1.712-1.12-.608-1.744.368-2.752.256-.256 4.704-4.304 4.784-4.656.008-.048.016-.24-.096-.336-.112-.096-.288-.064-.416-.032-.176.048-2.992 1.904-8.448 5.584-.8.544-1.52.8-2.176.784-.72-.016-2.112-.416-3.136-.752-1.264-.416-2.272-.64-2.176-1.36.048-.368.56-.752 1.52-1.136 5.92-2.576 9.872-4.272 11.856-5.104 5.648-2.352 6.816-2.768 7.584-2.784.168 0 .552.04.8.24.208.168.264.4.28.576z" />
                </svg>
              </span>
              <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors font-sans">
                Telegram
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `${window.location.origin}/projects/${sharingProject._id}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 bg-blue-950/20 hover:bg-blue-950/40 border border-blue-900/40 hover:border-blue-800/80 rounded-2xl transition-all group cursor-pointer"
            >
              <span className="text-blue-400 group-hover:scale-110 transition-transform">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </span>
              <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors font-sans">
                LinkedIn
              </span>
            </a>

            {/* Naukri.com */}
            <a
              href="https://www.naukri.com/mnjuser/homepage"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleCopyLink(sharingProject._id)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-900/40 hover:border-amber-800/80 rounded-2xl transition-all group cursor-pointer text-center"
              title="Copies link and opens Naukri page to add to your profile"
            >
              <span className="text-amber-400 group-hover:scale-110 transition-transform font-bold text-xs tracking-tighter bg-amber-950/80 border border-amber-900 h-5 w-5 rounded-full flex items-center justify-center font-sans">
                N
              </span>
              <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors font-sans">
                Naukri.com
              </span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                `${window.location.origin}/projects/${sharingProject._id}`
              )}&text=${encodeURIComponent(`Check out this project: ${sharingProject.title}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all group cursor-pointer"
            >
              <span className="text-white group-hover:scale-110 transition-transform">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
              <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors font-sans">
                X / Twitter
              </span>
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(
                `Project Showcase: ${sharingProject.title}`
              )}&body=${encodeURIComponent(
                `Take a look at this project on my portfolio website: ${window.location.origin}/projects/${sharingProject._id}`
              )}`}
              className="flex flex-col items-center gap-1.5 p-3 bg-purple-950/20 hover:bg-purple-950/40 border border-purple-900/40 hover:border-purple-800/80 rounded-2xl transition-all group cursor-pointer"
            >
              <span className="text-purple-400 group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5" />
              </span>
              <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition-colors font-sans">
                Email
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
