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

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, status } = req.body;
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
    user: req.user.id,
    title: trimmedTitle,
    description: trimmedDescription,
    priority,
    dueDate,
    status,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: tasks,
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
    { _id: req.params.id, user: req.user.id },
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
    user: req.user.id,
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
    user: req.user.id,
  });

  if (!task) {
    throw createError('Task not found', 404);
  }

  task.status = task.status === 'pending' ? 'completed' : 'pending';
  await task.save();

  res.status(200).json({
    success: true,
    data: task,
  });
});
