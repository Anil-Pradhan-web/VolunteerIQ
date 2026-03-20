import { FileSpreadsheet, FileText, UploadCloud } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="bg-slate-900 text-white">
        <CardHeader>
          <Badge variant="accent" className="w-fit">
            Survey intake
          </Badge>
          <CardTitle className="text-white">Upload zone prepared for Day 4</CardTitle>
          <CardDescription className="text-slate-300">
            The page is already routed and visually structured so file handling can be added
            without layout churn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-80 flex-col items-center justify-center rounded-[32px] border border-dashed border-white/25 bg-white/5 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <UploadCloud className="h-9 w-9 text-amber-300" />
            </div>
            <p className="mt-6 font-display text-2xl font-semibold">
              Drop CSV or PDF surveys here
            </p>
            <p className="mt-3 max-w-md text-sm text-slate-300">
              Firebase storage upload, extraction, and Gemini analysis can connect directly to this
              staged surface.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Choose file
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported inputs</CardTitle>
          <CardDescription>
            Aligned with the execution plan and backend extraction roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[24px] bg-amber-50 p-4">
            <FileSpreadsheet className="h-5 w-5 text-amber-700" />
            <p className="mt-3 font-display text-xl font-semibold">CSV surveys</p>
            <p className="mt-2 text-sm text-slate-600">
              Structured household and issue-response data.
            </p>
          </div>
          <div className="rounded-[24px] bg-emerald-50 p-4">
            <FileText className="h-5 w-5 text-emerald-700" />
            <p className="mt-3 font-display text-xl font-semibold">PDF reports</p>
            <p className="mt-2 text-sm text-slate-600">
              Field summaries, needs assessments, and compiled forms.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
