import { useState, useEffect, useCallback } from "react";
import { Scholarship } from "@/types/scholarship";
import { apiClient } from "@/lib/api-client";
import { normalizeScholarship, ruleFieldToBackend } from "@/lib/scholarship-adapter";

let cachedScholarships: Scholarship[] | null = null;

export function useScholarshipStore() {
  const [scholarships, setScholarships] = useState<Scholarship[]>(() => cachedScholarships || []);
  const [isLoading, setIsLoading] = useState(() => !cachedScholarships);
  const [error, setError] = useState<string | null>(null);

  const fetchScholarships = useCallback(async () => {
    if (!cachedScholarships) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await apiClient.get<{
        success: boolean;
        count: number;
        scholarships: any[];
      }>("/scholarships");

      if (response && Array.isArray(response.scholarships)) {
        const normalized = response.scholarships.map(normalizeScholarship);
        cachedScholarships = normalized;
        setScholarships(normalized);
      }
    } catch (err: any) {
      console.error("Failed to fetch scholarships from backend:", err);
      setError(err?.message || "Failed to load scholarships from server");
      if (!cachedScholarships) {
        setScholarships([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  const addScholarship = useCallback(async (newScholarship: Scholarship) => {
    const backendPayload = {
      name: newScholarship.name,
      provider: newScholarship.provider,
      description: newScholarship.description,
      amount_description: newScholarship.amountDescription,
      amount_value: Number(newScholarship.amountValue) || 0,
      deadline: newScholarship.deadline,
      official_notice_url: newScholarship.officialNoticeUrl,
      is_published: 1,
      rules: (newScholarship.rules || []).map((r) => ({
        field_name: ruleFieldToBackend(r.fieldName),
        operator: r.operator,
        expected_value: Array.isArray(r.expectedValue)
          ? JSON.stringify(r.expectedValue)
          : String(r.expectedValue),
        is_mandatory: r.isMandatory ? 1 : 0,
        rule_description: r.ruleDescription,
      })),
      documents: (newScholarship.documents || []).map((d) => ({
        document_name: d.documentName,
        is_mandatory: d.isMandatory ? 1 : 0,
        instructions: d.instructions || null,
      })),
    };

    const response = await apiClient.post<{
      success: boolean;
      scholarship: any;
    }>("/admin/scholarships", backendPayload);

    let savedItem = newScholarship;
    if (response && response.scholarship) {
      savedItem = normalizeScholarship(response.scholarship);
    }

    setScholarships((prev) => {
      const updated = [savedItem, ...prev.filter((s) => s.id !== savedItem.id)];
      cachedScholarships = updated;
      return updated;
    });
    return savedItem;
  }, []);

  const deleteScholarship = useCallback(async (id: string) => {
    await apiClient.delete(`/admin/scholarships/${id}`);
    setScholarships((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      cachedScholarships = updated;
      return updated;
    });
  }, []);

  return {
    scholarships,
    addScholarship,
    deleteScholarship,
    isLoading,
    error,
    refresh: fetchScholarships,
  };
}

