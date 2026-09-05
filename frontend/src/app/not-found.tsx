import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-2xl border-3 border-black bg-white p-8 text-center shadow-neo-lg space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-neo-yellow shadow-neo-sm">
          <HelpCircle className="h-9 w-9 stroke-[2.5]" />
        </div>

        <h2 className="text-3xl font-black font-display text-black">
          404 — Page Not Found
        </h2>

        <p className="text-xs font-semibold text-neutral-600 leading-relaxed">
          The scholarship or page you requested could not be located. It may have expired or been removed.
        </p>

        <div className="pt-2">
          <Link href="/scholarships">
            <Button variant="yellow" size="md">
              <ArrowLeft className="mr-2 h-4 w-4 stroke-[3]" />
              Return to Scholarships Directory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
