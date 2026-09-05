"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AlertCircle } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on the single-screen Directory page so it doesn't cause page-level scrolling
  if (pathname === "/scholarships") {
    return null;
  }

  return (
    <footer className="w-full border-t-2 border-black bg-white mt-20">
      {/* Notice Banner */}
      <div className="border-b-2 border-black bg-[#FFF9E6] px-4 py-3 text-center text-xs font-bold text-black flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4 text-black shrink-0 stroke-[2.5]" />
        <span>
          <strong>Transparency Notice:</strong> This portal provides deterministic rule-based eligibility evaluation. It does not submit applications. Always verify criteria via the official scholarship notice.
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-sm uppercase tracking-wider text-black">
            Qualify
          </span>
          <span className="text-xs text-neutral-500 font-bold">
            • Deterministic Eligibility Engine
          </span>
        </div>

        <div className="text-xs font-bold text-neutral-600">
          Deterministic Rule Engine • Zero Black-box Scoring • 100% Transparent
        </div>
      </div>
    </footer>
  );
}
