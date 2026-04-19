import type { DragEvent } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icons';
import { StartNode } from '@/components/nodes/StartNode';
import { TaskNode } from '@/components/nodes/TaskNode';
import { ApprovalNode } from '@/components/nodes/ApprovalNode';
import { AutomationNode } from '@/components/nodes/AutomationNode';
import { EndNode } from '@/components/nodes/EndNode';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';
import type { WorkflowEdge, WorkflowNode, WorkflowNodeType } from '@/features/workflow/types/workflow';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automation: AutomationNode,
  end: EndNode,
};

export function WorkflowCanvas() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const addNode = useWorkflowStore((state) => state.addNode);
  const setSelectedNodeId = useWorkflowStore((state) => state.setSelectedNodeId);
  const deleteEdge = useWorkflowStore((state) => state.deleteEdge);
  const reactFlow = useReactFlow();
  const hasAutoFit = useRef(false);

  const minimapNodeColor = useMemo(
    () => (node: { type?: string | null }) => {
      switch (node.type) {
        case 'start':
          return '#10b981';
        case 'task':
          return '#0ea5e9';
        case 'approval':
          return '#f59e0b';
        case 'automation':
          return '#8b5cf6';
        case 'end':
          return '#f43f5e';
        default:
          return '#64748b';
      }
    },
    [],
  );

  useEffect(() => {
    if (nodes.length === 0) {
      hasAutoFit.current = false;
      return;
    }

    if (!hasAutoFit.current) {
      hasAutoFit.current = true;
      window.setTimeout(() => {
        reactFlow.fitView({ padding: 0.2, duration: 500 });
      }, 120);
    }
  }, [nodes.length, reactFlow]);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');

    if (!nodeType) {
      return;
    }

    const position = reactFlow.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(nodeType as WorkflowNodeType, position);
  };

  return (
    <div className="panel relative h-full overflow-hidden border-slate-800/10 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.98))]">
      <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap items-start justify-between gap-3 rounded-[24px] border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Icon name="flow" className="h-4 w-4" />
            </div>
            <div>
              <p className="font-heading text-base font-semibold text-slate-950">Workflow canvas</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-slate-400">Design surface</p>
            </div>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Arrange steps, connect transitions, and review the live execution path.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {nodes.length} nodes
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {edges.length} connections
          </span>
          <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => reactFlow.fitView({ padding: 0.2, duration: 400 })}>
            <span className="mr-2 inline-flex"><Icon name="grid" className="h-4 w-4" /></span>
            Fit view
          </Button>
        </div>
      </div>

      <div className="h-full" onDragOver={handleDragOver} onDrop={handleDrop}>
        <ReactFlow<WorkflowNode, WorkflowEdge>
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={(instance) => {
            window.setTimeout(() => {
              instance.fitView({ padding: 0.2, duration: 500 });
            }, 120);
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={() => setSelectedNodeId(null)}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onSelectionChange={({ nodes: selectedNodes }) => setSelectedNodeId(selectedNodes[0]?.id ?? null)}
          onEdgeDoubleClick={(_, edge) => deleteEdge(edge.id)}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: '#334155', strokeWidth: 1.7 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#334155',
              width: 18,
              height: 18,
            },
          }}
          connectionLineStyle={{ stroke: '#0f172a', strokeWidth: 1.8 }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          deleteKeyCode={['Backspace', 'Delete']}
          selectionOnDrag
          snapToGrid
          snapGrid={[16, 16]}
          panOnScroll
          minZoom={0.45}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={18} color="#cbd5e1" />
          <MiniMap
            pannable
            zoomable
            nodeColor={minimapNodeColor}
            className="!bottom-5 !right-5 !rounded-2xl !border !border-slate-200 !bg-white/95 !shadow-sm"
          />
          <Controls showInteractive />
        </ReactFlow>

        {nodes.length === 0 ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
            <div className="pointer-events-auto max-w-md">
              <EmptyState
                title="Start designing a workflow"
                description="Drag a Start node onto the canvas, then add review, task, automation, and completion steps to build a complete HR process."
                iconName="flow"
              />
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute bottom-5 left-5 z-10 hidden rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-xs text-slate-500 shadow-sm backdrop-blur md:block">
          <div className="flex items-center gap-2">
            <Icon name="settings" className="h-4 w-4 text-slate-400" />
            <span>Tip: select a node to edit it, and double-click an edge to remove it.</span>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 right-36 z-10 hidden rounded-2xl border border-slate-200 bg-slate-950/95 px-4 py-3 text-xs text-slate-200 shadow-glow lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
              <Icon name="spark" className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Studio mode</p>
              <p className="mt-1 text-slate-300">Built for clean demos, quick edits, and reviewer walkthroughs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
