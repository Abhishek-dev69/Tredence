import type { DragEvent } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icons';
import { paletteNodes } from '@/features/workflow/utils/nodeCatalog';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';
import { ValidationSummary } from '@/components/common/ValidationSummary';
import { cn } from '@/lib/cn';
import type { WorkflowNodeType } from '@/features/workflow/types/workflow';

function getNodeIcon(type: WorkflowNodeType) {
  switch (type) {
    case 'start':
      return 'start';
    case 'task':
      return 'task';
    case 'approval':
      return 'approval';
    case 'automation':
      return 'automation';
    case 'end':
      return 'end';
  }
}

export function NodePalette() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const hasStartNode = useWorkflowStore((state) => state.nodes.some((node) => node.data.type === 'start'));
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleDragStart = (event: DragEvent<HTMLDivElement>, type: string) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleQuickAdd = (type: WorkflowNodeType) => {
    const index = nodes.length;
    const position = {
      x: 140 + (index % 2) * 280,
      y: 140 + Math.floor(index / 2) * 170,
    };

    addNode(type, position);
  };

  return (
    <aside className="panel flex h-full flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-5">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1e293b)] text-sm font-bold text-white shadow-md">
            <Icon name="flow" className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold text-slate-950">Workflow Blocks</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Drag or quick-add nodes, then shape the flow into a complete HR process.</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-auto pr-1">
        {paletteNodes.map((item) => {
          const disabled = item.type === 'start' && hasStartNode;

          return (
            <div
              key={item.type}
              draggable={!disabled}
              onDragStart={(event) => handleDragStart(event, item.type)}
              aria-disabled={disabled}
              className={cn(
                'w-full rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50',
                disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm', item.accentClassName)}>
                    <Icon name={getNodeIcon(item.type)} className="h-5 w-5" />
                  </div>
                  <div className={cn('h-2 w-20 rounded-full bg-gradient-to-r', item.accentClassName)} />
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  drag / add
                </span>
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
                </div>
                {disabled ? (
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">
                    Added
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-slate-500">
                  {item.type === 'start'
                    ? 'Only one start node is allowed'
                    : item.type === 'end'
                      ? 'Best placed at the final stage'
                      : item.type === 'automation'
                        ? 'Dynamic params come from the mock API'
                        : 'Editable in the inspector panel'}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-3 py-1.5 text-xs"
                  disabled={disabled}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleQuickAdd(item.type);
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.96))] p-4 text-white shadow-glow">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">Workflow Studio Tips</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="text-slate-200">Build a happy path first, then validate and refine details.</li>
          <li className="text-slate-300">Use fit view after adding nodes to keep the graph presentation-ready.</li>
          <li className="text-slate-300">Open the sandbox to preview errors and simulation output instantly.</li>
        </ul>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <ValidationSummary />
      </div>
    </aside>
  );
}
