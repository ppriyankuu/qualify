"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ScholarshipDocument } from "@/types/scholarship";
import { apiClient } from "@/lib/api-client";

import { useAuth } from "@/context/auth-context";

export function useDocumentChecklist(
  scholarshipId: string,
  documents: ScholarshipDocument[]
) {
  const { isAuthenticated, user } = useAuth();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const completedIdsRef = useRef(completedIds);
  completedIdsRef.current = completedIds;

  useEffect(() => {
    async function load() {
      if (!isAuthenticated || user?.role !== "student") {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await apiClient.get<{
          success: boolean;
          total_items: number;
          completed_items: number;
          checklist: Array<{
            id: string;
            scholarship_id: string;
            document_name: string;
            is_mandatory: boolean;
            is_completed: boolean;
          }>;
        }>(`/scholarships/${scholarshipId}/checklist`);

        if (data && Array.isArray(data.checklist)) {
          const finished = data.checklist
            .filter((c) => c.is_completed)
            .map((c) => c.id);
          setCompletedIds(finished);
        }
      } catch (err) {
        console.error("Failed to load checklist from backend:", err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [scholarshipId, isAuthenticated, user?.role]);

  const toggleItem = useCallback(
    async (docId: string) => {
      const isCurrentlyCompleted = completedIdsRef.current.includes(docId);
      const nextCompleted = !isCurrentlyCompleted;

      // Optimistic update with Set to prevent duplicates and race conditions
      setCompletedIds((prev) => {
        const next = new Set(prev);
        if (nextCompleted) {
          next.add(docId);
        } else {
          next.delete(docId);
        }
        return Array.from(next);
      });

      if (isAuthenticated && user?.role === "student") {
        try {
          await apiClient.patch(
            `/scholarships/${scholarshipId}/checklist/${docId}`,
            { is_completed: nextCompleted }
          );
        } catch (err) {
          console.error("Failed to update checklist item on backend:", err);
          // Revert optimistic update on failure
          setCompletedIds((prev) => {
            const next = new Set(prev);
            if (nextCompleted) {
              next.delete(docId);
            } else {
              next.add(docId);
            }
            return Array.from(next);
          });
        }
      }
    },
    [scholarshipId, isAuthenticated, user?.role]
  );

  const validDocIds = new Set(documents.map((d) => d.id));
  const uniqueCompleted = new Set(completedIds.filter((id) => validDocIds.has(id)));
  const completedCount = uniqueCompleted.size;
  const totalCount = documents.length;
  const progressPercentage =
    totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;

  return {
    completedIds,
    toggleItem,
    completedCount,
    totalCount,
    progressPercentage,
    isLoading,
  };
}
