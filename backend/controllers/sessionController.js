import mongoose from 'mongoose';

import Session from '../models/Session.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateObjectId = (id, message) => {
  if (!isValidObjectId(id)) {
    throw createError(message, 400);
  }
};

const getStartOfDay = (date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  return startOfDay;
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
};

const getCompletedSessionMatch = (userId, startTime = null, endTime = null) => {
  const match = {
    user: userId,
    endTime: { $exists: true, $ne: null },
  };

  if (startTime || endTime) {
    match.startTime = {};

    if (startTime) {
      match.startTime.$gte = startTime;
    }

    if (endTime) {
      match.startTime.$lt = endTime;
    }
  }

  return match;
};

export const startSession = asyncHandler(async (req, res) => {
  const { taskId } = req.body;

  validateObjectId(taskId, 'Invalid task ID');

  const task = await Task.findOne({
    _id: taskId,
    user: req.user._id,
  }).select('_id');

  if (!task) {
    throw createError('Task not found', 404);
  }

  const session = await Session.create({
    user: req.user._id,
    task: task._id,
    startTime: new Date(),
  });

  res.status(201).json({
    success: true,
    data: session,
  });
});

export const endSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  validateObjectId(sessionId, 'Invalid session ID');

  const session = await Session.findOne({
    _id: sessionId,
    user: req.user._id,
  });

  if (!session) {
    throw createError('Session not found', 404);
  }

  const endTime = new Date();
  const duration = Math.max(
    0,
    Math.round((endTime.getTime() - session.startTime.getTime()) / 1000)
  );

  session.endTime = endTime;
  session.duration = duration;

  await session.save();

  res.status(200).json({
    success: true,
    data: session,
  });
});

export const getDailySummary = asyncHandler(async (req, res) => {
  const todayStart = getStartOfDay();
  const tomorrowStart = addDays(todayStart, 1);
  const yesterdayStart = addDays(todayStart, -1);

  const [todaySummary, yesterdaySummary, activeDays] = await Promise.all([
    Session.aggregate([
      {
        $match: getCompletedSessionMatch(req.user._id, todayStart, tomorrowStart),
      },
      {
        $group: {
          _id: null,
          totalFocusTime: { $sum: '$duration' },
          sessionCount: { $sum: 1 },
        },
      },
    ]),
    Session.aggregate([
      {
        $match: getCompletedSessionMatch(req.user._id, yesterdayStart, todayStart),
      },
      {
        $group: {
          _id: null,
          totalFocusTime: { $sum: '$duration' },
        },
      },
    ]),
    Session.aggregate([
      {
        $match: getCompletedSessionMatch(req.user._id),
      },
      {
        $group: {
          _id: {
            year: { $year: '$startTime' },
            month: { $month: '$startTime' },
            day: { $dayOfMonth: '$startTime' },
          },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
          '_id.day': -1,
        },
      },
    ]),
  ]);

  const activeDayKeys = new Set(
    activeDays.map((item) => `${item._id.year}-${item._id.month}-${item._id.day}`)
  );
  let currentStreak = 0;
  let cursor = todayStart;

  while (
    activeDayKeys.has(`${cursor.getFullYear()}-${cursor.getMonth() + 1}-${cursor.getDate()}`)
  ) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  res.status(200).json({
    success: true,
    data: {
      totalFocusTime: todaySummary[0]?.totalFocusTime || 0,
      sessionCount: todaySummary[0]?.sessionCount || 0,
      currentStreak,
      yesterdayFocusTime: yesterdaySummary[0]?.totalFocusTime || 0,
    },
  });
});

export const getWeeklySummary = asyncHandler(async (req, res) => {
  const todayStart = getStartOfDay();
  const weekStart = addDays(todayStart, -6);
  const tomorrowStart = addDays(todayStart, 1);

  const weeklySessions = await Session.aggregate([
    {
      $match: getCompletedSessionMatch(req.user._id, weekStart, tomorrowStart),
    },
    {
      $group: {
        _id: {
          year: { $year: '$startTime' },
          month: { $month: '$startTime' },
          day: { $dayOfMonth: '$startTime' },
        },
        totalFocusTime: { $sum: '$duration' },
        sessionCount: { $sum: 1 },
      },
    },
  ]);

  const summaryByDay = new Map(
    weeklySessions.map((item) => [
      `${item._id.year}-${item._id.month}-${item._id.day}`,
      item,
    ])
  );

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const daySummary = summaryByDay.get(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );

    return {
      date: date.toISOString(),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      totalFocusTime: daySummary?.totalFocusTime || 0,
      sessionCount: daySummary?.sessionCount || 0,
    };
  });

  res.status(200).json({
    success: true,
    data: {
      days,
    },
  });
});

export const getTaskInsights = asyncHandler(async (req, res) => {
  const tasks = await Session.aggregate([
    {
      $match: getCompletedSessionMatch(req.user._id),
    },
    {
      $group: {
        _id: '$task',
        totalFocusTime: { $sum: '$duration' },
        sessionCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: '_id',
        as: 'task',
      },
    },
    {
      $unwind: {
        path: '$task',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        taskId: '$_id',
        taskName: { $ifNull: ['$task.title', 'Untitled task'] },
        totalFocusTime: 1,
        sessionCount: 1,
      },
    },
    {
      $sort: {
        totalFocusTime: -1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      tasks,
      highestTimeTask: tasks[0] || null,
      lowestTimeTask: tasks[tasks.length - 1] || null,
    },
  });
});
