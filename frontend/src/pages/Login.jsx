import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Zap,
  Sun,
  Moon,
  Eye,
  EyeOff,
  CheckCircle2,
  Brain,
  Flame,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const FEATURES = [
  { icon: CheckCircle2, text: "One-click daily habit check-offs" },
  { icon: Brain, text: "AI-powered weekly insights" },
  { icon: Flame, text: "Streak recovery coaching" },
  { icon: BarChart3, text: "Beautiful stats & heatmaps" },
];

export default function Login() {
  const { user, login } = useAuth();
  const { theme, toggle } = useTheme();
  const loc = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(loc.state?.from || "/dashboard", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Aurora overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.28), transparent 60%)," +
              "radial-gradient(ellipse 60% 50% at 80% 80%, rgba(34,211,238,0.18), transparent 60%)",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Zap size={19} />
          </div>
          <span
            className="font-bold text-xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            StreakAI
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold heading-brand leading-tight">
              Build habits that stick,
              <br />
              <span className="bg-linear-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                with AI that knows you.
              </span>
            </h2>
            <p className="mt-4 text-soft text-lg leading-relaxed max-w-sm">
              Track your progress, grow your streaks, and let AI turn your data
              into real encouragement.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sm text-soft"
              >
                <span className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <div className="glass rounded-2xl p-5 max-w-sm">
            <p className="text-sm leading-relaxed italic text-soft">
              "Your first streak is 3 clicks away."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-brand-500 to-brand-700 text-white text-xs font-bold flex items-center justify-center">
                <Zap size={12} />
              </div>
              <span className="text-xs text-muted">StreakAI</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="absolute top-4 right-4 p-2.5 rounded-xl glass"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            to="/"
            className="flex lg:hidden items-center justify-center gap-2.5 mb-8"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Zap size={17} />
            </div>
            <span
              className="font-bold text-lg"
              style={{ letterSpacing: "-0.03em" }}
            >
              StreakAI
            </span>
          </Link>

          <div className="card-elevated rounded-2xl p-8">
            <h1 className="text-2xl font-bold heading-brand">Welcome back</h1>
            <p className="text-sm text-muted mt-1">
              Sign in to continue your streaks.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    className="input pr-11"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-soft transition"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {err && (
                <div className="text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                  {err}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="text-center mt-5 text-sm text-soft">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-brand-600 dark:text-brand-300 font-medium hover:underline"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
