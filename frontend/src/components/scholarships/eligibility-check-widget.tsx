"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Scholarship } from "@/types/scholarship";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/context/auth-context";
import {
  EligibilityResult,
  EvaluatedRuleResult,
  formatGender,
  formatEducationLevel,
  formatAreaType,
} from "@/lib/eligibility-evaluator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { ruleFieldToBackend } from "@/lib/scholarship-adapter";

interface EligibilityCheckWidgetProps {
  scholarship: Scholarship;
}

export function EligibilityCheckWidget({
  scholarship,
}: EligibilityCheckWidgetProps) {
  const { user, isAuthenticated } = useAuth();
  const { profile, completeness } = useProfile();

  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const handleCheck = async () => {
    setCheckError(null);

    if (!isAuthenticated) {
      setCheckError("Please log in with your student account to check eligibility against your profile.");
      return;
    }

    if (user?.role !== "student") {
      setCheckError("Eligibility evaluation is only available for student accounts.");
      return;
    }

    setIsChecking(true);
    try {
      const res = await apiClient.post<{
        success: boolean;
        verdict: "ELIGIBLE" | "NOT_ELIGIBLE" | "POSSIBLY_ELIGIBLE";
        summary: string;
        evaluatedAt: string;
        ruleDetails: Array<{
          ruleId: string;
          field: string;
          description: string;
          expected: string;
          actual: string | number | boolean | null;
          status: "PASS" | "FAIL" | "UNKNOWN";
          reason: string;
        }>;
        documentDetails?: Array<{
          documentId: string;
          documentName: string;
          isMandatory: boolean;
          isCompleted: boolean;
        }>;
        documentsReadyCount?: number;
        documentsTotalCount?: number;
        mandatoryDocumentsPendingCount?: number;
      }>(`/scholarships/${scholarship.id}/check-eligibility`);

      if (res && res.ruleDetails) {
        const mappedResults: EvaluatedRuleResult[] = res.ruleDetails.map((rd) => {
          const matchingRule = scholarship.rules.find(
            (r) => r.id === rd.ruleId || ruleFieldToBackend(r.fieldName) === rd.field
          );
          return {
            rule: matchingRule || {
              id: rd.ruleId,
              fieldName: rd.field,
              operator: "EQ" as const,
              expectedValue: rd.expected,
              isMandatory: true,
              ruleDescription: rd.description,
            },
            status: rd.status,
            studentValueText: (() => {
              if (rd.actual === null || rd.actual === undefined || rd.actual === "") {
                return "Not provided in profile";
              }
              const norm = (rd.field || "").toLowerCase().replace(/_/g, "");
              if (norm === "gender") return formatGender(rd.actual);
              if (norm === "educationlevel") return formatEducationLevel(rd.actual);
              if (norm === "areatype") return formatAreaType(rd.actual);
              if (norm === "ispwd") return rd.actual === 1 || rd.actual === true || rd.actual === "1" || rd.actual === "true" ? "Yes" : "No";
              return String(rd.actual);
            })(),
            reason: rd.reason,
          };
        });

        setResult({
          verdict: res.verdict,
          summary: res.summary,
          evaluatedAt: res.evaluatedAt,
          results: mappedResults,
          documentDetails: res.documentDetails,
          documentsReadyCount: res.documentsReadyCount,
          documentsTotalCount: res.documentsTotalCount,
          mandatoryDocumentsPendingCount: res.mandatoryDocumentsPendingCount,
        });
      }
    } catch (err: any) {
      setCheckError(err?.message || "Failed to evaluate eligibility on server.");
    } finally {
      setIsChecking(false);
    }
  };

  const isProfileIncomplete = completeness < 50;

  return (
    <Card variant="white" className="border-3 border-black shadow-neo-lg">
      <CardHeader className="bg-[#FFF9E6] rounded-t-2xl p-4 sm:p-6 pb-3 sm:pb-4 border-b-2 border-black">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow shadow-neo-sm">
              <Sparkles className="h-4 w-4 stroke-[2.5]" />
            </div>
            <CardTitle className="text-lg">Deterministic Checker</CardTitle>
          </div>
          <Badge variant="dark" size="sm">
            Live Engine
          </Badge>
        </div>
        <CardDescription className="text-xs text-neutral-700">
          Match your profile values against these exact rules. Zero estimation.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
        {/* Profile Status Chip */}
        <div className="flex items-center justify-between rounded-xl border-2 border-black bg-[#FAF7F2] p-3 text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-black" />
            <span className="font-bold text-neutral-800">
              Profile:{" "}
              <strong>
                {profile.fullName ? profile.fullName : "Guest Student"}
              </strong>
            </span>
          </div>
          <span className="font-mono font-black text-black">
            {completeness}% Ready
          </span>
        </div>

        {isProfileIncomplete && (
          <div className="rounded-xl border-2 border-neo-yellow bg-neo-yellow/20 p-3 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 stroke-[2.5] text-black shrink-0 mt-0.5" />
              <span className="font-bold text-black">
                Your profile is missing key details (income, domicile, or CGPA).
              </span>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 text-[11px] font-black underline text-black hover:text-neutral-800"
            >
              Update profile for accurate checking <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {checkError && (
          <div className="rounded-xl border-2 border-neo-red bg-neo-red/15 p-3 text-xs font-bold text-black flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-neo-red shrink-0 stroke-[2.5] mt-0.5" />
            <div className="space-y-1">
              <span>{checkError}</span>
              {!isAuthenticated && (
                <div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 font-black underline text-black hover:text-neutral-800"
                  >
                    Go to Login <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evaluation Trigger Button */}
        <Button
          variant="yellow"
          size="lg"
          isLoading={isChecking}
          onClick={handleCheck}
          className="w-full text-sm font-black py-4 shadow-neo hover:shadow-neo-lg"
        >
          ⚡ Check My Eligibility
        </Button>

        {/* Verdict Results Display */}
        {result && (
          <div className="pt-4 space-y-4 animate-in fade-in duration-200 border-t-2 border-black/10">
            {/* Verdict Stamp Banner */}
            {result.verdict === "ELIGIBLE" && (
              <div className="rounded-xl border-3 border-black bg-neo-green/20 p-4 shadow-neo">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="mint" size="md">
                    ✓ ELIGIBLE
                  </Badge>
                  <span className="text-xs font-black text-black uppercase">
                    All Criteria Passed
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-800">
                  {result.summary}
                </p>
              </div>
            )}

            {result.verdict === "NOT_ELIGIBLE" && (
              <div className="rounded-xl border-3 border-black bg-neo-red/20 p-4 shadow-neo">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="fail" size="md">
                    ✗ NOT ELIGIBLE
                  </Badge>
                  <span className="text-xs font-black text-black uppercase">
                    Requirements Unmet
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-800">
                  {result.summary}
                </p>
              </div>
            )}

            {result.verdict === "POSSIBLY_ELIGIBLE" && (
              <div className="rounded-xl border-3 border-black bg-neo-yellow/30 p-4 shadow-neo">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="unknown" size="md">
                    ? POSSIBLY ELIGIBLE
                  </Badge>
                  <span className="text-xs font-black text-black uppercase">
                    Information Missing
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-800">
                  {result.summary}
                </p>
              </div>
            )}

            {/* Rule-by-Rule Breakdown Stack */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-black uppercase tracking-wider text-black block">
                Deterministic Rule Trace
              </span>

              {result.results.map((r, i) => (
                <div
                  key={r.rule.id}
                  className="rounded-xl border-2 border-black bg-white p-3 shadow-neo-sm space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5 font-display text-xs font-bold text-black flex-1 min-w-0">
                      {r.status === "PASS" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {r.status === "FAIL" && (
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      {r.status === "UNKNOWN" && (
                        <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <span className="break-words leading-snug">
                        {r.rule.ruleDescription}
                      </span>
                    </div>

                    <Badge
                      variant={
                        r.status === "PASS"
                          ? "mint"
                          : r.status === "FAIL"
                          ? "fail"
                          : "unknown"
                      }
                      size="sm"
                      className="shrink-0 text-[10px]"
                    >
                      {r.status}
                    </Badge>
                  </div>

                  <div className="text-[11px] font-mono text-neutral-600 bg-[#FAF7F2] p-1.5 rounded border border-black/10 break-words">
                    Your Profile: <strong>{r.studentValueText}</strong>
                  </div>

                  <p className="text-[11px] font-medium text-neutral-700 leading-snug break-words">
                    {r.reason}
                  </p>
                </div>
              ))}
            </div>

            {/* Document Readiness Trace */}
            {result.documentDetails && result.documentDetails.length > 0 && (
              <div className="space-y-2 pt-3 border-t-2 border-black/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    Document Readiness
                  </span>
                  <span className="font-mono text-[11px] font-black text-black">
                    {result.documentsReadyCount ?? result.documentDetails.filter((d) => d.isCompleted).length} / {result.documentDetails.length} Ready
                  </span>
                </div>

                <div className="space-y-1.5">
                  {result.documentDetails.map((doc) => (
                    <div
                      key={doc.documentId}
                      className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border-2 border-black text-xs ${
                        doc.isCompleted
                          ? "bg-[#E6FCF0] text-black"
                          : "bg-white text-neutral-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {doc.isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <span className={`break-words text-xs leading-snug ${doc.isCompleted ? "font-bold" : "font-medium"}`}>
                          {doc.documentName}
                        </span>
                      </div>

                      <Badge
                        variant={doc.isCompleted ? "mint" : doc.isMandatory ? "yellow" : "default"}
                        size="sm"
                        className="shrink-0 text-[10px]"
                      >
                        {doc.isCompleted ? "Ready" : doc.isMandatory ? "Pending" : "Optional"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
