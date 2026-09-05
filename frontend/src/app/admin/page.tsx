"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  Calendar,
  IndianRupee,
  Scale,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";
import { useScholarshipStore } from "@/hooks/use-scholarship-store";
import { AdminGuard } from "@/components/common/route-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { getDaysRemaining } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { scholarships, deleteScholarship, isLoading } = useScholarshipStore();
  const [scholarshipToDelete, setScholarshipToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const totalRules = scholarships.reduce((acc, s) => acc + s.rules.length, 0);

  const filteredScholarships = scholarships.filter((s) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.provider.toLowerCase().includes(query) ||
      s.amountDescription.toLowerCase().includes(query)
    );
  });

  const handleDeleteConfirm = async () => {
    if (scholarshipToDelete) {
      try {
        await deleteScholarship(scholarshipToDelete);
      } catch (err) {
        console.error("Failed to delete scholarship:", err);
      }
      setScholarshipToDelete(null);
    }
  };

  return (
    <AdminGuard>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats Summary Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card variant="white" className="shadow-neo-sm">
            <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2">
              <div>
                <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
                  Active Listings
                </span>
                <span className="text-xl sm:text-3xl font-black font-display text-black">
                  {scholarships.length}
                </span>
              </div>
              <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl border-2 border-black bg-neo-yellow shadow-neo-xs sm:shadow-neo-sm shrink-0">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </div>
            </CardContent>
          </Card>

          <Card variant="white" className="shadow-neo-sm">
            <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2">
              <div>
                <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
                  Total Rules
                </span>
                <span className="text-xl sm:text-3xl font-black font-display text-black">
                  {totalRules}
                </span>
              </div>
              <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl border-2 border-black bg-neo-pink shadow-neo-xs sm:shadow-neo-sm shrink-0">
                <Scale className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </div>
            </CardContent>
          </Card>

          <Card variant="white" className="shadow-neo-sm">
            <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2">
              <div>
                <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-600 block">
                  Rule Engine
                </span>
                <span className="text-[11px] sm:text-sm font-black font-display text-emerald-700 flex items-center gap-1 mt-0.5 sm:mt-1">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
                  Live
                </span>
              </div>
              <div className="flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl border-2 border-black bg-neo-green shadow-neo-xs sm:shadow-neo-sm shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search listings by title, provider, or benefit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-2 border-black bg-white pl-9 pr-8 py-2 text-xs font-bold placeholder:text-neutral-500 shadow-neo-sm focus:outline-none focus:shadow-neo"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black p-1"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Link href="/admin/scholarships/new" className="shrink-0">
            <Button
              variant="yellow"
              size="sm"
              className="w-full sm:w-auto text-xs font-black py-2.5 px-4 shadow-neo-sm hover:shadow-neo flex items-center justify-center"
            >
              <Plus className="mr-1.5 h-4 w-4 stroke-[3]" />
              Add New Scholarship
            </Button>
          </Link>
        </div>

        {/* Scholarships Data Container */}
        <Card variant="white" className="border-3 border-black shadow-neo-lg overflow-hidden">
          <CardHeader className="bg-[#FAF7F2] border-b-2 border-black py-3.5 px-4 sm:px-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-xl font-black">
                  Published Listings
                </CardTitle>
                <Badge variant="dark" size="sm" className="text-[10px]">
                  {filteredScholarships.length} of {scholarships.length}
                </Badge>
              </div>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-neutral-600 hover:text-black underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredScholarships.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-sm font-bold text-neutral-700">
                  No scholarship listings match &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-neutral-500">
                  Try checking for typos or searching by provider name.
                </p>
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-xs"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile Cards View (block md:hidden) */}
                <div className="block md:hidden divide-y-2 divide-black/10">
                  {filteredScholarships.map((s) => {
                    const daysInfo = getDaysRemaining(s.deadline);

                    return (
                      <div
                        key={s.id}
                        className="p-3.5 space-y-2.5 hover:bg-[#FAF7F2] transition-colors"
                      >
                        {/* Title & Status Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display font-black text-sm text-black leading-snug">
                              {s.name}
                            </h3>
                            <p className="text-[11px] font-medium text-neutral-600 truncate mt-0.5">
                              {s.provider}
                            </p>
                          </div>
                          <Badge
                            variant={daysInfo.isExpired ? "fail" : "yellow"}
                            size="sm"
                            className="shrink-0 text-[10px]"
                          >
                            {daysInfo.label}
                          </Badge>
                        </div>

                        {/* Amount & Specs Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-white px-2 py-0.5 font-bold text-black shadow-neo-xs">
                            <IndianRupee className="h-3 w-3" />
                            {s.amountDescription}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg border border-black/30 bg-neutral-100 px-2 py-0.5 font-mono font-bold text-neutral-700">
                            <Scale className="h-3 w-3" />
                            {s.rules.length} rules
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg border border-black/30 bg-neutral-100 px-2 py-0.5 font-mono font-bold text-neutral-700">
                            <FileCheck className="h-3 w-3" />
                            {s.documents.length} docs
                          </span>
                        </div>

                        {/* Footer info & Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/10">
                          <span className="text-[10px] font-mono text-neutral-500">
                            Deadline: {s.deadline}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/scholarships/${s.id}`}
                              className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-white px-2.5 py-1 text-xs font-bold shadow-neo-xs hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View</span>
                            </Link>

                            <button
                              onClick={() => setScholarshipToDelete(s.id)}
                              className="inline-flex items-center gap-1 rounded-lg border-2 border-black bg-white text-neo-red px-2.5 py-1 text-xs font-bold shadow-neo-xs hover:bg-neo-red hover:text-white active:translate-x-0.5 active:translate-y-0.5 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Data Table (hidden md:block) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-black bg-[#FFF9E6] text-[11px] font-black uppercase tracking-wider text-black">
                        <th className="p-4">Scholarship Name & Provider</th>
                        <th className="p-4">Deadline</th>
                        <th className="p-4">Amount / Benefits</th>
                        <th className="p-4">Rules</th>
                        <th className="p-4">Documents</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black/10 text-xs">
                      {filteredScholarships.map((s) => {
                        const daysInfo = getDaysRemaining(s.deadline);

                        return (
                          <tr
                            key={s.id}
                            className="hover:bg-[#FAF7F2] transition-colors font-medium text-black"
                          >
                            <td className="p-4">
                              <span className="font-bold font-display text-sm block">
                                {s.name}
                              </span>
                              <span className="text-[11px] text-neutral-600 block mt-0.5">
                                {s.provider}
                              </span>
                            </td>

                            <td className="p-4">
                              <Badge
                                variant={daysInfo.isExpired ? "fail" : "yellow"}
                                size="sm"
                              >
                                {daysInfo.label}
                              </Badge>
                              <span className="text-[10px] font-mono text-neutral-500 block mt-1">
                                {s.deadline}
                              </span>
                            </td>

                            <td className="p-4 font-bold">
                              {s.amountDescription}
                            </td>

                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 rounded-md border border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold">
                                <Scale className="h-3 w-3" />
                                {s.rules.length} rules
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 rounded-md border border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold">
                                <FileCheck className="h-3 w-3" />
                                {s.documents.length} docs
                              </span>
                            </td>

                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/scholarships/${s.id}`}
                                  title="View Public Page"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white shadow-neo-sm hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>

                                <button
                                  onClick={() => setScholarshipToDelete(s.id)}
                                  title="Delete Scholarship"
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white text-neutral-700 shadow-neo-sm hover:bg-neo-red hover:text-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <Dialog
          isOpen={!!scholarshipToDelete}
          onClose={() => setScholarshipToDelete(null)}
          title="Delete Scholarship Listing"
          description="Are you sure you want to delete this scholarship listing? This action cannot be undone."
        >
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="white"
              size="sm"
              onClick={() => setScholarshipToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
            >
              Confirm Delete
            </Button>
          </div>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
