import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import LoginPage from './pages/LoginPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CertificateDetailsPage from './pages/CertificateDetailsPage';
import DashboardPage from './pages/DashboardPage';
import BlogsListPage from './pages/BlogsListPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import ResumePrintPage from './pages/ResumePrintPage';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans bg-[#080b11] text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<PublicPortfolioPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/certificates/:id" element={<CertificateDetailsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/blogs" element={<BlogsListPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
            <Route path="/print-cv" element={<ResumePrintPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;
