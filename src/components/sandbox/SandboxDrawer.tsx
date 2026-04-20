import { useMemo } from 'react';
import { Alert } from '@/components/common/Alert';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icons';
import { serializeWorkflow } from '@/features/workflow/serializers/workflowSerializer';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';

export function SandboxDrawer() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const sandbox = useWorkflowStore((state) => state.sandbox);
  const simulationResult = useWorkflowStore((state) => state.simulationResult);
  const validationIssues = useWorkflowStore((state) => state.validation.issues);
  const runSimulation = useWorkflowStore((state) => state.runSimulation);

  const serializedGraph = useMemo(() => {
    return JSON.stringify(serializeWorkflow(nodes, edges), null, 2);
  }, [edges, nodes]);

  return (
    <section
      id="simulation-lab"
      className="panel mt-4 overflow-hidden border-slate-800/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,247,251,0.96))] shadow-luxe"
    >
      <div className="border-b border-slate-200/80 px-6 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500">Sandbox</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-slate-950">Simulation lab</h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              Stress-test the workflow and review the execution path before rollout.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:min-w-[280px]">
            <Button variant="primary" size="lg" className="justify-center px-6 py-4 text-base" onClick={() => void runSimulation()}>
              <Icon name="play" className="h-4 w-4" />
              <span>Run Simulation</span>
            </Button>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-500 shadow-sm">
              <span>Sandbox status</span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  sandbox.isLoading
                    ? 'bg-sky-50 text-sky-700'
                    : sandbox.error
                      ? 'bg-rose-50 text-rose-700'
                      : simulationResult?.success
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                }`}
              >
                {sandbox.isLoading
                  ? 'Running'
                  : sandbox.error
                    ? 'Needs review'
                    : simulationResult?.success
                      ? 'Ready'
                      : 'Idle'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="export" className="h-4 w-4 text-slate-400" />
            <h3 className="font-heading text-xl font-semibold text-slate-950">Serialized Graph</h3>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.95))] shadow-inner">
            <pre className="max-h-[420px] overflow-auto px-5 py-5 text-[13px] leading-7 text-slate-700">{serializedGraph}</pre>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="panel" className="h-4 w-4 text-slate-400" />
            <h3 className="font-heading text-xl font-semibold text-slate-950">Execution Log</h3>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm">
            {sandbox.isLoading ? (
              <div className="flex min-h-[280px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-sky-500" />
                  Running mock simulation...
                </div>
              </div>
            ) : sandbox.error ? (
              <div className="space-y-4">
                <Alert tone="error">{sandbox.error}</Alert>
                {!simulationResult && validationIssues.length > 0 ? (
                  <div className="space-y-3">
                    {validationIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-700"
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
                    <div
                      key={`${step}-${index}`}
                      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] px-4 py-4"
                    >
                      {index < simulationResult.steps.length - 1 ? (
                        <div className="absolute left-[1.85rem] top-12 h-full w-px bg-slate-200" />
                      ) : null}
                      <div className="flex gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{step}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">Execution step</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="min-h-[280px]">
                <EmptyState
                  title="Run simulation to see step-by-step execution"
                  description="Validate the graph and inspect the mock execution path here before presenting or exporting the workflow."
                  iconName="play"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
