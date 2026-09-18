import { z } from 'zod';

/**
 * Schema for user registration
 */
export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').optional(),
    username: z.string().trim().min(1, 'Username is required').optional(),
    email: z.string().trim().email('Please provide a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => Boolean(data.name || data.username), {
    message: 'Name is required',
    path: ['name'],
  });

/**
 * Schema for user login
 */
export const loginSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for code execution
 */
export const codeRunSchema = z.object({
  language: z.string().trim().min(1, 'Language is required'),
  code: z.string().trim().min(1, 'Code is required'),
});

/**
 * Schema for task creation and updates
 */
export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().trim().max(1000, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  category: z.string().trim().optional(),
  dueDate: z.union([z.string(), z.date()]).optional().nullable(),
  status: z.enum(['pending', 'completed']).optional(),
});

/**
 * Schema for room operations (creation, joining, leaving)
 */
export const roomSchema = z
  .object({
    name: z.string().trim().min(1, 'Room name is required').max(100).optional(),
    code: z.string().trim().min(1, 'Room code is required').max(10).optional(),
    roomId: z.string().trim().min(1, 'Room ID is required').optional(),
  })
  .refine((data) => Boolean(data.name || data.code || data.roomId), {
    message: 'Room name, code, or roomId is required',
    path: ['name'],
  });

/**
 * Schema for session start and end operations
 */
export const sessionSchema = z
  .object({
    taskId: z.string().trim().min(1, 'Task ID is required').optional(),
    sessionId: z.string().trim().min(1, 'Session ID is required').optional(),
    duration: z.number().nonnegative().optional(),
    type: z.string().trim().optional(),
  })
  .refine(
    (data) => Boolean(data.taskId || data.sessionId || data.duration !== undefined || data.type),
    {
      message: 'Task ID or Session ID is required',
      path: ['taskId'],
    }
  );

/**
 * Schema for resource creation
 */
export const resourceSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title too long'),
  url: z.string().trim().min(1, 'URL is required').max(2000, 'URL too long'),
  type: z.string().trim().min(1, 'Type is required'),
  tags: z.array(z.string()).optional(),
});


/**
 * Validation middleware factory.
 * Parses req.body against the provided Zod schema and returns HTTP 400 with
 * structured error details if validation fails.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      field: issue.path.join('.') || 'body',
      message: issue.message,
    }));

    const primaryMessage = formattedErrors[0]?.message || 'Validation failed';

    return res.status(400).json({
      success: false,
      message: primaryMessage,
      error: primaryMessage,
      errors: formattedErrors,
    });
  }

  req.body = result.data;
  if (result.data.username && !result.data.name) {
    req.body.name = result.data.username;
  }

  return next();
};

export default validate;
