import { useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icons';
import { WorkflowCanvas } from '@/components/canvas/WorkflowCanvas';
import { NodeConfigPanel } from '@/components/forms/NodeConfigPanel';
import { SandboxDrawer } from '@/components/sandbox/SandboxDrawer';
import { NodePalette } from '@/components/sidebar/NodePalette';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';
import { serializeWorkflow } from '@/features/workflow/serializers/workflowSerializer';
import { loadWorkflowDraft } from '@/services/api/workflowDraftStorage';

function downloadJsonFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AppShell() {
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const draftAvailable = useWorkflowStore((state) => state.draftAvailable);
  const runSimulation = useWorkflowStore((state) => state.runSimulation);
  const resetToDemo = useWorkflowStore((state) => state.resetToDemo);
  const clearWorkflow = useWorkflowStore((state) => state.clearWorkflow);
  const deleteSelectedNode = useWorkflowStore((state) => state.deleteSelectedNode);
  const openSandbox = useWorkflowStore((state) => state.openSandbox);
  const importWorkflow = useWorkflowStore((state) => state.importWorkflow);
  const setSandboxError = useWorkflowStore((state) => state.setSandboxError);

  const handleOpenSandbox = () => {
    openSandbox();
    window.requestAnimationFrame(() => {
      document.getElementById('simulation-lab')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleExport = () => {
    const payload = serializeWorkflow(nodes, edges);
    downloadJsonFile(JSON.stringify(payload, null, 2), 'hr-workflow-designer-export.json');
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      importWorkflow(parsed);
    } catch {
      setSandboxError('The selected file is not valid workflow JSON. Export a workflow from this app and try again.');
    } finally {
      event.target.value = '';
    }
  };

  const handleRestoreDraft = () => {
    const draft = loadWorkflowDraft();
    if (!draft) {
      return;
    }

    importWorkflow(draft.workflow);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb absolute left-[-4rem] top-[-3rem] h-80 w-80 rounded-full bg-sky-300/25 blur-3xl" />
        <div className="orb absolute bottom-[-4rem] right-[-3rem] h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="orb absolute right-1/3 top-24 h-64 w-64 rounded-full bg-violet-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] flex-col">
        <header className="panel mb-4 overflow-hidden border-slate-800/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.94))] px-6 py-6 text-white shadow-luxe">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-100">
                  HR Workflow Designer
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200">
                  Demo-ready prototype
                </span>
              </div>
              <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-white sm:text-[2.2rem]">
                Design internal HR processes in a premium visual workflow studio
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200/90">
                Build onboarding, approval, and document workflows on a typed canvas, edit each step in a live side panel,
                and validate the full process before running a simulation.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100">
                  React Flow canvas
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100">
                  Typed node inspector
                </span>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100">
                  Mock API sandbox
                </span>
              </div>
            </div>

            <div className="w-full xl:max-w-[500px]">
              <div className="rounded-[28px] border border-white/10 bg-white/8 p-3 shadow-[0_18px_44px_rgba(15,23,42,0.24)] backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">Workflow Actions</p>
                    <p className="mt-1 text-xs text-slate-300/80">Run, manage, import, and reset your current scenario.</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200">
                    Live
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="secondary" size="lg" className="justify-start bg-white text-slate-900" onClick={() => void runSimulation()}>
                    <Icon name="play" className="h-4 w-4" />
                    <span>Run Simulation</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="justify-start border-white/10 bg-white text-slate-800"
                    onClick={handleOpenSandbox}
                  >
                    <Icon name="panel" className="h-4 w-4" />
                    <span>Open Sandbox</span>
                  </Button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Button variant="ghost" className="justify-start border-white/10 bg-white text-slate-800" onClick={handleExport}>
                    <Icon name="export" className="h-4 w-4" />
                    <span>Export JSON</span>
                  </Button>
                  <Button variant="ghost" className="justify-start border-white/10 bg-white text-slate-800" onClick={handleImportClick}>
                    <Icon name="link" className="h-4 w-4" />
                    <span>Import JSON</span>
                  </Button>
                  {draftAvailable ? (
                    <Button variant="ghost" className="justify-start border-white/10 bg-white text-slate-800" onClick={handleRestoreDraft}>
                      <Icon name="clock" className="h-4 w-4" />
                      <span>Restore Draft</span>
                    </Button>
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                  <Button variant="ghost" className="justify-start border-white/10 bg-white text-slate-800" onClick={resetToDemo}>
                    <Icon name="grid" className="h-4 w-4" />
                    <span>Reset Demo</span>
                  </Button>
                  <Button variant="ghost" className="justify-start border-white/10 bg-white text-slate-800" onClick={clearWorkflow}>
                    <Icon name="spark" className="h-4 w-4" />
                    <span>New Workflow</span>
                  </Button>
                  <Button variant="danger" className="justify-start" onClick={deleteSelectedNode} disabled={!selectedNodeId}>
                    <Icon name="warning" className="h-4 w-4" />
                    <span>Delete Selected</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />

        </header>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[310px_minmax(0,1fr)_360px]">
          <div className="min-h-0">
            <NodePalette />
          </div>
          <div className="min-h-0">
            <WorkflowCanvas />
          </div>
          <div className="min-h-0">
            <NodeConfigPanel />
          </div>
        </div>

        <SandboxDrawer />
      </div>
    </div>
  );
}
