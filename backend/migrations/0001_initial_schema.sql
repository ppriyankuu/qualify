-- 0001_initial_schema.sql
-- Scholarship Eligibility Portal Database Schema

-- Users & Authentication Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
    created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Student Profiles Table
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

-- Scholarships Table
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

CREATE INDEX IF NOT EXISTS idx_scholarships_published ON scholarships(is_published);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);

-- Eligibility Rules Table
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

CREATE INDEX IF NOT EXISTS idx_eligibility_rules_scholarship_id ON eligibility_rules(scholarship_id);

-- Required Documents Table
CREATE TABLE IF NOT EXISTS scholarship_documents (
    id TEXT PRIMARY KEY,
    scholarship_id TEXT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    is_mandatory INTEGER NOT NULL DEFAULT 1 CHECK (is_mandatory IN (0, 1)),
    instructions TEXT
);

CREATE INDEX IF NOT EXISTS idx_scholarship_documents_scholarship_id ON scholarship_documents(scholarship_id);

-- Student Document Checklist Table
CREATE TABLE IF NOT EXISTS student_document_checklist (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scholarship_document_id TEXT NOT NULL REFERENCES scholarship_documents(id) ON DELETE CASCADE,
    is_completed INTEGER NOT NULL DEFAULT 0 CHECK (is_completed IN (0, 1)),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now')),
    UNIQUE (user_id, scholarship_document_id)
);

CREATE INDEX IF NOT EXISTS idx_checklist_user_doc ON student_document_checklist(user_id, scholarship_document_id);
