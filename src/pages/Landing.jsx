import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Productivity",
    description: "Organize your tasks, set priorities, and track your progress. Stay on top of assignments and deadlines with an intuitive task management system.",
    gradient: "from-brand-500 to-violet-500",
    bg: "from-brand-50 to-violet-50",
    border: "border-brand-100",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Collaboration",
    description: "Work together in real-time with a shared code editor, terminal, and integrated chat. Perfect for group projects and study sessions.",
    gradient: "from-sky-500 to-cyan-500",
    bg: "from-sky-50 to-cyan-50",
    border: "border-sky-100",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Resources",
    description: "Store and organize your study materials, notes, PDFs, and links. Everything you need, accessible from anywhere, anytime.",
    gradient: "from-emerald-500 to-teal-500",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-100",
  },
];

const COLLAB_FEATURES = [
  "Shared code editor with syntax highlighting",
  "Integrated terminal for running code",
  "Real-time chat and voice controls",
  "See who's online and active",
];

const TECH = [
  { name: "React 19", sub: "UI Framework" },
  { name: "Vite", sub: "Build Tool" },
  { name: "Tailwind CSS", sub: "Styling" },
  { name: "JavaScript", sub: "Language" },
];

const STATS = [
  { value: "10K+", label: "Active Students" },
  { value: "50K+", label: "Tasks Completed" },
  { value: "5K+", label: "Collab Rooms" },
];

function Landing() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ─────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-white via-brand-50/40 to-violet-50/50 py-24 lg:py-32 overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-200/30 to-violet-200/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-200/30 to-cyan-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-8">
            <span className="w-2 h-2 rounded-full gradient-brand" />
            <span className="text-sm font-semibold text-brand-700">Built for Students, By Students</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
            <span className="text-slate-900">Study Smarter,</span>
            <br />
            <span className="text-gradient-brand">Not Harder</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform for college students to manage tasks, collaborate on projects,
            and access learning resources — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/dashboard">
              <button className="gradient-brand text-white font-bold px-8 py-3.5 rounded-xl text-base shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all duration-200">
                Get Started Free →
              </button>
            </Link>
            <a href="#features">
              <button className="bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-xl text-base border border-slate-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                See Features
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gradient-brand">{s.value}</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600 mb-3">Features</p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-500">
              Powerful tools designed specifically for student productivity and collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`relative group bg-gradient-to-br ${f.bg} border ${f.border} rounded-2xl p-8 hover-lift overflow-hidden transition-all duration-200`}
              >
                <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${f.gradient} opacity-[0.07] rounded-full`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-button mb-6 group-hover:scale-105 transition-transform duration-200`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Collaboration Preview ─────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-brand-600 mb-4">Collaboration</p>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-5">
                Real-Time Collaboration,
                <br />
                <span className="text-gradient-brand">Made Simple</span>
              </h2>
              <p className="text-lg text-slate-500 mb-8">
                Code together, share terminals, and communicate seamlessly. Our collaboration
                rooms bring everything you need for group work into one unified interface.
              </p>
              <ul className="space-y-4">
                {COLLAB_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full gradient-success flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link to="/collaboration">
                  <button className="gradient-brand text-white font-bold px-6 py-3 rounded-xl shadow-button hover:shadow-button-hover hover:-translate-y-0.5 transition-all duration-200 text-sm">
                    Try Collaboration →
                  </button>
                </Link>
              </div>
            </div>

            {/* Right preview card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-200/30 to-violet-200/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-panel border border-slate-100 p-6 overflow-hidden">
                {/* Window header */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs font-semibold text-slate-400">main.js — StudyHub Room</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full pulse-dot" />
                    <span className="text-[11px] font-bold text-emerald-700">3 online</span>
                  </div>
                </div>

                {/* Code block */}
                <div className="bg-[#1e1e2e] rounded-xl p-5 font-mono text-sm mb-4">
                  <div className="text-[#6272a4] mb-2 text-xs">// Collaboration room — shared editor</div>
                  <div>
                    <span className="text-[#ff79c6]">function </span>
                    <span className="text-[#50fa7b]">greet</span>
                    <span className="text-[#f8f8f2]">(</span>
                    <span className="text-[#ffb86c]">name</span>
                    <span className="text-[#f8f8f2]">) {"{"}</span>
                  </div>
                  <div className="ml-5">
                    <span className="text-[#ff79c6]">return </span>
                    <span className="text-[#f1fa8c]">{"`Hello, ${name}!`"}</span>
                    <span className="text-[#f8f8f2]">;</span>
                  </div>
                  <div className="text-[#f8f8f2]">{"}"}</div>
                </div>

                {/* Terminal */}
                <div className="bg-[#0c0c0c] rounded-xl px-4 py-3 font-mono text-xs">
                  <span className="text-[#0dbc79]">➜</span>
                  <span className="text-[#e06c75] ml-2">~</span>
                  <span className="text-[#61afef] ml-1">$</span>
                  <span className="text-[#abb2bf] ml-2">node main.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ──────────────────────── */}
      <section id="tech" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600 mb-3">Technology</p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Built with Modern Tech
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TECH.map((t) => (
              <div key={t.name} className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-card text-center hover-lift transition-all duration-200">
                <p className="text-base font-bold text-gradient-brand mb-1 group-hover:scale-105 transition-transform inline-block">{t.name}</p>
                <p className="text-xs text-slate-500 font-medium">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────── */}
      <section className="py-24 gradient-brand relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-lg text-brand-100 mb-10 leading-relaxed">
            Join thousands of students who are already using StudyHub to stay
            organized and collaborate effectively.
          </p>
          <Link to="/dashboard">
            <button className="bg-white text-brand-700 font-bold px-10 py-4 rounded-xl text-base shadow-2xl hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200">
              Start Free Trial →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
