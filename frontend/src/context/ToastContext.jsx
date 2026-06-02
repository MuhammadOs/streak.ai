import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: { Icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  error:   { Icon: XCircle,      color: "text-rose-500",    bg: "bg-rose-500/10 border-rose-500/20" },
  warning: { Icon: AlertCircle,  color: "text-amber-500",   bg: "bg-amber-500/10 border-amber-500/20" },
  info:    { Icon: Info,         color: "text-brand-500",   bg: "bg-brand-500/10 border-brand-500/20" },
};

function Toast({ id, type = "success", message, onRemove }) {
  const { Icon, color, bg } = ICONS[type] || ICONS.info;
  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm rounded-xl border px-4 py-3 shadow-xl backdrop-blur-xl animate-slide-up glass-strong ${bg}`}
      role="alert"
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${color}`} />
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="shrink-0 p-0.5 rounded-lg text-faint hover:text-soft transition"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="fixed bottom-24 md:bottom-6 right-4 z-200 flex flex-col gap-2 items-end pointer-events-none">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast {...t} onRemove={remove} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
