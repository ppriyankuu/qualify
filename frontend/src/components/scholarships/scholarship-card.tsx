import React from "react";
import Link from "next/link";
import {
  Clock,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Scholarship } from "@/types/scholarship";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { getDaysRemaining } from "@/lib/utils";

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const daysInfo = getDaysRemaining(scholarship.deadline);

  return (
    <Card
      variant="white"
      className="group flex flex-col justify-between border-2 border-black shadow-neo transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg"
    >
      <div>
        <CardHeader className="bg-[#FAF7F2] rounded-t-2xl pb-2.5 pt-3.5 px-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className="text-[11px] font-black uppercase tracking-wider text-neutral-700 flex-1 min-w-0 pr-2 line-clamp-1"
              title={scholarship.provider}
            >
              {scholarship.provider}
            </span>

            {/* Deadline Badge */}
            <Badge
              variant={daysInfo.isExpired ? "fail" : daysInfo.days <= 10 ? "yellow" : "default"}
              size="sm"
              className="gap-1 shrink-0 text-[10px]"
            >
              <Clock className="h-3 w-3 stroke-[2.5]" />
              {daysInfo.label}
            </Badge>
          </div>

          <Link href={`/scholarships/${scholarship.id}`}>
            <CardTitle className="text-lg font-black font-display leading-tight group-hover:text-black group-hover:underline decoration-2">
              {scholarship.name}
            </CardTitle>
          </Link>

          <CardDescription className="line-clamp-2 mt-1 text-xs font-medium text-neutral-600">
            {scholarship.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-3 pb-3 px-4 space-y-2.5">
          {/* Amount Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-neo-yellow/30 px-2 py-0.5 text-xs font-black text-black shadow-neo-sm">
              <span>{scholarship.amountDescription}</span>
            </div>
            {scholarship.incomeLimit && (
              <span className="text-[11px] font-bold text-neutral-600">
                Income ≤ ₹{(scholarship.incomeLimit / 100000).toFixed(1)}L/yr
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {scholarship.educationLevel.map((lvl) => (
              <span
                key={lvl}
                className="rounded-md border border-black bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black"
              >
                {lvl}
              </span>
            ))}

            {scholarship.genderRestriction === "female" && (
              <span className="rounded-md border border-black bg-neo-pink px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                Girls Only
              </span>
            )}

            {scholarship.categoryRestriction !== "All" && (
              <span className="rounded-md border border-black bg-[#E6FCF0] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                {scholarship.categoryRestriction}
              </span>
            )}

            {scholarship.isPwdOnly && (
              <span className="rounded-md border border-black bg-neo-yellow px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                PwD Only
              </span>
            )}

            {scholarship.isRuralOnly && (
              <span className="rounded-md border border-black bg-[#E5E0D8] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-black">
                Rural Only
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="bg-[#FAF7F2] rounded-b-2xl border-t-2 border-black py-2.5 px-4 flex items-center justify-between gap-3">
        <a
          href={scholarship.officialNoticeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold text-neutral-600 hover:text-black hover:underline flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          Official Notice <ExternalLink className="h-3 w-3 stroke-[2]" />
        </a>

        <Link href={`/scholarships/${scholarship.id}`}>
          <button className="inline-flex items-center gap-1 rounded-xl border-2 border-black bg-neo-yellow px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm transition-all hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
            Check Eligibility
            <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
