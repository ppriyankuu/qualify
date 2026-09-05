"use client";

import React from "react";
import { Plus, Trash2, Scale, Info, Sparkles } from "lucide-react";
import { EligibilityRule, Operator } from "@/types/scholarship";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface RuleBuilderProps {
  rules: EligibilityRule[];
  onChange: (rules: EligibilityRule[]) => void;
}

const FIELD_OPTIONS = [
  { value: "familyIncome", label: "Annual Family Income (INR)", defaultOp: "LTE", hint: "e.g. 500000" },
  { value: "cgpa", label: "Minimum CGPA (out of 10)", defaultOp: "GTE", hint: "e.g. 7.5" },
  { value: "previousMarksPercentage", label: "Previous Exam Marks (%)", defaultOp: "GTE", hint: "e.g. 75" },
  { value: "fieldOfStudy", label: "Field of Study", defaultOp: "IN", hint: "e.g. Engineering & Technology, Medicine" },
  { value: "educationLevel", label: "Education Level", defaultOp: "IN", hint: "e.g. undergraduate, diploma" },
  { value: "domicileState", label: "State of Domicile", defaultOp: "IN", hint: "e.g. Assam, Meghalaya" },
  { value: "gender", label: "Gender Requirement", defaultOp: "EQ", hint: "female or male" },
  { value: "category", label: "Social Category", defaultOp: "IN", hint: "e.g. SC, ST, OBC" },
  { value: "areaType", label: "Residential Background", defaultOp: "EQ", hint: "rural or urban" },
  { value: "isPwd", label: "Person with Disability (PwD)", defaultOp: "EQ", hint: "true" },
  { value: "age", label: "Age Limit (Years)", defaultOp: "LTE", hint: "e.g. 25" },
];

const OPERATOR_OPTIONS: { value: Operator; label: string }[] = [
  { value: "EQ", label: "= (Equals)" },
  { value: "NEQ", label: "≠ (Not Equal)" },
  { value: "LTE", label: "≤ (Less Than or Equal)" },
  { value: "GTE", label: "≥ (Greater Than or Equal)" },
  { value: "LT", label: "< (Strictly Less Than)" },
  { value: "GT", label: "> (Strictly Greater Than)" },
  { value: "IN", label: "One Of (Comma-separated list)" },
  { value: "CONTAINS", label: "Contains (Substring text)" },
];

export function RuleBuilder({ rules, onChange }: RuleBuilderProps) {
  const addRule = () => {
    const newRule: EligibilityRule = {
      id: `rule-${Date.now()}`,
      fieldName: "familyIncome",
      operator: "LTE",
      expectedValue: 500000,
      isMandatory: true,
      ruleDescription: "Family Annual Income ≤ ₹5,00,000",
    };
    onChange([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    onChange(rules.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, updatedFields: Partial<EligibilityRule>) => {
    onChange(
      rules.map((r) => {
        if (r.id !== id) return r;
        const merged = { ...r, ...updatedFields };

        // Auto-generate description if not manually entered
        if (updatedFields.fieldName || updatedFields.operator || updatedFields.expectedValue) {
          const fieldObj = FIELD_OPTIONS.find((f) => f.value === merged.fieldName);
          const fieldLabel = fieldObj ? fieldObj.label.split("(")[0].trim() : merged.fieldName;
          merged.ruleDescription = `${fieldLabel} must be ${merged.operator} ${merged.expectedValue}`;
        }
        return merged;
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
        <div>
          <h3 className="font-display font-black text-lg text-black">
            Structured Eligibility Rules
          </h3>
          <p className="text-xs font-medium text-neutral-600">
            Define clear, visible mathematical rules evaluated by the deterministic engine.
          </p>
        </div>

        <button
          type="button"
          onClick={addRule}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-neo-yellow px-3.5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Add Another Rule
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-black/30 p-8 text-center space-y-2">
          <Scale className="mx-auto h-8 w-8 text-neutral-400" />
          <p className="text-xs font-bold text-neutral-600">
            No eligibility rules defined yet. Click &quot;Add Another Rule&quot; to begin.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => {
            const currentFieldObj = FIELD_OPTIONS.find((f) => f.value === rule.fieldName);

            return (
              <div
                key={rule.id}
                className="rounded-2xl border-2 border-black bg-white p-4 sm:p-5 shadow-neo-sm space-y-4 relative"
              >
                {/* Header of Rule Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="yellow" size="sm">
                      Rule #{index + 1}
                    </Badge>
                    <span className="font-mono text-xs font-bold text-neutral-600">
                      Condition: {rule.fieldName} {rule.operator} {String(rule.expectedValue)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRule(rule.id)}
                    title="Remove Rule"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white text-neutral-600 shadow-neo-sm hover:bg-neo-red hover:text-white transition-colors"
                  >
                    <Trash2 className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Form Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  {/* Field Selector */}
                  <div className="sm:col-span-4">
                    <Select
                      label="Evaluation Field"
                      value={rule.fieldName}
                      onChange={(e) => {
                        const newField = e.target.value;
                        const match = FIELD_OPTIONS.find((f) => f.value === newField);
                        updateRule(rule.id, {
                          fieldName: newField,
                          operator: (match?.defaultOp as Operator) || "EQ",
                        });
                      }}
                    >
                      {FIELD_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Operator Selector */}
                  <div className="sm:col-span-3">
                    <Select
                      label="Operator"
                      value={rule.operator}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          operator: e.target.value as Operator,
                        })
                      }
                    >
                      {OPERATOR_OPTIONS.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Expected Value */}
                  <div className="sm:col-span-5">
                    <Input
                      label="Expected Value"
                      placeholder={currentFieldObj?.hint || "Value"}
                      value={String(rule.expectedValue)}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          expectedValue: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Rule Description & Mandatory Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-black/10">
                  <div className="sm:col-span-8">
                    <Input
                      label="Human-Readable Description"
                      placeholder="e.g. Annual Family Income ≤ ₹5,00,000"
                      value={rule.ruleDescription}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          ruleDescription: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="sm:col-span-4 pt-4 sm:pt-6">
                    <Checkbox
                      checked={rule.isMandatory}
                      onCheckedChange={(checked) =>
                        updateRule(rule.id, { isMandatory: !!checked })
                      }
                      label="Mandatory Requirement"
                      description="Failing this rule marks student as Not Eligible."
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
