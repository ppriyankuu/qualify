// src/modules/auth/index.ts
import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, User } from '../../types';
import { hashPassword, verifyPassword } from '../../utils/crypto';
import { signToken } from '../../utils/jwt';
import { requireAuth } from '../../middleware/auth';

export const authRouter = new Hono<AppEnv>();

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'admin'], {
    errorMap: () => ({ message: 'Role must be either student or admin' }),
  }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/register
authRouter.post('/register', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        success: false,
        error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' },
      },
      400
    );
  }

  const parseResult = registerSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parseResult.error.errors[0]?.message || 'Validation failed',
          details: parseResult.error.flatten(),
        },
      },
      400
    );
  }

  const { email, password, role } = parseResult.data;
  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(normalizedEmail)
    .first();

  if (existingUser) {
    return c.json(
      {
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'A user with this email address already exists',
        },
      },
      409
    );
  }

  const userId = crypto.randomUUID();
  const hashedPassword = await hashPassword(password);
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    'INSERT INTO users (id, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  )
    .bind(userId, normalizedEmail, hashedPassword, role, now, now)
    .run();

  const token = await signToken({ sub: userId, email: normalizedEmail, role }, c.env.JWT_SECRET);

  return c.json(
    {
      success: true,
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        role,
        hasProfile: false,
      },
    },
    201
  );
});

// POST /api/auth/login
authRouter.post('/login', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        success: false,
        error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' },
      },
      400
    );
  }

  const parseResult = loginSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parseResult.error.errors[0]?.message || 'Validation failed',
        },
      },
      400
    );
  }

  const { email, password } = parseResult.data;
  const normalizedEmail = email.trim().toLowerCase();

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(normalizedEmail)
    .first<User>();

  if (!user) {
    return c.json(
      {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      },
      401
    );
  }

  const isPasswordValid = await verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    return c.json(
      {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      },
      401
    );
  }

  let hasProfile = true;
  let fullName: string | null = null;
  if (user.role === 'student') {
    const profile = await c.env.DB.prepare('SELECT user_id, full_name FROM student_profiles WHERE user_id = ?')
      .bind(user.id)
      .first<{ user_id: string; full_name: string }>();
    hasProfile = !!profile;
    fullName = profile?.full_name || null;
  }

  const token = await signToken({ sub: user.id, email: user.email, role: user.role }, c.env.JWT_SECRET);

  return c.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      hasProfile,
      name: fullName || (user.role === 'admin' ? 'Administrator' : undefined),
    },
  });
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (c) => {
  const jwtPayload = c.get('user');
  if (!jwtPayload) {
    return c.json(
      {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
      },
      401
    );
  }

  const user = await c.env.DB.prepare('SELECT id, email, role, created_at, updated_at FROM users WHERE id = ?')
    .bind(jwtPayload.sub)
    .first<Omit<User, 'password_hash'>>();

  if (!user) {
    return c.json(
      {
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User account not found' },
      },
      404
    );
  }

  let hasProfile = true;
  let fullName: string | null = null;
  if (user.role === 'student') {
    const profile = await c.env.DB.prepare('SELECT user_id, full_name FROM student_profiles WHERE user_id = ?')
      .bind(user.id)
      .first<{ user_id: string; full_name: string }>();
    hasProfile = !!profile;
    fullName = profile?.full_name || null;
  }

  return c.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      hasProfile,
      name: fullName || (user.role === 'admin' ? 'Administrator' : undefined),
    },
  });
});
