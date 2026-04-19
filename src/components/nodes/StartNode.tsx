import type { NodeProps } from '@xyflow/react';
import { Icon } from '@/components/common/Icons';
import type { StartWorkflowNode } from '@/features/workflow/types/workflow';
import { NodeShell } from '@/components/nodes/NodeShell';

export function StartNode({ id, data, selected }: NodeProps<StartWorkflowNode>) {
  return (
    <NodeShell
      id={id}
      typeLabel="Start"
      title={data.startTitle || 'Start'}
      subtitle={data.metadata.length ? `${data.metadata.length} metadata pairs configured` : 'Initial workflow trigger'}
      selected={selected}
      tone="emerald"
      icon={<Icon name="start" className="h-5 w-5" />}
      metaBadge="Trigger"
      showTarget={false}
    >
      <div className="flex flex-wrap gap-2">
        {(data.metadata.length ? data.metadata : [{ id: 'placeholder', key: 'metadata', value: 'optional' }])
          .slice(0, 2)
          .map((item) => (
            <span key={item.id} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600">
              {item.key || 'metadata'} {item.value ? `· ${item.value}` : ''}
            </span>
          ))}
      </div>
    </NodeShell>
  );
}
