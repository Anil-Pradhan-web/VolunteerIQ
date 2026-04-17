"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "@/lib/firebase";
import { buildApiUrl } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "volunteer" | "ngo_admin";
  photoURL?: string;
  skills?: string[];
  availability?: string[];
  location?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyAndFetchProfile = async (
    firebaseUser: User
  ): Promise<{ profile: UserProfile; firstLogin: boolean }> => {
    try {
      const token = await firebaseUser.getIdToken();

      const res = await fetch(buildApiUrl("/api/auth/verify"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const userProfile: UserProfile = {
          uid: data.user.id || data.user.uid || firebaseUser.uid,
          name: data.user.name || firebaseUser.displayName || "",
          email: data.user.email || firebaseUser.email || "",
          role: data.user.role || "volunteer",
          photoURL: firebaseUser.photoURL || undefined,
          skills: data.user.skills || [],
          availability: data.user.availability || [],
          location: data.user.location || "",
        };
        setProfile(userProfile);
        return { profile: userProfile, firstLogin: data.firstLogin === true };
      }
    } catch (err) {
      console.error("Failed to verify token:", err);
    }

    const fallback: UserProfile = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      role: "volunteer",
      photoURL: firebaseUser.photoURL || undefined,
    };
    setProfile(fallback);
    return { profile: fallback, firstLogin: false };
  };

  // Listen to Firebase auth state — handles BOTH fresh login AND returning sessions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const data = await verifyAndFetchProfile(firebaseUser);

        // First login → redirect directly to their profile to complete registration
        if (data.firstLogin) {
          setLoading(false);
          window.location.href = "/volunteer/profile";
          return;
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle the rest (profile fetch + redirect)
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setProfile(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await verifyAndFetchProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signInWithGoogle, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
