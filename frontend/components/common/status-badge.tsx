"use client";

import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "completed") {
    return (
      <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700">
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
        Completed
      </Badge>
    );
  }

  if (status === "assigned") {
    return (
      <Badge className="border border-amber-200 bg-amber-50 text-amber-700">
        <Clock className="mr-1 h-3.5 w-3.5" />
        Assigned
      </Badge>
    );
  }

  return (
    <Badge className="border border-primary/30 bg-primary/10 text-primary">
      <AlertCircle className="mr-1 h-3.5 w-3.5" />
      Open
    </Badge>
  );
}
