import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, StudentProfile } from '../../types';
import { requireAuth, requireStudent } from '../../middleware/auth';

export const profileRouter = new Hono<AppEnv>();

// Apply auth and student guards to all profile routes
profileRouter.use('*', requireAuth, requireStudent);

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z
    .number({ invalid_type_error: 'Age must be a number' })
    .int('Age must be an integer')
    .min(14, 'Age must be at least 14')
    .max(100, 'Age cannot exceed 100'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    errorMap: () => ({ message: 'Invalid gender option' }),
  }),
  family_income: z
    .number({ invalid_type_error: 'Annual family income must be a number' })
    .int('Family income must be an integer')
    .min(0, 'Family income cannot be negative'),
  education_level: z.enum(['undergraduate', 'postgraduate', 'diploma', 'school'], {
    errorMap: () => ({ message: 'Invalid education level' }),
  }),
  current_course: z.string().min(1, 'Current course is required'),
  field_of_study: z.string().min(1, 'Field of study is required'),
  cgpa: z
    .number({ invalid_type_error: 'CGPA must be a number' })
    .min(0.0, 'CGPA cannot be less than 0.0')
    .max(10.0, 'CGPA cannot exceed 10.0'),
  domicile_state: z.string().min(1, 'Domicile state is required'),
  area_type: z.enum(['rural', 'urban'], {
    errorMap: () => ({ message: 'Area type must be rural or urban' }),
  }),
  category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS'], {
    errorMap: () => ({ message: 'Category must be General, OBC, SC, ST, or EWS' }),
  }),
  is_pwd: z.union([z.boolean(), z.number().int().min(0).max(1)]).transform((val) => (val ? 1 : 0)),
  previous_institution: z.string().nullable().optional(),
  previous_marks_percentage: z
    .number()
    .min(0, 'Previous marks percentage cannot be negative')
    .max(100, 'Previous marks percentage cannot exceed 100%')
    .nullable()
    .optional(),
});

// GET /api/profile/me
profileRouter.get('/me', async (c) => {
  const user = c.get('user')!;

  const profile = await c.env.DB.prepare('SELECT * FROM student_profiles WHERE user_id = ?')
    .bind(user.sub)
    .first<StudentProfile>();

  if (!profile) {
    return c.json(
      {
        success: false,
        hasProfile: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Student profile has not been created yet',
        },
      },
      404
    );
  }

  return c.json({
    success: true,
    hasProfile: true,
    profile: {
      ...profile,
      is_pwd: Boolean(profile.is_pwd),
    },
  });
});

// PUT /api/profile/me (Create or update student profile)
profileRouter.put('/me', async (c) => {
  const user = c.get('user')!;

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

  const parseResult = profileSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: parseResult.error.errors[0]?.message || 'Profile validation failed',
          details: parseResult.error.flatten(),
        },
      },
      400
    );
  }

  const data = parseResult.data;
  const now = new Date().toISOString();

  // UPSERT into student_profiles
  await c.env.DB.prepare(
    `INSERT INTO student_profiles (
      user_id, full_name, age, gender, family_income,
      education_level, current_course, field_of_study, cgpa,
      domicile_state, area_type, category, is_pwd,
      previous_institution, previous_marks_percentage, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      full_name = excluded.full_name,
      age = excluded.age,
      gender = excluded.gender,
      family_income = excluded.family_income,
      education_level = excluded.education_level,
      current_course = excluded.current_course,
      field_of_study = excluded.field_of_study,
      cgpa = excluded.cgpa,
      domicile_state = excluded.domicile_state,
      area_type = excluded.area_type,
      category = excluded.category,
      is_pwd = excluded.is_pwd,
      previous_institution = excluded.previous_institution,
      previous_marks_percentage = excluded.previous_marks_percentage,
      updated_at = excluded.updated_at`
  )
    .bind(
      user.sub,
      data.full_name,
      data.age,
      data.gender,
      data.family_income,
      data.education_level,
      data.current_course,
      data.field_of_study,
      data.cgpa,
      data.domicile_state,
      data.area_type,
      data.category,
      data.is_pwd,
      data.previous_institution || null,
      data.previous_marks_percentage !== undefined ? data.previous_marks_percentage : null,
      now
    )
    .run();

  const updatedProfile = await c.env.DB.prepare('SELECT * FROM student_profiles WHERE user_id = ?')
    .bind(user.sub)
    .first<StudentProfile>();

  return c.json({
    success: true,
    hasProfile: true,
    profile: {
      ...updatedProfile,
      is_pwd: Boolean(updatedProfile?.is_pwd),
    },
  });
});
