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
      <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-slate-200/60 bg-white/70 shadow-[0_20px_35px_-28px_rgba(15,23,42,0.35)] backdrop-blur-md md:rounded-full">
        <div className="grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-5 md:min-h-[4.5rem] md:gap-4 md:px-6">
          <BrandLogo
            to="/"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
            className="min-w-0"
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
            className="justify-self-end rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:text-slate-900 md:hidden"
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
          <div className="border-t border-slate-200/70 px-4 pb-4 pt-3 sm:px-5 md:hidden">
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileNavOpen(false)}
                className="font-ui block rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Home
              </Link>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className="font-ui block rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-200/70 pt-4">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileNavOpen(false)}
                className="font-ui inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Open App
              </Link>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    logout();
                  }}
                  className="font-ui min-h-[46px] rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="font-ui inline-flex min-h-[46px] items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600"
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
