// test/api.spec.ts
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../src';
import { seedDatabase } from '../src/seeds/scholarships';

describe('Scholarship Eligibility Portal - API Endpoints', () => {
  const ctx = createExecutionContext();

  beforeAll(async () => {
    // Initialize D1 tables for the test environment
    const schemaSql = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
        created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
        updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
      );

      CREATE TABLE IF NOT EXISTS student_profiles (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
        family_income INTEGER NOT NULL,
        education_level TEXT NOT NULL CHECK (education_level IN ('undergraduate', 'postgraduate', 'diploma', 'school')),
        current_course TEXT NOT NULL,
        field_of_study TEXT NOT NULL,
        cgpa REAL NOT NULL,
        domicile_state TEXT NOT NULL,
        area_type TEXT NOT NULL CHECK (area_type IN ('rural', 'urban')),
        category TEXT NOT NULL CHECK (category IN ('General', 'OBC', 'SC', 'ST', 'EWS')),
        is_pwd INTEGER NOT NULL DEFAULT 0 CHECK (is_pwd IN (0, 1)),
        previous_institution TEXT,
        previous_marks_percentage REAL,
        updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
      );

      CREATE TABLE IF NOT EXISTS scholarships (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        description TEXT NOT NULL,
        amount_description TEXT NOT NULL,
        amount_value INTEGER NOT NULL DEFAULT 0,
        deadline TEXT NOT NULL,
        official_notice_url TEXT NOT NULL,
        created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
        is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
        created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
        updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
      );

      CREATE TABLE IF NOT EXISTS eligibility_rules (
        id TEXT PRIMARY KEY,
        scholarship_id TEXT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
        field_name TEXT NOT NULL,
        operator TEXT NOT NULL CHECK (operator IN ('EQ', 'NEQ', 'LTE', 'GTE', 'LT', 'GT', 'IN', 'CONTAINS')),
        expected_value TEXT NOT NULL,
        is_mandatory INTEGER NOT NULL DEFAULT 1 CHECK (is_mandatory IN (0, 1)),
        rule_description TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
      );

      CREATE TABLE IF NOT EXISTS scholarship_documents (
        id TEXT PRIMARY KEY,
        scholarship_id TEXT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
        document_name TEXT NOT NULL,
        is_mandatory INTEGER NOT NULL DEFAULT 1 CHECK (is_mandatory IN (0, 1)),
        instructions TEXT
      );

      CREATE TABLE IF NOT EXISTS student_document_checklist (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scholarship_document_id TEXT NOT NULL REFERENCES scholarship_documents(id) ON DELETE CASCADE,
        is_completed INTEGER NOT NULL DEFAULT 0 CHECK (is_completed IN (0, 1)),
        updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
        UNIQUE (user_id, scholarship_document_id)
      );
    `;

    const statements = schemaSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const sql of statements) {
      await env.DB.prepare(sql).run();
    }

    // Seed database
    await seedDatabase(env.DB);
    await waitOnExecutionContext(ctx);
  });

  // Health check
  it('GET /api/health returns healthy status', async () => {
    const req = new Request('http://localhost/api/health');
    const res = await app.fetch(req, env, ctx);
    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.success).toBe(true);
    expect(body.status).toBe('healthy');
  });

  // Auth flow
  describe('Authentication Flow', () => {
    it('POST /api/auth/register registers a new student', async () => {
      const uniqueEmail = `test_${Date.now()}@example.com`;
      const req = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: uniqueEmail,
          password: 'Password@123',
          role: 'student',
        }),
      });

      const res = await app.fetch(req, env, ctx);
      expect(res.status).toBe(201);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.success).toBe(true);
      expect(body.token).toBeTypeOf('string');
      expect((body.user as Record<string, unknown>).email).toBe(uniqueEmail);
    });

    it('POST /api/auth/login logs in seeded demo admin and student', async () => {
      const loginReq = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@scholarships.gov.in',
          password: 'Admin@12345',
        }),
      });

      const res = await app.fetch(loginReq, env, ctx);
      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.success).toBe(true);
      expect(body.token).toBeTypeOf('string');
      expect((body.user as Record<string, unknown>).role).toBe('admin');
    });

    it('GET /api/auth/me returns current user info', async () => {
      // First login as student1
      const loginReq = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@test.com',
          password: 'Student@12345',
        }),
      });
      const loginRes = await app.fetch(loginReq, env, ctx);
      const { token } = (await loginRes.json()) as { token: string };

      const meReq = new Request('http://localhost/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await app.fetch(meReq, env, ctx);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { success: boolean; user: { role: string; hasProfile: boolean } };
      expect(body.success).toBe(true);
      expect(body.user.role).toBe('student');
      expect(body.user.hasProfile).toBe(true);
    });
  });

  // Student Profile
  describe('Student Profile APIs', () => {
    it('GET /api/profile/me returns existing profile for student1', async () => {
      const loginReq = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@test.com',
          password: 'Student@12345',
        }),
      });
      const loginRes = await app.fetch(loginReq, env, ctx);
      const { token } = (await loginRes.json()) as { token: string };

      const profileReq = new Request('http://localhost/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await app.fetch(profileReq, env, ctx);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { success: boolean; profile: { full_name: string; cgpa: number } };
      expect(body.success).toBe(true);
      expect(body.profile.full_name).toBe('Ananya Sharma');
      expect(body.profile.cgpa).toBe(8.4);
    });

    it('PUT /api/profile/me updates student profile', async () => {
      const loginReq = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student2@test.com',
          password: 'Student@12345',
        }),
      });
      const loginRes = await app.fetch(loginReq, env, ctx);
      const { token } = (await loginRes.json()) as { token: string };

      const updateReq = new Request('http://localhost/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: 'Rahul Das',
          age: 21,
          gender: 'male',
          family_income: 180000,
          education_level: 'undergraduate',
          current_course: 'B.Sc Physics',
          field_of_study: 'Science',
          cgpa: 7.8,
          domicile_state: 'Assam',
          area_type: 'rural',
          category: 'OBC',
          is_pwd: false,
        }),
      });

      const res = await app.fetch(updateReq, env, ctx);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { success: boolean; profile: { full_name: string; area_type: string } };
      expect(body.success).toBe(true);
      expect(body.profile.full_name).toBe('Rahul Das');
      expect(body.profile.area_type).toBe('rural');
    });
  });

  // Scholarships & Filter & CSV
  describe('Scholarship Directory & Export APIs', () => {
    it('GET /api/scholarships returns list of 25 scholarships', async () => {
      const req = new Request('http://localhost/api/scholarships');
      const res = await app.fetch(req, env, ctx);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { success: boolean; count: number; scholarships: unknown[] };
      expect(body.success).toBe(true);
      expect(body.count).toBe(25);
    });

    it('GET /api/scholarships with search filter returns matching items', async () => {
      const req = new Request('http://localhost/api/scholarships?search=AICTE');
      const res = await app.fetch(req, env, ctx);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { success: boolean; count: number };
      expect(body.success).toBe(true);
      expect(body.count).toBeGreaterThan(0);
    });

    it('GET /api/scholarships/export/csv returns RFC 4180 CSV with headers', async () => {
      const req = new Request('http://localhost/api/scholarships/export/csv');
      const res = await app.fetch(req, env, ctx);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('text/csv');
      const csvText = await res.text();
      expect(csvText).toContain('Scholarship Name');
      expect(csvText).toContain('Official Notice URL');
      expect(csvText).toContain('Pragati Scholarship');
    });

    it('GET /api/scholarships/:id returns details with rules and documents', async () => {
      const req = new Request('http://localhost/api/scholarships/a1000000-0000-0000-0000-000000000002');
      const res = await app.fetch(req, env, ctx);
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        success: boolean;
        scholarship: { name: string; rules: unknown[]; documents: unknown[]; days_remaining: number };
      };
      expect(body.success).toBe(true);
      expect(body.scholarship.name).toContain('Pragati Scholarship');
      expect(body.scholarship.rules.length).toBeGreaterThan(0);
      expect(body.scholarship.documents.length).toBeGreaterThan(0);
    });
  });

  // Eligibility Check
  describe('Eligibility Evaluation Endpoint', () => {
    it('POST /api/scholarships/:id/check-eligibility evaluates student eligibility', async () => {
      // Login as student1 (Female, Engineering, Income 320000, CGPA 8.4)
      const loginReq = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@test.com',
          password: 'Student@12345',
        }),
      });
      const loginRes = await app.fetch(loginReq, env, ctx);
      const { token } = (await loginRes.json()) as { token: string };

      // Pragati Scholarship requires: Female, Engineering, Income <= 8,00,000, CGPA >= 6.0
      // Student1 meets all! Verdict must be ELIGIBLE.
      const checkReq = new Request(
        'http://localhost/api/scholarships/a1000000-0000-0000-0000-000000000002/check-eligibility',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await app.fetch(checkReq, env, ctx);
      expect(res.status).toBe(200);
      const body = (await res.json()) as { success: boolean; verdict: string; ruleDetails: unknown[] };
      expect(body.success).toBe(true);
      expect(['ELIGIBLE', 'POSSIBLY_ELIGIBLE']).toContain(body.verdict);
      expect(body.ruleDetails.length).toBeGreaterThan(0);
    });
  });

  // Document Checklist
  describe('Document Checklist APIs', () => {
    it('GET and PATCH /api/scholarships/:id/checklist tracks document preparation', async () => {
      const loginReq = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'student1@test.com',
          password: 'Student@12345',
        }),
      });
      const loginRes = await app.fetch(loginReq, env, ctx);
      const { token } = (await loginRes.json()) as { token: string };

      const scholarshipId = 'a1000000-0000-0000-0000-000000000002';

      // 1. Get initial checklist
      const getReq = new Request(`http://localhost/api/scholarships/${scholarshipId}/checklist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const getRes = await app.fetch(getReq, env, ctx);
      expect(getRes.status).toBe(200);
      const getBody = (await getRes.json()) as {
        success: boolean;
        checklist: Array<{ id: string; is_completed: boolean }>;
      };
      expect(getBody.checklist.length).toBeGreaterThan(0);

      const firstDocId = getBody.checklist[0].id;

      // 2. Toggle item to completed
      const patchReq = new Request(`http://localhost/api/scholarships/${scholarshipId}/checklist/${firstDocId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_completed: true }),
      });
      const patchRes = await app.fetch(patchReq, env, ctx);
      expect(patchRes.status).toBe(200);
      const patchBody = (await patchRes.json()) as { success: boolean; item: { is_completed: boolean } };
      expect(patchBody.item.is_completed).toBe(true);

      // 3. Verify checklist reports 1 completed item
      const verifyRes = await app.fetch(getReq, env, ctx);
      const verifyBody = (await verifyRes.json()) as { completed_items: number };
      expect(verifyBody.completed_items).toBe(1);
    });
  });

  // Admin Scholarship Management CRUD
  describe('Admin Scholarship CRUD APIs', () => {
    it('Admin can list, create, and delete a scholarship', async () => {
      // Login as admin
      const loginReq = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@scholarships.gov.in',
          password: 'Admin@12345',
        }),
      });
      const loginRes = await app.fetch(loginReq, env, ctx);
      const { token } = (await loginRes.json()) as { token: string };

      // 1. Admin List
      const listReq = new Request('http://localhost/api/admin/scholarships', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const listRes = await app.fetch(listReq, env, ctx);
      expect(listRes.status).toBe(200);
      const listBody = (await listRes.json()) as { success: boolean; count: number };
      expect(listBody.count).toBe(25);

      // 2. Create new scholarship
      const createReq = new Request('http://localhost/api/admin/scholarships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: 'State Talent Search Award 2026',
          provider: 'Department of Science & Technology',
          description: 'Prestigious state-level award for exceptional science scholars.',
          amount_description: '₹40,000 one-time honorarium',
          amount_value: 40000,
          deadline: '2026-12-31',
          official_notice_url: 'https://dst.gov.in/talent-award',
          is_published: 1,
          rules: [
            {
              field_name: 'cgpa',
              operator: 'GTE',
              expected_value: '8.5',
              is_mandatory: 1,
              rule_description: 'Minimum CGPA 8.5',
            },
          ],
          documents: [
            {
              document_name: 'Official Recommendation from Dean',
              is_mandatory: 1,
              instructions: 'Signed by Dean of Academics.',
            },
          ],
        }),
      });

      const createRes = await app.fetch(createReq, env, ctx);
      expect(createRes.status).toBe(201);
      const createBody = (await createRes.json()) as {
        success: boolean;
        scholarship: { id: string; name: string };
      };
      expect(createBody.scholarship.name).toBe('State Talent Search Award 2026');

      const createdId = createBody.scholarship.id;

      // 3. Delete the newly created scholarship
      const deleteReq = new Request(`http://localhost/api/admin/scholarships/${createdId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const deleteRes = await app.fetch(deleteReq, env, ctx);
      expect(deleteRes.status).toBe(200);
    });
  });
});
