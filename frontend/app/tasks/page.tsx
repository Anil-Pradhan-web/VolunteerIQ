import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tasks = [
  {
    title: "Mobile health camp setup",
    status: "Open",
    location: "Bhubaneswar",
    skills: "Medical, Driving"
  },
  {
    title: "Food distribution drive",
    status: "Assigned",
    location: "Cuttack",
    skills: "Cooking, Logistics"
  },
  {
    title: "IT skills workshop",
    status: "Open",
    location: "Bhubaneswar",
    skills: "IT Support, Teaching"
  }
];

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge className="mb-3 w-fit">Task system</Badge>
          <h2 className="font-display text-3xl font-bold text-slate-900">
            Tasks ready for CRUD wiring
          </h2>
        </div>
        <Button>Create new task</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.title}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{task.title}</CardTitle>
                  <CardDescription className="mt-2">{task.skills}</CardDescription>
                </div>
                <Badge variant={task.status === "Assigned" ? "secondary" : "default"}>
                  {task.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CalendarClock className="h-4 w-4" />
                {task.location}
              </div>
              <Link href="/tasks/health-camp">
                <Button variant="outline" className="w-full">
                  Open detail
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
