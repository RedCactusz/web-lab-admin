"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastId = 0;
export let addToast: ((toast: Omit<Toast, "id">) => void) | null = null;

export function useToast() {
  return {
    success: (message: string, duration = 3000) => {
      addToast?.({ message, type: "success", duration });
    },
    error: (message: string, duration = 4000) => {
      addToast?.({ message, type: "error", duration });
    },
    info: (message: string, duration = 3000) => {
      addToast?.({ message, type: "info", duration });
    },
    warning: (message: string, duration = 3500) => {
      addToast?.({ message, type: "warning", duration });
    },
  };
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    addToast = (toast: Omit<Toast, "id">) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { ...toast, id }]);

      if (toast.duration !== 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toast.duration || 3000);
      }
    };

    return () => {
      addToast = null;
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastStyles = (type: ToastType) => {
    const styles = {
      success: "bg-emerald-500 border-emerald-600 text-white",
      error: "bg-red-500 border-red-600 text-white",
      info: "bg-blue-500 border-blue-600 text-white",
      warning: "bg-amber-500 border-amber-600 text-white",
    };
    return styles[type];
  };

  const getIcon = (type: ToastType) => {
    const icons = {
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠",
    };
    return icons[type];
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto max-w-sm px-4 py-3 rounded-lg border shadow-lg flex items-start gap-3 animate-slide-in ${getToastStyles(toast.type)}`}
        >
          <span className="text-lg font-bold">{getIcon(toast.type)}</span>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/70 hover:text-white text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
