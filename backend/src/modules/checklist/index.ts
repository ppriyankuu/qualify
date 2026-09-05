import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv, ScholarshipDocument } from '../../types';
import { requireAuth, requireStudent } from '../../middleware/auth';

export const checklistRouter = new Hono<AppEnv>();

const toggleSchema = z.object({
  is_completed: z.union([z.boolean(), z.number()]).transform((val) => (val ? 1 : 0)),
});

// GET /api/scholarships/:id/checklist (Get student preparation checklist for a scholarship)
checklistRouter.get('/:id/checklist', requireAuth, requireStudent, async (c) => {
  const scholarshipId = c.req.param('id');
  const user = c.get('user')!;

  // Fetch all documents for this scholarship
  const docs = await c.env.DB.prepare(
    'SELECT * FROM scholarship_documents WHERE scholarship_id = ? ORDER BY is_mandatory DESC, id ASC'
  )
    .bind(scholarshipId)
    .all<ScholarshipDocument>();

  if (!docs.results || docs.results.length === 0) {
    return c.json({
      success: true,
      total_items: 0,
      completed_items: 0,
      checklist: [],
    });
  }

  // Fetch checklist completions for this student
  const completions = await c.env.DB.prepare(
    'SELECT scholarship_document_id, is_completed FROM student_document_checklist WHERE user_id = ?'
  )
    .bind(user.sub)
    .all<{ scholarship_document_id: string; is_completed: number }>();

  const completionMap = new Map<string, boolean>();
  for (const row of completions.results || []) {
    completionMap.set(row.scholarship_document_id, row.is_completed === 1);
  }

  const checklist = docs.results.map((doc) => {
    const isCompleted = completionMap.get(doc.id) || false;
    return {
      id: doc.id,
      scholarship_id: doc.scholarship_id,
      document_name: doc.document_name,
      is_mandatory: doc.is_mandatory === 1,
      instructions: doc.instructions || null,
      is_completed: isCompleted,
    };
  });

  const completedCount = checklist.filter((item) => item.is_completed).length;

  return c.json({
    success: true,
    total_items: checklist.length,
    completed_items: completedCount,
    checklist,
  });
});

// PATCH /api/scholarships/:id/checklist/:docId (Toggle document completion status)
checklistRouter.patch('/:id/checklist/:docId', requireAuth, requireStudent, async (c) => {
  const scholarshipId = c.req.param('id');
  const docId = c.req.param('docId');
  const user = c.get('user')!;

  // Verify that the document belongs to this scholarship
  const doc = await c.env.DB.prepare(
    'SELECT id, document_name FROM scholarship_documents WHERE id = ? AND scholarship_id = ?'
  )
    .bind(docId, scholarshipId)
    .first();

  if (!doc) {
    return c.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Scholarship document not found for this scholarship',
        },
      },
      404
    );
  }

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

  const parseResult = toggleSchema.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'is_completed must be a boolean (true or false)',
        },
      },
      400
    );
  }

  const isCompleted = parseResult.data.is_completed;
  const checklistId = crypto.randomUUID();
  const now = new Date().toISOString();

  // UPSERT student checklist state
  await c.env.DB.prepare(
    `INSERT INTO student_document_checklist (
      id, user_id, scholarship_document_id, is_completed, updated_at
    ) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, scholarship_document_id) DO UPDATE SET
      is_completed = excluded.is_completed,
      updated_at = excluded.updated_at`
  )
    .bind(checklistId, user.sub, docId, isCompleted, now)
    .run();

  return c.json({
    success: true,
    item: {
      scholarship_id: scholarshipId,
      document_id: docId,
      is_completed: isCompleted === 1,
    },
  });
});
