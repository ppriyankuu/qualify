"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types/auth";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RouteGuard({ children, allowedRoles }: GuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to their respective home
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/scholarships");
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-black border-t-neo-yellow" />
          <span className="font-display text-xs font-black uppercase tracking-widest text-neutral-600">
            Checking Permissions...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}

export function StudentGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={["student"]}>{children}</RouteGuard>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={["admin"]}>{children}</RouteGuard>;
}

export function ProfileIncompleteBanner() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || user.role !== "student" || user.hasProfile) {
    return null;
  }

  return (
    <div className="border-b-2 border-black bg-neo-yellow px-4 py-3 shadow-neo-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-5 w-5 stroke-[2.5] text-black shrink-0" />
          <span className="text-xs sm:text-sm font-black text-black">
            Action Required: Your student profile is incomplete. Complete it now to enable automatic eligibility checking.
          </span>
        </div>
        <Link
          href="/profile"
          className="shrink-0 inline-flex items-center gap-1 rounded-lg border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:bg-neutral-100"
        >
          Complete Profile
          <ArrowRight className="h-3 w-3 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}
