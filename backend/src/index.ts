import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { AppEnv } from './types';
import { authRouter } from './modules/auth';
import { profileRouter } from './modules/profile';
import { scholarshipsRouter, adminScholarshipsRouter } from './modules/scholarships';
import { checklistRouter } from './modules/checklist';
import { seedDatabase } from './seeds/scholarships';

const app = new Hono<AppEnv>();

// Global structured logger
app.use('*', logger());

// CORS configuration (Task B1.3)
app.use('*', async (c, next) => {
  const allowedOrigins = [
    c.env.FRONTEND_URL,
    'https://qualifiedscholar.pages.dev',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
  ].filter(Boolean);

  const corsMiddleware = cors({
    origin: (origin) => {
      if (!origin) return '*';
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.endsWith('.pages.dev')
      ) {
        return origin;
      }
      return allowedOrigins[0] || '*';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['Content-Disposition'],
    credentials: true,
  });

  return corsMiddleware(c, next);
});

// Standardized Global Error Handling Middleware (Task B1.3)
app.onError((err, c) => {
  console.error('Unhandled Application Error:', err);
  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected internal server error occurred',
      },
    },
    500
  );
});

// Standardized 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${c.req.method} ${c.req.path} was not found`,
      },
    },
    404
  );
});

// Health-check endpoint (Task B1.3)
app.get('/api/health', (c) => {
  return c.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Seed endpoint for development & setup
app.post('/api/seed', async (c) => {
  try {
    const counts = await seedDatabase(c.env.DB);
    return c.json({
      success: true,
      message: 'Database seeded successfully with demo users and 12 mock scholarships',
      counts,
    });
  } catch (err) {
    console.error('Seeding error:', err);
    return c.json(
      {
        success: false,
        error: {
          code: 'SEED_ERROR',
          message: err instanceof Error ? err.message : 'Unknown seed error',
        },
      },
      500
    );
  }
});

// Register module routers
app.route('/api/auth', authRouter);
app.route('/api/profile', profileRouter);
app.route('/api/scholarships', scholarshipsRouter);
app.route('/api/scholarships', checklistRouter);
app.route('/api/admin/scholarships', adminScholarshipsRouter);

export default app;
