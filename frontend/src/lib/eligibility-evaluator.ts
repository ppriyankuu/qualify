import { StudentProfile } from "@/types/profile";
import { EligibilityRule } from "@/types/scholarship";

export type RuleStatus = "PASS" | "FAIL" | "UNKNOWN";
export type Verdict = "ELIGIBLE" | "NOT_ELIGIBLE" | "POSSIBLY_ELIGIBLE";

export interface EvaluatedRuleResult {
  rule: EligibilityRule;
  status: RuleStatus;
  studentValueText: string;
  reason: string;
}

export interface EvaluatedDocumentResult {
  documentId: string;
  documentName: string;
  isMandatory: boolean;
  isCompleted: boolean;
}

export interface EligibilityResult {
  verdict: Verdict;
  summary: string;
  evaluatedAt: string;
  results: EvaluatedRuleResult[];
  documentDetails?: EvaluatedDocumentResult[];
  documentsReadyCount?: number;
  documentsTotalCount?: number;
  mandatoryDocumentsPendingCount?: number;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[+/\\(),._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const FIELD_OF_STUDY_DOMAINS: Record<string, string[]> = {
  engineering: [
    "engineering",
    "technology",
    "tech",
    "btech",
    "b.tech",
    "be",
    "b.e",
    "mtech",
    "m.tech",
    "stem",
    "polytechnic",
    "computer engineering",
    "mechanical",
    "electrical",
    "civil",
    "chemical",
    "electronics",
    "aerospace",
    "information technology",
  ],
  medicine: [
    "medicine",
    "medical",
    "healthcare",
    "health",
    "mbbs",
    "bds",
    "nursing",
    "pharmacy",
    "pharma",
    "allied health",
    "biomedical",
    "dental",
    "ayush",
    "bams",
    "bhms",
    "paramedical",
    "physiotherapy",
  ],
  computer: [
    "computer",
    "computing",
    "computer applications",
    "it",
    "information technology",
    "software",
    "computer science",
    "cs",
    "ai",
    "data science",
    "bca",
    "mca",
  ],
  science: [
    "science",
    "sciences",
    "pure science",
    "applied science",
    "physics",
    "chemistry",
    "mathematics",
    "math",
    "biology",
    "biotechnology",
    "botany",
    "zoology",
    "geology",
    "bsc",
    "b.sc",
    "msc",
    "m.sc",
    "stem",
    "biotech",
  ],
  commerce: [
    "commerce",
    "management",
    "business",
    "bcom",
    "b.com",
    "mcom",
    "m.com",
    "bba",
    "mba",
    "finance",
    "accounting",
    "economics",
    "banking",
  ],
  humanities: [
    "humanities",
    "social science",
    "social sciences",
    "arts",
    "ba",
    "b.a",
    "ma",
    "m.a",
    "history",
    "political science",
    "sociology",
    "psychology",
    "literature",
    "philosophy",
  ],
  law: [
    "law",
    "legal",
    "legal studies",
    "llb",
    "ll.b",
    "llm",
    "ll.m",
    "judiciary",
    "jurisprudence",
  ],
  agriculture: [
    "agriculture",
    "allied science",
    "allied sciences",
    "agricultural",
    "horticulture",
    "forestry",
    "veterinary",
    "fisheries",
    "agronomy",
  ],
  architecture: [
    "architecture",
    "design",
    "barch",
    "b.arch",
    "march",
    "m.arch",
    "planning",
    "interior design",
    "fashion design",
    "fine arts",
    "graphic design",
  ],
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  general: ["general", "gen", "open", "ur", "unreserved"],
  sc: ["sc", "scheduled caste"],
  st: ["st", "scheduled tribe"],
  obc: ["obc", "obc-ncl", "other backward classes", "sebc"],
  ews: ["ews", "economically weaker section"],
  ebc: ["ebc", "economically backward class"],
};

function extractMeaningfulTokens(text: string): string[] {
  const stopWords = new Set(["and", "or", "of", "in", "the", "for", "to", "with", "by", "an", "a"]);
  return normalizeText(text)
    .split(" ")
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !stopWords.has(t));
}

export const CANONICAL_FIELD_KEYWORDS: Record<string, string[]> = {
  "engineering and technology": [
    "engineering",
    "technology",
    "tech",
    "btech",
    "b.tech",
    "be",
    "b.e",
    "mtech",
    "m.tech",
    "computer science",
    "polytechnic",
    "stem",
    "mechanical",
    "electrical",
    "civil",
  ],
  "medicine and healthcare": [
    "medicine",
    "medical",
    "healthcare",
    "health",
    "mbbs",
    "bds",
    "nursing",
    "pharmacy",
    "pharma",
    "allied health",
    "dental",
    "ayush",
  ],
  "computer applications it": [
    "computer",
    "it",
    "information technology",
    "software",
    "computer science",
    "bca",
    "mca",
    "ai",
    "computing",
  ],
  "pure and applied sciences": [
    "science",
    "sciences",
    "pure science",
    "applied science",
    "physics",
    "chemistry",
    "mathematics",
    "biology",
    "biotechnology",
    "bsc",
    "b.sc",
    "msc",
    "m.sc",
    "stem",
  ],
  "commerce and management": [
    "commerce",
    "management",
    "business",
    "bcom",
    "b.com",
    "mcom",
    "m.com",
    "bba",
    "mba",
    "finance",
    "accounting",
    "economics",
  ],
  "humanities and social sciences": [
    "humanities",
    "social science",
    "social sciences",
    "arts",
    "ba",
    "b.a",
    "ma",
    "m.a",
    "history",
    "political science",
    "sociology",
    "literature",
  ],
  "law and legal studies": [
    "law",
    "legal",
    "legal studies",
    "llb",
    "ll.b",
    "llm",
    "ll.m",
    "judiciary",
  ],
  "agriculture and allied sciences": [
    "agriculture",
    "allied science",
    "allied sciences",
    "agricultural",
    "horticulture",
    "forestry",
    "veterinary",
    "fisheries",
  ],
  "architecture and design": [
    "architecture",
    "design",
    "barch",
    "b.arch",
    "march",
    "m.arch",
    "planning",
  ],
  "other multidisciplinary": [
    "other",
    "multidisciplinary",
    "all",
    "any",
  ],
};

export function formatGender(gender: unknown): string {
  if (gender === null || gender === undefined || gender === "") return "";
  const g = String(gender).trim().toLowerCase();
  if (g === "male") return "Male";
  if (g === "female") return "Female";
  if (g === "other") return "Other";
  if (g === "prefer_not_to_say" || g === "prefer not to say") return "Prefer not to say";
  return String(gender).charAt(0).toUpperCase() + String(gender).slice(1);
}

export function formatEducationLevel(level: unknown): string {
  if (level === null || level === undefined || level === "") return "";
  const l = String(level).trim().toLowerCase();
  if (l === "undergraduate") return "Undergraduate";
  if (l === "postgraduate") return "Postgraduate";
  if (l === "diploma") return "Diploma";
  if (l === "school") return "School (Class 11-12)";
  return String(level).charAt(0).toUpperCase() + String(level).slice(1);
}

export function formatAreaType(area: unknown): string {
  if (area === null || area === undefined || area === "") return "";
  const a = String(area).trim().toLowerCase();
  if (a === "rural") return "Rural";
  if (a === "urban") return "Urban";
  return String(area).charAt(0).toUpperCase() + String(area).slice(1);
}

export function matchFieldOfStudy(actual: string, expected: string): boolean {
  const normActual = normalizeText(actual);
  const normExpected = normalizeText(expected);

  if (normActual === normExpected) return true;
  if (normExpected === "all" || normExpected === "all india" || normExpected === "any") return true;

  let studentKeywords: string[] = [];
  for (const [key, keywords] of Object.entries(CANONICAL_FIELD_KEYWORDS)) {
    if (normActual === key || normActual.includes(key) || key.includes(normActual)) {
      studentKeywords = keywords;
      break;
    }
  }

  if (studentKeywords.length > 0) {
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
    if (normExp === "all" || normExp === "any") return true;
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

export function evaluateEligibility(
  profile: StudentProfile,
  rules: EligibilityRule[]
): EligibilityResult {
  const evaluatedRules: EvaluatedRuleResult[] = rules.map((rule) => {
    const rawStudentVal = profile[rule.fieldName as keyof StudentProfile];

    // Check if missing / unknown
    if (
      rawStudentVal === undefined ||
      rawStudentVal === null ||
      rawStudentVal === ""
    ) {
      return {
        rule,
        status: "UNKNOWN",
        studentValueText: "Not provided in profile",
        reason: `Your profile does not specify ${String(rule.fieldName)}. Please verify your eligibility with the official notice.`,
      };
    }

    let isPassed = false;
    let studentValueDisplay = String(rawStudentVal);
    const normField = (rule.fieldName || "").toLowerCase().replace(/_/g, "");
    const isStudyField =
      normField === "fieldofstudy" ||
      normField === "currentcourse" ||
      (!normField && isFieldOfStudyLike(String(rawStudentVal)));

    if (normField === "gender") {
      studentValueDisplay = formatGender(rawStudentVal);
    } else if (normField === "educationlevel") {
      studentValueDisplay = formatEducationLevel(rawStudentVal);
    } else if (normField === "areatype") {
      studentValueDisplay = formatAreaType(rawStudentVal);
    }

    switch (rule.operator) {
      case "EQ": {
        if (typeof rawStudentVal === "boolean") {
          isPassed = rawStudentVal === (rule.expectedValue === true || rule.expectedValue === "true");
          studentValueDisplay = rawStudentVal ? "Yes" : "No";
        } else if (normField === "gender") {
          const actG = String(rawStudentVal).trim().toLowerCase();
          const expG = String(rule.expectedValue).trim().toLowerCase();
          isPassed = expG === "all" || expG === "any" || actG === expG;
        } else {
          const rawStr = String(rawStudentVal).trim();
          const expStr = String(rule.expectedValue).trim();
          if (rawStr.toLowerCase() === expStr.toLowerCase()) {
            isPassed = true;
          } else if (isStudyField) {
            isPassed = matchFieldOfStudy(rawStr, expStr);
          } else if (normField === "category") {
            isPassed = matchCategory(rawStr, [expStr]);
          } else {
            isPassed = normalizeText(rawStr) === normalizeText(expStr);
          }
        }
        break;
      }

      case "NEQ": {
        if (normField === "gender") {
          const actG = String(rawStudentVal).trim().toLowerCase();
          const expG = String(rule.expectedValue).trim().toLowerCase();
          isPassed = actG !== expG;
        } else {
          const rawStr = String(rawStudentVal).trim();
          const expStr = String(rule.expectedValue).trim();
          if (rawStr.toLowerCase() === expStr.toLowerCase()) {
            isPassed = false;
          } else if (isStudyField) {
            isPassed = !matchFieldOfStudy(rawStr, expStr);
          } else if (normField === "category") {
            isPassed = !matchCategory(rawStr, [expStr]);
          } else {
            isPassed = normalizeText(rawStr) !== normalizeText(expStr);
          }
        }
        break;
      }

      case "GTE": {
        const studentNum = Number(rawStudentVal);
        const expectedNum = Number(rule.expectedValue);
        isPassed = studentNum >= expectedNum;
        studentValueDisplay = String(studentNum);
        break;
      }

      case "LTE": {
        const studentNum = Number(rawStudentVal);
        const expectedNum = Number(rule.expectedValue);
        isPassed = studentNum <= expectedNum;
        if (studentNum >= 1000) {
          studentValueDisplay = `₹${studentNum.toLocaleString("en-IN")}`;
        }
        break;
      }

      case "GT": {
        isPassed = Number(rawStudentVal) > Number(rule.expectedValue);
        break;
      }

      case "LT": {
        isPassed = Number(rawStudentVal) < Number(rule.expectedValue);
        break;
      }

      case "IN": {
        const rawStr = String(rawStudentVal).trim();
        const expectedList = Array.isArray(rule.expectedValue)
          ? rule.expectedValue.map((v) => String(v).trim())
          : String(rule.expectedValue)
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean);

        if (
          expectedList.some((item) => {
            const lower = item.toLowerCase();
            return lower === "all" || lower === "all india" || lower === "any";
          })
        ) {
          isPassed = true;
        } else if (normField === "gender") {
          const actG = rawStr.toLowerCase();
          isPassed = expectedList.map((x) => x.toLowerCase()).includes(actG);
        } else if (
          expectedList.some((item) => item.toLowerCase() === rawStr.toLowerCase())
        ) {
          isPassed = true;
        } else if (isStudyField) {
          isPassed = expectedList.some((item) => matchFieldOfStudy(rawStr, item));
        } else if (normField === "category") {
          isPassed = matchCategory(rawStr, expectedList);
        } else {
          const normActual = normalizeText(rawStr);
          isPassed = expectedList.some((item) => normalizeText(item) === normActual);
        }
        break;
      }

      case "CONTAINS": {
        if (normField === "gender") {
          const actG = String(rawStudentVal).trim().toLowerCase();
          const expG = String(rule.expectedValue).trim().toLowerCase();
          isPassed = expG === "all" || expG === "any" || actG === expG;
        } else {
          const rawStr = String(rawStudentVal).trim();
          const expStr = String(rule.expectedValue).trim();
          const normActual = normalizeText(rawStr);
          const normExp = normalizeText(expStr);
          if (normActual.includes(normExp) || normExp.includes(normActual)) {
            isPassed = true;
          } else if (isStudyField) {
            isPassed = matchFieldOfStudy(rawStr, expStr);
          } else {
            isPassed = false;
          }
        }
        break;
      }

      default:
        isPassed = false;
    }

    const status: RuleStatus = isPassed ? "PASS" : "FAIL";

    let reason = "";
    const cleanDesc = (rule.ruleDescription || "").replace(/\.+$/, "");
    if (status === "PASS") {
      if (normField === "gender") {
        reason = `Your gender (${studentValueDisplay}) satisfies the eligibility criteria.`;
      } else if (normField === "educationlevel") {
        reason = `Your education level (${studentValueDisplay}) satisfies the academic level requirement (${formatEducationLevel(rule.expectedValue)}).`;
      } else if (normField === "areatype") {
        reason = `Your area type (${studentValueDisplay}) satisfies the residency area requirement.`;
      } else {
        reason = `Satisfies requirement (${cleanDesc}).`;
      }
    } else {
      if (normField === "gender") {
        reason = `This scholarship is specified for ${formatGender(rule.expectedValue)} applicants (your profile: ${studentValueDisplay}).`;
      } else if (normField === "educationlevel") {
        reason = `This scholarship requires ${formatEducationLevel(rule.expectedValue)} education level (your profile: ${studentValueDisplay}).`;
      } else if (normField === "areatype") {
        reason = `This scholarship requires ${formatAreaType(rule.expectedValue)} residency (your profile: ${studentValueDisplay}).`;
      } else if (rule.operator === "GTE") {
        reason = `Your value (${studentValueDisplay}) is below the required minimum (${rule.expectedValue}).`;
      } else if (rule.operator === "LTE") {
        reason = `Your value (${studentValueDisplay}) exceeds the maximum permissible limit (${rule.expectedValue}).`;
      } else {
        reason = `Criterion not met: ${cleanDesc}.`;
      }
    }

    return {
      rule,
      status,
      studentValueText: studentValueDisplay,
      reason,
    };
  });

  // Calculate overall verdict
  const hasMandatoryFail = evaluatedRules.some(
    (r) => r.rule.isMandatory && r.status === "FAIL"
  );
  const hasMandatoryUnknown = evaluatedRules.some(
    (r) => r.rule.isMandatory && r.status === "UNKNOWN"
  );

  let verdict: Verdict = "ELIGIBLE";
  let summary = "You satisfy all evaluated mandatory eligibility criteria.";

  if (hasMandatoryFail) {
    verdict = "NOT_ELIGIBLE";
    summary = "You do not meet one or more mandatory eligibility requirements.";
  } else if (hasMandatoryUnknown) {
    verdict = "POSSIBLY_ELIGIBLE";
    summary =
      "You may qualify, but some requirements could not be definitively determined from your profile data. Please verify the official notice.";
  }

  return {
    verdict,
    summary,
    evaluatedAt: new Date().toISOString(),
    results: evaluatedRules,
  };
}
