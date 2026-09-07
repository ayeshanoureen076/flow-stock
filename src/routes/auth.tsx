import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in to POSFlow AI — POS & Inventory Platform" },
      {
        name: "description",
        content:
          "Access your POSFlow AI workspace to manage inventory, run the POS terminal and review AI demand forecasts.",
      },
      { property: "og:title", content: "Sign in to POSFlow AI" },
      {
        property: "og:description",
        content: "Secure access to your POS, inventory and AI forecasting dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "register" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your inbox to confirm your email.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset link sent.");
        setMode("login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  const titles: Record<Mode, string> = {
    login: "Welcome back",
    register: "Create your workspace",
    forgot: "Reset your password",
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between gradient-brown p-12 lg:flex">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary-foreground/85"
        >
          <ArrowLeft className="size-4" /> Back to site
        </Link>
        <div>
          <h2 className="max-w-md font-display text-4xl font-bold text-secondary-foreground">
            Run your store on autopilot.
          </h2>
          <p className="mt-4 max-w-md text-secondary-foreground/80">
            Real-time stock intelligence, AI demand forecasting and a lightning-fast POS terminal —
            all in one workspace.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary-foreground/80">
          <ShieldCheck className="size-4" /> Enterprise-grade security and role-based access
        </div>
      </div>

      <div className="flex items-center justify-center bg-muted p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card"
        >
          <span className="flex size-11 items-center justify-center rounded-xl gradient-primary font-display font-bold text-primary-foreground">
            PF
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-secondary">{titles[mode]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "We'll email you a secure reset link."
              : "Use your email or continue with Google."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "register" ? (
              <Field
                label="Full name"
                value={name}
                onChange={setName}
                type="text"
                placeholder="Ayesha Khan"
              />
            ) : null}
            <Field
              label="Work email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@store.com"
            />
            {mode !== "forgot" ? (
              <Field
                label="Password"
                value={password}
                onChange={setPassword}
                type="password"
                placeholder="••••••••"
              />
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 disabled:opacity-70"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send link"}
            </button>
          </form>

          {mode !== "forgot" ? (
            <>
              <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <button
                onClick={googleSignIn}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-accent"
              >
                Continue with Google
              </button>
            </>
          ) : null}

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                <button onClick={() => setMode("forgot")} className="font-medium text-secondary">
                  Forgot password?
                </button>
                <p>
                  New here?{" "}
                  <button onClick={() => setMode("register")} className="font-semibold text-secondary">
                    Create an account
                  </button>
                </p>
              </>
            ) : (
              <button onClick={() => setMode("login")} className="font-semibold text-secondary">
                Back to sign in
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );
}
