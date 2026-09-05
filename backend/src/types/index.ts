export type UserRole = 'student' | 'admin';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type EducationLevel = 'undergraduate' | 'postgraduate' | 'diploma' | 'school';
export type AreaType = 'rural' | 'urban';
export type SocialCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export type RuleOperator = 'EQ' | 'NEQ' | 'LTE' | 'GTE' | 'LT' | 'GT' | 'IN' | 'CONTAINS';

export type EvaluationStatus = 'PASS' | 'FAIL' | 'UNKNOWN';
export type EligibilityVerdict = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'POSSIBLY_ELIGIBLE';

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  user_id: string;
  full_name: string;
  age: number;
  gender: Gender;
  family_income: number;
  education_level: EducationLevel;
  current_course: string;
  field_of_study: string;
  cgpa: number;
  domicile_state: string;
  area_type: AreaType;
  category: SocialCategory;
  is_pwd: number; // 0 or 1
  previous_institution?: string | null;
  previous_marks_percentage?: number | null;
  updated_at: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  amount_description: string;
  amount_value: number;
  deadline: string;
  official_notice_url: string;
  created_by?: string | null;
  is_published: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export interface EligibilityRule {
  id: string;
  scholarship_id: string;
  field_name: string;
  operator: RuleOperator;
  expected_value: string;
  is_mandatory: number; // 0 or 1
  rule_description: string;
  created_at: string;
}

export interface ScholarshipDocument {
  id: string;
  scholarship_id: string;
  document_name: string;
  is_mandatory: number; // 0 or 1
  instructions?: string | null;
}

export interface StudentDocumentChecklistItem {
  id: string;
  user_id: string;
  scholarship_document_id: string;
  is_completed: number; // 0 or 1
  updated_at: string;
}

export interface RuleResult {
  ruleId: string;
  field: string;
  description: string;
  expected: string;
  actual: string | number | boolean | null;
  status: EvaluationStatus;
  reason: string;
}

export interface DocumentEvaluationResult {
  documentId: string;
  documentName: string;
  isMandatory: boolean;
  isCompleted: boolean;
}

export interface EligibilityReport {
  verdict: EligibilityVerdict;
  summary: string;
  evaluatedAt: string;
  ruleDetails: RuleResult[];
  documentDetails?: DocumentEvaluationResult[];
  documentsReadyCount?: number;
  documentsTotalCount?: number;
  mandatoryDocumentsPendingCount?: number;
}

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  FRONTEND_URL: string;
}

export type AppVariables = {
  user?: JWTPayload;
};

export type AppEnv = {
  Bindings: Env;
  Variables: AppVariables;
};
