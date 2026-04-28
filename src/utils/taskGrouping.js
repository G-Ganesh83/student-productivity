import { addDays, isBefore, isSameDay, isValid, parseISO, startOfDay } from "date-fns";

export const TASK_GROUPS = ["today", "tomorrow", "upcoming", "overdue", "noDate", "completed"];

const createEmptyGroups = () => ({
  today: [],
  tomorrow: [],
  upcoming: [],
  overdue: [],
  noDate: [],
  completed: [],
});

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate =
    value instanceof Date
      ? new Date(value)
      : typeof value === "string"
        ? parseISO(value)
        : new Date(value);

  if (!isValid(parsedDate)) {
    return null;
  }

  return startOfDay(parsedDate);
};

export const getTaskGroup = (task, referenceDate = new Date()) => {
  const dueDate = normalizeDate(task?.dueDate);

  if (!dueDate) {
    return "noDate";
  }

  const today = startOfDay(referenceDate);
  const tomorrow = addDays(today, 1);
  const upcomingEnd = addDays(today, 7);

  if (isBefore(dueDate, today)) {
    return "overdue";
  }

  if (isSameDay(dueDate, today)) {
    return "today";
  }

  if (isSameDay(dueDate, tomorrow)) {
    return "tomorrow";
  }

  if (!isBefore(upcomingEnd, dueDate)) {
    return "upcoming";
  }

  return "noDate";
};

export const groupTasks = (
  tasks,
  referenceDate = new Date(),
  { includeCompletedInDateGroups = true } = {}
) => {
  const groups = createEmptyGroups();

  for (const task of Array.isArray(tasks) ? tasks : []) {
    if (task?.status === "completed") {
      groups.completed.push(task);

      if (!includeCompletedInDateGroups) {
        continue;
      }
    }

    groups[getTaskGroup(task, referenceDate)].push(task);
  }

  return groups;
};
