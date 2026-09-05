import type { Context, Next } from 'hono';
import type { AppEnv, UserRole } from '../types';
import { verifyToken } from '../utils/jwt';

export async function requireAuth(c: Context<AppEnv>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization token',
        },
      },
      401
    );
  }

  const token = authHeader.substring(7).trim();

  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired authorization token',
        },
      },
      401
    );
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return async (c: Context<AppEnv>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        401
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
          },
        },
        403
      );
    }

    await next();
  };
}

export const requireAdmin = requireRole(['admin']);
export const requireStudent = requireRole(['student']);
