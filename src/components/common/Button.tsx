import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-slate-900 bg-slate-900 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:border-slate-800 disabled:border-slate-200 disabled:bg-slate-200',
  secondary:
    'border-sky-200 bg-[linear-gradient(180deg,#eff6ff,#dbeafe)] text-sky-900 shadow-sm hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-100 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
  ghost:
    'border-slate-200 bg-white/90 text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400',
  danger:
    'border-rose-200 bg-[linear-gradient(180deg,#fff1f2,#ffe4e6)] text-rose-700 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
};

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
