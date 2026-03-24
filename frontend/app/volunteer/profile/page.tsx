"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Mail,
  Award,
  Save,
  Briefcase,
  Clock,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [location, setLocation] = useState(profile?.location || "");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    profile?.skills || []
  );
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    profile?.availability || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setLocation(profile.location || "");
      setSelectedSkills(profile.skills || []);
      setSelectedAvailability(profile.availability || []);
    }
  }, [profile]);

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
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Keep your information accurate so task matching stays reliable."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-8 pb-6">
            <img
              src={
                user?.photoURL ||
                `https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.name}&backgroundColor=e2e8f0`
              }
              alt={profile?.name || "User"}
              className="h-24 w-24 rounded-full bg-slate-200 object-cover ring-4 ring-slate-100"
              referrerPolicy="no-referrer"
            />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {profile?.name || "Loading..."}
            </h2>
            <p className="text-sm text-slate-500">
              Volunteer
            </p>

            <div className="mt-6 w-full space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{location || "Not set"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Award className="h-4 w-4 text-slate-400" />
                <span>{selectedSkills.length} skills</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5 text-indigo-500" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setSaved(false);
                }}
                placeholder="e.g., Bhubaneswar, Odisha"
                className="max-w-md"
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-5 w-5 text-emerald-500" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-amber-500" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ALL_AVAILABILITY.map((slot) => {
                  const isSelected = selectedAvailability.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleAvailability(slot)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-indigo-600 px-8 text-white hover:bg-indigo-700"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
            {saved && (
              <span className="text-sm font-medium text-emerald-600">
                ✓ Profile saved successfully!
              </span>
            )}
            {error && <span className="text-sm font-medium text-rose-600">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
