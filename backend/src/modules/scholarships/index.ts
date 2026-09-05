import { Hono } from 'hono';
import { z } from 'zod';
import type {
  AppEnv,
  EligibilityRule,
  Scholarship,
  ScholarshipDocument,
  StudentProfile,
} from '../../types';
import { requireAdmin, requireAuth, requireStudent } from '../../middleware/auth';
import { evaluateEligibility } from '../rules-engine';

export const scholarshipsRouter = new Hono<AppEnv>();
export const adminScholarshipsRouter = new Hono<AppEnv>();

export function calculateDaysRemaining(deadlineStr: string): number {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) {
    return '""';
  }
  const str = String(field);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

// Validation schemas for admin
const ruleSchema = z.object({
  field_name: z.string().min(1, 'Field name is required'),
  operator: z.enum(['EQ', 'NEQ', 'LTE', 'GTE', 'LT', 'GT', 'IN', 'CONTAINS'], {
    errorMap: () => ({ message: 'Invalid rule operator' }),
  }),
  expected_value: z.string().min(1, 'Expected value is required'),
  is_mandatory: z.union([z.boolean(), z.number()]).transform((val) => (val ? 1 : 0)),
  rule_description: z.string().min(1, 'Rule description is required'),
});

const documentSchema = z.object({
  document_name: z.string().min(1, 'Document name is required'),
  is_mandatory: z.union([z.boolean(), z.number()]).transform((val) => (val ? 1 : 0)),
  instructions: z.string().nullable().optional(),
});

const scholarshipCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  provider: z.string().min(2, 'Provider is required'),
  description: z.string().min(5, 'Description is required'),
  amount_description: z.string().min(1, 'Amount description is required'),
  amount_value: z.number().int().min(0, 'Amount value must be a positive integer').default(0),
  deadline: z.string().min(1, 'Deadline is required'),
  official_notice_url: z.string().url('Official notice URL must be a valid URL'),
  is_published: z.union([z.boolean(), z.number()]).transform((val) => (val ? 1 : 0)).default(1),
  rules: z.array(ruleSchema).optional().default([]),
  documents: z.array(documentSchema).optional().default([]),
});

const scholarshipUpdateSchema = scholarshipCreateSchema.partial();

// ==========================================
// PUBLIC / STUDENT SCHOLARSHIP ROUTES
// ==========================================

// GET /api/scholarships/export/csv (Must come before /:id)
scholarshipsRouter.get('/export/csv', async (c) => {
  // Fetch all published scholarships
  const scholarshipsResult = await c.env.DB.prepare(
    'SELECT * FROM scholarships WHERE is_published = 1 ORDER BY deadline ASC'
  ).all<Scholarship>();

  const scholarships = scholarshipsResult.results || [];

  // Fetch all rules and documents in batch
  const rulesResult = await c.env.DB.prepare(
    'SELECT scholarship_id, rule_description FROM eligibility_rules'
  ).all<{ scholarship_id: string; rule_description: string }>();

  const docsResult = await c.env.DB.prepare(
    'SELECT scholarship_id, document_name FROM scholarship_documents'
  ).all<{ scholarship_id: string; document_name: string }>();

  const rulesMap: Record<string, string[]> = {};
  for (const r of rulesResult.results || []) {
    if (!rulesMap[r.scholarship_id]) rulesMap[r.scholarship_id] = [];
    rulesMap[r.scholarship_id].push(r.rule_description);
  }

  const docsMap: Record<string, string[]> = {};
  for (const d of docsResult.results || []) {
    if (!docsMap[d.scholarship_id]) docsMap[d.scholarship_id] = [];
    docsMap[d.scholarship_id].push(d.document_name);
  }

  const headers = [
    'Scholarship Name',
    'Provider',
    'Amount / Benefits',
    'Deadline',
    'Days Remaining',
    'Required Documents',
    'Eligibility Criteria Summary',
    'Official Notice URL',
  ];

  const csvRows: string[] = [];
  csvRows.push(headers.map(escapeCsvField).join(','));

  for (const s of scholarships) {
    const daysRemaining = calculateDaysRemaining(s.deadline);
    const rulesList = (rulesMap[s.id] || []).join('; ');
    const docsList = (docsMap[s.id] || []).join('; ');

    const row = [
      s.name,
      s.provider,
      s.amount_description,
      s.deadline,
      daysRemaining > 0 ? `${daysRemaining} days` : 'Deadline passed',
      docsList || 'None specified',
      rulesList || 'None specified',
      s.official_notice_url,
    ];

    csvRows.push(row.map(escapeCsvField).join(','));
  }

  const csvContent = csvRows.join('\r\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="scholarships-directory.csv"',
      'Cache-Control': 'no-cache',
    },
  });
});

// GET /api/scholarships (Filtered directory listing)
scholarshipsRouter.get('/', async (c) => {
  const query = c.req.query();
  const search = query.search?.trim();
  const fieldOfStudy = query.field_of_study?.trim();
  const educationLevel = query.education_level?.trim();
  const maxIncome = query.max_income ? Number(query.max_income) : null;
  const gender = query.gender?.trim();
  const isPwd = query.is_pwd !== undefined ? query.is_pwd : null;
  const category = query.category?.trim();
  const sortBy = query.sort_by || 'deadline';
  const order = query.order?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  // Base query: published scholarships
  let sql = 'SELECT DISTINCT s.* FROM scholarships s';
  const params: unknown[] = [];
  const whereClauses: string[] = ['s.is_published = 1'];

  // Search keyword across name, provider, description
  if (search) {
    whereClauses.push('(s.name LIKE ? OR s.provider LIKE ? OR s.description LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  // Join eligibility_rules if rule-based filters are requested
  let joinRules = false;

  if (fieldOfStudy) {
    joinRules = true;
    const tokens = fieldOfStudy
      .replace(/&/g, ' ')
      .replace(/[+/\\(),._-]/g, ' ')
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3 && !['and', 'all', 'the', 'for'].includes(t.toLowerCase()));

    const likeClauses = tokens.map(() => 'r.expected_value LIKE ?').join(' OR ');
    whereClauses.push(
      `s.id IN (
        SELECT r.scholarship_id FROM eligibility_rules r 
        WHERE r.field_name = 'field_of_study' 
        AND (r.expected_value LIKE '%All%' ${likeClauses ? `OR ${likeClauses}` : ''})
      )`
    );
    for (const t of tokens) {
      params.push(`%${t}%`);
    }
  }

  if (educationLevel) {
    joinRules = true;
    whereClauses.push(
      `s.id IN (
        SELECT r.scholarship_id FROM eligibility_rules r 
        WHERE r.field_name = 'education_level' 
        AND (r.expected_value LIKE ? OR r.expected_value LIKE '%All%')
      )`
    );
    params.push(`%${educationLevel}%`);
  }

  if (gender && gender !== 'all') {
    joinRules = true;
    whereClauses.push(
      `s.id IN (
        SELECT r.scholarship_id FROM eligibility_rules r 
        WHERE r.field_name = 'gender' 
        AND (LOWER(r.expected_value) = LOWER(?) OR LOWER(r.expected_value) LIKE '%all%')
      )`
    );
    params.push(gender);
  }

  if (category && category !== 'all') {
    joinRules = true;
    whereClauses.push(
      `s.id IN (
        SELECT r.scholarship_id FROM eligibility_rules r 
        WHERE r.field_name = 'category' 
        AND (r.expected_value LIKE ? OR r.expected_value LIKE '%All%')
      )`
    );
    params.push(`%${category}%`);
  }

  if (isPwd !== null && isPwd !== '') {
    const isPwdBool = isPwd === 'true' || isPwd === '1';
    if (isPwdBool) {
      whereClauses.push(
        `s.id IN (
          SELECT r.scholarship_id FROM eligibility_rules r 
          WHERE r.field_name = 'is_pwd' 
          AND (r.expected_value = '1' OR LOWER(r.expected_value) = 'true')
        )`
      );
    }
  }

  if (maxIncome !== null && !isNaN(maxIncome)) {
    // Return scholarships where there is no income limit OR rule limit >= maxIncome
    whereClauses.push(
      `s.id NOT IN (
        SELECT r.scholarship_id FROM eligibility_rules r
        WHERE r.field_name = 'family_income'
        AND CAST(r.expected_value AS INTEGER) < ?
      )`
    );
    params.push(maxIncome);
  }

  sql += ` WHERE ${whereClauses.join(' AND ')}`;

  // Sorting
  if (sortBy === 'amount') {
    sql += ` ORDER BY s.amount_value ${order}, s.deadline ASC`;
  } else if (sortBy === 'created_at') {
    sql += ` ORDER BY s.created_at ${order}`;
  } else {
    // Default deadline
    sql += ` ORDER BY s.deadline ${order}`;
  }

  const result = await c.env.DB.prepare(sql).bind(...params).all<Scholarship>();
  const scholarships = result.results || [];

  // Fetch rules and documents in batch for all scholarships returned
  const scholarshipIds = scholarships.map((s) => s.id);
  const rulesMap: Record<string, EligibilityRule[]> = {};
  const docsMap: Record<string, ScholarshipDocument[]> = {};

  if (scholarshipIds.length > 0) {
    const placeholders = scholarshipIds.map(() => '?').join(',');
    const [rulesResult, docsResult] = await Promise.all([
      c.env.DB.prepare(
        `SELECT * FROM eligibility_rules WHERE scholarship_id IN (${placeholders}) ORDER BY is_mandatory DESC, created_at ASC`
      )
        .bind(...scholarshipIds)
        .all<EligibilityRule>(),
      c.env.DB.prepare(
        `SELECT * FROM scholarship_documents WHERE scholarship_id IN (${placeholders}) ORDER BY is_mandatory DESC, id ASC`
      )
        .bind(...scholarshipIds)
        .all<ScholarshipDocument>(),
    ]);

    for (const r of rulesResult.results || []) {
      if (!rulesMap[r.scholarship_id]) rulesMap[r.scholarship_id] = [];
      rulesMap[r.scholarship_id].push(r);
    }

    for (const d of docsResult.results || []) {
      if (!docsMap[d.scholarship_id]) docsMap[d.scholarship_id] = [];
      docsMap[d.scholarship_id].push(d);
    }
  }

  // Attach days_remaining, rules, and documents to each scholarship
  const enriched = scholarships.map((s) => ({
    ...s,
    days_remaining: calculateDaysRemaining(s.deadline),
    rules: rulesMap[s.id] || [],
    documents: docsMap[s.id] || [],
  }));

  return c.json({
    success: true,
    count: enriched.length,
    scholarships: enriched,
  });
});

// GET /api/scholarships/:id (Public scholarship details)
scholarshipsRouter.get('/:id', async (c) => {
  const id = c.req.param('id');

  const scholarship = await c.env.DB.prepare('SELECT * FROM scholarships WHERE id = ?')
    .bind(id)
    .first<Scholarship>();

  if (!scholarship) {
    return c.json(
      {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Scholarship not found' },
      },
      404
    );
  }

  const rulesResult = await c.env.DB.prepare(
    'SELECT * FROM eligibility_rules WHERE scholarship_id = ? ORDER BY is_mandatory DESC, created_at ASC'
  )
    .bind(id)
    .all<EligibilityRule>();

  const docsResult = await c.env.DB.prepare(
    'SELECT * FROM scholarship_documents WHERE scholarship_id = ? ORDER BY is_mandatory DESC, id ASC'
  )
    .bind(id)
    .all<ScholarshipDocument>();

  return c.json({
    success: true,
    scholarship: {
      ...scholarship,
      days_remaining: calculateDaysRemaining(scholarship.deadline),
      rules: rulesResult.results || [],
      documents: docsResult.results || [],
    },
  });
});

// POST /api/scholarships/:id/check-eligibility (Evaluate student eligibility)
scholarshipsRouter.post('/:id/check-eligibility', requireAuth, requireStudent, async (c) => {
  const id = c.req.param('id');
  const user = c.get('user')!;

  // Fetch student profile
  const profile = await c.env.DB.prepare('SELECT * FROM student_profiles WHERE user_id = ?')
    .bind(user.sub)
    .first<StudentProfile>();

  if (!profile) {
    return c.json(
      {
        success: false,
        error: {
          code: 'PROFILE_INCOMPLETE',
          message: 'Please complete your profile before evaluating scholarship eligibility',
        },
      },
      400
    );
  }

  // Fetch scholarship
  const scholarship = await c.env.DB.prepare('SELECT * FROM scholarships WHERE id = ?')
    .bind(id)
    .first<Scholarship>();

  if (!scholarship) {
    return c.json(
      {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Scholarship not found' },
      },
      404
    );
  }

  // Fetch rules
  const rulesResult = await c.env.DB.prepare(
    'SELECT * FROM eligibility_rules WHERE scholarship_id = ? ORDER BY is_mandatory DESC, created_at ASC'
  )
    .bind(id)
    .all<EligibilityRule>();

  const rules = rulesResult.results || [];
  const report = evaluateEligibility(profile, rules);

  // Fetch documents for this scholarship
  const docsResult = await c.env.DB.prepare(
    'SELECT * FROM scholarship_documents WHERE scholarship_id = ? ORDER BY is_mandatory DESC, id ASC'
  )
    .bind(id)
    .all<ScholarshipDocument>();

  const docs = docsResult.results || [];

  // Fetch student's checklist state for these documents
  const checklistResult = await c.env.DB.prepare(
    'SELECT scholarship_document_id, is_completed FROM student_document_checklist WHERE user_id = ?'
  )
    .bind(user.sub)
    .all<{ scholarship_document_id: string; is_completed: number }>();

  const completedDocIds = new Set<string>();
  for (const row of checklistResult.results || []) {
    if (row.is_completed === 1) {
      completedDocIds.add(row.scholarship_document_id);
    }
  }

  const documentDetails = docs.map((doc) => ({
    documentId: doc.id,
    documentName: doc.document_name,
    isMandatory: doc.is_mandatory === 1,
    isCompleted: completedDocIds.has(doc.id),
  }));

  const mandatoryDocs = documentDetails.filter((d) => d.isMandatory);
  const pendingMandatoryDocs = mandatoryDocs.filter((d) => !d.isCompleted);

  let finalVerdict = report.verdict;
  let finalSummary = report.summary;

  if (report.verdict === 'NOT_ELIGIBLE') {
    finalVerdict = 'NOT_ELIGIBLE';
    if (pendingMandatoryDocs.length > 0) {
      finalSummary = `${report.summary} Note: You also have ${pendingMandatoryDocs.length} mandatory document(s) pending preparation.`;
    }
  } else if (report.verdict === 'ELIGIBLE') {
    if (pendingMandatoryDocs.length > 0) {
      finalVerdict = 'POSSIBLY_ELIGIBLE';
      const pendingNames = pendingMandatoryDocs.map((d) => d.documentName).join(', ');
      finalSummary = `You satisfy all profile criteria! However, ${pendingMandatoryDocs.length} mandatory document(s) are still pending in your checklist: ${pendingNames}.`;
    } else {
      finalVerdict = 'ELIGIBLE';
      finalSummary = 'You satisfy all eligibility requirements and have marked all required documents as ready!';
    }
  } else {
    // POSSIBLY_ELIGIBLE from profile
    if (pendingMandatoryDocs.length > 0) {
      finalSummary = `${report.summary} Additionally, ${pendingMandatoryDocs.length} mandatory document(s) are pending in your checklist.`;
    }
  }

  return c.json({
    success: true,
    scholarshipId: id,
    scholarshipName: scholarship.name,
    ...report,
    verdict: finalVerdict,
    summary: finalSummary,
    documentDetails,
    documentsReadyCount: documentDetails.filter((d) => d.isCompleted).length,
    documentsTotalCount: documentDetails.length,
    mandatoryDocumentsPendingCount: pendingMandatoryDocs.length,
  });
});

// ==========================================
// ADMIN SCHOLARSHIP ROUTES
// ==========================================

// Apply requireAuth and requireAdmin to all admin scholarship routes
adminScholarshipsRouter.use('*', requireAuth, requireAdmin);

// GET /api/admin/scholarships (List all with rule and document counts)
adminScholarshipsRouter.get('/', async (c) => {
  const sql = `
    SELECT 
      s.*,
      COUNT(DISTINCT r.id) as rules_count,
      COUNT(DISTINCT d.id) as documents_count
    FROM scholarships s
    LEFT JOIN eligibility_rules r ON s.id = r.scholarship_id
    LEFT JOIN scholarship_documents d ON s.id = d.scholarship_id
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `;

  const result = await c.env.DB.prepare(sql).all();
  const rawList = result.results || [];
  const scholarshipIds = rawList.map((s: Record<string, unknown>) => s.id as string);
  const rulesMap: Record<string, EligibilityRule[]> = {};
  const docsMap: Record<string, ScholarshipDocument[]> = {};

  if (scholarshipIds.length > 0) {
    const placeholders = scholarshipIds.map(() => '?').join(',');
    const [rulesResult, docsResult] = await Promise.all([
      c.env.DB.prepare(
        `SELECT * FROM eligibility_rules WHERE scholarship_id IN (${placeholders}) ORDER BY is_mandatory DESC, created_at ASC`
      )
        .bind(...scholarshipIds)
        .all<EligibilityRule>(),
      c.env.DB.prepare(
        `SELECT * FROM scholarship_documents WHERE scholarship_id IN (${placeholders}) ORDER BY is_mandatory DESC, id ASC`
      )
        .bind(...scholarshipIds)
        .all<ScholarshipDocument>(),
    ]);

    for (const r of rulesResult.results || []) {
      if (!rulesMap[r.scholarship_id]) rulesMap[r.scholarship_id] = [];
      rulesMap[r.scholarship_id].push(r);
    }

    for (const d of docsResult.results || []) {
      if (!docsMap[d.scholarship_id]) docsMap[d.scholarship_id] = [];
      docsMap[d.scholarship_id].push(d);
    }
  }

  const scholarships = rawList.map((s: Record<string, unknown>) => ({
    ...s,
    days_remaining: calculateDaysRemaining(s.deadline as string),
    rules_count: Number(s.rules_count || (rulesMap[s.id as string] || []).length),
    documents_count: Number(s.documents_count || (docsMap[s.id as string] || []).length),
    rules: rulesMap[s.id as string] || [],
    documents: docsMap[s.id as string] || [],
  }));

  return c.json({
    success: true,
    count: scholarships.length,
    scholarships,
  });
});

// POST /api/admin/scholarships (Create scholarship with rules and documents)
adminScholarshipsRouter.post('/', async (c) => {
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

  const parseResult = scholarshipCreateSchema.safeParse(body);
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

  const data = parseResult.data;
  const scholarshipId = crypto.randomUUID();
  const now = new Date().toISOString();

  const statements: D1PreparedStatement[] = [];

  // Insert scholarship
  statements.push(
    c.env.DB.prepare(
      `INSERT INTO scholarships (
        id, name, provider, description, amount_description,
        amount_value, deadline, official_notice_url, created_by,
        is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      scholarshipId,
      data.name,
      data.provider,
      data.description,
      data.amount_description,
      data.amount_value,
      data.deadline,
      data.official_notice_url,
      user.sub,
      data.is_published,
      now,
      now
    )
  );

  // Insert rules
  for (const rule of data.rules) {
    const ruleId = crypto.randomUUID();
    statements.push(
      c.env.DB.prepare(
        `INSERT INTO eligibility_rules (
          id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        ruleId,
        scholarshipId,
        rule.field_name,
        rule.operator,
        rule.expected_value,
        rule.is_mandatory,
        rule.rule_description,
        now
      )
    );
  }

  // Insert documents
  for (const doc of data.documents) {
    const docId = crypto.randomUUID();
    statements.push(
      c.env.DB.prepare(
        `INSERT INTO scholarship_documents (
          id, scholarship_id, document_name, is_mandatory, instructions
        ) VALUES (?, ?, ?, ?, ?)`
      ).bind(docId, scholarshipId, doc.document_name, doc.is_mandatory, doc.instructions || null)
    );
  }

  await c.env.DB.batch(statements);

  const createdScholarship = await c.env.DB.prepare('SELECT * FROM scholarships WHERE id = ?')
    .bind(scholarshipId)
    .first<Scholarship>();

  const createdRules = await c.env.DB.prepare('SELECT * FROM eligibility_rules WHERE scholarship_id = ?')
    .bind(scholarshipId)
    .all<EligibilityRule>();

  const createdDocs = await c.env.DB.prepare('SELECT * FROM scholarship_documents WHERE scholarship_id = ?')
    .bind(scholarshipId)
    .all<ScholarshipDocument>();

  return c.json(
    {
      success: true,
      scholarship: {
        ...createdScholarship,
        days_remaining: calculateDaysRemaining(data.deadline),
        rules: createdRules.results || [],
        documents: createdDocs.results || [],
      },
    },
    201
  );
});

// PUT /api/admin/scholarships/:id (Update scholarship metadata, rules, and documents)
adminScholarshipsRouter.put('/:id', async (c) => {
  const id = c.req.param('id');

  const existing = await c.env.DB.prepare('SELECT * FROM scholarships WHERE id = ?')
    .bind(id)
    .first<Scholarship>();

  if (!existing) {
    return c.json(
      {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Scholarship not found' },
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

  const parseResult = scholarshipUpdateSchema.safeParse(body);
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

  const data = parseResult.data;
  const now = new Date().toISOString();
  const statements: D1PreparedStatement[] = [];

  // Update scholarship fields
  statements.push(
    c.env.DB.prepare(
      `UPDATE scholarships SET
        name = COALESCE(?, name),
        provider = COALESCE(?, provider),
        description = COALESCE(?, description),
        amount_description = COALESCE(?, amount_description),
        amount_value = COALESCE(?, amount_value),
        deadline = COALESCE(?, deadline),
        official_notice_url = COALESCE(?, official_notice_url),
        is_published = COALESCE(?, is_published),
        updated_at = ?
      WHERE id = ?`
    ).bind(
      data.name !== undefined ? data.name : null,
      data.provider !== undefined ? data.provider : null,
      data.description !== undefined ? data.description : null,
      data.amount_description !== undefined ? data.amount_description : null,
      data.amount_value !== undefined ? data.amount_value : null,
      data.deadline !== undefined ? data.deadline : null,
      data.official_notice_url !== undefined ? data.official_notice_url : null,
      data.is_published !== undefined ? data.is_published : null,
      now,
      id
    )
  );

  // If rules array was provided, re-sync rules
  if (data.rules !== undefined) {
    statements.push(c.env.DB.prepare('DELETE FROM eligibility_rules WHERE scholarship_id = ?').bind(id));
    for (const rule of data.rules) {
      const ruleId = crypto.randomUUID();
      statements.push(
        c.env.DB.prepare(
          `INSERT INTO eligibility_rules (
            id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          ruleId,
          id,
          rule.field_name,
          rule.operator,
          rule.expected_value,
          rule.is_mandatory,
          rule.rule_description,
          now
        )
      );
    }
  }

  // If documents array was provided, re-sync documents
  if (data.documents !== undefined) {
    statements.push(c.env.DB.prepare('DELETE FROM scholarship_documents WHERE scholarship_id = ?').bind(id));
    for (const doc of data.documents) {
      const docId = crypto.randomUUID();
      statements.push(
        c.env.DB.prepare(
          `INSERT INTO scholarship_documents (
            id, scholarship_id, document_name, is_mandatory, instructions
          ) VALUES (?, ?, ?, ?, ?)`
        ).bind(docId, id, doc.document_name, doc.is_mandatory, doc.instructions || null)
      );
    }
  }

  await c.env.DB.batch(statements);

  const updatedScholarship = await c.env.DB.prepare('SELECT * FROM scholarships WHERE id = ?')
    .bind(id)
    .first<Scholarship>();

  const updatedRules = await c.env.DB.prepare('SELECT * FROM eligibility_rules WHERE scholarship_id = ?')
    .bind(id)
    .all<EligibilityRule>();

  const updatedDocs = await c.env.DB.prepare('SELECT * FROM scholarship_documents WHERE scholarship_id = ?')
    .bind(id)
    .all<ScholarshipDocument>();

  return c.json({
    success: true,
    scholarship: {
      ...updatedScholarship,
      days_remaining: calculateDaysRemaining(updatedScholarship!.deadline),
      rules: updatedRules.results || [],
      documents: updatedDocs.results || [],
    },
  });
});

// DELETE /api/admin/scholarships/:id (Cascade delete scholarship)
adminScholarshipsRouter.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const existing = await c.env.DB.prepare('SELECT id FROM scholarships WHERE id = ?')
    .bind(id)
    .first();

  if (!existing) {
    return c.json(
      {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Scholarship not found' },
      },
      404
    );
  }

  // Cascade delete using batch (foreign keys with ON DELETE CASCADE will also delete rules/docs)
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM eligibility_rules WHERE scholarship_id = ?').bind(id),
    c.env.DB.prepare('DELETE FROM scholarship_documents WHERE scholarship_id = ?').bind(id),
    c.env.DB.prepare('DELETE FROM scholarships WHERE id = ?').bind(id),
  ]);

  return c.json({
    success: true,
    message: 'Scholarship deleted successfully',
  });
});
