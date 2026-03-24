"use client";

import { useEffect, useState } from "react";
import { MapPin, Sparkles, Search, Loader2, Users2 } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { FilterChips } from "@/components/common/filter-chips";
import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  skills: string[];
  availability: string[];
  location: string;
}

export default function VolunteersPage() {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        let headers: Record<string, string> = {};
        if (user) {
          const token = await user.getIdToken();
          headers["Authorization"] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/api/volunteers`, { headers });
        if (res.ok) {
          const data = await res.json();
          setVolunteers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch volunteers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, [user]);

  const allSkills = Array.from(
    new Set(volunteers.flatMap((v) => v.skills || []))
  ).sort();

  const filtered = volunteers.filter((v) => {
    if (
      searchQuery &&
      !v.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !v.location?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (skillFilter && !v.skills?.includes(skillFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteer Network"
        description="Find volunteers by skills, location, and availability for reliable deployment."
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {allSkills.length > 0 && (
          <FilterChips
            options={["all", ...allSkills]}
            selected={skillFilter || "all"}
            onSelect={(value) => setSkillFilter(value === "all" ? "" : value)}
          />
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm">
          <Users2 className="h-4 w-4 text-indigo-500" />
          <span className="font-semibold text-slate-800">{volunteers.length}</span>
          <span className="text-slate-500">total volunteers</span>
        </div>
        {skillFilter && (
          <div className="text-sm text-slate-500">
            {filtered.length} matching &ldquo;{skillFilter}&rdquo;
          </div>
        )}
      </div>

      {/* Volunteer Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No volunteers found"
          description={
            volunteers.length === 0
              ? "Volunteers will appear here once they register."
              : "Try adjusting your search or skill filters."
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((vol) => (
            <Card key={vol.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <img
                    src={vol.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${vol.name}&backgroundColor=e2e8f0`}
                    alt={vol.name}
                    className="h-12 w-12 rounded-xl bg-slate-100 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {vol.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {vol.location || "No location"}
                    </div>
                  </div>
                </div>

                {vol.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {vol.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          skillFilter === skill
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {vol.availability?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {vol.availability.map((slot) => (
                      <span
                        key={slot}
                        className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
