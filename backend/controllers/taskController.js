import mongoose from 'mongoose';

import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sanitizeTaskInput = (payload) => {
  const updates = {};

  if (payload.title !== undefined) {
    updates.title = payload.title.trim();
  }

  if (payload.description !== undefined) {
    updates.description = payload.description.trim();
  }

  if (payload.priority !== undefined) {
    updates.priority = payload.priority;
  }

  if (payload.category !== undefined) {
    updates.category = payload.category;
  }

  if (payload.dueDate !== undefined) {
    updates.dueDate = payload.dueDate;
  }

  if (payload.status !== undefined) {
    updates.status = payload.status;
  }

  return updates;
};

const validateTaskId = (id) => {
  if (!isValidObjectId(id)) {
    throw createError('Invalid task ID', 400);
  }
};

const getStartOfTodayUTC = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, category, dueDate, status } = req.body;
  const trimmedTitle = title?.trim();
  const trimmedDescription = description?.trim();

  if (!trimmedTitle) {
    throw createError('Title is required', 400);
  }

  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    throw createError('Title too long', 400);
  }

  if (trimmedDescription && trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
    throw createError('Description too long', 400);
  }

  const task = await Task.create({
    user: req.user._id,
    title: trimmedTitle,
    description: trimmedDescription,
    priority,
    category,
    dueDate,
    status,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: tasks,
  });
});

export const getTaskStats = asyncHandler(async (req, res) => {
  const today = getStartOfTodayUTC();
  const userId = req.user._id;

  const [statusStats, overdue, completedDays] = await Promise.all([
    Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
    Task.countDocuments({
      user: userId,
      status: 'pending',
      dueDate: { $lt: today },
    }),
    Task.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          completedAt: { $type: 'date' },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$completedAt',
            },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]),
  ]);

  const counts = statusStats.reduce(
    (acc, item) => {
      acc[item._id] = item.count;
      return acc;
    },
    { pending: 0, completed: 0 }
  );

  const completedDaySet = new Set(completedDays.map((day) => day._id));
  let streak = 0;
  const cursor = getStartOfTodayUTC();

  while (completedDaySet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const completed = counts.completed || 0;
  const pending = counts.pending || 0;
  const total = completed + pending;
  const completionRate = total ? Number(((completed / total) * 100).toFixed(2)) : 0;

  res.status(200).json({
    success: true,
    data: {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      streak,
    },
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  validateTaskId(req.params.id);

  const updates = sanitizeTaskInput(req.body);

  if (Object.keys(updates).length === 0) {
    throw createError('No valid fields provided for update', 400);
  }

  if (updates.title !== undefined && updates.title === '') {
    throw createError('Title is required', 400);
  }

  if (updates.title !== undefined && updates.title.length > MAX_TITLE_LENGTH) {
    throw createError('Title too long', 400);
  }

  if (
    updates.description !== undefined &&
    updates.description.length > MAX_DESCRIPTION_LENGTH
  ) {
    throw createError('Description too long', 400);
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw createError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  validateTaskId(req.params.id);

  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    throw createError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

export const toggleTaskStatus = asyncHandler(async (req, res) => {
  validateTaskId(req.params.id);

  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    throw createError('Task not found', 404);
  }

  task.status = task.status === 'pending' ? 'completed' : 'pending';
  task.completedAt = task.status === 'completed' ? new Date() : null;

  await task.save();

  res.status(200).json({
    success: true,
    data: task,
  });
});
