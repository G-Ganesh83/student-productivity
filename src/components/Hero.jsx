import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import collabAnimation from "../assets/collab-animation.json";
import FeatureCard from "./FeatureCard";

function Hero({ floatingCards }) {
  return (
    <section className="border-b border-slate-200/80 bg-[linear-gradient(180deg,#f8fafc_0%,#f8fafc_82%,#f4f8fc_100%)]">
      <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-10 sm:px-6 lg:px-6 lg:pb-20 lg:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-8">
          <div className="max-w-[38rem] lg:-mt-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.82rem] text-slate-600 shadow-sm shadow-slate-900/5">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Built for students, by students
            </div>

            <h1 className="mt-8 max-w-[11ch] font-display text-[clamp(3.3rem,7vw,5.8rem)] leading-[0.95] tracking-tight text-slate-900">
              One place to study,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                build,
              </span>{" "}
              and collaborate
              <br />
              smarter.
            </h1>

            <p className="mt-6 max-w-lg text-[1.02rem] leading-8 text-gray-600 sm:text-[1.06rem]">
              Plan tasks, code together in real-time, and share resources — all in one focused workspace.
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="font-ui inline-flex items-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:scale-105 hover:bg-slate-800"
              >
                Get Started
              </Link>
              <Link
                to="/collaboration"
                className="font-ui inline-flex items-center rounded-full border border-slate-300 bg-transparent px-5 py-3 text-sm font-medium text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-950"
              >
                Join a room
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end lg:pr-2">
            <div className="absolute left-10 top-14 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />
            <div className="absolute bottom-12 right-4 h-44 w-44 rounded-full bg-indigo-200/20 blur-3xl" />
            <div className="absolute right-24 top-8 h-28 w-28 rounded-full bg-sky-100/50 blur-2xl" />

            <div className="relative z-10 w-full max-w-[36rem] lg:max-w-[40rem]">
              <div className="absolute left-8 top-0 hidden rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[0.68rem] font-ui font-semibold uppercase tracking-[0.22em] text-sky-600 shadow-sm md:block">
                Focus mode
              </div>
              <div className="relative px-2 py-8 sm:px-6 lg:px-0">
                <Lottie animationData={collabAnimation} loop className="w-full" />
              </div>
            </div>

            {floatingCards.map((card) => (
              <div key={card.title} className={`absolute hidden md:block ${card.position}`}>
                <FeatureCard
                  title={card.title}
                  description={card.description}
                  className={`${card.animationClass} transition duration-300 hover:-translate-y-1`}
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
