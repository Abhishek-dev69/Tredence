import { useMemo } from 'react';
import { Icon } from '@/components/common/Icons';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';

export function ValidationSummary() {
  const validation = useWorkflowStore((state) => state.validation);

  const { errors, warnings } = useMemo(() => {
    return {
      errors: validation.issues.filter((issue) => issue.severity === 'error'),
      warnings: validation.issues.filter((issue) => issue.severity === 'warning'),
    };
  }, [validation.issues]);

  const healthLabel = errors.length === 0 ? 'Healthy' : errors.length <= 2 ? 'Needs review' : 'At risk';

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Validation status</p>
          <p className="text-xs leading-5 text-slate-500">Review structure before simulation or export.</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {healthLabel}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3">
          <div className="flex items-center gap-2">
            <Icon name="warning" className="h-4 w-4 text-rose-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-600">Errors</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-700">{errors.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3">
          <div className="flex items-center gap-2">
            <Icon name="clock" className="h-4 w-4 text-amber-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600">Warnings</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-700">{warnings.length}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-rose-700">{errors.length} errors</span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">{warnings.length} warnings</span>
        </div>
        {validation.issues.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
            Workflow is structurally valid and ready to simulate.
          </div>
        ) : (
          validation.issues.slice(0, 4).map((issue) => (
            <div
              key={issue.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm text-slate-600"
            >
              <p className="font-semibold text-slate-800">{issue.message}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                {issue.scope}
                {issue.nodeId ? ` · ${issue.nodeId}` : ''}
              </p>
            </div>
          ))
        )}

        {validation.issues.length > 4 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-3 py-2 text-xs font-medium text-slate-500">
            {validation.issues.length - 4} more issues are available in the sandbox panel after validation.
          </div>
        ) : null}
      </div>
    </div>
  );
}
