import React from "react";
import { Scale, CheckCircle, AlertTriangle } from "lucide-react";
import { EligibilityRule } from "@/types/scholarship";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

import {
  formatGender,
  formatEducationLevel,
  formatAreaType,
} from "@/lib/eligibility-evaluator";

interface RulesTableProps {
  rules: EligibilityRule[];
}

export function RulesTable({ rules }: RulesTableProps) {
  const getOperatorLabel = (op: string) => {
    switch (op) {
      case "EQ":
        return "=";
      case "NEQ":
        return "≠";
      case "GTE":
        return "≥";
      case "LTE":
        return "≤";
      case "GT":
        return ">";
      case "LT":
        return "<";
      case "IN":
        return "One of";
      case "CONTAINS":
        return "Contains";
      default:
        return op;
    }
  };

  const formatExpectedValue = (field: string, val: string | number | boolean | string[]) => {
    if (Array.isArray(val)) {
      return val.join(", ");
    }
    if (typeof val === "boolean") {
      return val ? "Yes" : "No";
    }
    if (typeof val === "number" && val >= 1000) {
      return `₹${val.toLocaleString("en-IN")}`;
    }
    const norm = String(field).toLowerCase().replace(/_/g, "");
    if (norm === "gender") return formatGender(val);
    if (norm === "educationlevel") return formatEducationLevel(val);
    if (norm === "areatype") return formatAreaType(val);
    return String(val);
  };

  return (
    <Card variant="white" className="shadow-neo border-2 border-black">
      <CardHeader className="bg-[#FAF7F2] rounded-t-2xl p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-neo-pink shadow-neo-sm shrink-0">
            <Scale className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Visible Eligibility Rules</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Deterministic criteria defined by the scholarship provider.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6 space-y-2.5 sm:space-y-3">
        <div className="space-y-2.5">
          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              className="flex flex-col gap-2 p-3 sm:p-3.5 rounded-xl border-2 border-black bg-white shadow-neo-sm hover:bg-neutral-50 transition-all"
            >
              {/* Header row: Rule number and Requirement Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-black uppercase text-neutral-500">
                  Rule #{idx + 1}
                </span>
                <Badge
                  variant={rule.isMandatory ? "dark" : "default"}
                  size="sm"
                  className="text-[9px] sm:text-[10px] px-1.5 py-0 shrink-0"
                >
                  {rule.isMandatory ? "Mandatory" : "Preferred"}
                </Badge>
              </div>

              {/* Rule Description */}
              <span className="font-display font-black text-xs sm:text-sm text-black leading-snug break-words">
                {rule.ruleDescription}
              </span>

              {/* Structured condition definition chips */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold text-neutral-700 pt-0.5">
                <span className="bg-[#FAF7F2] px-2 py-0.5 rounded border border-black/20 break-all">
                  {String(rule.fieldName)}
                </span>
                <span className="bg-neo-yellow/30 px-1.5 py-0.5 rounded border border-black/20 font-black shrink-0">
                  {getOperatorLabel(rule.operator)}
                </span>
                <span className="bg-neutral-100 px-2 py-0.5 rounded border border-black/20 font-black text-black break-words max-w-full">
                  {formatExpectedValue(rule.fieldName, rule.expectedValue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
