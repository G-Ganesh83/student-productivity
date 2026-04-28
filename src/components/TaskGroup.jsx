function TaskGroup({
  groupKey,
  title,
  description,
  icon,
  totalCount,
  completedCount,
  progress,
  isOpen,
  onToggle,
  sectionClassName,
  badgeClassName,
  iconClassName,
  progressClassName,
  children,
}) {
  const GroupIcon = icon;
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(progress, 100)) : 0;

  return (
    <section
      className={`rounded-[28px] border p-4 shadow-card transition-all duration-300 sm:p-5 ${
        isOpen ? "ring-1 ring-slate-200/80" : ""
      } ${sectionClassName}`}
      data-group={groupKey}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full flex-col gap-4 rounded-2xl text-left transition-all duration-200 sm:flex-row sm:items-start sm:justify-between ${
          isOpen ? "pb-4" : ""
        } hover:bg-white/40`}
        aria-expanded={isOpen}
        aria-controls={`task-group-panel-${groupKey}`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 ${
                isOpen ? "-translate-y-0.5" : ""
              } ${iconClassName}`}
            >
              <GroupIcon className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-ui text-lg font-semibold text-slate-900">{title}</h2>
                <span
                  className={`font-ui inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${badgeClassName}`}
                >
                  {totalCount} {totalCount === 1 ? "task" : "tasks"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </div>
          </div>
        </div>

        <div className="flex min-w-[220px] items-center gap-4 sm:justify-end">
            <div className="min-w-0 flex-1 sm:text-right">
            <div className="flex items-center justify-between gap-3 text-xs font-medium text-slate-500 sm:justify-end">
              <span>{completedCount} completed</span>
              <span>{safeProgress}% done</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-slate-200/70">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressClassName}`}
                style={{ width: `${safeProgress}%` }}
              />
            </div>
          </div>
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-500 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-slate-700" : ""
            }`}
            aria-hidden="true"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      <div
        id={`task-group-panel-${groupKey}`}
        className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out ${
          isOpen ? "mt-4 max-h-[2200px] opacity-100" : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className={`border-t border-slate-200/70 pt-4 ${isOpen ? "block" : "hidden"}`}>{isOpen ? children : null}</div>
      </div>
    </section>
  );
}

export default TaskGroup;
