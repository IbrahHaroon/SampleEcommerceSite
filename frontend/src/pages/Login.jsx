import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Redirect if already signed in
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Check your email to confirm your account, then sign in.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 text-gray-200">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">
            {mode === "login" ? "Sign In" : "Create Account"}
          </p>
          <h1 className="mt-4 text-3xl font-light text-gray-100">
            {mode === "login" ? "Welcome back." : "Join Ibrahim's Samples."}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-2 w-full rounded-full border border-gray-400/30 bg-transparent px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus:border-gray-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-full border border-gray-400/30 bg-transparent px-4 py-3 text-sm text-gray-200 placeholder:text-gray-500 focus:border-gray-300 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-gray-200 py-3 text-sm uppercase tracking-[0.3em] text-gray-900 transition hover:bg-gray-100 disabled:opacity-40"
          >
            {loading && <Loader className="animate-spin" size={14} />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={toggleMode}
            className="text-xs uppercase tracking-[0.4em] text-gray-400 hover:text-gray-200 transition"
          >
            {mode === "login" ? "No account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
