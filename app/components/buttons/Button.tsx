/**
 * Button Component
 *
 * ⚠️ SHARED COMPONENT — Also exists in:
 * - lab_sgg-ui/app/components/buttons/Button.tsx
 * - lab_sgg-admin/app/components/buttons/Button.tsx
 *
 * Last Sync: TBD - Initial sync verification
 *
 * When modifying: Update BOTH projects & update this date
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  isLoading,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 text-white",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white",
  };

  return (
    <button
      className={`px-6 py-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Memproses...
        </span>
      ) : children}
    </button>
  );
}
