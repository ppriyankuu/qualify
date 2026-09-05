"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ArrowRight, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const { user, isAuthenticated, logout, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDirectoryActive = pathname.startsWith("/scholarships");
  const isProfileActive = pathname.startsWith("/profile");
  const isAdminActive = pathname.startsWith("/admin");

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-[#F4F0EA]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 shrink-0"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-neo-yellow shadow-neo-sm group-hover:shadow-neo transition-all">
            <GraduationCap className="h-5.5 w-5.5 stroke-[2.5] text-black" />
          </div>
          <div className="flex flex-col justify-center select-none">
            <span className="font-display font-black text-xl tracking-tight text-black leading-none">
              Qualify
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-600 leading-none mt-1">
              Deterministic Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/scholarships"
            className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all duration-150 border-2 ${
              isDirectoryActive
                ? "border-black bg-neo-yellow text-black shadow-neo-sm -translate-y-0.5"
                : "border-transparent text-neutral-800 hover:border-black hover:bg-neo-yellow hover:text-black hover:shadow-neo-sm hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            }`}
          >
            Directory
          </Link>
          {isAuthenticated && user && role === "student" && (
            <Link
              href="/profile"
              className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all duration-150 border-2 ${
                isProfileActive
                  ? "border-black bg-neo-yellow text-black shadow-neo-sm -translate-y-0.5"
                  : "border-transparent text-neutral-800 hover:border-black hover:bg-neo-yellow hover:text-black hover:shadow-neo-sm hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              }`}
            >
              My Profile
            </Link>
          )}
          {isAuthenticated && user && role === "admin" && (
            <Link
              href="/admin"
              className={`rounded-xl px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all duration-150 border-2 ${
                isAdminActive
                  ? "border-black bg-neo-pink text-black shadow-neo-sm -translate-y-0.5"
                  : "border-transparent text-neutral-800 hover:border-black hover:bg-neo-pink hover:text-black hover:shadow-neo-sm hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              }`}
            >
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Actions / Auth Badge + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isAuthenticated && user ? (
            /* Desktop Auth Info */
            <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-2.5 py-1.5 sm:px-3 shadow-neo-sm">
                <UserIcon className="h-3.5 w-3.5 stroke-[2.5] text-neutral-600 shrink-0" />
                <span className="text-xs font-bold text-black max-w-[140px] truncate">
                  {user.name || user.email.split("@")[0]}
                </span>
                <Badge
                  variant={user.role === "admin" ? "pink" : "yellow"}
                  size="sm"
                  className="text-[10px]"
                >
                  {user.role}
                </Badge>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white shadow-neo-sm transition-all hover:bg-neutral-100 hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <LogOut className="h-4 w-4 stroke-[2.5] text-black" />
              </button>
            </div>
          ) : (
            /* Unauthenticated Buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm transition-all hover:bg-neutral-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-neo-yellow px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm transition-all hover:bg-amber-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Sign Up
                <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-white shadow-neo-sm transition-all hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4 stroke-[3]" />
            ) : (
              <Menu className="h-4 w-4 stroke-[3]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 py-3 shadow-neo-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2">
            {/* Mobile User Profile Card (if authenticated) */}
            {isAuthenticated && user && (
              <div className="flex items-center justify-between rounded-xl border-2 border-black bg-neutral-50 p-3 mb-1">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-neo-yellow text-xs font-black">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-black truncate max-w-[120px]">
                        {user.name || user.email.split("@")[0]}
                      </span>
                      <Badge
                        variant={user.role === "admin" ? "pink" : "yellow"}
                        size="sm"
                        className="text-[9px] py-0 px-1"
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-medium truncate max-w-[150px]">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  title="Logout"
                  className="flex items-center gap-1 shrink-0 rounded-lg border-2 border-black bg-white px-2.5 py-1 text-xs font-bold text-black shadow-neo-sm hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            <Link
              href="/scholarships"
              onClick={closeMenu}
              className="flex items-center justify-between rounded-xl border-2 border-black bg-[#FAF7F2] p-3 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:bg-neo-yellow"
            >
              <span>Explore Scholarships</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {isAuthenticated && user && role === "student" && (
              <Link
                href="/profile"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border-2 border-black bg-[#FAF7F2] p-3 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:bg-neo-yellow"
              >
                <span>My Profile</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}

            {isAuthenticated && user && role === "admin" && (
              <Link
                href="/admin"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl border-2 border-black bg-[#FAF7F2] p-3 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:bg-neo-pink"
              >
                <span>Admin Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}

            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center rounded-xl border-2 border-black bg-white p-2.5 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:bg-neutral-50"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-1 rounded-xl border-2 border-black bg-neo-yellow p-2.5 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
