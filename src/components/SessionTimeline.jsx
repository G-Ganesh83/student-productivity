import { useMemo } from "react";

import { formatDuration, formatTaskName } from "../utils/sessionAnalytics";

const getSessionTaskName = (session) =>
  session.taskName ||
  session.title ||
  session.name ||
  session.task?.title ||
  session.task?.name ||
  "Untitled task";

const getSessionDuration = (session) => {
  const duration = Number(session.duration ?? session.totalDuration ?? session.totalFocusTime);

  if (Number.isFinite(duration) && duration > 0) {
    return duration;
  }

  const startTime = new Date(session.startTime).getTime();
  const endTime = new Date(session.endTime).getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return 0;
  }

  return Math.max(0, Math.round((endTime - startTime) / 1000));
};

const formatSessionTime = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "00:00";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

function SessionTimeline({ focusTimeToday = 0, sessions = [], sessionsToday = 0, isLoading = false }) {
  const timelineItems = useMemo(() => {
    const today = new Date();
    const completedSessions = sessions
      .filter((session) => {
        if (!session?.startTime || (!session?.endTime && !session?.duration)) {
          return false;
        }

        const startDate = new Date(session.startTime);

        return (
          !Number.isNaN(startDate.getTime()) &&
          startDate.getFullYear() === today.getFullYear() &&
          startDate.getMonth() === today.getMonth() &&
          startDate.getDate() === today.getDate()
        );
      })
      .sort((first, second) => new Date(first.startTime) - new Date(second.startTime))
      .map((session) => ({
        id: session._id || session.id || `${session.startTime}-${getSessionTaskName(session)}`,
        time: formatSessionTime(session.startTime),
        taskName: formatTaskName(getSessionTaskName(session)),
        duration: formatDuration(getSessionDuration(session)),
      }));

    if (sessionsToday === 0) {
      return completedSessions;
    }

    const averageDuration = sessionsToday > 0 ? Math.round(focusTimeToday / sessionsToday) : 0;
    const missingSessionCount = Math.max(0, sessionsToday - completedSessions.length);

    return [
      ...completedSessions,
      ...Array.from({ length: missingSessionCount }, (_, index) => ({
        id: `summary-session-${index}`,
        time: "00:00",
        taskName: sessionsToday === 1 ? "Focus Session" : `Focus Session ${index + 1}`,
        duration: formatDuration(averageDuration),
      })),
    ];
  }, [focusTimeToday, sessions, sessionsToday]);

  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Today's Activity</h3>
        <p className="mt-1 text-xs text-slate-500">Completed focus sessions from today.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : sessionsToday > 0 ? (
        <div className="divide-y divide-slate-100">
          {timelineItems.map((item) => (
            <div key={item.id} className="flex min-w-0 flex-wrap items-center gap-2 py-3 first:pt-0 last:pb-0">
              <span className="text-xs font-medium text-slate-500">{item.time}</span>
              <span className="text-xs text-slate-300">–</span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">{item.taskName}</span>
              <span className="text-xs text-slate-300">–</span>
              <span className="shrink-0 text-sm font-semibold text-slate-700">{item.duration}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
          <p className="text-sm font-medium text-slate-700">
            No activity yet. Start your first session to track productivity.
          </p>
        </div>
      )}
    </section>
  );
}

export default SessionTimeline;
