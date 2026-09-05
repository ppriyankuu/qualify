// test/rules-engine.spec.ts
import { describe, it, expect } from 'vitest';
import {
  evaluateOperator,
  evaluateRule,
  evaluateEligibility,
} from '../src/modules/rules-engine';
import type { EligibilityRule, StudentProfile } from '../src/types';

describe('Deterministic Rule Engine - Operator Evaluator', () => {
  describe('EQ & NEQ operators', () => {
    it('evaluates string equality case-insensitively', () => {
      expect(evaluateOperator('Engineering', 'EQ', 'engineering')).toBe(true);
      expect(evaluateOperator('Medical', 'EQ', 'Engineering')).toBe(false);
      expect(evaluateOperator('General', 'NEQ', 'SC')).toBe(true);
      expect(evaluateOperator('SC', 'NEQ', 'sc')).toBe(false);
    });

    it('evaluates numeric equality', () => {
      expect(evaluateOperator(20, 'EQ', '20')).toBe(true);
      expect(evaluateOperator(21, 'EQ', '20')).toBe(false);
      expect(evaluateOperator(20, 'NEQ', '21')).toBe(true);
    });

    it('evaluates boolean / flag equality for is_pwd', () => {
      expect(evaluateOperator(1, 'EQ', '1')).toBe(true);
      expect(evaluateOperator(0, 'EQ', '1')).toBe(false);
      expect(evaluateOperator(true, 'EQ', 'true')).toBe(true);
      expect(evaluateOperator(false, 'EQ', 'true')).toBe(false);
    });
  });

  describe('GTE & LTE comparison operators', () => {
    it('evaluates CGPA boundary scenarios correctly', () => {
      // Required CGPA >= 7.5
      expect(evaluateOperator(7.5, 'GTE', '7.5')).toBe(true);
      expect(evaluateOperator(7.51, 'GTE', '7.5')).toBe(true);
      expect(evaluateOperator(7.49, 'GTE', '7.5')).toBe(false);

      // Required CGPA > 7.5
      expect(evaluateOperator(7.5, 'GT', '7.5')).toBe(false);
      expect(evaluateOperator(7.51, 'GT', '7.5')).toBe(true);
    });

    it('evaluates Annual Family Income boundary scenarios correctly', () => {
      // Limit <= 5,00,000
      expect(evaluateOperator(500000, 'LTE', '500000')).toBe(true);
      expect(evaluateOperator(499999, 'LTE', '500000')).toBe(true);
      expect(evaluateOperator(500001, 'LTE', '500000')).toBe(false);

      // Strict limit < 500000
      expect(evaluateOperator(500000, 'LT', '500000')).toBe(false);
      expect(evaluateOperator(499999, 'LT', '500000')).toBe(true);
    });
  });

  describe('IN & CONTAINS operators', () => {
    it('evaluates comma-separated list inclusion (IN)', () => {
      expect(evaluateOperator('Assam', 'IN', 'Assam, Meghalaya, Manipur')).toBe(true);
      expect(evaluateOperator('assam', 'IN', 'Assam, Meghalaya, Manipur')).toBe(true);
      expect(evaluateOperator('Delhi', 'IN', 'Assam, Meghalaya, Manipur')).toBe(false);
    });

    it('evaluates JSON array formatted string (IN)', () => {
      expect(evaluateOperator('SC', 'IN', '["SC", "ST", "OBC"]')).toBe(true);
      expect(evaluateOperator('General', 'IN', '["SC", "ST", "OBC"]')).toBe(false);
    });

    it('evaluates substring containment (CONTAINS)', () => {
      expect(evaluateOperator('Computer Science and Engineering', 'CONTAINS', 'Engineering')).toBe(true);
      expect(evaluateOperator('Bachelor of Commerce', 'CONTAINS', 'Science')).toBe(false);
    });

    it('evaluates field_of_study with compound and canonical names', () => {
      const relRuleExpected = 'Engineering, Medical, Architecture, Design, Law';

      // "Engineering & Technology" -> should match "Engineering"
      expect(evaluateOperator('Engineering & Technology', 'IN', relRuleExpected, 'field_of_study')).toBe(true);
      // "engineering and technology" -> should match "Engineering"
      expect(evaluateOperator('engineering and technology', 'IN', relRuleExpected, 'field_of_study')).toBe(true);
      // "Medicine & Healthcare" -> should match "Medical"
      expect(evaluateOperator('Medicine & Healthcare', 'IN', relRuleExpected, 'field_of_study')).toBe(true);
      // "Architecture & Design" -> should match "Architecture"
      expect(evaluateOperator('Architecture & Design', 'IN', relRuleExpected, 'field_of_study')).toBe(true);
      // "Law & Legal Studies" -> should match "Law"
      expect(evaluateOperator('Law & Legal Studies', 'IN', relRuleExpected, 'field_of_study')).toBe(true);

      // "Commerce & Management" -> should NOT match
      expect(evaluateOperator('Commerce & Management', 'IN', relRuleExpected, 'field_of_study')).toBe(false);
      // "Humanities & Social Sciences" -> should NOT match
      expect(evaluateOperator('Humanities & Social Sciences', 'IN', relRuleExpected, 'field_of_study')).toBe(false);
    });
  });
});

describe('Deterministic Rule Engine - Missing Data & Aggregate Decision', () => {
  const baseProfile: Partial<StudentProfile> = {
    full_name: 'Ananya Sharma',
    age: 20,
    gender: 'female',
    family_income: 320000,
    education_level: 'undergraduate',
    current_course: 'B.Tech Computer Science',
    field_of_study: 'Engineering',
    cgpa: 8.4,
    domicile_state: 'Assam',
    area_type: 'urban',
    category: 'General',
    is_pwd: 0,
    previous_marks_percentage: 88.5,
  };

  it('marks rule as UNKNOWN if the student profile field is null or undefined', () => {
    const incompleteProfile: Partial<StudentProfile> = {
      ...baseProfile,
      previous_marks_percentage: null,
    };

    const rule: EligibilityRule = {
      id: 'r1',
      scholarship_id: 's1',
      field_name: 'previous_marks_percentage',
      operator: 'GTE',
      expected_value: '80.0',
      is_mandatory: 1,
      rule_description: 'Previous examination marks must be at least 80%',
      created_at: new Date().toISOString(),
    };

    const result = evaluateRule(rule, incompleteProfile);
    expect(result.status).toBe('UNKNOWN');
    expect(result.actual).toBeNull();
    expect(result.reason).toContain('this information is not available in your profile');
  });

  it('verdict is ELIGIBLE when all mandatory rules PASS', () => {
    const rules: EligibilityRule[] = [
      {
        id: 'r1',
        scholarship_id: 's1',
        field_name: 'gender',
        operator: 'EQ',
        expected_value: 'female',
        is_mandatory: 1,
        rule_description: 'Female students only',
        created_at: new Date().toISOString(),
      },
      {
        id: 'r2',
        scholarship_id: 's1',
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '500000',
        is_mandatory: 1,
        rule_description: 'Annual family income <= 5,00,000',
        created_at: new Date().toISOString(),
      },
      {
        id: 'r3',
        scholarship_id: 's1',
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '7.0',
        is_mandatory: 1,
        rule_description: 'Minimum CGPA 7.0',
        created_at: new Date().toISOString(),
      },
    ];

    const report = evaluateEligibility(baseProfile, rules);
    expect(report.verdict).toBe('ELIGIBLE');
    expect(report.ruleDetails.every((r) => r.status === 'PASS')).toBe(true);
    expect(report.summary).toContain('satisfy all evaluated eligibility requirements');
  });

  it('verdict is NOT_ELIGIBLE if even 1 mandatory rule FAILS', () => {
    const rules: EligibilityRule[] = [
      {
        id: 'r1',
        scholarship_id: 's1',
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '200000', // Student has 320000 -> FAIL
        is_mandatory: 1,
        rule_description: 'Annual family income <= 2,00,000',
        created_at: new Date().toISOString(),
      },
      {
        id: 'r2',
        scholarship_id: 's1',
        field_name: 'gender',
        operator: 'EQ',
        expected_value: 'female', // PASS
        is_mandatory: 1,
        rule_description: 'Female students only',
        created_at: new Date().toISOString(),
      },
    ];

    const report = evaluateEligibility(baseProfile, rules);
    expect(report.verdict).toBe('NOT_ELIGIBLE');
    expect(report.summary).toContain('do not meet one or more mandatory requirements');
  });

  it('verdict is POSSIBLY_ELIGIBLE if 0 mandatory rules fail but at least 1 is UNKNOWN', () => {
    const incompleteProfile: Partial<StudentProfile> = {
      ...baseProfile,
      previous_marks_percentage: null,
    };

    const rules: EligibilityRule[] = [
      {
        id: 'r1',
        scholarship_id: 's1',
        field_name: 'gender',
        operator: 'EQ',
        expected_value: 'female', // PASS
        is_mandatory: 1,
        rule_description: 'Female students only',
        created_at: new Date().toISOString(),
      },
      {
        id: 'r2',
        scholarship_id: 's1',
        field_name: 'previous_marks_percentage', // UNKNOWN
        operator: 'GTE',
        expected_value: '80.0',
        is_mandatory: 1,
        rule_description: 'Previous examination marks must be at least 80%',
        created_at: new Date().toISOString(),
      },
    ];

    const report = evaluateEligibility(incompleteProfile, rules);
    expect(report.verdict).toBe('POSSIBLY_ELIGIBLE');
    expect(report.summary).toContain('could not be confirmed from your profile data');
  });

  it('correctly FAILS female-only scholarship for male student and formats gender with capital letter', () => {
    const maleProfile: Partial<StudentProfile> = {
      ...baseProfile,
      gender: 'male',
    };

    const femaleOnlyRule: EligibilityRule = {
      id: 'r_female',
      scholarship_id: 's_women_in_stem',
      field_name: 'gender',
      operator: 'EQ',
      expected_value: 'female',
      is_mandatory: 1,
      rule_description: 'Exclusively for female students.',
      created_at: new Date().toISOString(),
    };

    const result = evaluateRule(femaleOnlyRule, maleProfile);
    expect(result.status).toBe('FAIL');
    expect(result.actual).toBe('Male');
    expect(result.expected).toBe('Female');
    expect(result.reason).toBe('This scholarship is specified for Female applicants (your profile: Male).');

    const report = evaluateEligibility(maleProfile, [femaleOnlyRule]);
    expect(report.verdict).toBe('NOT_ELIGIBLE');
  });

  it('correctly formats education_level with capital letter and avoids double dots', () => {
    const postgradProfile: Partial<StudentProfile> = {
      ...baseProfile,
      education_level: 'postgraduate',
    };

    const diplomaRule: EligibilityRule = {
      id: 'r_diploma',
      scholarship_id: 's_polytechnic',
      field_name: 'education_level',
      operator: 'EQ',
      expected_value: 'diploma',
      is_mandatory: 1,
      rule_description: 'Must be enrolled in a recognized 3-year Polytechnic Diploma course.',
      created_at: new Date().toISOString(),
    };

    const result = evaluateRule(diplomaRule, postgradProfile);
    expect(result.status).toBe('FAIL');
    expect(result.actual).toBe('Postgraduate');
    expect(result.expected).toBe('Diploma');
    expect(result.reason).toBe('This scholarship requires Diploma education level (your profile: Postgraduate).');
    expect(result.reason).not.toContain('..');
  });
});
