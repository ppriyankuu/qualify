"use client";

import React from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-2xl border-3 border-black bg-white p-8 text-center shadow-neo-lg space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-neo-red text-white shadow-neo-sm">
          <AlertOctagon className="h-9 w-9 stroke-[2.5]" />
        </div>

        <h2 className="text-2xl font-black font-display text-black">
          Unexpected Error Occurred
        </h2>

        <p className="text-xs font-semibold text-neutral-600 leading-relaxed">
          {error.message || "An unexpected error interrupted the portal service."}
        </p>

        <div className="pt-2">
          <Button variant="yellow" size="md" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-4 w-4 stroke-[3]" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
