import type { PropsWithChildren } from 'react';
import { Icon, type IconName } from '@/components/common/Icons';
import { cn } from '@/lib/cn';

interface AlertProps {
  tone?: 'error' | 'info' | 'success' | 'warning';
  className?: string;
}

const toneClasses: Record<NonNullable<AlertProps['tone']>, string> = {
  error: 'border-rose-200 bg-[linear-gradient(180deg,rgba(255,241,242,0.98),rgba(255,228,230,0.92))] text-rose-700',
  info: 'border-sky-200 bg-[linear-gradient(180deg,rgba(240,249,255,0.98),rgba(224,242,254,0.92))] text-sky-700',
  success: 'border-emerald-200 bg-[linear-gradient(180deg,rgba(236,253,245,0.98),rgba(209,250,229,0.9))] text-emerald-700',
  warning: 'border-amber-200 bg-[linear-gradient(180deg,rgba(255,251,235,0.98),rgba(254,243,199,0.9))] text-amber-700',
};

const toneIcons: Record<NonNullable<AlertProps['tone']>, IconName> = {
  error: 'warning',
  info: 'panel',
  success: 'success',
  warning: 'warning',
};

export function Alert({ children, tone = 'info', className }: PropsWithChildren<AlertProps>) {
  return (
    <div className={cn('flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm', toneClasses[tone], className)}>
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/70">
        <Icon name={toneIcons[tone]} className="h-4 w-4" />
      </div>
      <div className="flex-1 leading-6">{children}</div>
    </div>
  );
}
