import { StudentProfile } from "@/types/profile";

export function profileFromBackend(raw: any): StudentProfile {
  return {
    userId: raw.user_id || raw.userId || "",
    fullName: raw.full_name || raw.fullName || "",
    age: typeof raw.age === "number" ? raw.age : raw.age ? Number(raw.age) : "",
    gender: raw.gender || "",
    familyIncome:
      typeof raw.family_income === "number"
        ? raw.family_income
        : raw.familyIncome !== undefined && raw.familyIncome !== ""
        ? Number(raw.familyIncome)
        : "",
    educationLevel: raw.education_level || raw.educationLevel || "",
    currentCourse: raw.current_course || raw.currentCourse || "",
    fieldOfStudy: raw.field_of_study || raw.fieldOfStudy || "",
    cgpa:
      typeof raw.cgpa === "number"
        ? raw.cgpa
        : raw.cgpa !== undefined && raw.cgpa !== ""
        ? Number(raw.cgpa)
        : "",
    domicileState: raw.domicile_state || raw.domicileState || "",
    areaType: raw.area_type || raw.areaType || "",
    category: raw.category || "",
    isPwd: Boolean(raw.is_pwd ?? raw.isPwd),
    previousInstitution: raw.previous_institution || raw.previousInstitution || "",
    previousMarksPercentage:
      typeof raw.previous_marks_percentage === "number"
        ? raw.previous_marks_percentage
        : raw.previousMarksPercentage !== undefined && raw.previousMarksPercentage !== ""
        ? Number(raw.previousMarksPercentage)
        : "",
    updatedAt: raw.updated_at || raw.updatedAt,
  };
}

export function profileToBackend(profile: StudentProfile): Record<string, any> {
  return {
    full_name: profile.fullName.trim(),
    age: typeof profile.age === "number" ? profile.age : Number(profile.age) || 18,
    gender: profile.gender || "prefer_not_to_say",
    family_income:
      typeof profile.familyIncome === "number"
        ? profile.familyIncome
        : Number(profile.familyIncome) || 0,
    education_level: profile.educationLevel || "undergraduate",
    current_course: profile.currentCourse.trim(),
    field_of_study: profile.fieldOfStudy.trim(),
    cgpa: typeof profile.cgpa === "number" ? profile.cgpa : Number(profile.cgpa) || 0,
    domicile_state: profile.domicileState.trim(),
    area_type: profile.areaType || "urban",
    category: profile.category || "General",
    is_pwd: profile.isPwd ? 1 : 0,
    previous_institution: profile.previousInstitution?.trim() || null,
    previous_marks_percentage:
      profile.previousMarksPercentage !== "" &&
      profile.previousMarksPercentage !== undefined &&
      profile.previousMarksPercentage !== null
        ? Number(profile.previousMarksPercentage)
        : null,
  };
}
