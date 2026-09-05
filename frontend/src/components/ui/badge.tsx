import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "pass"
    | "fail"
    | "unknown"
    | "yellow"
    | "pink"
    | "mint"
    | "dark"
    | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-white text-black",
    pass: "bg-neo-green text-black",
    fail: "bg-neo-red text-white",
    unknown: "bg-neo-yellow text-black",
    yellow: "bg-neo-yellow text-black",
    pink: "bg-neo-pink text-black",
    mint: "bg-neo-green text-black",
    dark: "bg-black text-white",
    outline: "bg-transparent text-black",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-display font-black uppercase tracking-wider rounded-lg border-2 border-black shadow-neo-sm transition-transform",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
