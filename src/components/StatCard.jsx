import { Link } from "react-router-dom";

function StatCard({
  icon,
  title,
  value,
  label,
  to,
  isLoading = false,
  iconClassName = "bg-sky-50 text-sky-600",
}) {
  const cardClassName = `rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-200 ease-out ${
    to
      ? "group block hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
      : "hover:-translate-y-0.5 hover:shadow-card-hover"
  }`;

  const content = isLoading ? (
    <div className="animate-pulse">
      <div className="h-10 w-10 rounded-xl bg-slate-100" />
      <div className="mt-5 h-4 w-20 rounded bg-slate-100" />
      <div className="mt-3 h-8 w-16 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-24 rounded bg-slate-100" />
    </div>
  ) : (
    <>
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
        aria-hidden="true"
      >
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 font-ui text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400">{label}</p>
        {to ? (
          <span className="font-ui text-xs font-medium text-slate-400 transition duration-200 group-hover:text-slate-700">
            Open
          </span>
        ) : null}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClassName}>
      {content}
    </div>
  );
}

export default StatCard;
