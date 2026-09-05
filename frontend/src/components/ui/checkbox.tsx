import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  label,
  description,
  disabled,
  className,
  id,
  ...props
}: CheckboxProps) {
  const inputId = id || React.useId();

  return (
    <div className={cn("flex items-start space-x-3 select-none", className)}>
      <button
        type="button"
        role="checkbox"
        id={inputId}
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onCheckedChange?.(!checked);
        }}
        className={cn(
          "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-black transition-all",
          "shadow-neo-sm hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
          checked ? "bg-neo-green text-black" : "bg-white",
          disabled && "opacity-50 cursor-not-allowed shadow-none"
        )}
        {...props}
      >
        {checked && <Check className="h-4 w-4 stroke-[3.5]" />}
      </button>
      {(label || description) && (
        <label
          htmlFor={inputId}
          className={cn(
            "cursor-pointer text-sm",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label && (
            <span
              className={cn(
                "font-bold text-black block",
                checked && "line-through text-neutral-500"
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-neutral-600 block mt-0.5">
              {description}
            </span>
          )}
        </label>
      )}
    </div>
  );
}
