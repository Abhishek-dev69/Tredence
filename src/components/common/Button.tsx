import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-slate-900 bg-slate-900 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:border-slate-800 disabled:border-slate-200 disabled:bg-slate-200',
  secondary:
    'border-sky-200 bg-[linear-gradient(180deg,#eff6ff,#dbeafe)] text-sky-950 shadow-[0_14px_28px_rgba(59,130,246,0.18)] hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_18px_34px_rgba(59,130,246,0.22)] disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
  ghost:
    'border-white/10 bg-white/95 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white disabled:border-slate-200 disabled:text-slate-400',
  danger:
    'border-rose-200 bg-[linear-gradient(180deg,#fff1f2,#ffe4e6)] text-rose-700 shadow-sm hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-[48px] px-4 py-2.5 text-sm',
  lg: 'min-h-[56px] px-5 py-3 text-base',
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
