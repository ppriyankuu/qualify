"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { StudentProfile } from "@/types/profile";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

import { profileFromBackend, profileToBackend } from "@/lib/profile-adapter";

export const EMPTY_PROFILE: StudentProfile = {
  fullName: "",
  age: "",
  gender: "",
  familyIncome: "",
  educationLevel: "",
  currentCourse: "",
  fieldOfStudy: "",
  cgpa: "",
  domicileState: "",
  areaType: "",
  category: "",
  isPwd: false,
  previousInstitution: "",
  previousMarksPercentage: "",
};

// Meritorious demo profile for quick 1-click test populating in the UI
export const DEMO_STUDENT_PROFILE: StudentProfile = {
  fullName: "Aarav Sharma",
  age: 20,
  gender: "male",
  familyIncome: 320000,
  educationLevel: "undergraduate",
  currentCourse: "B.Tech Computer Science & Engineering",
  fieldOfStudy: "Engineering & Technology",
  cgpa: 8.4,
  domicileState: "Assam",
  areaType: "rural",
  category: "OBC",
  isPwd: false,
  previousInstitution: "Cotton University, Guwahati",
  previousMarksPercentage: 89.5,
};

export function calculateProfileCompleteness(profile: StudentProfile): number {
  const coreFields: (keyof StudentProfile)[] = [
    "fullName",
    "age",
    "gender",
    "familyIncome",
    "educationLevel",
    "currentCourse",
    "fieldOfStudy",
    "cgpa",
    "domicileState",
    "areaType",
    "category",
  ];

  const filledCount = coreFields.filter((field) => {
    const val = profile[field];
    return val !== "" && val !== undefined && val !== null;
  }).length;

  return Math.round((filledCount / coreFields.length) * 100);
}

// Module-level in-memory cache to prevent repeated GET /profile/me across components
let cachedProfile: StudentProfile | null = null;
let cachedProfileUserId: string | null = null;

export function useProfile() {
  const { user, updateUser, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (user?.id && cachedProfileUserId === user.id && cachedProfile) {
      return cachedProfile;
    }
    return EMPTY_PROFILE;
  });

  const [isLoading, setIsLoading] = useState(() => {
    return !(user?.id && cachedProfileUserId === user.id && cachedProfile);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserRef = useRef(updateUser);
  updateUserRef.current = updateUser;

  const userRef = useRef(user);
  userRef.current = user;

  // Load profile from Backend API
  useEffect(() => {
    let mounted = true;

    if (!isAuthenticated || user?.role !== "student") {
      cachedProfile = null;
      cachedProfileUserId = null;
      setProfile(EMPTY_PROFILE);
      setIsLoading(false);
      return;
    }

    // If already cached for this specific user, use cached value
    if (user?.id && cachedProfileUserId === user.id && cachedProfile) {
      setProfile(cachedProfile);
      setIsLoading(false);
      return;
    }

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient.get<{
          success: boolean;
          hasProfile: boolean;
          profile: any;
        }>("/profile/me");

        if (mounted && data && data.hasProfile && data.profile) {
          const normalized = profileFromBackend(data.profile);
          cachedProfile = normalized;
          cachedProfileUserId = user?.id || null;
          setProfile(normalized);

          if (!userRef.current?.hasProfile || userRef.current?.name !== normalized.fullName) {
            updateUserRef.current({ hasProfile: true, name: normalized.fullName });
          }
        } else if (mounted) {
          cachedProfile = EMPTY_PROFILE;
          cachedProfileUserId = user?.id || null;
          setProfile(EMPTY_PROFILE);
        }
      } catch (err: any) {
        if (mounted) {
          // If 404, the student profile simply hasn't been created yet
          if (err?.status === 404) {
            cachedProfile = EMPTY_PROFILE;
            cachedProfileUserId = user?.id || null;
            setProfile(EMPTY_PROFILE);
          } else {
            setError(err.message || "Failed to load profile from server");
          }
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id, user?.role]);

  const saveProfile = useCallback(
    async (updatedData: StudentProfile) => {
      setIsSaving(true);
      setError(null);
      try {
        const backendPayload = profileToBackend(updatedData);
        const data = await apiClient.put<{
          success: boolean;
          hasProfile: boolean;
          profile: any;
        }>("/profile/me", backendPayload);

        if (data && data.profile) {
          const normalized = profileFromBackend(data.profile);
          cachedProfile = normalized;
          cachedProfileUserId = userRef.current?.id || null;
          setProfile(normalized);

          if (!userRef.current?.hasProfile || userRef.current?.name !== normalized.fullName) {
            updateUserRef.current({ hasProfile: true, name: normalized.fullName });
          }
          return normalized;
        }
      } catch (err: any) {
        const msg = err.message || "Failed to save profile to server";
        setError(msg);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  return {
    profile,
    setProfile,
    saveProfile,
    isLoading,
    isSaving,
    error,
    completeness: calculateProfileCompleteness(profile),
  };
}
