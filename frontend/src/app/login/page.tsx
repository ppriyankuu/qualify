"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight, Shield, GraduationCap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginAsDemo, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else if (!user.hasProfile) {
        router.push("/profile");
      } else {
        router.push("/scholarships");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await login({ email, password });
      if (loggedUser.role === "admin") {
        router.push("/admin");
      } else if (!loggedUser.hasProfile) {
        router.push("/profile");
      } else {
        router.push("/scholarships");
      }
    } catch (err: unknown) {
      setError(
        (err as Error).message ||
          "Failed to log in. Please check your credentials or use the Quick Demo buttons below."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: "student" | "admin") => {
    setError(null);
    setIsLoading(true);
    try {
      const loggedUser = await quickLoginAsDemo(role);
      if (loggedUser.role === "admin") {
        router.push("/admin");
      } else if (!loggedUser.hasProfile) {
        router.push("/profile");
      } else {
        router.push("/scholarships");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Demo login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-5 sm:space-y-6">
        {/* Quick Testing Callout */}
        <div className="rounded-2xl border-2 border-black bg-neo-yellow/30 p-4 shadow-neo-sm">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="yellow" size="sm">
              Instant 1-Click Testing
            </Badge>
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Demo Logins
            </span>
          </div>
          <p className="text-xs font-semibold text-neutral-800 mb-3">
            Click a button below to test the portal immediately without typing:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("student")}
              className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm transition-all hover:bg-neutral-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <GraduationCap className="h-4 w-4 stroke-[2.5]" />
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("admin")}
              className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-wider text-black shadow-neo-sm transition-all hover:bg-neutral-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Shield className="h-4 w-4 stroke-[2.5]" />
              Demo Admin
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <Card variant="white" className="border-3 border-black shadow-neo-lg">
          <CardHeader className="bg-white rounded-t-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-neo-yellow shadow-neo-sm mb-2">
              <LogIn className="h-6 w-6 stroke-[2.5]" />
            </div>
            <CardTitle className="text-2xl font-black">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your account to check eligibility and track your scholarships.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 rounded-xl border-2 border-neo-red bg-neo-red/15 p-3 text-xs font-bold text-black">
                  <AlertCircle className="h-4 w-4 text-neo-red shrink-0 stroke-[2.5] mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="yellow"
                size="lg"
                isLoading={isLoading}
                className="w-full text-sm font-black py-3 mt-2"
              >
                Sign In to Portal
                <ArrowRight className="ml-2 h-4 w-4 stroke-[3]" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-[#FAF7F2] rounded-b-2xl border-t-2 border-black">
            <p className="text-xs font-bold text-neutral-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-black text-black underline underline-offset-2 hover:text-neutral-800"
              >
                Create one now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
