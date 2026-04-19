import type { NodeProps } from '@xyflow/react';
import { Icon } from '@/components/common/Icons';
import type { ApprovalWorkflowNode } from '@/features/workflow/types/workflow';
import { NodeShell } from '@/components/nodes/NodeShell';

export function ApprovalNode({ id, data, selected }: NodeProps<ApprovalWorkflowNode>) {
  return (
    <NodeShell
      id={id}
      typeLabel="Approval"
      title={data.title || 'Approval'}
      subtitle={data.approverRole ? `${data.approverRole} review` : 'Choose approver'}
      selected={selected}
      tone="amber"
      icon={<Icon name="approval" className="h-5 w-5" />}
      metaBadge="Review"
    >
      <div className="text-[11px] text-slate-500">
        {data.autoApproveThreshold ? `Auto-approve after ${data.autoApproveThreshold} hours` : 'Manual approval only'}
      </div>
    </NodeShell>
  );
}
