import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

function LandingLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-button">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gradient-brand">StudyHub</span>
            </Link>

            {/* Desktop Nav links */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="#features" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                Features
              </a>
              <a href="#tech" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                Tech Stack
              </a>
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
              <Link to="/dashboard">
                <button className="gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all duration-200">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label="Toggle navigation"
            >
              {isMobileNavOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile nav dropdown */}
          {isMobileNavOpen && (
            <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
              <a href="#features" className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">Features</a>
              <a href="#tech" className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">Tech Stack</a>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/dashboard" className="block text-center text-sm font-semibold text-slate-700 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50">Sign In</Link>
                <Link to="/dashboard" className="block text-center text-sm font-semibold text-white py-2.5 rounded-xl gradient-brand shadow-button">Get Started Free</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <Outlet />

      {/* ─── Footer ──────────────────────────── */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-lg font-bold">StudyHub</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Empowering students to collaborate, stay organized, and achieve more — together.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2.5">
                <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5">
                <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2026 StudyHub. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingLayout;
