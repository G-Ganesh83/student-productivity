import { Link } from "react-router-dom";

function BrandLogo({
  to = "/",
  onClick,
  className = "",
  compact = false,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2.5 ${className}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-[1.15rem] bg-slate-950 text-white shadow-sm shadow-slate-900/10 ring-1 ring-slate-900/5">
        <span className="font-display text-[1.05rem] font-semibold leading-none">L</span>
      </div>
      {!compact ? (
        <span className="font-ui text-[0.92rem] font-semibold tracking-[0.14em] text-slate-900">
          LEARN EASY
        </span>
      ) : null}
    </Link>
  );
}

export default BrandLogo;
