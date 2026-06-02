import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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

function PasswordStrength({ password }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (!password) return null;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-yellow-400",
    "bg-emerald-500",
  ];
  const textColors = [
    "text-rose-500",
    "text-amber-500",
    "text-yellow-500",
    "text-emerald-500",
  ];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score - 1] : "bg-(--chip-bg)"
            }`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${textColors[score - 1] || "text-faint"}`}
      >
        {labels[score - 1] || "Too short"}
      </p>
    </div>
  );
}

export default function Register() {
  const { user, register } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* ── Left brand panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
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
              Your first streak is
              <br />
              <span className="bg-linear-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
                3 clicks away.
              </span>
            </h2>
            <p className="mt-4 text-soft text-lg leading-relaxed max-w-sm">
              Create your account, add a habit, check it off. That's the whole
              onboarding.
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

        {/* Bottom note */}
        <div className="relative">
          <div className="glass rounded-2xl p-5 max-w-sm">
            <p className="text-sm leading-relaxed text-soft">
              Free forever. No credit card. Takes 30 seconds.
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
            <h1 className="text-2xl font-bold heading-brand">
              Create your account
            </h1>
            <p className="text-sm text-muted mt-1">
              Free forever. Takes 30 seconds.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    className="input pr-11"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="At least 6 characters"
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
                <PasswordStrength password={form.password} />
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
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="text-center mt-5 text-sm text-soft">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-600 dark:text-brand-300 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
