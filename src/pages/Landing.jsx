import { Link } from "react-router-dom";
import Hero from "../components/Hero";

const FLOATING_CARDS = [
  {
    title: "Task Planner",
    description: "Organize your day",
    position: "-left-2 top-24",
    animationClass: "float-card",
  },
  {
    title: "Live Code Rooms",
    description: "Code together instantly",
    position: "right-0 top-10",
    animationClass: "float-card float-card-delay",
  },
  {
    title: "Shared Resources",
    description: "All notes in one place",
    position: "bottom-6 right-12",
    animationClass: "float-card float-card-slow",
  },
];

const FEATURES = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h11M9 12h11M9 18h11M5 6h.01M5 12h.01M5 18h.01" />
      </svg>
    ),
    number: "01",
    title: "Productivity",
    description: "Track assignments, deadlines, and weekly priorities with a planner that keeps student work visible and calm.",
    iconBox: "bg-sky-50 text-sky-700",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m10 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0H7" />
      </svg>
    ),
    number: "02",
    title: "Collaboration Rooms",
    description: "Open focused rooms for pair programming, debugging, and discussions with live code, chat, and presence signals.",
    iconBox: "bg-indigo-50 text-indigo-700",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5v11m0-11c-1.2-.84-2.57-1.25-4.1-1.25C6.15 5.25 4.58 5.66 3.4 6.5v11c1.18-.84 2.75-1.25 4.5-1.25 1.53 0 2.9.41 4.1 1.25m0-11c1.2-.84 2.57-1.25 4.1-1.25 1.75 0 3.32.41 4.5 1.25v11c-1.18-.84-2.75-1.25-4.5-1.25-1.53 0-2.9.41-4.1 1.25" />
      </svg>
    ),
    number: "03",
    title: "Resources",
    description: "Keep notes, links, PDFs, and supporting material together so study sessions stay streamlined instead of scattered.",
    iconBox: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414 1.414m0 0A9 9 0 105.636 18.364m11.314-11.314L12 12" />
      </svg>
    ),
    number: "04",
    title: "Guidance & Settings",
    description: "Built-in help and simple account settings make the workspace feel complete and easier to navigate confidently.",
    iconBox: "bg-amber-50 text-amber-700",
  },
];

const COLLAB_FEATURES = [
  "Shared editor with live cursors and synced code changes",
  "Built-in room chat for quick decisions and explanations",
  "Presence indicators to see who is active right now",
  "Instant output feedback for testing ideas together",
];

const TECH = [
  { badge: "Frontend", badgeClass: "bg-sky-50 text-sky-700", name: "React 19", sub: "Fast interface and smooth state updates" },
  { badge: "Backend", badgeClass: "bg-indigo-50 text-indigo-700", name: "Node.js + Express", sub: "Reliable APIs and room orchestration" },
  { badge: "Database", badgeClass: "bg-emerald-50 text-emerald-700", name: "MongoDB", sub: "Flexible storage for users, tasks, and rooms" },
  { badge: "Realtime", badgeClass: "bg-slate-100 text-slate-700", name: "Socket.IO", sub: "Instant collaboration events and room sync" },
];

const CTA_LINKS = [
  {
    title: "Start planning",
    description: "Organize coursework and deadlines.",
    to: "/productivity",
  },
  {
    title: "Explore resources",
    description: "Keep notes and useful references together.",
    to: "/resources",
  },
  {
    title: "Open help",
    description: "Get quick guidance across the product.",
    to: "/help",
  },
];

function Landing() {
  return (
    <div className="overflow-x-hidden bg-[#F8FAFC] text-slate-900">
      <Hero floatingCards={FLOATING_CARDS} />

      <section className="bg-[#F8FAFC] pb-18 pt-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-ui text-sm font-medium text-slate-300">main.py — LEARN EASY Room #A3F9</span>
              </div>
              <div className="rounded-full border border-emerald-900 bg-emerald-950/70 px-3 py-1 text-xs font-ui font-semibold text-emerald-300">
                3 online
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.55fr)_320px]">
              <div className="border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
                <div className="grid grid-cols-[52px_minmax(0,1fr)] px-4 py-5 font-mono text-[0.94rem] leading-8 sm:px-6">
                  <div className="select-none border-r border-white/10 pr-4 text-right text-slate-500">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                    <div>9</div>
                    <div>10</div>
                  </div>
                  <div className="overflow-x-auto pl-4 text-slate-100">
                    <div><span className="text-violet-300">def</span> <span className="text-sky-300">find_max</span>(scores):</div>
                    <div>    best = scores[<span className="text-amber-300">0</span>]</div>
                    <div>    <span className="text-violet-300">for</span> score <span className="text-violet-300">in</span> scores[<span className="text-amber-300">1</span>:]:</div>
                    <div>        <span className="text-violet-300">if</span> score &gt; best:</div>
                    <div>            best = score</div>
                    <div>    <span className="text-violet-300">return</span> best</div>
                    <div><span className="text-slate-500"># Weekly quiz scores from the room</span></div>
                    <div>marks = [<span className="text-amber-300">72</span>, <span className="text-amber-300">88</span>, <span className="text-amber-300">91</span>, <span className="text-amber-300">84</span>]</div>
                    <div>highest = <span className="text-sky-300">find_max</span>(marks)</div>
                    <div><span className="text-sky-300">print</span>(<span className="text-emerald-300">"Highest score:"</span>, highest)</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-slate-900/70">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="font-ui text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Team Chat</p>
                </div>
                <div className="flex-1 space-y-4 px-5 py-5 text-sm">
                  <div className="max-w-[88%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="mb-1 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sky-300">Priya</p>
                    <p className="text-slate-200">Let&apos;s keep the example simple so everyone in the room can follow it fast.</p>
                  </div>
                  <div className="ml-auto max-w-[88%] rounded-2xl border border-sky-900/60 bg-sky-500/10 px-4 py-3">
                    <p className="mb-1 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sky-300">Arjun</p>
                    <p className="text-slate-100">Perfect. I&apos;ll explain the loop while you run the output.</p>
                  </div>
                  <div className="max-w-[88%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="mb-1 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-300">You</p>
                    <p className="text-slate-200">Done. We can keep using this room for the next problem set too.</p>
                  </div>
                </div>
                <div className="border-t border-white/10 bg-black/30 px-5 py-4 font-mono text-sm text-emerald-300">
                  &gt; Highest score: 91
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-slate-200/80 bg-[#F8FAFC] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-[34rem]">
            <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-700">What&apos;s inside</p>
            <h2 className="mt-4 max-w-[10ch] font-display text-4xl leading-[0.95] tracking-[-0.04em] text-slate-900 sm:text-5xl">
              Core modules. One focused platform.
            </h2>
            <p className="mt-5 text-[1.02rem] leading-8 text-slate-500">
              Everything is designed to reduce tool-switching and keep the student workflow calm, quick, and collaborative.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-200/70">
            <div className="grid gap-px lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <article key={feature.title} className="bg-white px-6 py-8 sm:px-8">
                  <div className="font-display text-[3.4rem] leading-none tracking-[-0.05em] text-slate-200">
                    {feature.number}
                  </div>
                  <div className={`mt-8 flex h-11 w-11 items-center justify-center rounded-2xl ${feature.iconBox}`}>
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 font-ui text-xl font-semibold tracking-[-0.02em] text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-700">Explore faster</p>
              <h2 className="mt-3 font-display text-3xl leading-tight tracking-[-0.03em] text-slate-900 sm:text-4xl">
                Jump straight into the part of the product you need.
              </h2>
            </div>
            <Link
              to="/register"
              className="font-ui inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950"
            >
              Create account
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {CTA_LINKS.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50/70 p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-ui text-lg font-semibold tracking-[-0.02em] text-slate-900">{item.title}</h3>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-500">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="collaboration" className="bg-slate-950 py-20 text-white lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:px-8">
          <div className="max-w-[34rem]">
            <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-300/90">Collaboration</p>
            <h2 className="mt-4 font-display text-4xl leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl">
              Code together, share context, move faster.
            </h2>
            <p className="mt-5 text-[1.02rem] leading-8 text-slate-300">
              LEARN EASY is built for problem-solving sessions, pair programming, and project teamwork without the mess of scattered tools.
            </p>

            <ul className="mt-10 space-y-4">
              {COLLAB_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                  </span>
                  <span className="text-sm leading-7 text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                to="/collaboration"
                className="font-ui inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white hover:text-slate-950"
              >
                Explore collaboration
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-36px_rgba(14,165,233,0.25)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex -space-x-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-950 bg-sky-200 text-sm font-ui font-semibold text-slate-950">P</div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-950 bg-indigo-200 text-sm font-ui font-semibold text-slate-950">A</div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-950 bg-emerald-200 text-sm font-ui font-semibold text-slate-950">R</div>
              </div>
              <div className="text-right">
                <p className="font-ui text-sm font-semibold text-white">3 members editing</p>
                <span className="mt-2 inline-flex rounded-full border border-emerald-900 bg-emerald-950/70 px-3 py-1 font-ui text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Live
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-[1.25rem] border border-white/10 bg-black/20 p-5 font-mono text-sm">
              <div><span className="text-violet-300">def</span> <span className="text-sky-300">bubble_sort</span>(arr):</div>
              <div>    <span className="text-violet-300">for</span> i <span className="text-violet-300">in</span> <span className="text-sky-300">range</span>(<span className="text-sky-300">len</span>(arr)):</div>
              <div>        <span className="text-violet-300">for</span> j <span className="text-violet-300">in</span> <span className="text-sky-300">range</span>(<span className="text-sky-300">len</span>(arr) - i - <span className="text-amber-300">1</span>):</div>
              <div>            <span className="text-violet-300">if</span> arr[j] &gt; arr[j + <span className="text-amber-300">1</span>]:</div>
              <div>                arr[j], arr[j + <span className="text-amber-300">1</span>] = arr[j + <span className="text-amber-300">1</span>], arr[j]</div>
              <div>    <span className="text-violet-300">return</span> arr</div>
            </div>

            <div className="mt-5 rounded-[1rem] border border-emerald-900/60 bg-emerald-950/70 px-4 py-3 font-mono text-sm text-emerald-300">
              &gt; [12, 23, 31, 45, 56]
            </div>
          </div>
        </div>
      </section>

      <section id="tech" className="border-t border-slate-200 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-[34rem]">
            <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-700">Tech Stack</p>
            <h2 className="mt-4 max-w-[11ch] font-display text-4xl leading-[0.95] tracking-[-0.04em] text-slate-900 sm:text-5xl">
              Built on modern tools that students already trust.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {TECH.map((item) => (
              <div key={item.name} className="rounded-[1.4rem] border border-slate-200 bg-slate-50/70 p-6">
                <span className={`font-ui inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${item.badgeClass}`}>
                  {item.badge}
                </span>
                <h3 className="mt-6 font-ui text-xl font-semibold tracking-[-0.02em] text-slate-900">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#F8FAFC] py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-700">Start now</p>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] tracking-[-0.04em] text-slate-900 sm:text-5xl">
            Ready to study smarter with one calm workspace?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[1.02rem] leading-8 text-slate-500">
            Create your account, open a room, and keep planning, coding, and course material connected from day one.
          </p>
          <Link
            to="/register"
            className="font-ui mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-button transition duration-200 hover:scale-[1.02] hover:bg-slate-800"
          >
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
