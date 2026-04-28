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
