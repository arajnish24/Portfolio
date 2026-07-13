import React from "react";
import { Send } from "lucide-react";

const ContactSection = ({
  contactForm,
  setContactForm,
  contactStatus,
  contactError,
  handleContactSubmit,
}) => {
  return (
    <section id="contact" className="container mx-auto px-6 max-w-3xl space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight font-sans">
          Get In <span className="text-premium-gradient font-sans">Touch</span>
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          Submit the contact form to trigger simulated secure confirmations
        </p>
      </div>

      <form
        onSubmit={handleContactSubmit}
        className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-850 space-y-4"
      >
        {contactStatus === "success" && (
          <div className="p-4 bg-emerald-950/40 text-emerald-400 border border-emerald-900 rounded-xl text-xs font-semibold font-sans">
            ✔ Message submitted successfully! Secure email confirmation alert has been logged in console.
          </div>
        )}
        {contactStatus === "error" && (
          <div className="p-4 bg-rose-950/40 text-rose-300 border border-rose-900 rounded-xl text-xs font-semibold space-y-1 font-sans">
            <p>❌ Submission failed. Please try again.</p>
            {contactError && (
              <p className="text-[10px] text-rose-400 font-normal">
                {contactError}
              </p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            value={contactForm.name}
            onChange={(e) =>
              setContactForm({ ...contactForm, name: e.target.value })
            }
            className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none text-white font-sans"
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={contactForm.email}
            onChange={(e) =>
              setContactForm({ ...contactForm, email: e.target.value })
            }
            className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none text-white font-sans"
            placeholder="Email"
            required
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="tel"
            value={contactForm.phone}
            onChange={(e) =>
              setContactForm({ ...contactForm, phone: e.target.value })
            }
            className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none text-white font-sans"
            placeholder="Mobile Number"
          />
          <input
            type="text"
            value={contactForm.subject}
            onChange={(e) =>
              setContactForm({ ...contactForm, subject: e.target.value })
            }
            className="bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none text-white font-sans"
            placeholder="Subject"
          />
        </div>
        <textarea
          rows={4}
          value={contactForm.message}
          onChange={(e) =>
            setContactForm({ ...contactForm, message: e.target.value })
          }
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-xs focus:outline-none resize-none text-white font-sans"
          placeholder="Write message details..."
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={contactStatus === "submitting"}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 px-8 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 font-sans"
          >
            <span>
              {contactStatus === "submitting" ? "Submitting..." : "Send Message"}
            </span>
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactSection;
