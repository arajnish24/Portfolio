import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, Calendar, ShieldCheck, Download, ExternalLink, FileText } from 'lucide-react';

const CertificateDetailsPage = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/collections/certificates/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Certificate not found');
        return res.json();
      })
      .then((data) => {
        if (data.certificate) {
          setCertificate(data.certificate);
        } else {
          throw new Error('Certificate data missing');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b11] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading Certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-[#080b11] flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl border border-slate-900 text-center max-w-md space-y-4">
          <Award className="h-12 w-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-white">Verification Error</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{error || 'The requested certificate could not be retrieved.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  const isPdf = certificate.image && certificate.image.toLowerCase().endsWith('.pdf');

  return (
    <div className="min-h-screen bg-[#080b11] py-12 px-6">
      <div className="container mx-auto max-w-5xl space-y-8">
        
        {/* Back navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Certificate Metadata Card */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-900 grid md:grid-cols-3 gap-8 items-center">
          
          <div className="md:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-950/40 text-blue-400 border border-blue-900/60 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-inner">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Credential</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {certificate.title}
              </h1>
              <p className="text-sm text-blue-400 font-bold">
                Issued by {certificate.organization}
              </p>
            </div>

            {certificate.date && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span>Issued date: {certificate.date}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-1 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
            {certificate.image && (
              <a
                href={certificate.image}
                download
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/10 cursor-pointer text-center"
              >
                <Download className="h-4 w-4" />
                <span>Download Document</span>
              </a>
            )}
            {certificate.image && (
              <a
                href={certificate.image}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in Raw Format</span>
              </a>
            )}
          </div>

        </div>

        {/* Certificate Rendering Container */}
        <div className="glass-panel p-4 md:p-6 rounded-3xl border border-slate-900 overflow-hidden shadow-2xl">
          <div className="bg-slate-950 rounded-2xl border border-slate-900/60 p-4 md:p-8 flex items-center justify-center min-h-[400px]">
            {certificate.image ? (
              isPdf ? (
                <iframe
                  src={certificate.image}
                  className="w-full h-[650px] border-0 rounded-xl"
                  title="Certificate PDF Viewer"
                />
              ) : (
                <div className="relative group max-w-3xl mx-auto">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="max-h-[600px] w-auto object-contain rounded-xl shadow-2xl border border-slate-900"
                  />
                </div>
              )
            ) : (
              <div className="text-center space-y-3 p-8 text-slate-500 max-w-sm">
                <FileText className="h-10 w-10 mx-auto text-slate-700 animate-pulse" />
                <h4 className="font-extrabold text-sm text-slate-400">No Attachment Available</h4>
                <p className="text-xs leading-relaxed">This certification record contains verification metadata, but no document preview has been uploaded by the administrator.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateDetailsPage;
