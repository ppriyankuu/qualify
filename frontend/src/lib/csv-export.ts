import { Scholarship } from "@/types/scholarship";
import { getDaysRemaining } from "./utils";

export function exportScholarshipsToCSV(scholarships: Scholarship[]) {
  const headers = [
    "Scholarship Name",
    "Provider / Institution",
    "Amount / Benefits",
    "Application Deadline",
    "Status / Days Left",
    "Field of Study",
    "Education Level",
    "Income Ceiling (INR)",
    "Gender Eligibility",
    "Social Category",
    "Rules Count",
    "Eligibility Rules Summary",
    "Required Documents",
    "Official Notice Reference",
  ];

  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const stringVal = String(value).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = scholarships.map((s) => {
    const daysInfo = getDaysRemaining(s.deadline);
    const rulesSummary = (s.rules || []).map((r) => r.ruleDescription).join(" | ");
    const docsSummary = (s.documents || []).map((d) => d.documentName).join(" | ");
    const fieldsSummary = Array.isArray(s.fieldOfStudy)
      ? s.fieldOfStudy.join(", ")
      : String(s.fieldOfStudy || "All Disciplines");
    const levelsSummary = Array.isArray(s.educationLevel)
      ? s.educationLevel.join(", ")
      : String(s.educationLevel || "All Levels");

    return [
      escapeCSV(s.name),
      escapeCSV(s.provider),
      escapeCSV(s.amountDescription),
      escapeCSV(s.deadline),
      escapeCSV(daysInfo.label),
      escapeCSV(fieldsSummary),
      escapeCSV(levelsSummary),
      escapeCSV(s.incomeLimit ? `₹${s.incomeLimit.toLocaleString("en-IN")}` : "No Limit"),
      escapeCSV(s.genderRestriction === "all" ? "Open to All" : s.genderRestriction),
      escapeCSV(s.categoryRestriction || "All"),
      escapeCSV((s.rules || []).length),
      escapeCSV(rulesSummary || "No specific restrictions"),
      escapeCSV(docsSummary || "None specified"),
      escapeCSV(s.officialNoticeUrl),
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");

  // Trigger browser download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];

  link.setAttribute("href", url);
  link.setAttribute("download", `scholarships_directory_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadBackendCSV(): Promise<void> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://backend.ppriyankuu.workers.dev/api";
  const res = await fetch(`${apiUrl}/scholarships/export/csv`, {
    headers: {
      Accept: "text/csv",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download CSV: HTTP ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];

  link.setAttribute("href", url);
  link.setAttribute("download", `scholarships_directory_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

