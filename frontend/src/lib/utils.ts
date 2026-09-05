import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDaysRemaining(deadlineDateString: string): {
  days: number;
  isExpired: boolean;
  label: string;
} {
  const deadline = new Date(deadlineDateString);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: diffDays, isExpired: true, label: "Deadline passed" };
  }
  if (diffDays === 0) {
    return { days: 0, isExpired: false, label: "Expires today" };
  }
  if (diffDays === 1) {
    return { days: 1, isExpired: false, label: "1 day left" };
  }
  return { days: diffDays, isExpired: false, label: `${diffDays} days left` };
}
