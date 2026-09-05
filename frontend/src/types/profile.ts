export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type EducationLevel = "undergraduate" | "postgraduate" | "diploma" | "school";
export type AreaType = "rural" | "urban";
export type SocialCategory = "General" | "OBC" | "SC" | "ST" | "EWS";

export interface StudentProfile {
  userId?: string;
  fullName: string;
  age: number | "";
  gender: Gender | "";
  familyIncome: number | "";
  educationLevel: EducationLevel | "";
  currentCourse: string;
  fieldOfStudy: string;
  cgpa: number | "";
  domicileState: string;
  areaType: AreaType | "";
  category: SocialCategory | "";
  isPwd: boolean;
  previousInstitution: string;
  previousMarksPercentage: number | "";
  updatedAt?: string;
}

export const INDIAN_STATES = [
  "All India (General)",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const FIELDS_OF_STUDY = [
  "Engineering & Technology",
  "Medicine & Healthcare",
  "Computer Applications / IT",
  "Pure & Applied Sciences",
  "Commerce & Management",
  "Humanities & Social Sciences",
  "Law & Legal Studies",
  "Agriculture & Allied Sciences",
  "Architecture & Design",
  "Other / Multidisciplinary",
];

export const EDUCATION_LEVELS = [
  { value: "undergraduate", label: "Undergraduate (B.Tech, B.Sc, B.Com, MBBS, etc.)" },
  { value: "postgraduate", label: "Postgraduate (M.Tech, M.Sc, MBA, etc.)" },
  { value: "diploma", label: "Diploma / Polytechnic" },
  { value: "school", label: "Higher Secondary (Class 11 - 12)" },
];

export const SOCIAL_CATEGORIES = [
  { value: "General", label: "General / Unreserved" },
  { value: "OBC", label: "Other Backward Class (OBC - Non-Creamy Layer)" },
  { value: "SC", label: "Scheduled Caste (SC)" },
  { value: "ST", label: "Scheduled Tribe (ST)" },
  { value: "EWS", label: "Economically Weaker Section (EWS)" },
];
