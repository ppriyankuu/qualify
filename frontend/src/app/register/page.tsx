"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowRight, Shield, GraduationCap, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, user } = useAuth();

  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await register({ email, password, role });
      if (newUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-5 sm:space-y-6">
        <Card variant="white" className="border-3 border-black shadow-neo-lg">
          <CardHeader className="bg-white rounded-t-2xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-black bg-neo-pink shadow-neo-sm mb-2">
              <UserPlus className="h-6 w-6 stroke-[2.5]" />
            </div>
            <CardTitle className="text-2xl font-black">
              Create an Account
            </CardTitle>
            <CardDescription>
              Join the portal to explore verified scholarships and track eligibility.
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

              {/* Role Selector Tabs */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-black font-display">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 border-black p-3 text-xs font-black uppercase tracking-wider transition-all ${
                      role === "student"
                        ? "bg-neo-yellow text-black shadow-neo -translate-y-0.5"
                        : "bg-white text-neutral-600 shadow-neo-sm hover:bg-neutral-50"
                    }`}
                  >
                    <GraduationCap className="h-4 w-4 stroke-[2.5]" />
                    Student
                    {role === "student" && (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 border-black p-3 text-xs font-black uppercase tracking-wider transition-all ${
                      role === "admin"
                        ? "bg-neo-pink text-black shadow-neo -translate-y-0.5"
                        : "bg-white text-neutral-600 shadow-neo-sm hover:bg-neutral-50"
                    }`}
                  >
                    <Shield className="h-4 w-4 stroke-[2.5]" />
                    Institution / Admin
                    {role === "admin" && (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    )}
                  </button>
                </div>
              </div>

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
                label="Password (min 8 characters)"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant={role === "admin" ? "pink" : "yellow"}
                size="lg"
                isLoading={isLoading}
                className="w-full text-sm font-black py-3 mt-2"
              >
                Create {role === "admin" ? "Admin" : "Student"} Account
                <ArrowRight className="ml-2 h-4 w-4 stroke-[3]" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-[#FAF7F2] rounded-b-2xl border-t-2 border-black">
            <p className="text-xs font-bold text-neutral-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-black text-black underline underline-offset-2 hover:text-neutral-800"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
