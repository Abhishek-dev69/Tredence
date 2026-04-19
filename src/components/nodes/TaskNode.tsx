import type { NodeProps } from '@xyflow/react';
import { Icon } from '@/components/common/Icons';
import type { TaskWorkflowNode } from '@/features/workflow/types/workflow';
import { NodeShell } from '@/components/nodes/NodeShell';

export function TaskNode({ id, data, selected }: NodeProps<TaskWorkflowNode>) {
  return (
    <NodeShell
      id={id}
      typeLabel="Task"
      title={data.title || 'Task'}
      subtitle={data.assignee ? `Assignee: ${data.assignee}` : 'Awaiting assignee'}
      selected={selected}
      tone="sky"
      icon={<Icon name="task" className="h-5 w-5" />}
      metaBadge="Manual"
    >
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>{data.dueDate ? `Due ${data.dueDate}` : 'No due date'}</span>
        <span>{data.customFields.length} custom fields</span>
      </div>
    </NodeShell>
  );
}
