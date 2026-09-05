import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "white" | "yellow" | "pink" | "mint" | "cream";
}

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white",
    white: "bg-white",
    yellow: "bg-[#FFF9E6]",
    pink: "bg-[#FFF0FA]",
    mint: "bg-[#E6FCF0]",
    cream: "bg-[#FAF7F2]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-black shadow-neo transition-all",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-6 pb-3 border-b-2 border-black/10", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-xl font-black tracking-tight text-black font-display",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-neutral-600 font-medium mt-1", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-6 pt-3 border-t-2 border-black/10 flex items-center justify-between",
        className
      )}
      {...props}
    />
  );
}
