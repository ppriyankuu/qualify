"use client";

import React from "react";
import { Filter, RotateCcw, X } from "lucide-react";
import { ScholarshipFilterState } from "@/types/scholarship";
import { FIELDS_OF_STUDY } from "@/types/profile";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface FilterSidebarProps {
  filters: ScholarshipFilterState;
  onFilterChange: (updated: Partial<ScholarshipFilterState>) => void;
  onReset: () => void;
  activeFilterCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  activeFilterCount,
  isOpenMobile = false,
  onCloseMobile,
}: FilterSidebarProps) {
  const toggleFieldOfStudy = (field: string) => {
    const next = filters.fieldsOfStudy.includes(field)
      ? filters.fieldsOfStudy.filter((f) => f !== field)
      : [...filters.fieldsOfStudy, field];
    onFilterChange({ fieldsOfStudy: next });
  };

  const toggleEducationLevel = (level: string) => {
    const next = filters.educationLevels.includes(level)
      ? filters.educationLevels.filter((l) => l !== level)
      : [...filters.educationLevels, level];
    onFilterChange({ educationLevels: next });
  };

  const content = (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow shadow-neo-sm">
            <Filter className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
          <span className="font-display font-black text-xs uppercase tracking-wider text-black">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <Badge variant="pink" size="sm" className="text-[10px] px-1.5 py-0">
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-black text-neutral-600 hover:text-black hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Filter 1: Education Level (Compact Grid) */}
      <div className="space-y-1.5">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-black font-display">
          Education Level
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            ["undergraduate", "Undergrad"],
            ["postgraduate", "Postgrad"],
            ["diploma", "Diploma"],
            ["school", "10+2 School"],
          ].map(([lvlKey, lvlLabel]) => {
            const isSelected = filters.educationLevels.includes(lvlKey);
            return (
              <button
                key={lvlKey}
                type="button"
                onClick={() => toggleEducationLevel(lvlKey)}
                className={`rounded-lg border-2 border-black py-1 px-2 text-[11px] font-black transition-all ${
                  isSelected
                    ? "bg-neo-yellow text-black shadow-neo-sm -translate-y-0.5"
                    : "bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {lvlLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 2: Maximum Family Income */}
      <div className="space-y-1.5 pt-1.5 border-t border-black/10">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-black font-display">
          Income Cap
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              ["any", "Any Limit"],
              [250000, "≤ ₹2.5L"],
              [500000, "≤ ₹5.0L"],
              [800000, "≤ ₹8.0L"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => onFilterChange({ maxIncome: val })}
              className={`rounded-lg border-2 border-black py-1 px-2 text-[11px] font-black transition-all ${
                filters.maxIncome === val
                  ? "bg-neo-yellow text-black shadow-neo-sm -translate-y-0.5"
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter 3: Gender Requirement */}
      <div className="space-y-1.5 pt-1.5 border-t border-black/10">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-black font-display">
          Gender
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              ["all", "All"],
              ["female", "Female"],
              ["male", "Male"],
            ] as const
          ).map(([gVal, gLabel]) => (
            <button
              key={gVal}
              type="button"
              onClick={() => onFilterChange({ gender: gVal })}
              className={`rounded-lg border-2 border-black py-1 px-1.5 text-[11px] font-black uppercase transition-all ${
                filters.gender === gVal
                  ? "bg-neo-pink text-black shadow-neo-sm -translate-y-0.5"
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {gLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Filter 4: Social Category */}
      <div className="space-y-1.5 pt-1.5 border-t border-black/10">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-black font-display">
          Category
        </h4>
        <div className="flex flex-wrap gap-1">
          {(["all", "General", "OBC", "SC", "ST", "EWS"] as const).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange({ category: cat })}
                className={`rounded-lg border-2 border-black py-0.5 px-2 text-[10px] font-black transition-all ${
                  filters.category === cat
                    ? "bg-neo-green text-black shadow-neo-sm -translate-y-0.5"
                    : "bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Filter 5: Special Priorities */}
      <div className="space-y-1.5 pt-1.5 border-t border-black/10">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-black font-display">
          Special Priorities
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange({ pwdOnly: !filters.pwdOnly })}
            className={`rounded-lg border-2 border-black py-1 px-1 text-[10px] font-black transition-all ${
              filters.pwdOnly
                ? "bg-neo-yellow text-black shadow-neo-sm -translate-y-0.5"
                : "bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            PwD Friendly
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ruralOnly: !filters.ruralOnly })}
            className={`rounded-lg border-2 border-black py-1 px-1 text-[10px] font-black transition-all ${
              filters.ruralOnly
                ? "bg-neo-yellow text-black shadow-neo-sm -translate-y-0.5"
                : "bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            Rural Priority
          </button>
        </div>
      </div>

      {/* Filter 6: Field of Study (Compact Dropdown) */}
      <div className="space-y-1.5 pt-1.5 border-t border-black/10">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-black font-display">
            Field of Study
          </h4>
          {filters.fieldsOfStudy.length > 0 && (
            <button
              type="button"
              onClick={() => onFilterChange({ fieldsOfStudy: [] })}
              className="text-[10px] font-black text-neutral-500 hover:text-black underline"
            >
              Clear
            </button>
          )}
        </div>
        <select
          value={filters.fieldsOfStudy[0] || ""}
          onChange={(e) => {
            const val = e.target.value;
            onFilterChange({ fieldsOfStudy: val ? [val] : [] });
          }}
          className="w-full rounded-xl border-2 border-black bg-[#FAF7F2] px-2.5 py-1.5 text-xs font-black text-black cursor-pointer focus:outline-none focus:bg-white"
        >
          <option value="">All Fields of Study</option>
          {FIELDS_OF_STUDY.map((fld) => (
            <option key={fld} value={fld}>
              {fld}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Compact, fits viewport without scroll, scrollbar hidden if needed) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-full overflow-hidden">
        <div className="flex flex-col rounded-2xl border-2 border-black bg-white p-3.5 shadow-neo overflow-y-auto no-scrollbar">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs"
          onClick={onCloseMobile}
        >
          <div
            className="relative ml-auto h-full w-full max-w-xs bg-white p-5 shadow-2xl overflow-y-auto no-scrollbar border-l-3 border-black animate-in slide-in-from-right duration-200 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <span className="font-display font-black text-sm uppercase text-black">
                  Filters
                </span>
                <button
                  onClick={onCloseMobile}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <X className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
              <div className="mt-4">{content}</div>
            </div>

            <div className="pt-6 pb-2">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full rounded-xl border-2 border-black bg-neo-yellow py-3 text-xs font-black uppercase tracking-wider text-black shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Apply & View Scholarships
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
