import { Check, Flame, Pencil, Trash2, Archive } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 100];

function StreakBadge({ streak }) {
  const milestone = STREAK_MILESTONES.slice().reverse().find((m) => streak === m);
  if (!milestone) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 px-2 py-0.5 text-xs font-semibold animate-pop">
      🎉 {milestone}d
    </span>
  );
}

export default function TodayHabitCard({
  habit,
  completed,
  onToggle,
  streak = 0,
  onEdit,
  onDelete,
  onArchive,
}) {
  const [menu, setMenu] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuWidth = 160;
  const menuHeight = 132;

  useLayoutEffect(() => {
    if (!menu || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const flipUp = rect.bottom + menuHeight + 8 > window.innerHeight;
    setPos({
      top: flipUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: rect.right - menuWidth,
    });
  }, [menu]);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menu]);

  return (
    <div
      className={`card p-4 flex items-center gap-4 transition-all duration-300 ${
        completed
          ? "ring-1 ring-brand-500/15 bg-brand-500/5 dark:bg-brand-500/3 opacity-80"
          : ""
      }`}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `${habit.color}26`, color: habit.color }}
      >
        {habit.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`font-medium truncate transition-all ${completed ? "line-through text-muted" : ""}`}>
            {habit.name}
          </div>
          <span className="chip">{habit.category}</span>
          <StreakBadge streak={streak} />
        </div>
        {habit.description && (
          <div className="text-sm text-muted truncate mt-0.5">{habit.description}</div>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-1 text-sm text-soft">
        <Flame
          size={16}
          className={streak > 0 ? "text-orange-500" : "text-faint"}
        />
        <span className="font-medium">{streak}</span>
      </div>

      {/* Context menu */}
      <div className="relative">
        <button
          ref={triggerRef}
          className="btn-ghost p-2"
          onClick={() => setMenu((m) => !m)}
          aria-label="Habit options"
          aria-expanded={menu}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="13" cy="8" r="1.5" />
          </svg>
        </button>

        {menu &&
          createPortal(
            <>
              <div className="fixed inset-0 z-100" onClick={() => setMenu(false)} />
              <div
                className="fixed z-110 glass-strong rounded-xl py-1 w-40 shadow-xl animate-fade-in"
                style={{ top: pos.top, left: pos.left }}
              >
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-soft hover:bg-(--surface-hover)"
                  onClick={() => { setMenu(false); onEdit(); }}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-soft hover:bg-(--surface-hover)"
                  onClick={() => { setMenu(false); onArchive(); }}
                >
                  <Archive size={14} />
                  {habit.isArchived ? "Unarchive" : "Archive"}
                </button>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-500/10"
                  onClick={() => { setMenu(false); onDelete(); }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>,
            document.body
          )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 ${
          completed
            ? "bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/40 animate-pop"
            : "bg-brand-100 dark:bg-brand-500/10 border-2 border-brand-300 dark:border-brand-500/30 text-brand-400 hover:border-brand-500 hover:bg-brand-200 dark:hover:bg-brand-500/20"
        }`}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
      >
        <Check size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
