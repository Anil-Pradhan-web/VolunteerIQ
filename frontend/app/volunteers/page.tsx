import { MapPin, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const volunteers = [
  ["Priya Sharma", "Medical, First Aid", "Weekends", "Bhubaneswar"],
  ["Rahul Das", "Driving, Logistics", "Full-time", "Cuttack"],
  ["Ananya Patel", "Teaching, IT Support", "Weekdays", "Bhubaneswar"],
  ["Sneha Roy", "Cooking, Medical", "Mornings", "Bhubaneswar"]
];

export default function VolunteersPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <Badge className="w-fit">Volunteer pool</Badge>
          <CardTitle>Search-ready volunteer list</CardTitle>
          <CardDescription>
            Day 1 table scaffold aligned with the Firestore schema in the plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map(([name, skills, availability, location]) => (
                <TableRow key={name}>
                  <TableCell className="font-semibold text-slate-900">{name}</TableCell>
                  <TableCell>{skills}</TableCell>
                  <TableCell>{availability}</TableCell>
                  <TableCell>{location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matching signals</CardTitle>
          <CardDescription>
            These UI cues prepare the page for Day 7 ranking results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-[24px] bg-emerald-50 p-4">
            <Sparkles className="h-5 w-5 text-emerald-700" />
            <p className="mt-3 font-display text-xl font-semibold">Skill density</p>
            <p className="mt-2 text-sm text-slate-600">
              Medical and logistics are strongest in the current demo volunteer pool.
            </p>
          </div>
          <div className="rounded-[24px] bg-orange-50 p-4">
            <MapPin className="h-5 w-5 text-orange-700" />
            <p className="mt-3 font-display text-xl font-semibold">Location coverage</p>
            <p className="mt-2 text-sm text-slate-600">
              Bhubaneswar is well covered, while Puri and Cuttack need faster assignment routing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
