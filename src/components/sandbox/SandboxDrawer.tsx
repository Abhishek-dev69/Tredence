import { Alert } from '@/components/common/Alert';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icons';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';

export function SandboxDrawer() {
  const sandbox = useWorkflowStore((state) => state.sandbox);
  const simulationResult = useWorkflowStore((state) => state.simulationResult);
  const validationIssues = useWorkflowStore((state) => state.validation.issues);
  const closeSandbox = useWorkflowStore((state) => state.closeSandbox);

  if (!sandbox.isOpen) {
    return null;
  }

  return (
    <section className="panel mt-4 flex max-h-[340px] min-h-[250px] flex-col overflow-hidden border-slate-800/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] text-white shadow-luxe">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="panel" className="h-4 w-4 text-sky-200" />
            <p className="font-heading text-base font-semibold text-white">Workflow sandbox</p>
          </div>
          <p className="mt-1 text-sm text-slate-300">Inspect validation blockers, runtime steps, and mock execution output.</p>
        </div>
        <Button variant="ghost" onClick={closeSandbox}>
          Close
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4">
        {sandbox.isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <span className="h-3 w-3 animate-pulse rounded-full bg-sky-500" />
              Running mock simulation...
            </div>
          </div>
        ) : sandbox.error ? (
          <div className="space-y-4">
            <Alert tone="error">{sandbox.error}</Alert>
            {!simulationResult && validationIssues.length > 0 ? (
              <div className="space-y-2">
                {validationIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                  >
                    {issue.message}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : simulationResult ? (
          <div className="space-y-4">
            <Alert tone={simulationResult.success ? 'success' : 'error'}>
              {simulationResult.success ? 'Simulation completed successfully.' : 'Simulation returned an error.'}
            </Alert>
            <div className="space-y-3">
              {simulationResult.steps.map((step, index) => (
                <div key={`${step}-${index}`} className="relative flex gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <div className="absolute left-[1.65rem] top-10 h-full w-px bg-white/10" />
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{step}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-300">execution step</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No simulation run yet"
            description="Use the Run Simulation button to validate the graph and generate a step-by-step sandbox log."
            iconName="play"
          />
        )}
      </div>
    </section>
  );
}
