import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TaskDetailPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <Badge className="w-fit">Task detail</Badge>
          <CardTitle>Mobile health camp setup</CardTitle>
          <CardDescription>
            Base detail page ready for Day 6 task CRUD and Day 7 AI volunteer matching.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-[24px] bg-amber-50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-700">
              Required skills
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Medical, Driving</p>
          </div>
          <div className="rounded-[24px] bg-white/80 p-5">
            <p className="text-sm text-slate-600">
              Assemble transport, triage station, and medicine desk for a mobile clinic serving
              flood-affected communities near Bhubaneswar.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment preview</CardTitle>
          <CardDescription>Dialog primitive is in place for quick action flows.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-[22px] border border-border/70 bg-white/80 p-4">
            <p className="font-semibold text-slate-900">Current status</p>
            <p className="mt-2 text-sm text-slate-600">
              Open and waiting for AI-ranked volunteers.
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Preview assignment modal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign volunteers</DialogTitle>
                <DialogDescription>
                  This modal will be reused for Day 7 and Day 8 task assignment actions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="rounded-[20px] bg-emerald-50 p-4 text-sm text-slate-700">
                  Priya Sharma: high medical relevance and weekend availability.
                </div>
                <div className="rounded-[20px] bg-orange-50 p-4 text-sm text-slate-700">
                  Rahul Das: ideal for transport support and field logistics.
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
