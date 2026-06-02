import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Brain,
  BarChart3,
  Zap,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/weekly", label: "Weekly", icon: CalendarDays },
  { to: "/insights", label: "Insights", icon: Brain },
  { to: "/stats", label: "Stats", icon: BarChart3 },
];

export default function MobileNav() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    location.pathname.startsWith(item.to),
  );

  return (
    <>
      {/* Top bar */}
      <div className="md:hidden sticky top-0 z-20 glass border-b divider px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-md shadow-brand-500/30">
            <Zap size={15} />
          </div>
          <div className="font-bold" style={{ letterSpacing: "-0.03em" }}>
            StreakAI
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-soft hover:bg-(--surface-hover) transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-500 to-brand-700 text-white text-sm font-semibold flex items-center justify-center">
            {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-soft hover:bg-(--surface-hover) transition"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 glass border-t divider flex justify-around py-1.5 px-1"
        aria-label="Main navigation"
      >
        {/* Sliding pill indicator */}
        {activeIndex >= 0 && (
          <span
            className="absolute top-1.5 h-[calc(100%-12px)] rounded-xl bg-brand-500/10 transition-all duration-300 pointer-events-none"
            style={{
              width: `${100 / NAV_ITEMS.length}%`,
              left: `${(activeIndex / NAV_ITEMS.length) * 100}%`,
            }}
          />
        )}

        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl text-xs font-medium transition active:scale-95 ${
                isActive ? "text-brand-700 dark:text-brand-300" : "text-faint"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
