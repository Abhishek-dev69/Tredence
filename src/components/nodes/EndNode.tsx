import type { NodeProps } from '@xyflow/react';
import { Icon } from '@/components/common/Icons';
import type { EndWorkflowNode } from '@/features/workflow/types/workflow';
import { NodeShell } from '@/components/nodes/NodeShell';

export function EndNode({ id, data, selected }: NodeProps<EndWorkflowNode>) {
  return (
    <NodeShell
      id={id}
      typeLabel="End"
      title={data.endMessage || 'End'}
      subtitle={data.summaryFlag ? 'Summary output enabled' : 'Summary output disabled'}
      selected={selected}
      tone="rose"
      icon={<Icon name="end" className="h-5 w-5" />}
      metaBadge="Outcome"
      showSource={false}
    />
  );
}
