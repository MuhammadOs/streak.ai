import { Link, Navigate } from "react-router-dom";
import {
  Zap,
  Flame,
  BarChart3,
  Brain,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import HabitChecklistMockup from "../components/HabitChecklistMockup.jsx";

const features = [
  {
    icon: CheckCircle2,
    title: "Smart daily tracking",
    desc: "One-tap check-offs, progress rings, streaks, and a 90-day consistency heatmap.",
  },
  {
    icon: Brain,
    title: "AI weekly insights",
    desc: "Personalised reports on what worked, what didn't, and what to try next.",
  },
  {
    icon: Flame,
    title: "Streak recovery coach",
    desc: "When streaks break, AI builds a warm, actionable 3-day comeback plan.",
  },
  {
    icon: BarChart3,
    title: "Deep statistics",
    desc: "Patterns across days, weeks, and categories — with an AI analyst built in.",
  },
];

const stats = [
  { value: "90-day", label: "Habit heatmap" },
  { value: "AI-first", label: "Weekly insights" },
  { value: "Real-time", label: "Streak tracking" },
];

export default function Landing() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen">
      {/* ── Nav ── */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Zap size={17} />
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            StreakAI
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="btn-ghost p-2.5"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="btn-ghost">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary">
            Get started free
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-12 md:pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 chip mb-6 bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
              <Zap size={11} />
              AI-powered habit intelligence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.06] heading-brand">
              Build habits that
              <br />
              <span className="bg-linear-to-r from-brand-400 via-brand-500 to-accent-400 bg-clip-text text-transparent">
                actually stick.
              </span>
            </h1>
            <p className="mt-5 text-soft text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              Track every habit, grow your streaks, and let AI turn your data
              into real, personalised encouragement — not generic motivation
              quotes.
            </p>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <Link to="/register" className="btn-primary px-6 py-3 text-base">
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                Sign in
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-brand-400" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp size={13} className="text-brand-400" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-brand-400" />
                Setup in 30s
              </span>
            </div>
          </div>

          {/* Right: product mockup */}
          <div className="flex justify-center lg:justify-end">
            <HabitChecklistMockup />
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
          {stats.map((s) => (
            <div
              key={s.label}
              className="card-subtle rounded-xl p-4 text-center"
            >
              <div className="text-lg font-bold text-brand-600 dark:text-brand-300 tracking-tight">
                {s.value}
              </div>
              <div className="text-xs text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t divider">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold heading-brand">
            Everything you need to stay consistent
          </h2>
          <p className="mt-3 text-soft text-base">
            Clean tracking, deep stats, and AI that understands your actual data
            — not generic advice.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="card p-5 group hover:card-elevated transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300 flex items-center justify-center mb-4 group-hover:bg-brand-500/15 transition-colors">
                <f.icon size={18} />
              </div>
              <div className="font-semibold text-sm">{f.title}</div>
              <div className="text-sm text-soft mt-1.5 leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div
          className="relative p-10 md:p-14 text-center rounded-2xl overflow-hidden text-white"
          style={{
            background:
              "linear-gradient(135deg, #4f46e5 0%, #312e81 60%, #1e1b4b 100%)",
            boxShadow: "0 20px 60px rgba(79,70,229,0.40)",
          }}
        >
          {/* Decorative overlays */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 15% 10%, rgba(255,255,255,0.15), transparent 50%)," +
                "radial-gradient(circle at 85% 85%, rgba(34,211,238,0.25), transparent 50%)",
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 border border-white/20">
              <Zap size={12} />
              Start in 30 seconds
            </div>
            <h2 className="text-3xl md:text-4xl font-bold heading-brand">
              Your first streak is one click away.
            </h2>
            <p className="mt-3 text-brand-200 max-w-md mx-auto text-base">
              Create your account, add a habit, check it off. That's the whole
              onboarding.
            </p>
            <Link
              to="/register"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white text-brand-700 px-6 py-3 text-sm font-semibold hover:bg-brand-50 transition shadow-xl"
            >
              Create free account
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-faint border-t divider">
        Built with MERN · StreakAI © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
