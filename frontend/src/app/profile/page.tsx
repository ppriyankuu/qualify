"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  GraduationCap,
  IndianRupee,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  StudentProfile,
  INDIAN_STATES,
  FIELDS_OF_STUDY,
  EDUCATION_LEVELS,
  SOCIAL_CATEGORIES,
  Gender,
  AreaType,
  SocialCategory,
  EducationLevel,
} from "@/types/profile";
import {
  useProfile,
  DEMO_STUDENT_PROFILE,
  EMPTY_PROFILE,
} from "@/hooks/use-profile";
import { formatINR } from "@/lib/utils";
import { StudentGuard } from "@/components/common/route-guard";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, saveProfile, isLoading, isSaving, completeness } = useProfile();

  const [formData, setFormData] = useState<StudentProfile>(EMPTY_PROFILE);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync loaded profile into form state
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (
    field: keyof StudentProfile,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuickFill = () => {
    setFormData(DEMO_STUDENT_PROFILE);
    setValidationError(null);
  };

  const handleReset = () => {
    setFormData(EMPTY_PROFILE);
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Basic client validation
    if (!formData.fullName.trim()) {
      setValidationError("Full Name is required.");
      return;
    }
    if (!formData.educationLevel) {
      setValidationError("Please select your current education level.");
      return;
    }
    if (!formData.fieldOfStudy) {
      setValidationError("Please select your primary field of study.");
      return;
    }
    if (formData.cgpa === "" || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
      setValidationError("Please enter a valid CGPA between 0.0 and 10.0.");
      return;
    }
    if (formData.familyIncome === "" || Number(formData.familyIncome) < 0) {
      setValidationError("Please enter your annual family income.");
      return;
    }
    if (!formData.domicileState) {
      setValidationError("Please select your domicile state.");
      return;
    }

    try {
      await saveProfile(formData);
      setShowSuccessToast(true);

      setTimeout(() => {
        router.push("/scholarships");
      }, 1200);
    } catch (err: any) {
      setValidationError(err?.message || "Failed to save profile to server. Please verify your details.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-black border-t-neo-yellow" />
          <span className="font-display text-xs font-black uppercase tracking-widest text-neutral-600">
            Loading Profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <StudentGuard>
      <div className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header & Completeness Progress */}
      <div className="rounded-2xl border-3 border-black bg-white p-4 sm:p-6 shadow-neo-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-neo-yellow px-3 py-1 shadow-neo-sm mb-2">
              <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                Student Profile Onboarding
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-black">
              Eligibility Profile
            </h1>
            <p className="text-sm font-medium text-neutral-600">
              Your profile data is evaluated deterministically against visible scholarship rules.
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleQuickFill}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-neo-green px-3.5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm transition-all hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Zap className="h-3.5 w-3.5 stroke-[3]" />
              1-Click Demo Fill
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Reset Form"
              className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white shadow-neo-sm hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[2.5] text-neutral-700" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2 border-t-2 border-black/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-700">
              Profile Completeness
            </span>
            <span className="font-black font-mono text-black">
              {completeness}% Completed
            </span>
          </div>
          <div className="h-4 w-full rounded-full border-2 border-black bg-neutral-100 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-neo-green transition-all duration-300 border border-black/20"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Submission Notice / Toast */}
      {showSuccessToast && (
        <div className="rounded-2xl border-3 border-black bg-neo-green/20 p-4 shadow-neo flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 stroke-[2.5] text-emerald-700 shrink-0" />
            <div>
              <strong className="block text-sm font-black text-black">
                Profile Saved Successfully!
              </strong>
              <span className="text-xs font-bold text-neutral-800">
                Redirecting you to the scholarship directory...
              </span>
            </div>
          </div>
          <Badge variant="mint" size="md">Saved</Badge>
        </div>
      )}

      {validationError && (
        <div className="rounded-xl border-2 border-neo-red bg-neo-red/15 p-4 shadow-neo-sm flex items-center gap-3">
          <AlertCircle className="h-5 w-5 stroke-[2.5] text-neo-red shrink-0" />
          <span className="text-xs font-bold text-black">{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal Details */}
        <Card variant="white" className="shadow-neo">
          <CardHeader className="bg-[#FAF7F2] rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-neo-yellow shadow-neo-sm">
                <User className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <CardTitle className="text-lg">1. Personal Details</CardTitle>
                <CardDescription>
                  Your basic biographical information.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                id="fullName"
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                required
              />

              <Input
                label="Age (Years)"
                id="age"
                type="number"
                min={14}
                max={100}
                placeholder="e.g. 20"
                value={formData.age}
                onChange={(e) =>
                  handleChange(
                    "age",
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                required
              />
            </div>

            {/* Gender Pills */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-black uppercase tracking-wider text-black font-display">
                Gender
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    ["male", "Male"],
                    ["female", "Female"],
                    ["other", "Other"],
                    ["prefer_not_to_say", "Prefer not to say"],
                  ] as const
                ).map(([gVal, gLabel]) => (
                  <button
                    key={gVal}
                    type="button"
                    onClick={() => handleChange("gender", gVal as Gender)}
                    className={`rounded-xl border-2 border-black p-2.5 text-xs font-bold transition-all ${
                      formData.gender === gVal
                        ? "bg-neo-yellow text-black shadow-neo font-black -translate-y-0.5"
                        : "bg-white text-neutral-600 shadow-neo-sm hover:bg-neutral-50"
                    }`}
                  >
                    {gLabel}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Academic Profile */}
        <Card variant="white" className="shadow-neo">
          <CardHeader className="bg-[#FAF7F2] rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-neo-pink shadow-neo-sm">
                <GraduationCap className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <CardTitle className="text-lg">2. Academic Information</CardTitle>
                <CardDescription>
                  Your current degree, stream, and marks used for merit rules.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Education Level"
                id="educationLevel"
                value={formData.educationLevel}
                onChange={(e) =>
                  handleChange("educationLevel", e.target.value as EducationLevel)
                }
              >
                <option value="">Select Level...</option>
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </Select>

              <Select
                label="Field of Study"
                id="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
              >
                <option value="">Select Field...</option>
                {FIELDS_OF_STUDY.map((fld) => (
                  <option key={fld} value={fld}>
                    {fld}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Course / Degree Name"
                id="currentCourse"
                placeholder="e.g. B.Tech Computer Science"
                value={formData.currentCourse}
                onChange={(e) => handleChange("currentCourse", e.target.value)}
                required
              />

              <div>
                <Input
                  label="Current CGPA (Scale of 10.0)"
                  id="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="e.g. 8.4"
                  value={formData.cgpa}
                  onChange={(e) =>
                    handleChange(
                      "cgpa",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  required
                />
                <span className="text-[11px] font-bold text-neutral-500 mt-1 block">
                  Most merit-based scholarships require CGPA ≥ 7.0 or 7.5.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/10">
              <Input
                label="Previous Institution Name"
                id="previousInstitution"
                placeholder="e.g. Cotton College / Guwahati High School"
                value={formData.previousInstitution}
                onChange={(e) =>
                  handleChange("previousInstitution", e.target.value)
                }
              />

              <Input
                label="Previous Academic Performance (%)"
                id="previousMarksPercentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 89.5"
                value={formData.previousMarksPercentage}
                onChange={(e) =>
                  handleChange(
                    "previousMarksPercentage",
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Financial & Demographics */}
        <Card variant="white" className="shadow-neo">
          <CardHeader className="bg-[#FAF7F2] rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-neo-green shadow-neo-sm">
                <IndianRupee className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  3. Financial & Demographic Details
                </CardTitle>
                <CardDescription>
                  Evaluated against income ceiling, domicile, and category quotas.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Annual Family Income (INR ₹)"
                  id="familyIncome"
                  type="number"
                  min="0"
                  step="5000"
                  placeholder="e.g. 320000"
                  value={formData.familyIncome}
                  onChange={(e) =>
                    handleChange(
                      "familyIncome",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  required
                />
                {formData.familyIncome !== "" && (
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md border border-black bg-neo-yellow/30 px-2 py-0.5 text-[11px] font-black text-black">
                      Formatted: {formatINR(Number(formData.familyIncome))} / year
                    </span>
                  </div>
                )}
              </div>

              <Select
                label="Domicile State / Union Territory"
                id="domicileState"
                value={formData.domicileState}
                onChange={(e) => handleChange("domicileState", e.target.value)}
              >
                <option value="">Select State...</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Select
                label="Social Category"
                id="category"
                value={formData.category}
                onChange={(e) =>
                  handleChange("category", e.target.value as SocialCategory)
                }
              >
                <option value="">Select Category...</option>
                {SOCIAL_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>

              {/* Area Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-black font-display">
                  Residential Area Background
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["rural", "Rural Area"],
                      ["urban", "Urban Area"],
                    ] as const
                  ).map(([aType, aLabel]) => (
                    <button
                      key={aType}
                      type="button"
                      onClick={() =>
                        handleChange("areaType", aType as AreaType)
                      }
                      className={`rounded-xl border-2 border-black p-2.5 text-xs font-bold transition-all ${
                        formData.areaType === aType
                          ? "bg-neo-yellow text-black shadow-neo font-black -translate-y-0.5"
                          : "bg-white text-neutral-600 shadow-neo-sm hover:bg-neutral-50"
                      }`}
                    >
                      {aLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PwD Status */}
            <div className="pt-3 border-t border-black/10">
              <Checkbox
                checked={formData.isPwd}
                onCheckedChange={(checked) => handleChange("isPwd", checked)}
                label="Person with Disability (PwD / Divyangjan)"
                description="Check this box if you possess a valid disability certificate of 40% or above."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-black/10">
          <div className="text-xs font-medium text-neutral-600 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Profile values are saved securely and can be updated anytime.</span>
          </div>

          <Button
            type="submit"
            variant="yellow"
            size="md"
            isLoading={isSaving}
            className="w-full sm:w-auto text-xs sm:text-sm font-black tracking-wider px-6 py-2.5 shadow-neo-sm hover:shadow-neo active:shadow-none"
          >
            Save Profile
            <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5]" />
          </Button>
        </div>
      </form>
    </div>
    </StudentGuard>
  );
}
