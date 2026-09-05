"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  ExternalLink,
  Scale,
  CheckCircle2,
  XCircle,
  Check,
  Cpu,
  Stethoscope,
  Building2,
  HeartHandshake,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-neo-pink px-4 py-1.5 shadow-neo-sm">
          <Sparkles className="h-4 w-4 stroke-[2.5] text-black" />
          <span className="text-xs font-black uppercase tracking-wider text-black">
            Deterministic Eligibility Engine
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-black leading-[1.06]">
          Find Scholarships. <br className="hidden sm:inline" />
          Understand The Rules.{" "}
          <span className="relative inline-block mt-2 sm:mt-1">
            <span className="bg-neo-yellow px-3 sm:px-4 py-1 rounded-xl border-2 sm:border-3 border-black inline-block shadow-neo transform -rotate-1 hover:rotate-0 transition-transform">
              Zero Guesswork.
            </span>
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl font-medium text-neutral-700 max-w-2xl mx-auto leading-relaxed">
          No black-box scoring algorithms or arbitrary match percentages. Transparent, rule-by-rule eligibility verification with official circulars and pre-application document readiness tracking.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link href="/scholarships">
            <Button
              variant="yellow"
              size="lg"
              className="text-sm sm:text-base px-6 py-2.5 shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5"
            >
              Explore 100s of Scholarships
              <ArrowRight className="ml-2 h-4 w-4 stroke-[3]" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button
              variant="pink"
              size="lg"
              className="text-sm sm:text-base px-6 py-2.5 shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5"
            >
              Complete Student Profile
            </Button>
          </Link>
          <Link href="/admin">
            <Button
              variant="white"
              size="lg"
              className="text-sm sm:text-base px-5 py-2.5 shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5"
            >
              Admin Portal Demo
            </Button>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black bg-white text-[11px] font-black shadow-neo-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-black stroke-[3]" />
            <span>100% Deterministic Engine</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black bg-white text-[11px] font-black shadow-neo-sm">
            <FileText className="h-3.5 w-3.5 text-black stroke-[3]" />
            <span>Document Readiness Checklist</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black bg-white text-[11px] font-black shadow-neo-sm">
            <ExternalLink className="h-3.5 w-3.5 text-black stroke-[3]" />
            <span>Verified Official Notices</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black bg-white text-[11px] font-black shadow-neo-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-black stroke-[3]" />
            <span>Zero Black-Box AI Scores</span>
          </div>
        </div>
      </section>

      {/* 2. Live Engine Preview / Interactive Showcase Mockup */}
      <section className="max-w-4xl mx-auto">
        <div className="rounded-2xl border-2 sm:border-3 border-black bg-white shadow-neo-lg overflow-hidden">
          {/* Mockup Header Bar */}
          <div className="bg-[#FAF7F2] border-b-2 border-black px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-black bg-neo-red inline-block" />
                <span className="w-3 h-3 rounded-full border-2 border-black bg-neo-yellow inline-block" />
                <span className="w-3 h-3 rounded-full border-2 border-black bg-neo-green inline-block" />
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-neutral-600 pl-1">
                rules-engine.evaluator.preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-neo-green animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-black">
                Live Deterministic Trace
              </span>
            </div>
          </div>

          {/* Mockup Body */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Student Context Strip */}
            <div className="rounded-xl border-2 border-black bg-[#FAF7F2] p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-neutral-500 uppercase text-[10px]">
                  Sample Student:
                </span>
                <span className="font-black text-black">Engineering Undergrad</span>
                <span className="text-neutral-400">•</span>
                <span className="font-bold text-neutral-700">CGPA 8.4</span>
                <span className="text-neutral-400">•</span>
                <span className="font-bold text-neutral-700">Income ₹4.5 Lakhs</span>
                <span className="text-neutral-400">•</span>
                <span className="font-bold text-neutral-700">Category: General</span>
              </div>
              <Badge variant="pass" size="sm" className="font-black">
                Verified Profile
              </Badge>
            </div>

            {/* Evaluated Rules Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-600">
                <span>Evaluating: Reliance Foundation Undergraduate Scholarship</span>
                <span className="text-[11px] text-neutral-500 font-bold hidden sm:inline">
                  3 Rules Evaluated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Rule 1 */}
                <div className="rounded-xl border-2 border-black bg-[#E6FCF0] p-3 flex flex-col justify-between shadow-neo-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">
                      Academic Score
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded border border-black bg-neo-green">
                      PASS
                    </span>
                  </div>
                  <div className="text-xs font-black text-black">Rule: CGPA ≥ 7.0</div>
                  <div className="text-[11px] font-medium text-neutral-600 mt-1">
                    Student has 8.4 → Satisfied
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="rounded-xl border-2 border-black bg-[#E6FCF0] p-3 flex flex-col justify-between shadow-neo-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">
                      Income Ceiling
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded border border-black bg-neo-green">
                      PASS
                    </span>
                  </div>
                  <div className="text-xs font-black text-black">Rule: Income ≤ ₹6.0L</div>
                  <div className="text-[11px] font-medium text-neutral-600 mt-1">
                    Student has ₹4.5L → Satisfied
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="rounded-xl border-2 border-black bg-[#E6FCF0] p-3 flex flex-col justify-between shadow-neo-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">
                      Degree Level
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded border border-black bg-neo-green">
                      PASS
                    </span>
                  </div>
                  <div className="text-xs font-black text-black">Rule: Degree Student</div>
                  <div className="text-[11px] font-medium text-neutral-600 mt-1">
                    B.Tech 1st-4th Year → Satisfied
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict Output Banner */}
            <div className="rounded-xl border-2 border-black bg-black text-white p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-neo-green shrink-0 stroke-[3]" />
                <span className="font-bold">
                  VERDICT: <strong className="text-neo-green font-black">100% ELIGIBLE</strong> — All 3 mandatory rules satisfied deterministically.
                </span>
              </div>
              <Link href="/scholarships">
                <span className="inline-flex items-center gap-1 font-black text-neo-yellow hover:underline cursor-pointer">
                  Test your own profile <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works: 3-Step Process */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black font-display text-black">
            How Qualify Works
          </h2>
          <p className="text-sm sm:text-base font-bold text-neutral-600">
            Three straightforward steps to transparent scholarship eligibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="group rounded-2xl border-2 border-black bg-white p-6 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-neo-yellow text-sm font-black font-mono shadow-neo-sm">
                01
              </span>
              <Badge variant="yellow" size="sm">
                One-Time Setup
              </Badge>
            </div>
            <h3 className="text-lg font-black font-display text-black mb-2">
              Set Your Academic Profile
            </h3>
            <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-relaxed">
              Enter your CGPA, family income, field of study, gender, and social
              category once. Your profile stays local or synced to your account.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group rounded-2xl border-2 border-black bg-white p-6 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-neo-pink text-sm font-black font-mono shadow-neo-sm">
                02
              </span>
              <Badge variant="pink" size="sm">
                Strict Rules
              </Badge>
            </div>
            <h3 className="text-lg font-black font-display text-black mb-2">
              Deterministic Evaluation
            </h3>
            <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-relaxed">
              Every scholarship rule is mathematically tested against your profile.
              Get instant PASS, FAIL, or UNKNOWN breakdown with exact reasons.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group rounded-2xl border-2 border-black bg-white p-6 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-neo-green text-sm font-black font-mono shadow-neo-sm">
                03
              </span>
              <Badge variant="mint" size="sm">
                Official Sources
              </Badge>
            </div>
            <h3 className="text-lg font-black font-display text-black mb-2">
              Checklist & Official PDF
            </h3>
            <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-relaxed">
              Track required certificates before applying, download CSV summaries,
              and verify criteria directly through official institutional notices.
            </p>
          </div>
        </div>
      </section>

      {/* 4. The Deterministic Difference (Comparison Table) */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black font-display text-black">
            The Deterministic Difference
          </h2>
          <p className="text-sm sm:text-base font-bold text-neutral-600">
            Why rule-based transparency beats opaque recommendation algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Traditional Way */}
          <div className="rounded-2xl border-2 border-black bg-[#FAF7F2] p-6 shadow-neo space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-neo-red stroke-[2.5]" />
              <h3 className="text-base sm:text-lg font-black font-display text-black">
                Traditional Scholarship Portals
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-neo-red font-black shrink-0">✕</span>
                <span>Vague match percentages (e.g. &quot;78% Match&quot;) without explaining what criteria failed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neo-red font-black shrink-0">✕</span>
                <span>Expired schemes, broken links, and outdated stipend amounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neo-red font-black shrink-0">✕</span>
                <span>Requires filling 10-page forms before knowing if you meet the basic income cap</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neo-red font-black shrink-0">✕</span>
                <span>Surprise certificate rejections after spending weeks on an application</span>
              </li>
            </ul>
          </div>

          {/* Qualify Way */}
          <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-neo space-y-4 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <Badge variant="pass" size="sm" className="font-mono">
                RECOMMENDED
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-black stroke-[3]" />
              <h3 className="text-base sm:text-lg font-black font-display text-black">
                Qualify Deterministic Engine
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-neutral-800">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-black shrink-0 stroke-[3] mt-0.5" />
                <span><strong>Explicit Rule Traces:</strong> Every rule clearly flags PASS, FAIL, or UNKNOWN with values</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-black shrink-0 stroke-[3] mt-0.5" />
                <span><strong>Verified Official Notices:</strong> Direct links to official government circulars and PDF notices</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-black shrink-0 stroke-[3] mt-0.5" />
                <span><strong>Instant Evaluator:</strong> Evaluation takes 0ms without waiting for black-box AI processing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-black shrink-0 stroke-[3] mt-0.5" />
                <span><strong>Document Checklists:</strong> Interactive preparation checklist so you apply with all papers ready</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Quick Category Explorer */}
      <section className="space-y-6">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-black font-display text-black">
            Popular Opportunities
          </h2>
          <p className="text-xs sm:text-sm font-bold text-neutral-600">
            Browse verified scholarships tailored across diverse disciplines and backgrounds.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/scholarships"
            className="rounded-xl border-2 border-black bg-white p-3.5 text-center shadow-neo-sm hover:shadow-neo hover:bg-neo-yellow hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow shadow-neo-sm">
              <Cpu className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black">Engineering</span>
          </Link>

          <Link
            href="/scholarships"
            className="rounded-xl border-2 border-black bg-white p-3.5 text-center shadow-neo-sm hover:shadow-neo hover:bg-neo-pink hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-neo-pink shadow-neo-sm">
              <Stethoscope className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black">Medicine</span>
          </Link>

          <Link
            href="/scholarships"
            className="rounded-xl border-2 border-black bg-white p-3.5 text-center shadow-neo-sm hover:shadow-neo hover:bg-neo-green hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-neo-green shadow-neo-sm">
              <Sparkles className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black">Pure Science</span>
          </Link>

          <Link
            href="/scholarships"
            className="rounded-xl border-2 border-black bg-white p-3.5 text-center shadow-neo-sm hover:shadow-neo hover:bg-[#70D6FF] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-[#70D6FF] shadow-neo-sm">
              <Building2 className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black">Management</span>
          </Link>

          <Link
            href="/scholarships"
            className="rounded-xl border-2 border-black bg-white p-3.5 text-center shadow-neo-sm hover:shadow-neo hover:bg-[#FF8C42] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-[#FF8C42] shadow-neo-sm">
              <HeartHandshake className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black">Need-Based</span>
          </Link>

          <Link
            href="/scholarships"
            className="rounded-xl border-2 border-black bg-white p-3.5 text-center shadow-neo-sm hover:shadow-neo hover:bg-[#D4A5FF] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-[#D4A5FF] shadow-neo-sm">
              <GraduationCap className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black">Women in STEM</span>
          </Link>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="rounded-3xl border-2 sm:border-3 border-black bg-neo-yellow p-6 sm:p-12 shadow-neo-lg text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display text-black">
          Ready to Discover Scholarships You Actually Qualify For?
        </h2>
        <p className="text-xs sm:text-base font-bold text-neutral-800 max-w-xl mx-auto">
          Explore all 25+ verified listings or set up your student profile to evaluate criteria across every scholarship deterministically.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link href="/scholarships">
            <Button
              variant="dark"
              size="lg"
              className="text-sm border-2 border-neutral-200 sm:text-base px-6 py-2.5 shadow-neo hover:shadow-neo-lg"
            >
              Browse Scholarship Directory
              <ArrowRight className="ml-2 h-4 w-4 stroke-[3]" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button
              variant="white"
              size="lg"
              className="text-sm sm:text-base px-6 py-2.5 shadow-neo hover:shadow-neo-lg"
            >
              Set Up My Profile
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
