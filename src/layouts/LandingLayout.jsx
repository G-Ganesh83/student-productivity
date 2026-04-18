import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/BrandLogo";
import Navbar from "../components/Navbar";

function LandingLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar
        isAuthenticated={isAuthenticated}
        userName={user?.name || initials}
        logout={logout}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
      />

      <Outlet />

      {/* ─── Footer ──────────────────────────── */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <BrandLogo to="/" />
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
            <p className="text-sm text-slate-500">© 2026 LEARN EASY. All rights reserved.</p>
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
