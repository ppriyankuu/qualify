"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={cn(
          "relative w-full max-w-lg rounded-2xl border-3 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000000] animate-in zoom-in-95 duration-150",
          className
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white shadow-neo-sm hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <X className="h-4 w-4 stroke-[3]" />
        </button>

        {/* Header */}
        <div className="mb-4 pr-8">
          <h3 className="text-xl font-black font-display text-black">{title}</h3>
          {description && (
            <p className="mt-1 text-xs font-medium text-neutral-600">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
