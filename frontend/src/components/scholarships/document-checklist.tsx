"use client";

import React from "react";
import { FileCheck, AlertCircle, Info } from "lucide-react";
import { ScholarshipDocument } from "@/types/scholarship";
import { useDocumentChecklist } from "@/hooks/use-document-checklist";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface DocumentChecklistProps {
  scholarshipId: string;
  documents: ScholarshipDocument[];
}

export function DocumentChecklist({
  scholarshipId,
  documents,
}: DocumentChecklistProps) {
  const {
    completedIds,
    toggleItem,
    completedCount,
    totalCount,
    progressPercentage,
  } = useDocumentChecklist(scholarshipId, documents);

  return (
    <Card variant="white" className="shadow-neo border-2 border-black">
      <CardHeader className="bg-[#FAF7F2] rounded-t-2xl p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-neo-yellow shadow-neo-sm shrink-0">
              <FileCheck className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl">Required Document Checklist</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Track your document preparation progress before applying.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Badge
              variant={progressPercentage === 100 ? "pass" : "yellow"}
              size="md"
              className="text-xs"
            >
              {completedCount} of {totalCount} Ready ({progressPercentage}%)
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-3">
          <div className="h-3 w-full rounded-full border-2 border-black bg-neutral-100 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-neo-green transition-all duration-300 border border-black/20"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
        {/* Document Items */}
        <div className="space-y-2.5 sm:space-y-3">
          {documents.map((doc, idx) => {
            const isDone = completedIds.includes(doc.id);

            return (
              <div
                key={doc.id}
                onClick={() => toggleItem(doc.id)}
                className={`flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl border-2 border-black transition-all cursor-pointer select-none ${
                  isDone
                    ? "bg-[#E6FCF0] shadow-neo-sm"
                    : "bg-white shadow-neo-sm hover:bg-neutral-50 hover:shadow-neo"
                }`}
              >
                <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isDone}
                    onCheckedChange={() => toggleItem(doc.id)}
                    aria-label={`Toggle ${doc.documentName}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start sm:items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <span
                      className={`text-xs sm:text-sm font-bold block break-words leading-snug ${
                        isDone
                          ? "line-through text-neutral-500"
                          : "text-black"
                      }`}
                    >
                      {idx + 1}. {doc.documentName}
                    </span>

                    <Badge
                      variant={doc.isMandatory ? "dark" : "default"}
                      size="sm"
                      className="shrink-0 text-[9px] sm:text-[10px] px-1.5 py-0"
                    >
                      {doc.isMandatory ? "Mandatory" : "Optional"}
                    </Badge>
                  </div>

                  {doc.instructions && (
                    <p className="text-[11px] sm:text-xs text-neutral-600 mt-1.5 flex items-start gap-1 leading-snug">
                      <Info className="h-3.5 w-3.5 shrink-0 text-neutral-500 mt-0.5" />
                      <span>{doc.instructions}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Notice */}
        <div className="flex items-start gap-2.5 rounded-xl border-2 border-black bg-[#FFF9E6] p-3 text-xs font-bold text-black shadow-neo-sm mt-4">
          <AlertCircle className="h-4 w-4 shrink-0 stroke-[2.5] text-black mt-0.5" />
          <p className="leading-snug">
            <strong>Personal Preparation Only:</strong> This checklist helps you organize required certificates. The portal does not collect, store, or submit your documents to the scholarship provider.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
