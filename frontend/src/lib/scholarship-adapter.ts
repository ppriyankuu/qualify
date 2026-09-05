import { Scholarship, EligibilityRule, ScholarshipDocument } from "@/types/scholarship";

export function ruleFieldToBackend(field: string): string {
  const map: Record<string, string> = {
    familyIncome: "family_income",
    educationLevel: "education_level",
    fieldOfStudy: "field_of_study",
    domicileState: "domicile_state",
    areaType: "area_type",
    isPwd: "is_pwd",
    previousMarksPercentage: "previous_marks_percentage",
    previousInstitution: "previous_institution",
    currentCourse: "current_course",
  };
  return map[field] || field;
}

export function ruleFieldToFrontend(field: string): string {
  const map: Record<string, string> = {
    family_income: "familyIncome",
    education_level: "educationLevel",
    field_of_study: "fieldOfStudy",
    domicile_state: "domicileState",
    area_type: "areaType",
    is_pwd: "isPwd",
    previous_marks_percentage: "previousMarksPercentage",
    previous_institution: "previousInstitution",
    current_course: "currentCourse",
  };
  return map[field] || field;
}

export function normalizeRule(raw: any): EligibilityRule {
  const rawField = raw.field_name || raw.fieldName || "";
  return {
    id: raw.id || `rule-${Math.random().toString(36).substring(2, 9)}`,
    fieldName: ruleFieldToFrontend(rawField),
    operator: raw.operator || "EQ",
    expectedValue: raw.expected_value !== undefined ? raw.expected_value : raw.expectedValue ?? "",
    isMandatory: raw.is_mandatory !== undefined ? Boolean(raw.is_mandatory) : Boolean(raw.isMandatory),
    ruleDescription: raw.rule_description || raw.ruleDescription || "",
  };
}

export function normalizeDocument(raw: any): ScholarshipDocument {
  return {
    id: raw.id || `doc-${Math.random().toString(36).substring(2, 9)}`,
    documentName: raw.document_name || raw.documentName || "Required Document",
    isMandatory: raw.is_mandatory !== undefined ? Boolean(raw.is_mandatory) : Boolean(raw.isMandatory),
    instructions: raw.instructions || undefined,
  };
}

export function normalizeScholarship(raw: any): Scholarship {
  const rules: EligibilityRule[] = Array.isArray(raw.rules)
    ? raw.rules.map(normalizeRule)
    : [];

  const documents: ScholarshipDocument[] = Array.isArray(raw.documents)
    ? raw.documents.map(normalizeDocument)
    : [];

  // Derive filter metadata from rules if not explicitly provided at the top level
  let derivedIncomeLimit: number | undefined = raw.incomeLimit ?? (raw.income_limit ? Number(raw.income_limit) : undefined);
  let derivedGender: "all" | "female" | "male" = raw.genderRestriction || raw.gender_restriction || "all";
  let derivedCategory: any = raw.categoryRestriction || raw.category_restriction || "All";
  let derivedFieldsOfStudy: string[] = raw.fieldOfStudy || raw.field_of_study || [];
  let derivedEducationLevels: any[] = raw.educationLevel || raw.education_level || [];
  let derivedIsPwd: boolean = Boolean(raw.isPwdOnly ?? raw.is_pwd_only);
  let derivedIsRural: boolean = Boolean(raw.isRuralOnly ?? raw.is_rural_only);

  for (const r of rules) {
    const fn = (r.fieldName || "").toLowerCase();
    const ev = String(r.expectedValue || "");

    if (fn === "family_income" || fn === "familyincome") {
      const parsed = Number(ev);
      if (!isNaN(parsed)) derivedIncomeLimit = parsed;
    } else if (fn === "gender") {
      const g = ev.toLowerCase();
      if (g.includes("female") || g.includes("girl") || g.includes("women")) {
        derivedGender = "female";
      } else if (g.includes("male") && !g.includes("female")) {
        derivedGender = "male";
      }
    } else if (fn === "category") {
      if (ev.includes("SC") && ev.includes("ST")) {
        derivedCategory = "SC/ST";
      } else if (ev.includes("SC")) {
        derivedCategory = "SC";
      } else if (ev.includes("ST")) {
        derivedCategory = "ST";
      } else if (ev.includes("OBC")) {
        derivedCategory = "OBC";
      } else if (ev.includes("EWS")) {
        derivedCategory = "EWS";
      }
    } else if (fn === "field_of_study" || fn === "fieldofstudy") {
      if (derivedFieldsOfStudy.length === 0) {
        derivedFieldsOfStudy = ev.split(",").map((s) => s.trim()).filter(Boolean);
      }
    } else if (fn === "education_level" || fn === "educationlevel") {
      if (derivedEducationLevels.length === 0) {
        derivedEducationLevels = ev.split(",").map((s) => s.trim().toLowerCase()) as any;
      }
    } else if (fn === "is_pwd" || fn === "ispwd") {
      if (ev === "1" || ev.toLowerCase() === "true") {
        derivedIsPwd = true;
      }
    } else if (fn === "area_type" || fn === "areatype") {
      if (ev.toLowerCase().includes("rural")) {
        derivedIsRural = true;
      }
    }
  }

  if (derivedFieldsOfStudy.length === 0) {
    derivedFieldsOfStudy = ["All Disciplines"];
  }

  if (derivedEducationLevels.length === 0) {
    derivedEducationLevels = ["undergraduate"];
  }

  return {
    id: String(raw.id),
    name: raw.name || "Scholarship Listing",
    provider: raw.provider || "Government / Institution",
    description: raw.description || "",
    amountDescription: raw.amountDescription || raw.amount_description || "Financial Support",
    amountValue: Number(raw.amountValue ?? raw.amount_value ?? 0),
    deadline: raw.deadline || new Date().toISOString().split("T")[0],
    officialNoticeUrl: raw.officialNoticeUrl || raw.official_notice_url || "https://scholarships.gov.in",
    fieldOfStudy: derivedFieldsOfStudy,
    educationLevel: derivedEducationLevels,
    incomeLimit: derivedIncomeLimit,
    genderRestriction: derivedGender,
    categoryRestriction: derivedCategory,
    isPwdOnly: derivedIsPwd,
    isRuralOnly: derivedIsRural,
    rules,
    documents,
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
  };
}
