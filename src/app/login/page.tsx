"use client";

import React, { useState } from "react";
import { loginAction } from "../actions";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAction(passcode);
    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(res.error || "Login Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 ">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-400">
            Enter the admin passcode to access forms and submission data.
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" /> Admin Passcode
            </label>
            <input
              type="password"
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none transition"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (default: thisistheend-1)"
              required
            />
          </div>
          {error && (
            <p className="text-xs font-medium text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-3">
              {error}
            </p>
          )}
          <button
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 "
            type="submit"
          >
            {loading ? "Authenticating ... " : "Unlock Studio"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-mono">
          Default Passcode:{" "}
          <code className="text-slate-300">thisistheend-1</code>
        </p>
      </div>
    </div>
  );
}
