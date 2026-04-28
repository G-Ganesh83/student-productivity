import { useEffect, useState } from "react";

const MOTIVATIONAL_QUOTES = [
  "Stay consistent, success follows.",
  "Small steps compound into big wins.",
  "Focus on the next minute, not the whole mountain.",
  "Deep work now, confidence later.",
  "Your future self is watching this effort.",
  "One focused session can change the whole day.",
  "Keep going. Clarity comes through action.",
  "Discipline is quiet, but its results are loud.",
];

const getRandomQuote = (currentQuote = "") => {
  const availableQuotes = MOTIVATIONAL_QUOTES.filter((quote) => quote !== currentQuote);
  const quotes = availableQuotes.length > 0 ? availableQuotes : MOTIVATIONAL_QUOTES;
  const randomIndex = Math.floor(Math.random() * quotes.length);

  return quotes[randomIndex];
};

function FocusMode({ error, isStopping = false, taskName, timer, onBack, onStop }) {
  const [quote, setQuote] = useState(() => getRandomQuote());
  const [theme, setTheme] = useState("light");
  const isDark = theme === "dark";

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setQuote((currentQuote) => getRandomQuote(currentQuote));
    }, 30 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <main
      className={`relative flex h-screen w-full items-center justify-center overflow-hidden font-ui transition-colors duration-300 ${
        isDark
          ? "bg-[#0B0F14] text-[#E5E7EB]"
          : "bg-[radial-gradient(circle_at_center,#E0F2FE_0%,#F8FBFF_42%,#EEF6FF_100%)] text-slate-900"
      }`}
    >
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-300 ${
          isDark ? "bg-sky-500/20" : "bg-sky-300/30"
        }`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onBack}
        className={`absolute left-5 top-5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
          isDark
            ? "border border-slate-700 bg-[#111827]/80 text-slate-200 hover:bg-slate-800"
            : "border border-sky-100 bg-white/80 text-slate-700 shadow-sm shadow-sky-100/80 hover:bg-white"
        }`}
      >
        ← Back to Tasks
      </button>

      <button
        type="button"
        onClick={() => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"))}
        className={`absolute right-5 top-5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
          isDark
            ? "border border-slate-700 bg-[#111827]/80 text-[#E5E7EB] hover:bg-slate-800"
            : "border border-sky-100 bg-white/80 text-slate-700 shadow-sm shadow-sky-100/80 hover:bg-white"
        }`}
      >
        {isDark ? "Light" : "Dark"}
      </button>

      <div className="relative z-10 mx-auto flex w-full max-w-[500px] justify-center text-center">
        <section
          className="mx-auto flex w-full max-w-[500px] flex-col items-center justify-center gap-6 px-6 py-8 sm:px-8"
        >
          <div
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              isDark
                ? "border border-slate-700 bg-[#0B0F14] text-slate-300"
                : "border border-sky-100 bg-sky-50 text-slate-600"
            }`}
          >
            Focus Mode
          </div>

          <div className="space-y-2">
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Task
            </p>
            <h1
              className={`text-balance font-ui text-2xl font-semibold leading-tight sm:text-3xl ${
                isDark ? "text-[#E5E7EB]" : "text-slate-900"
              }`}
            >
              {taskName || "Untitled Task"}
            </h1>
          </div>

          <div className="relative flex justify-center py-2">
            <div
              className={`absolute inset-4 rounded-full blur-2xl ${
                isDark ? "bg-sky-400/20" : "bg-sky-300/30"
              }`}
              aria-hidden="true"
            />
            <div
              className={`relative flex aspect-square w-[min(68vw,16rem)] items-center justify-center rounded-full transition-all duration-200 ${
                isDark
                  ? "bg-[#0B0F14]/90 shadow-[0_0_56px_rgba(56,189,248,0.18)] ring-1 ring-slate-700"
                  : "bg-sky-50 shadow-[0_24px_70px_-36px_rgba(14,165,233,0.55)] ring-1 ring-sky-100"
              }`}
            >
              <div
                className={`absolute inset-3 rounded-full border ${
                  isDark ? "border-sky-400/20" : "border-sky-200"
                }`}
              />
              <div
                className={`absolute inset-0 rounded-full animate-pulse ${
                  isDark
                    ? "shadow-[0_0_70px_rgba(56,189,248,0.18)]"
                    : "shadow-[0_0_70px_rgba(14,165,233,0.22)]"
                }`}
              />
              <div
                className={`absolute inset-6 rounded-full border-4 border-t-transparent ${
                  isDark ? "border-sky-400/70" : "border-sky-500/80"
                }`}
              />
              <p
                className={`relative z-10 animate-pulse font-ui text-5xl font-semibold leading-none tracking-normal sm:text-6xl ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                {timer || "00:00"}
              </p>
            </div>
          </div>

          <p className={`mx-auto max-w-sm text-sm leading-6 sm:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            {quote}
          </p>

          {error ? (
            <p
              className={`mx-auto mt-6 max-w-md rounded-2xl px-4 py-3 text-sm font-medium ${
                isDark
                  ? "border border-red-300/20 bg-red-500/10 text-red-100"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onStop}
            disabled={isStopping}
            className="inline-flex items-center justify-center rounded-full border border-red-300/20 bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition-all duration-200 hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300/20 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isStopping ? "Stopping..." : "Stop Session"}
          </button>
        </section>
      </div>
    </main>
  );
}

export default FocusMode;
