import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  ExternalLink,
  IndianRupee,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { RulesTable } from "@/components/scholarships/rules-table";
import { DocumentChecklist } from "@/components/scholarships/document-checklist";
import { OfficialNoticeCard } from "@/components/scholarships/official-notice-card";
import { EligibilityCheckWidget } from "@/components/scholarships/eligibility-check-widget";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getDaysRemaining } from "@/lib/utils";
import { normalizeScholarship } from "@/lib/scholarship-adapter";
import { Scholarship } from "@/types/scholarship";

import { MOCK_SCHOLARSHIPS } from "@/data/mock-scholarships";

export async function generateStaticParams() {
  const dbIds = Array.from({ length: 25 }, (_, i) => ({
    id: `a1000000-0000-0000-0000-${String(i + 1).padStart(12, "0")}`,
  }));

  const mockIds = MOCK_SCHOLARSHIPS.map((s) => ({
    id: s.id,
  }));

  return [...dbIds, ...mockIds];
}

interface ScholarshipDetailsPageProps {
  params: {
    id: string;
  };
}

async function fetchScholarshipFromBackend(id: string): Promise<Scholarship | null> {
  // If id is literal template "[id]", skip
  if (!id || id === "[id]") return null;

  // 1. Try remote backend API first
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://backend.ppriyankuu.workers.dev/api";
  try {
    const res = await fetch(`${apiUrl}/scholarships/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.scholarship) {
        return normalizeScholarship(data.scholarship);
      }
    }
  } catch {
    // Silently continue to fallbacks if backend unreachable during build
  }

  // 2. Direct match in local mock data
  const local = MOCK_SCHOLARSHIPS.find((s) => s.id === id);
  if (local) return local;

  // 3. Fallback matching for database UUIDs (a1000000-0000-0000-0000-0000000000XX)
  const uuidMatch = id.match(/^a1000000-0000-0000-0000-0000000000(\d{2})$/);
  if (uuidMatch) {
    const index = parseInt(uuidMatch[1], 10) - 1;
    if (index >= 0 && index < MOCK_SCHOLARSHIPS.length) {
      return {
        ...MOCK_SCHOLARSHIPS[index],
        id,
      };
    }
  }

  return null;
}

export default async function ScholarshipDetailsPage({
  params,
}: ScholarshipDetailsPageProps) {
  const scholarship = await fetchScholarshipFromBackend(params.id);

  if (!scholarship) {
    return notFound();
  }


  const daysInfo = getDaysRemaining(scholarship.deadline);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-bold text-neutral-600">
        <Link href="/scholarships" className="hover:text-black hover:underline">
          Scholarships
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-black font-black truncate max-w-[200px] sm:max-w-md">
          {scholarship.name}
        </span>
      </nav>

      {/* Top Hero Section */}
      <div className="rounded-2xl border-3 border-black bg-white p-4 sm:p-8 shadow-neo-lg space-y-5 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-black bg-[#FAF7F2] px-2.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm">
                <Building className="h-3.5 w-3.5" />
                {scholarship.provider}
              </span>
              <Badge variant="mint" size="sm">
                Verified Listing
              </Badge>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black font-display text-black leading-tight">
              {scholarship.name}
            </h1>

            <p className="text-xs sm:text-sm lg:text-base font-medium text-neutral-700 leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* Deadline & Official Notice Block */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-black/10">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  daysInfo.isExpired
                    ? "fail"
                    : daysInfo.days <= 10
                    ? "yellow"
                    : "yellow"
                }
                size="md"
                className="text-xs px-3 py-1.5"
              >
                <Clock className="mr-1.5 h-3.5 w-3.5 stroke-[2.5]" />
                {daysInfo.label}
              </Badge>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-neutral-500">
              Deadline: {new Date(scholarship.deadline).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Key Information Highlight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 border-t-2 border-black/10">
          <div className="rounded-xl border-2 border-black bg-[#FFF9E6] p-2.5 sm:p-3 shadow-neo-sm">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
              Grant Amount
            </span>
            <span className="font-display text-xs sm:text-base font-black text-black break-words leading-tight block mt-0.5">
              {scholarship.amountDescription}
            </span>
          </div>

          <div className="rounded-xl border-2 border-black bg-white p-2.5 sm:p-3 shadow-neo-sm">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
              Education Level
            </span>
            <span className="font-display text-xs sm:text-base font-black text-black capitalize break-words leading-tight block mt-0.5">
              {scholarship.educationLevel.join(", ")}
            </span>
          </div>

          <div className="rounded-xl border-2 border-black bg-white p-2.5 sm:p-3 shadow-neo-sm">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
              Income Ceiling
            </span>
            <span className="font-display text-xs sm:text-base font-black text-black break-words leading-tight block mt-0.5">
              {scholarship.incomeLimit
                ? `≤ ₹${scholarship.incomeLimit.toLocaleString("en-IN")}`
                : "No Limit"}
            </span>
          </div>

          <div className="rounded-xl border-2 border-black bg-white p-2.5 sm:p-3 shadow-neo-sm">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
              Gender Quota
            </span>
            <span className="font-display text-xs sm:text-base font-black text-black capitalize break-words leading-tight block mt-0.5">
              {scholarship.genderRestriction === "all"
                ? "Open to All"
                : scholarship.genderRestriction}
            </span>
          </div>
        </div>
      </div>

      {/* Main Body Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Right Column (Sticky on Desktop): Eligibility Checker & Official Notice */}
        <div className="order-1 lg:order-2 lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* Interactive Eligibility Evaluation Trigger Card */}
          <EligibilityCheckWidget scholarship={scholarship} />

          {/* Official Notice Link Box (Desktop view - pinned in sticky sidebar) */}
          <div className="hidden lg:block">
            <OfficialNoticeCard
              officialNoticeUrl={scholarship.officialNoticeUrl}
              provider={scholarship.provider}
              scholarshipName={scholarship.name}
            />
          </div>
        </div>

        {/* Left Column: Rules First, Document Checklist Second */}
        <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 sm:space-y-8">
          {/* Structured Eligibility Rules FIRST */}
          <RulesTable rules={scholarship.rules} />

          {/* Interactive Document Checklist SECOND */}
          <DocumentChecklist
            scholarshipId={scholarship.id}
            documents={scholarship.documents}
          />

          {/* Official Notice Link Box (Mobile view - placed cleanly at the bottom after rules and checklist) */}
          <div className="block lg:hidden">
            <OfficialNoticeCard
              officialNoticeUrl={scholarship.officialNoticeUrl}
              provider={scholarship.provider}
              scholarshipName={scholarship.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
