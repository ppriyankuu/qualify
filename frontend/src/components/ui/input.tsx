import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-black uppercase tracking-wider text-black font-display"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          ref={ref}
          className={cn(
            "w-full rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm font-medium text-black placeholder:text-neutral-400",
            "shadow-neo-sm transition-all focus:outline-none focus:shadow-neo focus:bg-[#FFFDF9]",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-neo-red focus:border-neo-red",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs font-bold text-neo-red font-display mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
