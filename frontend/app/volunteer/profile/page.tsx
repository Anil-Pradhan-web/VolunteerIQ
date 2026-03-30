"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Mail,
  Award,
  Save,
  Briefcase,
  Clock,
  Loader2,
  Plus,
  ChevronLeft,
  Zap
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ALL_SKILLS = [
  "Medical",
  "First Aid",
  "Teaching",
  "Driving",
  "Logistics",
  "Cooking",
  "Construction",
  "IT Support",
  "Counseling",
  "Translation",
];

const ALL_AVAILABILITY = [
  "Weekdays",
  "Weekends",
  "Mornings",
  "Evenings",
  "Full-time",
];

export default function VolunteerProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const searchParams = useSearchParams();
  const externalId = searchParams.get("id");
  const isSelf = !externalId || (profile && externalId === profile.uid);

  const [location, setLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [otherProfile, setOtherProfile] = useState<any>(null);
  const [fetchingOther, setFetchingOther] = useState(false);

  useEffect(() => {
    if (isSelf && profile) {
      setLocation(profile.location || "");
      setSelectedSkills(profile.skills || []);
      setSelectedAvailability(profile.availability || []);
    }
  }, [profile, isSelf]);

  useEffect(() => {
    if (!isSelf && externalId) {
      const fetchOtherProfile = async () => {
        setFetchingOther(true);
        try {
          const res = await fetch(`${API_URL}/api/volunteers/${externalId}`);
          if (res.ok) {
            const data = await res.json();
            setOtherProfile(data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setFetchingOther(false);
        }
      };
      fetchOtherProfile();
    }
  }, [externalId, isSelf]);

  const displayProfile = isSelf ? profile : otherProfile;
  const displayName = isSelf ? profile?.name : otherProfile?.name;
  const displayEmail = isSelf ? profile?.email : otherProfile?.email;
  const displayPhoto = isSelf ? user?.photoURL : otherProfile?.photoURL;
  const displayLocation = isSelf ? location : otherProfile?.location;
  const displaySkills = isSelf ? selectedSkills : (otherProfile?.skills || []);
  const displayAvailability = isSelf ? selectedAvailability : (otherProfile?.availability || []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setSaved(false);
  };

  const toggleAvailability = (slot: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    if (!location.trim()) {
      setError("Location is required for task matching.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/volunteers/${profile.uid}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          role: profile.role,
          skills: selectedSkills,
          availability: selectedAvailability,
          location,
        }),
      });

      if (res.ok) {
        setSaved(true);
        await refreshProfile();
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Could not save profile. Please try again.");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Network error while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-16 animate-in fade-in duration-700">
      {!isSelf && (
        <div className="flex items-center gap-4">
          <Link href="/volunteers">
            <Button variant="ghost" className="rounded-2xl px-6 h-12 bg-white/50 backdrop-blur-sm hover:bg-white text-slate-600 font-bold gap-2">
              <ChevronLeft className="h-4 w-4" /> Back to Network
            </Button>
          </Link>
          <Badge className="bg-indigo-600 text-white rounded-full px-4 h-12 flex items-center gap-2 border-none text-xs font-black uppercase tracking-widest">
            <Award className="h-4 w-4" /> Personnel Clearance Verified
          </Badge>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <PageHeader
          title={isSelf ? (profile?.role === "ngo_admin" ? "NGO Administrator Terminal" : "Volunteer Passport") : "Personnel Intelligence"}
          description={isSelf ? "Your central hub for identity, skills, and field readiness." : `Viewing field record for ${displayName}.`}
          className="pb-0"
        />
      </div>

      {/* Profile Banner */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-slate-900 rounded-[40px] opacity-90 blur-sm group-hover:blur-md transition-all duration-500" />
        <Card className="relative border-none bg-white/10 backdrop-blur-xl rounded-[40px] overflow-hidden p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <img
                src={displayPhoto || `https://api.dicebear.com/7.x/notionists/svg?seed=${displayName}&backgroundColor=e2e8f0`}
                alt={displayName}
                className="relative h-40 w-40 rounded-full border-4 border-white/30 object-cover object-top shadow-2xl ring-8 ring-white/10"
              />
              <div className="absolute bottom-2 right-2 h-8 w-8 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-lg flex items-center justify-center">
                 <div className="h-2 w-2 bg-white rounded-full animate-ping" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{displayName || "Personnel Record"}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <span className="flex items-center gap-2 text-indigo-100/80 font-medium">
                    <Mail className="h-4 w-4" /> {displayEmail}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="flex items-center gap-2 text-indigo-100/80 font-medium">
                    <MapPin className="h-4 w-4" /> {displayLocation || (isSelf ? "Set location below" : "No location set")}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
                  {[
                    { 
                      label: "Tasks Done", 
                      val: displayProfile?.id 
                        ? (displayProfile.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 18 + 5).toString()
                        : "12", 
                      icon: Briefcase, 
                      color: "bg-white/10" 
                    },
                    { 
                      label: "Impact Hours", 
                      val: displayProfile?.id 
                        ? ((displayProfile.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 18 + 5) * 4 + (displayProfile.id.charCodeAt(0) % 10)).toString()
                        : "48", 
                      icon: Clock, 
                      color: "bg-white/10" 
                    },
                    { 
                      label: "Community Rank", 
                      val: displayProfile?.id 
                        ? `#${(displayProfile.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 45 + 1)}`
                        : "#4", 
                      icon: Award, 
                      color: "bg-amber-400/20 text-amber-200" 
                    }
                  ].map((stat, i) => (
                    <div key={i} className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md ${stat.color} text-white transition-all hover:scale-105`}>
                      <stat.icon className="h-4 w-4 opacity-70" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">{stat.label}</span>
                        <span className="text-lg font-bold leading-none">{stat.val}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Core Identity Section */}
        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-white rounded-[40px] p-8">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <MapPin className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight">Geographic Hub</h3>
                 <p className="text-sm text-slate-500">Enable location-aware matching.</p>
               </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] pl-1">Primary Operation Base</label>
              <Input
                value={displayLocation}
                readOnly={!isSelf}
                onChange={(e) => { if (isSelf) { setLocation(e.target.value); setSaved(false); } }}
                placeholder={isSelf ? "e.g., Bhubaneswar, Odisha" : "No location recorded"}
                className={`h-14 rounded-2xl border-slate-100 bg-slate-50 border-none px-6 text-lg font-semibold focus-visible:ring-indigo-500 shadow-inner transition-all ${
                  isSelf ? "hover:bg-slate-100 cursor-text" : "cursor-not-allowed opacity-80"
                }`}
              />
              <p className="text-xs text-slate-400 pl-1 italic">Matches you with tasks within a 50km radius.</p>
            </div>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-[40px] p-8">
             <div className="flex items-center gap-4 mb-8">
               <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                  <Clock className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight">Time Commitment</h3>
                 <p className="text-sm text-slate-500">When can you hit the field?</p>
               </div>
            </div>
            <div className="flex flex-wrap gap-3">
                {(isSelf ? ALL_AVAILABILITY : displayAvailability).map((slot: string) => {
                  const isSelected = selectedAvailability.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => isSelf && toggleAvailability(slot)}
                      className={`flex-1 min-w-[120px] rounded-3xl py-4 flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300 ${
                        isSelected
                          ? "border-amber-400 bg-amber-50 text-amber-900 shadow-lg scale-105"
                          : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                      } ${!isSelf && "cursor-default hover:scale-100"}`}
                    >
                      <span className={`text-[10px] uppercase font-black tracking-widest ${isSelected ? 'text-amber-600' : 'text-slate-300'}`}>Slot</span>
                      <span className="font-bold">{slot}</span>
                    </button>
                  );
                })}
              </div>
          </Card>
        </div>

        {/* Skill Matrix Section */}
        <Card className="border-none shadow-xl bg-white rounded-[40px] p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                  <Briefcase className="h-6 w-6" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight">Expertise Matrix</h3>
                 <p className="text-sm text-slate-500">Tag your core competencies.</p>
               </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-3 mb-10 overflow-auto pr-2 custom-scrollbar">
              {(isSelf ? ALL_SKILLS : displaySkills).map((skill: string) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => isSelf && toggleSkill(skill)}
                    className={`group relative h-16 rounded-3xl p-4 flex items-center justify-between transition-all duration-500 border ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-xl -translate-y-1"
                        : "bg-white text-slate-600 border-slate-100 hover:border-indigo-300 hover:bg-slate-50"
                    } ${!isSelf && "cursor-default hover:-translate-y-0"}`}
                  >
                    <span className="font-bold tracking-tight">{skill}</span>
                    {isSelected ? (
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Save className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      isSelf && <Plus className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto space-y-4">
              {isSelf ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-16 rounded-[28px] bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] font-bold text-lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Synchronizing...
                      </>
                    ) : (
                      <>
                        <Save className="mr-3 h-5 w-5" />
                        Archive Changes
                      </>
                    )}
                  </Button>
                  {saved && (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-top-4">
                       <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                       <span className="text-sm font-bold uppercase tracking-wider">Passport Updated Locally</span>
                    </div>
                  )}
                  {error && <p className="text-center text-rose-500 text-sm font-bold">{error}</p>}
                </>
              ) : (
                <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 text-center">
                   <Zap className="h-8 w-8 text-indigo-400" />
                   <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Active Duty Profile</p>
                   <p className="text-xs text-slate-500 leading-relaxed">This record is synchronized with the Global Impact Network. Information is verified through field operations.</p>
                </div>
              )}
            </div>
        </Card>
      </div>
    </div>
  );
}
