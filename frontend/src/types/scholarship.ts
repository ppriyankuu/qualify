import { StudentProfile } from "./profile";

export type Operator = "EQ" | "NEQ" | "LTE" | "GTE" | "LT" | "GT" | "IN" | "CONTAINS";

export interface EligibilityRule {
  id: string;
  fieldName: keyof StudentProfile | string;
  operator: Operator;
  expectedValue: string | number | boolean | string[];
  isMandatory: boolean;
  ruleDescription: string;
}

export interface ScholarshipDocument {
  id: string;
  documentName: string;
  isMandatory: boolean;
  instructions?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  amountDescription: string;
  amountValue: number; // numeric value for sorting
  deadline: string; // ISO date string YYYY-MM-DD
  officialNoticeUrl: string;
  fieldOfStudy: string[]; // e.g. ["Engineering & Technology", "Medicine & Healthcare"]
  educationLevel: ("undergraduate" | "postgraduate" | "diploma" | "school")[];
  incomeLimit?: number; // annual family income cap
  genderRestriction: "all" | "female" | "male";
  categoryRestriction: "All" | "General" | "OBC" | "SC" | "ST" | "EWS" | "SC/ST";
  isPwdOnly?: boolean;
  isRuralOnly?: boolean;
  rules: EligibilityRule[];
  documents: ScholarshipDocument[];
  createdAt: string;
}

export interface ScholarshipFilterState {
  search: string;
  fieldsOfStudy: string[];
  educationLevels: string[];
  maxIncome: number | "any";
  gender: "all" | "female" | "male";
  category: "all" | "General" | "OBC" | "SC" | "ST" | "EWS";
  pwdOnly: boolean;
  ruralOnly: boolean;
  sortBy: "deadline" | "amount-high" | "amount-low" | "recent";
}
