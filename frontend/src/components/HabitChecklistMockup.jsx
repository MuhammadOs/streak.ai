import { useEffect, useState } from "react";
import { Check, Flame, Zap } from "lucide-react";

const HABITS = [
  { emoji: "💧", name: "Drink 2L water", streak: 12, delay: 0.3 },
  { emoji: "📚", name: "Read 20 minutes", streak: 7, delay: 0.9 },
  { emoji: "🧘", name: "10-min meditation", streak: 21, delay: 1.5 },
  { emoji: "🏃", name: "Morning run", streak: 5, delay: 2.1 },
];

export default function HabitChecklistMockup() {
  const [checked, setChecked] = useState([]);
  const [visible, setVisible] = useState([]);

  // Staggered row appearance on mount
  useEffect(() => {
    HABITS.forEach((_, i) => {
      setTimeout(() => {
        setVisible((v) => [...v, i]);
      }, HABITS[i].delay * 1000);
    });
  }, []);

  // Auto-check habits with a delay after they appear
  useEffect(() => {
    HABITS.forEach((_, i) => {
      setTimeout(
        () => {
          setChecked((c) => [...c, i]);
        },
        HABITS[i].delay * 1000 + 700,
      );
    });
  }, []);

  const progress = Math.round((checked.length / HABITS.length) * 100);

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Glow halo */}
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(99,102,241,0.18), transparent 70%)",
        }}
      />

      <div className="relative card-elevated rounded-2xl overflow-hidden">
        {/* Header */}
        <div
          className="px-5 pt-5 pb-4 border-b"
          style={{ borderColor: "var(--divider)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-md shadow-brand-500/30">
                <Zap size={13} />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                Today's habits
              </span>
            </div>
            <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
              {checked.length}/{HABITS.length} done
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--chip-bg)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #818cf8, #22d3ee)",
              }}
            />
          </div>
        </div>

        {/* Habit rows */}
        <div className="p-3 space-y-1.5">
          {HABITS.map((h, i) => {
            const isDone = checked.includes(i);
            const isVisible = visible.includes(i);

            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-500 ${
                  isDone
                    ? "bg-brand-500/6 dark:bg-brand-500/8"
                    : "hover:bg-(--surface-hover)"
                }`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 0.4s ease ${h.delay}s, transform 0.4s ease ${h.delay}s, background 0.3s`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ background: "var(--chip-bg)" }}
                >
                  {h.emoji}
                </div>

                {/* Name + streak */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium transition-all duration-300 ${
                      isDone ? "line-through text-muted" : ""
                    }`}
                  >
                    {h.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                    <Flame size={11} className="text-orange-400" />
                    <span>{h.streak} day streak</span>
                  </div>
                </div>

                {/* Checkbox */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isDone
                      ? "shadow-md shadow-brand-500/30"
                      : "border-2 border-(--surface-border)"
                  }`}
                  style={
                    isDone
                      ? {
                          background:
                            "linear-gradient(135deg, #818cf8, #4f46e5)",
                        }
                      : {}
                  }
                >
                  {isDone && (
                    <Check
                      size={14}
                      strokeWidth={3}
                      className="text-white"
                      style={{ animation: "check-pop 0.35s ease-out" }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer streak summary */}
        <div
          className="px-5 py-3 border-t flex items-center justify-between"
          style={{ borderColor: "var(--divider)" }}
        >
          {[
            { label: "Active streaks", value: "4" },
            { label: "This week", value: "86%" },
            { label: "Best streak", value: "21d" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-base font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
