import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Brain,
  BarChart3,
  LogOut,
  Settings,
  Zap,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Modal from "./Modal.jsx";
import api from "../api/axios.js";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/weekly", label: "Weekly", icon: CalendarDays },
  { to: "/insights", label: "Insights", icon: Brain },
  { to: "/stats", label: "Statistics", icon: BarChart3 },
];

function useCollapsed() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true",
  );
  const toggle = () =>
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  return [collapsed, toggle];
}

export default function Sidebar() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggle } = useTheme();
  const [collapsed, toggleCollapsed] = useCollapsed();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [morning, setMorning] = useState(user?.morningMotivation || false);
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", {
        name,
        morningMotivation: morning,
      });
      updateUser(res.data.user);
      setSettingsOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const w = collapsed ? "w-[68px]" : "w-64";

  return (
    <>
      <aside
        className={`hidden md:flex md:flex-col fixed inset-y-0 left-0 z-30 glass border-r transition-all duration-300 ${w}`}
      >
        {/* Logo row */}
        <div
          className={`px-4 py-5 border-b divider flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 shrink-0">
                <Zap size={17} />
              </div>
              <div
                className="font-bold text-lg tracking-tight truncate"
                style={{ letterSpacing: "-0.03em" }}
              >
                StreakAI
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Zap size={17} />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-lg text-faint hover:text-soft hover:bg-(--surface-hover) transition shrink-0"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition relative group ${
                  isActive
                    ? "bg-linear-to-r from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/20"
                    : "text-soft hover:bg-(--surface-hover)"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-brand-500" />
                  )}
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg glass-strong text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div
          className={`p-2 border-t divider space-y-1 ${collapsed ? "items-center" : ""}`}
        >
          <button
            onClick={toggle}
            title={
              collapsed
                ? theme === "dark"
                  ? "Light mode"
                  : "Dark mode"
                : undefined
            }
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-soft hover:bg-(--surface-hover) transition ${collapsed ? "justify-center" : ""}`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && (theme === "dark" ? "Light mode" : "Dark mode")}
          </button>

          <button
            title={collapsed ? "Settings" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-soft hover:bg-(--surface-hover) transition ${collapsed ? "justify-center" : ""}`}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={18} />
            {!collapsed && "Settings"}
          </button>

          {/* Collapse toggle (when expanded it's in header; when collapsed show here) */}
          {collapsed && (
            <button
              onClick={toggleCollapsed}
              title="Expand sidebar"
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm text-soft hover:bg-(--surface-hover) transition"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}

          {/* User row */}
          <div
            className={`px-2 py-2 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
          >
            <div
              title={collapsed ? user?.name : undefined}
              className="w-9 h-9 rounded-full bg-linear-to-br from-brand-500 to-brand-700 text-white font-semibold flex items-center justify-center shadow-md shadow-brand-500/30 shrink-0"
            >
              {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user?.name}
                  </div>
                  <div className="text-xs text-faint truncate">
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 rounded-lg text-soft hover:bg-(--surface-hover) transition"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Offset for main content — reactive to collapsed state */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar-offset { margin-left: ${collapsed ? "68px" : "256px"}; transition: margin-left 0.3s; }
        }
      `}</style>

      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
      >
        <div className="space-y-5">
          {/* Profile section */}
          <div className="flex items-center gap-4 p-4 rounded-xl card-subtle">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-500 to-brand-700 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-brand-500/30 shrink-0">
              {user?.avatar || user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-faint truncate">{user?.email}</div>
            </div>
          </div>

          {/* Display name */}
          <div>
            <label className="label">Display name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* Morning motivation toggle */}
          <label className="flex items-start gap-3 p-4 rounded-xl card-subtle cursor-pointer hover:bg-(--surface-hover) transition">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={morning}
                onChange={(e) => setMorning(e.target.checked)}
                className="sr-only peer"
                id="morning-toggle"
              />
              <div className="w-10 h-6 rounded-full transition-colors duration-200 peer-checked:bg-brand-500 bg-(--chip-bg) border border-(--divider)" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
            </div>
            <div>
              <div className="text-sm font-medium">Morning motivation</div>
              <div className="text-xs text-faint mt-0.5">
                Show a short AI message every morning on the dashboard.
              </div>
            </div>
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              className="btn-secondary"
              onClick={() => setSettingsOpen(false)}
            >
              Cancel
            </button>
            <button className="btn-primary" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
