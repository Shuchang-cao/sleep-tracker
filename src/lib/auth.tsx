import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/db";
import * as schema from "../database/schema";
import { headers } from "next/headers";

export const auth = betterAuth({
  adapter: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },
  emailAndPassword: {
    enabled: true
  }
});

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await auth.api.getSession({
          headers: await headers()
        });
        setUser(session?.user || null);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers()
    });
    setUser(result.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers()
    });
    setUser(result.user);
  };

  const signOut = async () => {
    await auth.api.signOut({
      headers: await headers()
    });
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};