import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#collaboration", label: "Collaboration" },
  { href: "#tech", label: "Tech Stack" },
];

function Navbar({
  isAuthenticated,
  userName,
  logout,
  isMobileNavOpen,
  setIsMobileNavOpen,
}) {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-full border border-slate-200/60 bg-white/60 shadow-[0_20px_35px_-28px_rgba(15,23,42,0.35)] backdrop-blur-md">
        <div className="grid min-h-[4.5rem] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-6">
          <BrandLogo
            to="/"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
          />

          <nav className="hidden items-center justify-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-ui text-sm font-medium text-slate-500 transition duration-200 hover:scale-[1.02] hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <>
                <span className="font-ui text-sm font-medium text-slate-500">{userName}</span>
                <button
                  onClick={logout}
                  className="font-ui text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                  Sign out
                </button>
              </>
            ) : null}

            <Link
              to="/dashboard"
              className="font-ui inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-button transition duration-200 hover:scale-[1.02] hover:bg-slate-800"
            >
              Open App
            </Link>
          </div>

          <button
            className="justify-self-end rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:text-slate-900 md:hidden"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileNavOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {isMobileNavOpen ? (
          <div className="border-t border-slate-200/70 px-5 pb-5 pt-4 md:hidden">
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-ui block rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-200/70 pt-4">
              <Link
                to="/dashboard"
                className="font-ui inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Open App
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="font-ui rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="font-ui inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
