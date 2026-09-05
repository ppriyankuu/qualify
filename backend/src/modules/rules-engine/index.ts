import type {
  EligibilityReport,
  EligibilityRule,
  EligibilityVerdict,
  EvaluationStatus,
  RuleOperator,
  RuleResult,
  StudentProfile,
} from '../../types';

/**
 * Format currency to INR format (e.g. ₹5,00,000)
 */
function formatCurrency(amount: number): string {
  try {
    return `₹${amount.toLocaleString('en-IN')}`;
  } catch {
    return `₹${amount}`;
  }
}

/**
 * Parse expected values for list-based operators (IN)
 */
function parseExpectedList(expected: string): string[] {
  const trimmed = expected.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim().toLowerCase());
      }
    } catch {
      // fallback to comma split
    }
  }
  return trimmed
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Extract field value from student profile
 */
export function getProfileFieldValue(
  profile: Partial<StudentProfile> | null | undefined,
  fieldName: string
): { value: unknown; isMissing: boolean } {
  if (!profile) {
    return { value: null, isMissing: true };
  }

  const rec = profile as Record<string, unknown>;
  let rawValue = rec[fieldName];

  if (rawValue === undefined) {
    const snakeCase = fieldName.replace(/([A-Z])/g, '_$1').toLowerCase();
    const camelCase = fieldName.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
    rawValue = rec[snakeCase] !== undefined ? rec[snakeCase] : rec[camelCase];
  }

  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return { value: null, isMissing: true };
  }

  return { value: rawValue, isMissing: false };
}

/**
 * Format gender for display (capitalized)
 */
export function formatGender(gender: unknown): string {
  if (gender === null || gender === undefined || gender === '') return '';
  const g = String(gender).trim().toLowerCase();
  if (g === 'male') return 'Male';
  if (g === 'female') return 'Female';
  if (g === 'other') return 'Other';
  if (g === 'prefer_not_to_say' || g === 'prefer not to say') return 'Prefer not to say';
  return String(gender).charAt(0).toUpperCase() + String(gender).slice(1);
}

/**
 * Format education level for display (capitalized)
 */
export function formatEducationLevel(level: unknown): string {
  if (level === null || level === undefined || level === '') return '';
  const l = String(level).trim().toLowerCase();
  if (l === 'undergraduate') return 'Undergraduate';
  if (l === 'postgraduate') return 'Postgraduate';
  if (l === 'diploma') return 'Diploma';
  if (l === 'school') return 'School (Class 11-12)';
  return String(level).charAt(0).toUpperCase() + String(level).slice(1);
}

/**
 * Format area type for display (capitalized)
 */
export function formatAreaType(area: unknown): string {
  if (area === null || area === undefined || area === '') return '';
  const a = String(area).trim().toLowerCase();
  if (a === 'rural') return 'Rural';
  if (a === 'urban') return 'Urban';
  return String(area).charAt(0).toUpperCase() + String(area).slice(1);
}

/**
 * Format expected display value for readability
 */
function formatExpectedDisplay(field: string, operator: RuleOperator, expected: string): string {
  const normField = field.toLowerCase().replace(/_/g, '');

  if (normField === 'gender') {
    return formatGender(expected);
  }

  if (normField === 'educationlevel') {
    return formatEducationLevel(expected);
  }

  if (normField === 'areatype') {
    return formatAreaType(expected);
  }

  if (normField === 'familyincome' && !isNaN(Number(expected))) {
    const num = Number(expected);
    if (operator === 'LTE') return `<= ${formatCurrency(num)}`;
    if (operator === 'LT') return `< ${formatCurrency(num)}`;
    if (operator === 'GTE') return `>= ${formatCurrency(num)}`;
    if (operator === 'GT') return `> ${formatCurrency(num)}`;
    return formatCurrency(num);
  }

  if (normField === 'cgpa' && !isNaN(Number(expected))) {
    if (operator === 'GTE') return `>= ${expected}`;
    if (operator === 'GT') return `> ${expected}`;
    if (operator === 'LTE') return `<= ${expected}`;
    if (operator === 'LT') return `< ${expected}`;
    return expected;
  }

  if (normField === 'ispwd') {
    return expected === '1' || expected.toLowerCase() === 'true' ? 'Yes (PwD)' : 'No';
  }

  return expected;
}

/**
 * Format actual display value for readability
 */
function formatActualDisplay(field: string, value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) {
    return null;
  }
  const normField = field.toLowerCase().replace(/_/g, '');
  if (normField === 'gender') {
    return formatGender(value);
  }
  if (normField === 'educationlevel') {
    return formatEducationLevel(value);
  }
  if (normField === 'areatype') {
    return formatAreaType(value);
  }
  if (normField === 'familyincome' && typeof value === 'number') {
    return formatCurrency(value);
  }
  if (normField === 'ispwd') {
    return value === 1 || value === true ? 'Yes' : 'No';
  }
  return value as string | number | boolean;
}

/**
 * Normalizes text for comparison by lowercasing, replacing ampersands, removing punctuation, and collapsing whitespace.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[+/\\(),._-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Known field-of-study domain keyword mappings
 */
export const FIELD_OF_STUDY_DOMAINS: Record<string, string[]> = {
  engineering: [
    'engineering',
    'technology',
    'tech',
    'btech',
    'b.tech',
    'be',
    'b.e',
    'mtech',
    'm.tech',
    'stem',
    'polytechnic',
    'computer engineering',
    'mechanical',
    'electrical',
    'civil',
    'chemical',
    'electronics',
    'aerospace',
    'information technology',
  ],
  medicine: [
    'medicine',
    'medical',
    'healthcare',
    'health',
    'mbbs',
    'bds',
    'nursing',
    'pharmacy',
    'pharma',
    'allied health',
    'biomedical',
    'dental',
    'ayush',
    'bams',
    'bhms',
    'paramedical',
    'physiotherapy',
  ],
  computer: [
    'computer',
    'computing',
    'computer applications',
    'it',
    'information technology',
    'software',
    'computer science',
    'cs',
    'ai',
    'data science',
    'bca',
    'mca',
  ],
  science: [
    'science',
    'sciences',
    'pure science',
    'applied science',
    'physics',
    'chemistry',
    'mathematics',
    'math',
    'biology',
    'biotechnology',
    'botany',
    'zoology',
    'geology',
    'bsc',
    'b.sc',
    'msc',
    'm.sc',
    'stem',
    'biotech',
  ],
  commerce: [
    'commerce',
    'management',
    'business',
    'bcom',
    'b.com',
    'mcom',
    'm.com',
    'bba',
    'mba',
    'finance',
    'accounting',
    'economics',
    'banking',
  ],
  humanities: [
    'humanities',
    'social science',
    'social sciences',
    'arts',
    'ba',
    'b.a',
    'ma',
    'm.a',
    'history',
    'political science',
    'sociology',
    'psychology',
    'literature',
    'philosophy',
  ],
  law: [
    'law',
    'legal',
    'legal studies',
    'llb',
    'll.b',
    'llm',
    'll.m',
    'judiciary',
    'jurisprudence',
  ],
  agriculture: [
    'agriculture',
    'allied science',
    'allied sciences',
    'agricultural',
    'horticulture',
    'forestry',
    'veterinary',
    'fisheries',
    'agronomy',
  ],
  architecture: [
    'architecture',
    'design',
    'barch',
    'b.arch',
    'march',
    'm.arch',
    'planning',
    'interior design',
    'fashion design',
    'fine arts',
    'graphic design',
  ],
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  general: ['general', 'gen', 'open', 'ur', 'unreserved'],
  sc: ['sc', 'scheduled caste'],
  st: ['st', 'scheduled tribe'],
  obc: ['obc', 'obc-ncl', 'other backward classes', 'sebc'],
  ews: ['ews', 'economically weaker section'],
  ebc: ['ebc', 'economically backward class'],
};

function extractMeaningfulTokens(text: string): string[] {
  const stopWords = new Set(['and', 'or', 'of', 'in', 'the', 'for', 'to', 'with', 'by', 'an', 'a']);
  return normalizeText(text)
    .split(' ')
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !stopWords.has(t));
}

export const CANONICAL_FIELD_KEYWORDS: Record<string, string[]> = {
  'engineering and technology': [
    'engineering',
    'technology',
    'tech',
    'btech',
    'b.tech',
    'be',
    'b.e',
    'mtech',
    'm.tech',
    'computer science',
    'polytechnic',
    'stem',
    'mechanical',
    'electrical',
    'civil',
  ],
  'medicine and healthcare': [
    'medicine',
    'medical',
    'healthcare',
    'health',
    'mbbs',
    'bds',
    'nursing',
    'pharmacy',
    'pharma',
    'allied health',
    'dental',
    'ayush',
  ],
  'computer applications it': [
    'computer',
    'it',
    'information technology',
    'software',
    'computer science',
    'bca',
    'mca',
    'ai',
    'computing',
  ],
  'pure and applied sciences': [
    'science',
    'sciences',
    'pure science',
    'applied science',
    'physics',
    'chemistry',
    'mathematics',
    'biology',
    'biotechnology',
    'bsc',
    'b.sc',
    'msc',
    'm.sc',
    'stem',
  ],
  'commerce and management': [
    'commerce',
    'management',
    'business',
    'bcom',
    'b.com',
    'mcom',
    'm.com',
    'bba',
    'mba',
    'finance',
    'accounting',
    'economics',
  ],
  'humanities and social sciences': [
    'humanities',
    'social science',
    'social sciences',
    'arts',
    'ba',
    'b.a',
    'ma',
    'm.a',
    'history',
    'political science',
    'sociology',
    'literature',
  ],
  'law and legal studies': [
    'law',
    'legal',
    'legal studies',
    'llb',
    'll.b',
    'llm',
    'll.m',
    'judiciary',
  ],
  'agriculture and allied sciences': [
    'agriculture',
    'allied science',
    'allied sciences',
    'agricultural',
    'horticulture',
    'forestry',
    'veterinary',
    'fisheries',
  ],
  'architecture and design': [
    'architecture',
    'design',
    'barch',
    'b.arch',
    'march',
    'm.arch',
    'planning',
  ],
  'other multidisciplinary': [
    'other',
    'multidisciplinary',
    'all',
    'any',
  ],
};

export function matchFieldOfStudy(actual: string, expected: string): boolean {
  const normActual = normalizeText(actual);
  const normExpected = normalizeText(expected);

  if (normActual === normExpected) return true;
  if (normExpected === 'all' || normExpected === 'all india' || normExpected === 'any') return true;

  // Find canonical group for student's field
  let studentKeywords: string[] = [];
  for (const [key, keywords] of Object.entries(CANONICAL_FIELD_KEYWORDS)) {
    if (normActual === key || normActual.includes(key) || key.includes(normActual)) {
      studentKeywords = keywords;
      break;
    }
  }

  // If matched to a canonical profile field
  if (studentKeywords.length > 0) {
    // Check if expected item equals or is contained in allowed keywords
    if (studentKeywords.includes(normExpected)) return true;
    const expectedTokens = extractMeaningfulTokens(expected);
    if (expectedTokens.some((t) => studentKeywords.includes(t))) return true;
    return false;
  }

  // Fallback for custom or direct values using meaningful token overlap
  const actualTokens = extractMeaningfulTokens(actual);
  const expectedTokens = extractMeaningfulTokens(expected);
  return actualTokens.some((aTok) => expectedTokens.includes(aTok));
}

function matchCategory(actual: string, expectedList: string[]): boolean {
  const normActual = normalizeText(actual);
  for (const exp of expectedList) {
    const normExp = normalizeText(exp);
    if (normActual === normExp) return true;
    if (normExp === 'all' || normExp === 'any') return true;
    for (const aliases of Object.values(CATEGORY_ALIASES)) {
      if (aliases.includes(normActual) && aliases.includes(normExp)) {
        return true;
      }
    }
  }
  return false;
}

function isFieldOfStudyLike(text: string): boolean {
  const tokens = extractMeaningfulTokens(text);
  for (const domainKeywords of Object.values(FIELD_OF_STUDY_DOMAINS)) {
    if (domainKeywords.some((k) => tokens.includes(k))) {
      return true;
    }
  }
  return false;
}

/**
 * Evaluate a single operator deterministically
 */
export function evaluateOperator(
  actualValue: unknown,
  operator: RuleOperator,
  expectedValue: string,
  fieldName?: string
): boolean {
  const normExpected = expectedValue.trim();

  // Boolean handling for fields like is_pwd
  if (
    typeof actualValue === 'boolean' ||
    (typeof actualValue === 'number' &&
      (actualValue === 0 || actualValue === 1) &&
      (normExpected === '0' ||
        normExpected === '1' ||
        normExpected.toLowerCase() === 'true' ||
        normExpected.toLowerCase() === 'false'))
  ) {
    const actualBool = Boolean(actualValue);
    const expectedBool = normExpected === '1' || normExpected.toLowerCase() === 'true';
    if (operator === 'EQ') return actualBool === expectedBool;
    if (operator === 'NEQ') return actualBool !== expectedBool;
  }

  // Numeric comparisons
  const actualNum = Number(actualValue);
  const expectedNum = Number(normExpected);
  const isBothNumeric =
    !isNaN(actualNum) && !isNaN(expectedNum) && actualValue !== '' && normExpected !== '';

  if (isBothNumeric) {
    switch (operator) {
      case 'EQ':
        return actualNum === expectedNum;
      case 'NEQ':
        return actualNum !== expectedNum;
      case 'GTE':
        return actualNum >= expectedNum;
      case 'LTE':
        return actualNum <= expectedNum;
      case 'GT':
        return actualNum > expectedNum;
      case 'LT':
        return actualNum < expectedNum;
      default:
        break;
    }
  }

  // String comparisons
  const actualStr = String(actualValue).trim();
  const expectedStr = normExpected;
  const normField = (fieldName || '').toLowerCase().replace(/_/g, '');
  const isStudyField =
    normField === 'fieldofstudy' ||
    normField === 'currentcourse' ||
    (!normField && isFieldOfStudyLike(actualStr));

  switch (operator) {
    case 'EQ': {
      if (normField === 'gender') {
        const actG = actualStr.toLowerCase();
        const expG = expectedStr.toLowerCase();
        return expG === 'all' || expG === 'any' || actG === expG;
      }
      if (actualStr.toLowerCase() === expectedStr.toLowerCase()) return true;
      if (isStudyField) {
        return matchFieldOfStudy(actualStr, expectedStr);
      }
      if (normField === 'category') {
        return matchCategory(actualStr, [expectedStr]);
      }
      return normalizeText(actualStr) === normalizeText(expectedStr);
    }
    case 'NEQ': {
      if (normField === 'gender') {
        const actG = actualStr.toLowerCase();
        const expG = expectedStr.toLowerCase();
        return actG !== expG;
      }
      if (actualStr.toLowerCase() === expectedStr.toLowerCase()) return false;
      if (isStudyField) {
        return !matchFieldOfStudy(actualStr, expectedStr);
      }
      if (normField === 'category') {
        return !matchCategory(actualStr, [expectedStr]);
      }
      return normalizeText(actualStr) !== normalizeText(expectedStr);
    }
    case 'IN': {
      const list = parseExpectedList(normExpected);

      // Wildcard check
      if (
        list.some((item) => {
          const lower = item.toLowerCase();
          return lower === 'all' || lower === 'all india' || lower === 'any';
        })
      ) {
        return true;
      }

      if (normField === 'gender') {
        const actG = actualStr.toLowerCase();
        return list.includes(actG);
      }

      // Direct exact match (case-insensitive)
      const actualLower = actualStr.toLowerCase();
      if (list.some((item) => item.toLowerCase() === actualLower)) {
        return true;
      }

      // Field of study domain matching
      if (isStudyField) {
        return list.some((item) => matchFieldOfStudy(actualStr, item));
      }

      // Category matching
      if (normField === 'category') {
        return matchCategory(actualStr, list);
      }

      // Normalized equality (& vs and, extra spaces)
      const normActual = normalizeText(actualStr);
      if (list.some((item) => normalizeText(item) === normActual)) {
        return true;
      }

      return false;
    }
    case 'CONTAINS': {
      if (normField === 'gender') {
        const actG = actualStr.toLowerCase();
        const expG = expectedStr.toLowerCase();
        return actG === expG || expG === 'all' || expG === 'any';
      }
      const normActual = normalizeText(actualStr);
      const normExpectedStr = normalizeText(expectedStr);
      if (normActual.includes(normExpectedStr) || normExpectedStr.includes(normActual)) {
        return true;
      }
      if (isStudyField) {
        return matchFieldOfStudy(actualStr, expectedStr);
      }
      return false;
    }
    case 'GTE':
    case 'LTE':
    case 'GT':
    case 'LT':
      return false;
    default:
      return false;
  }
}

/**
 * Generate human-readable reason for evaluation outcome
 */
function generateReason(
  field: string,
  operator: RuleOperator,
  expected: string,
  actual: unknown,
  status: EvaluationStatus,
  description: string
): string {
  const normField = field.toLowerCase().replace(/_/g, '');

  if (status === 'UNKNOWN') {
    return `The scholarship requires ${field}, but this information is not available in your profile. Please verify with the official notice.`;
  }

  if (normField === 'familyincome') {
    const actualFormatted = formatCurrency(Number(actual));
    const expectedFormatted = formatCurrency(Number(expected));
    if (status === 'PASS') {
      return `Your annual income (${actualFormatted}) is within the required limit (${operator === 'LTE' ? '<= ' : ''}${expectedFormatted}).`;
    }
    return `Your annual income (${actualFormatted}) exceeds the required limit of ${expectedFormatted}.`;
  }

  if (normField === 'cgpa') {
    if (status === 'PASS') {
      return `Your CGPA (${actual}) satisfies the minimum requirement of ${expected}.`;
    }
    return `Your CGPA (${actual}) is below the required threshold of ${expected}.`;
  }

  if (normField === 'domicilestate') {
    if (status === 'PASS') {
      return `Your domicile state (${actual}) satisfies the residency requirement (${expected}).`;
    }
    return `Your domicile state (${actual}) does not match the eligible states (${expected}).`;
  }

  if (normField === 'category') {
    if (status === 'PASS') {
      return `Your category (${actual}) is eligible for this scholarship.`;
    }
    return `Your category (${actual}) is not among the eligible categories (${expected}).`;
  }

  if (normField === 'gender') {
    const actualLabel = formatGender(actual);
    const expectedLabel = formatGender(expected);
    if (status === 'PASS') {
      return `Your gender (${actualLabel}) satisfies the eligibility criteria.`;
    }
    return `This scholarship is specified for ${expectedLabel} applicants.`;
  }

  if (normField === 'educationlevel') {
    const actualLabel = formatEducationLevel(actual);
    const expectedLabel = formatEducationLevel(expected);
    if (status === 'PASS') {
      return `Your education level (${actualLabel}) satisfies the academic level requirement (${expectedLabel}).`;
    }
    return `This scholarship requires ${expectedLabel} education level.`;
  }

  if (normField === 'areatype') {
    const actualLabel = formatAreaType(actual);
    const expectedLabel = formatAreaType(expected);
    if (status === 'PASS') {
      return `Your area type (${actualLabel}) satisfies the residency area requirement.`;
    }
    return `This scholarship requires ${expectedLabel} residency.`;
  }

  if (normField === 'ispwd') {
    const actualLabel = actual === 1 || actual === true ? 'Yes' : 'No';
    if (status === 'PASS') {
      return `PwD status condition satisfied.`;
    }
    return `This scholarship requires PwD status.`;
  }

  if (normField === 'fieldofstudy') {
    if (status === 'PASS') {
      return `Your field of study (${actual}) satisfies the academic discipline requirement (${expected}).`;
    }
    return `Your field of study (${actual}) is not among the eligible fields (${expected}).`;
  }

  const cleanDescription = (description || `${field} matches ${expected}`).replace(/\.+$/, '');
  if (status === 'PASS') {
    return `Criterion met: ${cleanDescription}.`;
  }
  return `Criterion not met: ${cleanDescription}.`;
}

/**
 * Evaluate a single rule against a student profile
 */
export function evaluateRule(rule: EligibilityRule, profile: Partial<StudentProfile> | null): RuleResult {
  const { value: actualValue, isMissing } = getProfileFieldValue(profile, rule.field_name);

  const expectedDisplay = formatExpectedDisplay(rule.field_name, rule.operator, rule.expected_value);

  if (isMissing) {
    return {
      ruleId: rule.id,
      field: rule.field_name,
      description: rule.rule_description,
      expected: expectedDisplay,
      actual: null,
      status: 'UNKNOWN',
      reason: generateReason(
        rule.field_name,
        rule.operator,
        rule.expected_value,
        null,
        'UNKNOWN',
        rule.rule_description
      ),
    };
  }

  const isPassed = evaluateOperator(actualValue, rule.operator, rule.expected_value, rule.field_name);
  const status: EvaluationStatus = isPassed ? 'PASS' : 'FAIL';
  const actualDisplay = formatActualDisplay(rule.field_name, actualValue);

  return {
    ruleId: rule.id,
    field: rule.field_name,
    description: rule.rule_description,
    expected: expectedDisplay,
    actual: actualDisplay,
    status,
    reason: generateReason(
      rule.field_name,
      rule.operator,
      rule.expected_value,
      actualValue,
      status,
      rule.rule_description
    ),
  };
}

/**
 * Aggregate evaluations into final verdict according to Phase B6.3
 */
export function evaluateEligibility(
  profile: Partial<StudentProfile> | null,
  rules: EligibilityRule[]
): EligibilityReport {
  const evaluatedAt = new Date().toISOString();

  if (!rules || rules.length === 0) {
    return {
      verdict: 'ELIGIBLE',
      summary: 'No specific restrictions are defined for this scholarship.',
      evaluatedAt,
      ruleDetails: [],
    };
  }

  const ruleDetails: RuleResult[] = [];
  let hasMandatoryFail = false;
  let hasMandatoryUnknown = false;

  for (const rule of rules) {
    const result = evaluateRule(rule, profile);
    ruleDetails.push(result);

    const isMandatory = rule.is_mandatory === 1;

    if (isMandatory) {
      if (result.status === 'FAIL') {
        hasMandatoryFail = true;
      } else if (result.status === 'UNKNOWN') {
        hasMandatoryUnknown = true;
      }
    }
  }

  let verdict: EligibilityVerdict;
  let summary: string;

  if (hasMandatoryFail) {
    verdict = 'NOT_ELIGIBLE';
    summary = 'You do not meet one or more mandatory requirements for this scholarship.';
  } else if (hasMandatoryUnknown) {
    verdict = 'POSSIBLY_ELIGIBLE';
    summary = 'You may be eligible, but some requirements could not be confirmed from your profile data. Please verify the original notice.';
  } else {
    verdict = 'ELIGIBLE';
    summary = 'You satisfy all evaluated eligibility requirements for this scholarship.';
  }

  return {
    verdict,
    summary,
    evaluatedAt,
    ruleDetails,
  };
}
