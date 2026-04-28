import { format, isSameDay, isValid, parseISO, startOfDay, subDays } from "date-fns";

export const formatDuration = (seconds) => {
  const safeSeconds = Math.max(0, Math.round(seconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours >= 1) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

export const normalizeStreak = (value) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

export const parseSessionDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate =
    value instanceof Date
      ? new Date(value)
      : typeof value === "string"
        ? parseISO(value)
        : new Date(value);

  return isValid(parsedDate) ? parsedDate : null;
};

export const getSessionCreatedAt = (session) => parseSessionDate(session?.createdAt);

export const getSessionDuration = (session) => {
  const duration = Number(session?.duration ?? session?.totalDuration ?? session?.totalFocusTime);

  if (Number.isFinite(duration) && duration > 0) {
    return Math.max(0, Math.round(duration));
  }

  const startTime = parseSessionDate(session?.startTime)?.getTime();
  const endTime = parseSessionDate(session?.endTime)?.getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return 0;
  }

  return Math.max(0, Math.round((endTime - startTime) / 1000));
};

export const isSessionOnDate = (session, targetDate) => {
  const sessionDate = getSessionCreatedAt(session);
  const normalizedTargetDate = parseSessionDate(targetDate);

  if (!sessionDate || !normalizedTargetDate) {
    return false;
  }

  return isSameDay(sessionDate, normalizedTargetDate);
};

export const filterSessionsByDate = (sessions = [], targetDate) =>
  (Array.isArray(sessions) ? sessions : []).filter((session) => isSessionOnDate(session, targetDate));

export const sumSessionDurations = (sessions = []) =>
  (Array.isArray(sessions) ? sessions : []).reduce((total, session) => total + getSessionDuration(session), 0);

export const getDailyFocusTotals = (sessions = [], referenceDate = new Date()) => {
  const todaySessions = filterSessionsByDate(sessions, referenceDate);
  const yesterday = subDays(referenceDate, 1);
  const yesterdaySessions = filterSessionsByDate(sessions, yesterday);

  return {
    todaySessions,
    yesterdaySessions,
    totalFocusTimeToday: sumSessionDurations(todaySessions),
    totalFocusTimeYesterday: sumSessionDurations(yesterdaySessions),
  };
};

export const getWeeklyFocusSummary = (sessions = [], referenceDate = new Date(), days = 7) => {
  const safeDays = Math.max(1, Math.round(days || 7));

  return Array.from({ length: safeDays }, (_, index) => {
    const date = subDays(startOfDay(referenceDate), safeDays - index - 1);
    const sessionsForDay = filterSessionsByDate(sessions, date);

    return {
      date: date.toISOString(),
      label: format(date, "EEE"),
      totalFocusTime: sumSessionDurations(sessionsForDay),
    };
  });
};

export const getCurrentSessionStreak = (sessions = [], referenceDate = new Date()) => {
  const uniqueSessionDays = new Set(
    (Array.isArray(sessions) ? sessions : [])
      .map((session) => getSessionCreatedAt(session))
      .filter(Boolean)
      .map((date) => startOfDay(date).getTime())
  );

  let streak = 0;
  let cursor = startOfDay(referenceDate);

  while (uniqueSessionDays.has(cursor.getTime())) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
};

export const formatTaskName = (name = "") => {
  const normalizedName = String(name).trim().replace(/\s+/g, " ");

  if (!normalizedName) {
    return "Untitled task";
  }

  const acronymMap = {
    api: "API",
    dsa: "DSA",
    html: "HTML",
    js: "JS",
    os: "OS",
    sql: "SQL",
    ui: "UI",
    ux: "UX",
  };

  return normalizedName
    .split(" ")
    .map((word) => {
      const lowerWord = word.toLowerCase();

      if (acronymMap[lowerWord]) {
        return acronymMap[lowerWord];
      }

      if (word === word.toUpperCase() && word.length > 1) {
        return word;
      }

      return `${lowerWord.charAt(0).toUpperCase()}${lowerWord.slice(1)}`;
    })
    .join(" ");
};

export const generateInsights = ({
  totalFocusTimeToday = 0,
  totalFocusTimeYesterday = 0,
  streak = 0,
  highestTimeTask = null,
} = {}) => {
  const messages = [];

  if (highestTimeTask?.taskName) {
    messages.push(`You focused most on ${formatTaskName(highestTimeTask.taskName)} today.`);
  }

  if (streak >= 2) {
    messages.push(`You are maintaining a ${streak}-day consistency streak.`);
  }

  if (messages.length < 2) {
    if (totalFocusTimeToday < totalFocusTimeYesterday) {
      messages.push("Your activity decreased compared to yesterday.");
    } else {
      messages.push("You are making consistent progress.");
    }
  }

  return messages.slice(0, 2);
};
