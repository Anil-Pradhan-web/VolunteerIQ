"use client";

import { useEffect, useState } from "react";
import { 
  MapPin, 
  Sparkles, 
  Search, 
  Loader2, 
  Users2, 
  Filter, 
  ChevronRight,
  Globe,
  Award,
  Zap
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    const matchesSearch = !searchQuery || 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesSkill = !skillFilter || v.skills?.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-[48px] bg-slate-950 p-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
            Global Impact Network
          </Badge>
          <h1 className="text-6xl font-black tracking-tight leading-[1.1]">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Force</span> for Good.
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg">
            Connect with verified field agents, specialists, and community leaders ready to transform intelligence into action. 
          </p>
          
          <div className="flex items-center gap-8 pt-6">
             <div className="flex flex-col">
                <span className="text-3xl font-black text-white">{volunteers.length}</span>
                <span className="text-xs uppercase font-bold text-slate-500 tracking-tighter">Verified Personnel</span>
             </div>
             <div className="h-10 w-px bg-white/10" />
             <div className="flex flex-col">
                <span className="text-3xl font-black text-white">{allSkills.length}</span>
                <span className="text-xs uppercase font-bold text-slate-500 tracking-tighter">Specialized Skills</span>
             </div>
          </div>
        </div>
      </div>

      {/* Intelligence Control Bar */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center justify-between sticky top-4 z-30 p-4 bg-white/80 backdrop-blur-2xl rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search by name, expertise, or mission loc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 h-14 rounded-2xl border-none bg-slate-100/50 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <Button
            variant={skillFilter === "" ? "default" : "ghost"}
            onClick={() => setSkillFilter("")}
            className={`rounded-2xl h-14 px-6 font-bold transition-all ${
              skillFilter === "" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            All Personnel
          </Button>
          {allSkills.map((skill) => (
            <Button
              key={skill}
              variant={skillFilter === skill ? "default" : "ghost"}
              onClick={() => setSkillFilter(skill)}
              className={`rounded-2xl h-14 px-6 font-bold whitespace-nowrap transition-all ${
                skillFilter === skill ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="rounded-[40px] bg-white p-8 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-5">
                   <div className="h-20 w-20 rounded-[24px] bg-slate-200/70" />
                   <div className="space-y-2 flex-1">
                      <div className="h-5 w-2/3 rounded bg-slate-200" />
                      <div className="h-3 w-1/3 rounded bg-slate-100" />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="h-3 w-1/4 rounded bg-slate-100" />
                   <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-xl bg-slate-100" />
                      <div className="h-6 w-20 rounded-xl bg-slate-100" />
                   </div>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-50">
                   <div className="h-12 w-full rounded-[24px] bg-slate-100/50" />
                </div>
             </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="Clear Radar"
          description="No personnel match current intelligence parameters. Try widening your search net."
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vol) => (
            <Card 
              key={vol.id} 
              className="group relative border-none bg-white rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Decorative Card Elements */}
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                 <Zap className="h-6 w-6 text-indigo-500" />
              </div>

              <div className="flex flex-col h-full gap-8">
                <div className="flex items-center gap-5">
                    <div className="relative">
                      <img
                        src={vol.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${vol.id}&backgroundColor=f1f5f9`}
                        alt={vol.name}
                        className="h-24 w-24 rounded-[32px] object-cover object-top bg-slate-100 shadow-lg group-hover:scale-105 transition-transform duration-500 border-2 border-white"
                      />
                      <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 border-[4px] border-white ring-1 ring-emerald-500/20 shadow-sm" />
                    </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-slate-900 truncate tracking-tight">{vol.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                         <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                         {vol.location || "On Assignment"}
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Core Expertise</span>
                     <div className="flex flex-wrap gap-2">
                        {vol.skills?.slice(0, 3).map((skill) => (
                          <Badge 
                            key={skill} 
                            className={`rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-tight transition-all ${
                              skillFilter === skill 
                                ? "bg-indigo-600 text-white" 
                                : "bg-slate-50 text-slate-500 border-none group-hover:bg-indigo-50 group-hover:text-indigo-600"
                            }`}
                          >
                             {skill}
                          </Badge>
                        ))}
                        {vol.skills?.length > 3 && (
                           <Badge className="bg-slate-50 text-slate-400 border-none rounded-xl px-2 py-1.5 text-[10px] font-black">+{vol.skills.length - 3}</Badge>
                        )}
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Availability</span>
                     <div className="flex flex-wrap gap-2">
                        {vol.availability?.map((slot) => (
                          <Badge key={slot} className="rounded-xl bg-emerald-50 text-emerald-600 border-none px-3 py-1.5 text-[10px] font-black uppercase tracking-tight group-hover:bg-emerald-100">
                             {slot}
                          </Badge>
                        ))}
                     </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50">
                    <Link href={`/volunteer/profile?id=${vol.id}`} className="block">
                      <Button variant="ghost" className="w-full rounded-[24px] h-14 bg-slate-50 hover:bg-slate-900 hover:text-white font-black transition-all gap-2 group/btn">
                         Personnel Details
                         <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
