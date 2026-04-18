import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import collabAnimation from "../assets/collab-animation.json";
import FeatureCard from "./FeatureCard";

function Hero({ floatingCards }) {
  return (
    <section className="border-b border-slate-200/80 bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,1.04fr)] lg:gap-12">
          <div className="max-w-[34rem]">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] text-slate-600 shadow-sm shadow-slate-900/5">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Built for students, by students
            </div>

            <h1 className="mt-8 max-w-[10ch] font-display text-[clamp(3.3rem,7vw,5.6rem)] leading-[0.9] tracking-[-0.05em] text-slate-900">
              One place to study, build, and collaborate smarter.
            </h1>

            <p className="mt-6 max-w-[31rem] text-[1.02rem] leading-8 text-slate-500 sm:text-[1.06rem]">
              Plan tasks, code together in real-time, and share resources — all in one focused workspace.
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="font-ui inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-button transition duration-200 hover:scale-[1.02] hover:bg-slate-800"
              >
                Get Started
              </Link>
              <Link
                to="/collaboration"
                className="font-ui inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition duration-200 hover:border-sky-200 hover:text-slate-950"
              >
                Join a room
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto flex min-h-[420px] w-full max-w-[40rem] items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-36px_rgba(15,23,42,0.2)]">
              <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(248,250,252,0))]" />
              <div className="absolute left-6 top-6 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-[0.68rem] font-ui font-semibold uppercase tracking-[0.22em] text-sky-600 shadow-sm">
                Focus mode
              </div>
              <div className="relative z-10 w-full max-w-[34rem] px-4 py-8 sm:px-8">
                <Lottie animationData={collabAnimation} loop className="w-full" />
              </div>
            </div>

            {floatingCards.map((card) => (
              <div key={card.title} className={`absolute hidden lg:block ${card.position}`}>
                <FeatureCard
                  title={card.title}
                  description={card.description}
                  className={card.animationClass}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
