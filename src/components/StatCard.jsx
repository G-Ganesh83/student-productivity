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
  const cardClassName = `rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 ${
    to
      ? "group block hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
      : "hover:-translate-y-0.5 hover:shadow-md"
  }`;

  const content = isLoading ? (
    <div className="animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-slate-100" />
      <div className="mt-5 h-4 w-20 rounded bg-slate-100" />
      <div className="mt-3 h-8 w-16 rounded bg-slate-100" />
      <div className="mt-3 h-3 w-24 rounded bg-slate-100" />
    </div>
  ) : (
    <>
      <div
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}
        aria-hidden="true"
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-gray-500">{title}</p>
      <p className="mt-2 font-ui text-3xl font-semibold tracking-tight text-gray-900">{value}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400">{label}</p>
        {to ? (
          <span className="font-ui text-xs font-semibold text-slate-400 transition duration-200 group-hover:text-slate-700">
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
