import type { NodeProps } from '@xyflow/react';
import { Icon } from '@/components/common/Icons';
import type { AutomationWorkflowNode } from '@/features/workflow/types/workflow';
import { NodeShell } from '@/components/nodes/NodeShell';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';

export function AutomationNode({ id, data, selected }: NodeProps<AutomationWorkflowNode>) {
  const automations = useWorkflowStore((state) => state.automations);
  const actionLabel = automations.find((item) => item.id === data.actionId)?.label ?? data.actionId;

  return (
    <NodeShell
      id={id}
      typeLabel="Automation"
      title={data.title || 'Automated step'}
      subtitle={actionLabel || 'Select a mock automation'}
      selected={selected}
      tone="violet"
      icon={<Icon name="automation" className="h-5 w-5" />}
      metaBadge="System"
    >
      <div className="text-[11px] text-slate-500">{Object.keys(data.actionParams).length} parameters configured</div>
    </NodeShell>
  );
}
