import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "yellow" | "pink" | "mint" | "white" | "danger" | "dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "yellow",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      yellow:
        "bg-neo-yellow text-black hover:bg-[#ffd633] active:bg-[#e6b400]",
      pink: "bg-neo-pink text-black hover:bg-[#ffa6ed] active:bg-[#e675cf]",
      mint: "bg-neo-green text-black hover:bg-[#3bf467] active:bg-[#04c935]",
      white: "bg-white text-black hover:bg-neutral-100 active:bg-neutral-200",
      danger: "bg-neo-red text-white hover:bg-[#ff8585] active:bg-[#e65252]",
      dark: "bg-black text-white hover:bg-neutral-800 active:bg-neutral-900",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs font-bold",
      md: "px-5 py-2.5 text-sm font-black",
      lg: "px-7 py-3.5 text-base font-black tracking-wide",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl border-2 border-black font-display uppercase transition-all duration-100",
          "shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg",
          "active:translate-x-1 active:translate-y-1 active:shadow-none",
          "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
