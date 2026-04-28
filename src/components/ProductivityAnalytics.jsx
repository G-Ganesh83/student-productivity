import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import {
  getDailySessionSummary,
  getTaskSessionInsights,
  getWeeklySessionSummary,
} from "../api/sessionApi";
import {
  formatDuration,
  formatTaskName,
  generateInsights,
  getCurrentSessionStreak,
  getDailyFocusTotals,
  getSessionCreatedAt,
  getWeeklyFocusSummary,
  normalizeStreak,
} from "../utils/sessionAnalytics";

const EMPTY_DAILY_SUMMARY = {
  totalFocusTime: 0,
  sessionCount: 0,
  currentStreak: 0,
  yesterdayFocusTime: 0,
  sessions: [],
};

const unwrapPayload = (response) => response?.data || response || {};

const readNumber = (...values) => {
  for (const value of values) {
    if (value === undefined || value === null) {
      continue;
    }

    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
};

const getDayLabel = (value) => {
  const date = getSessionCreatedAt({ createdAt: value });

  if (!date) {
    return "";
  }

  return format(date, "EEE");
};

const normalizeDailySummary = (response) => {
  const payload = unwrapPayload(response);
  const allSessions = Array.isArray(payload.sessions) ? payload.sessions : [];
  const todaySessionsPayload = Array.isArray(payload.todaySessions) ? payload.todaySessions : [];
  const sessions = allSessions.length ? allSessions : todaySessionsPayload;
  const {
    todaySessions,
    totalFocusTimeToday,
    totalFocusTimeYesterday,
  } = getDailyFocusTotals(allSessions.length ? allSessions : todaySessionsPayload);
  const providedTotalFocusTime = readNumber(
    payload.totalFocusTime,
    payload.totalDuration,
    payload.duration,
    payload.today
  );
  const providedYesterdayFocusTime = readNumber(payload.yesterdayFocusTime, payload.yesterdayDuration, payload.yesterday);
  const providedSessionCount = readNumber(payload.sessionCount, payload.totalSessions);
  const providedStreak = normalizeStreak(readNumber(payload.currentStreak, payload.streak));

  return {
    totalFocusTime: todaySessionsPayload.length || allSessions.length ? totalFocusTimeToday || providedTotalFocusTime : providedTotalFocusTime,
    sessionCount: allSessions.length ? todaySessions.length : todaySessionsPayload.length || providedSessionCount,
    currentStreak: allSessions.length ? providedStreak || getCurrentSessionStreak(allSessions) : providedStreak,
    yesterdayFocusTime: allSessions.length ? totalFocusTimeYesterday : providedYesterdayFocusTime,
    sessions,
  };
};

const normalizeWeeklySummary = (response) => {
  const payload = unwrapPayload(response);
  const items = Array.isArray(payload) ? payload : payload.days || payload.week || payload.summary || [];
  const sessions = Array.isArray(payload.sessions) ? payload.sessions : [];

  if (!items.length && sessions.length) {
    return getWeeklyFocusSummary(sessions);
  }

  return items.slice(-7).map((item, index) => {
    const date = item.date || item.day || item._id;
    const label = item.label || item.dayName || getDayLabel(date) || `Day ${index + 1}`;

    return {
      label,
      totalFocusTime: readNumber(item.totalFocusTime, item.totalDuration, item.duration, item.seconds),
    };
  });
};

const getTaskName = (task) => {
  if (!task) {
    return "No task data";
  }

  if (typeof task.task === "string") {
    return formatTaskName(task.task);
  }

  return formatTaskName(task.taskName || task.title || task.name || task.task?.title || task.task?.name || "Untitled task");
};

const normalizeTaskInsights = (response) => {
  const payload = unwrapPayload(response);
  const tasks = Array.isArray(payload) ? payload : payload.tasks || payload.insights || [];
  const sortedTasks = [...tasks].sort(
    (first, second) =>
      readNumber(second.totalFocusTime, second.totalDuration, second.duration) -
      readNumber(first.totalFocusTime, first.totalDuration, first.duration)
  );
  const highest = payload.highestTimeTask || payload.highest || payload.mostFocusedTask || sortedTasks[0] || null;
  const lowest =
    payload.lowestTimeTask ||
    payload.lowest ||
    payload.leastFocusedTask ||
    sortedTasks[sortedTasks.length - 1] ||
    null;

  return {
    highest: highest
      ? {
          taskName: getTaskName(highest),
          totalFocusTime: readNumber(highest.totalFocusTime, highest.totalDuration, highest.duration),
        }
      : null,
    lowest: lowest
      ? {
          taskName: getTaskName(lowest),
          totalFocusTime: readNumber(lowest.totalFocusTime, lowest.totalDuration, lowest.duration),
        }
      : null,
  };
};

function ProductivityAnalytics({ onDailySummaryChange }) {
  const [dailySummary, setDailySummary] = useState(EMPTY_DAILY_SUMMARY);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [taskInsights, setTaskInsights] = useState({ highest: null, lowest: null });
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setStatus("loading");

        const [dailyResult, weeklyResult, insightsResult] = await Promise.all([
          getDailySessionSummary(),
          getWeeklySessionSummary(),
          getTaskSessionInsights(),
        ]);

        if (!isMounted) {
          return;
        }

        const nextDailySummary = normalizeDailySummary(dailyResult);

        setDailySummary(nextDailySummary);
        onDailySummaryChange?.(nextDailySummary);
        setWeeklySummary(normalizeWeeklySummary(weeklyResult));
        setTaskInsights(normalizeTaskInsights(insightsResult));
        setStatus("success");
      } catch {
        if (isMounted) {
          setStatus("error");
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, [onDailySummaryChange]);

  const maxWeeklyFocusTime = useMemo(
    () => Math.max(...weeklySummary.map((item) => item.totalFocusTime), 0),
    [weeklySummary]
  );

  const analyticsData = useMemo(
    () => ({
      focusTimeToday: dailySummary.totalFocusTime,
      insights: taskInsights,
      sessions: dailySummary.sessions,
      yesterdaySessions: dailySummary.yesterdaySessions || [],
      sessionsToday: dailySummary.sessionCount,
      streak: dailySummary.currentStreak,
      weekly: weeklySummary,
      yesterdayFocusTime: dailySummary.yesterdayFocusTime,
    }),
    [dailySummary, taskInsights, weeklySummary]
  );

  const insightMessages = useMemo(
    () =>
      generateInsights({
        totalFocusTimeToday: analyticsData.focusTimeToday,
        totalFocusTimeYesterday: analyticsData.yesterdayFocusTime,
        streak: analyticsData.streak,
        highestTimeTask: analyticsData.insights.highest,
        lowestTimeTask: analyticsData.insights.lowest,
      }).filter((message) => !message.toLowerCase().includes("consistency streak")),
    [analyticsData]
  );

  const summaryCards = [
    {
      label: "Focus time today",
      value: formatDuration(analyticsData.focusTimeToday),
    },
    {
      label: "Sessions today",
      value: String(analyticsData.sessionsToday),
    },
    {
      label: "Yesterday's focus",
      value: formatDuration(analyticsData.yesterdayFocusTime),
    },
  ];
  const hasTodayActivity = analyticsData.sessionsToday > 0;
  const emptyMessage = "No activity yet. Start your first session to track productivity.";
  const consistencyItems = analyticsData.weekly.length
    ? analyticsData.weekly
    : Array.from({ length: 7 }, (_, index) => ({
        label: `Day ${index + 1}`,
        totalFocusTime: 0,
      }));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-3xl font-semibold leading-none tracking-tight text-slate-900">
          Today's Focus
        </h2>
        <p className="mt-2 text-sm text-slate-600">Focused work patterns from your study sessions.</p>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
        {status === "loading" ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-600">Loading analytics...</p>
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
            <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : status === "error" ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
            <p className="text-sm font-medium text-slate-700">
              Analytics are unavailable right now.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {!hasTodayActivity ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
                <p className="text-sm font-medium text-slate-700">{emptyMessage}</p>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Weekly Activity</h3>
                    <p className="mt-1 text-xs text-slate-500">Last 7 days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Consistency (last 7 days)
                    </p>
                    <div className="mt-2 flex justify-end gap-1">
                      {consistencyItems.map((item, index) => (
                        <span
                          key={`${item.label}-${index}`}
                          className={`h-2.5 w-5 rounded-full ${
                            item.totalFocusTime > 0 ? "bg-sky-600" : "bg-slate-200"
                          }`}
                          title={`${item.label}: ${formatDuration(item.totalFocusTime)}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex h-56 items-end gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
                  {(analyticsData.weekly.length ? analyticsData.weekly : Array.from({ length: 7 }, (_, index) => ({
                    label: `Day ${index + 1}`,
                    totalFocusTime: 0,
                  }))).map((item, index) => {
                    const height = maxWeeklyFocusTime
                      ? Math.max(14, Math.min(88, Math.round((item.totalFocusTime / maxWeeklyFocusTime) * 82)))
                      : 10;

                    return (
                      <div key={`${item.label}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                        <div className="flex h-36 w-full items-end">
                          <div
                            className="w-full rounded-t-lg bg-sky-500 transition-all duration-500"
                            style={{ height: `${height}%` }}
                            title={formatDuration(item.totalFocusTime)}
                          />
                        </div>
                        <p className="truncate text-xs font-medium text-slate-500">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Task Insights</h3>
                  <p className="mt-1 text-xs text-slate-500">Time distribution by task</p>
                </div>

                <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                  {insightMessages.map((message, index) => (
                    <p key={`${message}-${index}`} className="text-sm font-medium leading-6 text-slate-700">
                      {message}
                    </p>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Highest time</p>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                      {analyticsData.insights.highest?.taskName || emptyMessage}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-slate-950">
                      {formatDuration(analyticsData.insights.highest?.totalFocusTime || 0)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Lowest time</p>
                    <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                      {analyticsData.insights.lowest?.taskName || emptyMessage}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-slate-950">
                      {formatDuration(analyticsData.insights.lowest?.totalFocusTime || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductivityAnalytics;
