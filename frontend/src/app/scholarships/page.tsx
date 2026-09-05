"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Filter,
  HelpCircle,
} from "lucide-react";
import { useScholarshipStore } from "@/hooks/use-scholarship-store";
import { Scholarship, ScholarshipFilterState } from "@/types/scholarship";
import { ScholarshipCard } from "@/components/scholarships/scholarship-card";
import { FilterSidebar } from "@/components/scholarships/filter-sidebar";
import { exportScholarshipsToCSV } from "@/lib/csv-export";
import { Button } from "@/components/ui/button";

const INITIAL_FILTERS: ScholarshipFilterState = {
  search: "",
  fieldsOfStudy: [],
  educationLevels: [],
  maxIncome: "any",
  gender: "all",
  category: "all",
  pwdOnly: false,
  ruralOnly: false,
  sortBy: "deadline",
};

export default function ScholarshipsDirectoryPage() {
  const { scholarships, isLoading } = useScholarshipStore();
  const [filters, setFilters] = useState<ScholarshipFilterState>(INITIAL_FILTERS);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (updated: Partial<ScholarshipFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Compute active filters count (excluding search and sort)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.fieldsOfStudy.length > 0) count += filters.fieldsOfStudy.length;
    if (filters.educationLevels.length > 0) count += filters.educationLevels.length;
    if (filters.maxIncome !== "any") count += 1;
    if (filters.gender !== "all") count += 1;
    if (filters.category !== "all") count += 1;
    if (filters.pwdOnly) count += 1;
    if (filters.ruralOnly) count += 1;
    return count;
  }, [filters]);

  // Filter and Sort Scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((s) => {
      // 1. Search filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesProvider = s.provider.toLowerCase().includes(query);
        const matchesDesc = s.description.toLowerCase().includes(query);
        if (!matchesName && !matchesProvider && !matchesDesc) {
          return false;
        }
      }

      // 2. Fields of study
      if (filters.fieldsOfStudy.length > 0) {
        const hasOverlap = s.fieldOfStudy.some((field) =>
          filters.fieldsOfStudy.includes(field)
        );
        if (!hasOverlap) return false;
      }

      // 3. Education level
      if (filters.educationLevels.length > 0) {
        const hasLevel = s.educationLevel.some((lvl) =>
          filters.educationLevels.includes(lvl)
        );
        if (!hasLevel) return false;
      }

      // 4. Maximum income
      if (filters.maxIncome !== "any") {
        if (s.incomeLimit && s.incomeLimit < filters.maxIncome) {
          return false;
        }
      }

      // 5. Gender
      if (filters.gender !== "all") {
        if (
          s.genderRestriction !== "all" &&
          s.genderRestriction !== filters.gender
        ) {
          return false;
        }
      }

      // 6. Social Category
      if (filters.category !== "all") {
        if (
          s.categoryRestriction !== "All" &&
          s.categoryRestriction !== filters.category &&
          !(
            s.categoryRestriction === "SC/ST" &&
            (filters.category === "SC" || filters.category === "ST")
          )
        ) {
          return false;
        }
      }

      // 7. PwD
      if (filters.pwdOnly && !s.isPwdOnly) {
        return false;
      }

      // 8. Rural
      if (filters.ruralOnly && !s.isRuralOnly) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (filters.sortBy === "amount-high") {
        return b.amountValue - a.amountValue;
      }
      if (filters.sortBy === "amount-low") {
        return a.amountValue - b.amountValue;
      }
      if (filters.sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [filters, scholarships]);

  const handleDownloadCSV = () => {
    exportScholarshipsToCSV(filteredScholarships);
  };

  return (
    <div className="h-auto lg:h-[calc(100dvh-4.25rem)] flex flex-col max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 lg:overflow-hidden w-full">
      {/* Top Controls Toolbar Strip */}
      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border-2 border-black shadow-neo-sm mb-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search scholarship name, provider, keyword..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="w-full rounded-xl border-2 border-black bg-[#FAF7F2] pl-9 pr-3 py-2 sm:py-1.5 text-xs font-bold text-black placeholder:text-neutral-500 focus:outline-none focus:bg-white transition-colors"
          />
        </div>

        {/* Controls: Sort, Export CSV, Mobile Filter */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
            <span className="text-[11px] font-black uppercase text-neutral-600 hidden md:inline">
              Sort:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({
                  sortBy: e.target.value as ScholarshipFilterState["sortBy"],
                })
              }
              className="w-full sm:w-auto rounded-xl border-2 border-black bg-[#FAF7F2] px-2.5 py-1.5 text-xs font-black text-black cursor-pointer focus:outline-none"
            >
              <option value="deadline">Deadline: Soonest</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>

          <Button
            variant="white"
            size="sm"
            onClick={handleDownloadCSV}
            className="text-xs py-1.5 px-2.5 sm:px-3 shadow-neo-sm hover:shadow-neo shrink-0"
          >
            <Download className="mr-1 sm:mr-1.5 h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span> ({filteredScholarships.length})
          </Button>

          {/* Mobile Filter Button */}
          <Button
            variant="yellow"
            size="sm"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden text-xs py-1.5 px-2.5 sm:px-3 shadow-neo-sm shrink-0"
          >
            <Filter className="mr-1 h-3.5 w-3.5 stroke-[2.5]" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex gap-5 min-h-0 lg:overflow-hidden">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          activeFilterCount={activeFilterCount}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Main Listings Column */}
        <div className="flex-1 flex flex-col min-w-0 h-full lg:overflow-hidden">
          {/* Results Summary Counter */}
          <div className="shrink-0 flex items-center justify-between text-xs font-bold text-neutral-600 pb-2 px-1">
            <span>
              Showing <strong>{filteredScholarships.length}</strong> of{" "}
              {scholarships.length} scholarships
            </span>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-black font-black underline hover:text-neutral-700"
              >
                Clear all active filters
              </button>
            )}
          </div>

          {/* Cards Scroll Container: scrolls internally on desktop, flows naturally on mobile */}
          <div className="flex-1 lg:overflow-y-auto min-h-0 pt-2.5 px-2 pb-6 no-scrollbar">
            {isLoading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-black border-t-neo-yellow" />
              </div>
            ) : filteredScholarships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border-2 border-black bg-white p-10 text-center shadow-neo space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-neo-yellow shadow-neo-sm">
                  <HelpCircle className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black font-display text-black">
                  No Scholarships Match Your Current Filters
                </h3>
                <p className="text-xs font-semibold text-neutral-600 max-w-md mx-auto">
                  Try widening your income limit, resetting category selections, or searching for broader terms.
                </p>
                <div className="pt-2">
                  <Button variant="yellow" size="sm" onClick={handleResetFilters}>
                    Reset All Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
