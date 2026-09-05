import React from "react";
import { ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OfficialNoticeCardProps {
  officialNoticeUrl: string;
  provider: string;
  scholarshipName: string;
}

export function OfficialNoticeCard({
  officialNoticeUrl,
  provider,
  scholarshipName,
}: OfficialNoticeCardProps) {
  return (
    <Card variant="yellow" className="border-3 border-black shadow-neo">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-neo-green shadow-neo-sm">
              <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-black font-display">
              Official Reference Source
            </span>
          </div>
          <Badge variant="dark" size="sm">
            Verified Provider
          </Badge>
        </div>

        <div className="space-y-1">
          <h4 className="font-display text-lg font-black text-black">
            Original Scholarship Notice
          </h4>
          <p className="text-xs font-medium text-neutral-800 leading-relaxed">
            The portal provides automated eligibility matching based on published criteria. For final authority, terms, and official application filing, always consult the original circular issued directly by <strong>{provider}</strong>.
          </p>
        </div>

        <div className="pt-2">
          <a
            href={officialNoticeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-neo-sm transition-all hover:bg-neutral-800 hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Open Official Notice / Circular
            <ExternalLink className="h-4 w-4 stroke-[2.5]" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
