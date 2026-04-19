import type { PropsWithChildren, ReactNode } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';
import { cn } from '@/lib/cn';

interface NodeShellProps {
  id: string;
  typeLabel: string;
  title: string;
  subtitle: string;
  selected?: boolean;
  tone: 'emerald' | 'sky' | 'amber' | 'violet' | 'rose';
  icon: ReactNode;
  metaBadge?: string;
  showTarget?: boolean;
  showSource?: boolean;
}

const toneClasses: Record<NodeShellProps['tone'], string> = {
  emerald: 'border-emerald-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(236,253,245,0.95))]',
  sky: 'border-sky-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,249,255,0.95))]',
  amber: 'border-amber-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,251,235,0.95))]',
  violet: 'border-violet-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,243,255,0.95))]',
  rose: 'border-rose-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,241,242,0.95))]',
};

const ringClasses: Record<NodeShellProps['tone'], string> = {
  emerald: 'ring-emerald-300',
  sky: 'ring-sky-300',
  amber: 'ring-amber-300',
  violet: 'ring-violet-300',
  rose: 'ring-rose-300',
};

const accentClasses: Record<NodeShellProps['tone'], string> = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
};

const handleClasses: Record<NodeShellProps['tone'], string> = {
  emerald: '!bg-emerald-500',
  sky: '!bg-sky-500',
  amber: '!bg-amber-500',
  violet: '!bg-violet-500',
  rose: '!bg-rose-500',
};

export function NodeShell({
  children,
  id,
  typeLabel,
  title,
  subtitle,
  selected,
  tone,
  icon,
  metaBadge,
  showTarget = true,
  showSource = true,
}: PropsWithChildren<NodeShellProps>) {
  const issueCount = useWorkflowStore((state) => state.validation.nodeIssueCount[id] ?? 0);

  return (
    <div
      className={cn(
        'min-w-[252px] overflow-hidden rounded-[28px] border px-4 py-4 shadow-[0_16px_38px_rgba(15,23,42,0.12)] transition',
        toneClasses[tone],
        selected && `ring-2 ${ringClasses[tone]}`,
        issueCount > 0 && 'border-rose-300 ring-2 ring-rose-200',
      )}
    >
      {showTarget ? (
        <Handle
          type="target"
          position={Position.Left}
          className={cn('!h-3.5 !w-3.5 !border-2 !border-white', handleClasses[tone])}
        />
      ) : null}
      {showSource ? (
        <Handle
          type="source"
          position={Position.Right}
          className={cn('!h-3.5 !w-3.5 !border-2 !border-white', handleClasses[tone])}
        />
      ) : null}

      <div className={cn('mb-4 h-1.5 rounded-full', accentClasses[tone])} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm', accentClasses[tone])}>
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{typeLabel}</p>
              {metaBadge ? (
                <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  {metaBadge}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[15px] font-semibold leading-5 text-slate-900">{title}</p>
          </div>
        </div>
        {issueCount > 0 ? (
          <span className="rounded-full border border-rose-200 bg-rose-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">
            {issueCount} issue{issueCount > 1 ? 's' : ''}
          </span>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-white/70 bg-white/65 px-3 py-3 backdrop-blur-sm">
        <p className="text-xs leading-5 text-slate-600">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
