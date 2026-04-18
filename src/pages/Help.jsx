import Card from "../components/Card";
import Button from "../components/Button";

const QUICK_GUIDES = [
  {
    title: "Get started fast",
    description: "Create an account, sign in, and head to the dashboard to access your daily workspace.",
  },
  {
    title: "Manage your tasks",
    description: "Use the Productivity module to create, filter, and update tasks based on priority and status.",
  },
  {
    title: "Collaborate in real time",
    description: "Create a room or join one with a room code to start coding and chatting with your team.",
  },
];

const FAQS = [
  {
    question: "How do I join a collaboration room?",
    answer:
      "Open the Collaboration page, choose Join Room, enter the shared room code, and you will be redirected into the active room.",
  },
  {
    question: "Why can I not access a room anymore?",
    answer:
      "Room access is protected by membership and authentication. If a room was deleted, you were removed, or your session expired, you may need to sign in again or rejoin with the latest code.",
  },
  {
    question: "Where should I manage my daily work?",
    answer:
      "Use the Productivity module for personal tasks, deadlines, and priorities. It is the best place to track what needs attention next.",
  },
  {
    question: "What can I store in Resources?",
    answer:
      "You can save useful learning links, notes, PDFs, and tagged reference material so important study content stays easy to find.",
  },
];

function Help() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-none tracking-tight text-slate-900">Guidance & support</h1>
          <p className="mt-1 text-sm text-slate-600">
            Quick guidance for using LEARN EASY smoothly across tasks, resources, and collaboration rooms.
          </p>
        </div>
        <Button variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to Top
        </Button>
      </header>

      <Card variant="default" padding="lg">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Need a quick walkthrough?</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Everything important is grouped into a few simple flows.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Use the dashboard to navigate, keep your personal work in Productivity, save learning material in
              Resources, and use Collaboration Rooms whenever you need shared coding and live discussion.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white/80 p-5 shadow-card">
            <p className="text-sm font-semibold text-slate-900">Recommended usage order</p>
            <div className="mt-4 space-y-3">
              {["Sign in", "Check Dashboard", "Manage tasks", "Open or join a room"].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-5 md:grid-cols-3">
        {QUICK_GUIDES.map((guide) => (
          <Card key={guide.title} variant="default" padding="md">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{guide.description}</p>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Frequently asked questions</h2>
          <p className="mt-1 text-sm text-slate-600">Short answers for the most common product and workflow questions.</p>
        </div>
        <div className="space-y-4">
          {FAQS.map((item) => (
            <Card key={item.question} variant="default" padding="md">
              <h3 className="text-base font-bold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Help;
