import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, id, children, options, ...props }, ref) => {
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
        <select
          id={id}
          ref={ref}
          className={cn(
            "w-full rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm font-semibold text-black cursor-pointer",
            "shadow-neo-sm transition-all focus:outline-none focus:shadow-neo",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-neo-red",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p className="text-xs font-bold text-neo-red font-display mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
