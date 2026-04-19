import type {
  ApprovalNodeData,
  AutomationNodeData,
  EndNodeData,
  KeyValuePair,
  PaletteNodeDefinition,
  StartNodeData,
  TaskNodeData,
  WorkflowNodeData,
  WorkflowNodeType,
} from '@/features/workflow/types/workflow';
import type { AutomationAction } from '@/features/workflow/types/api';

const createPair = (): KeyValuePair => ({
  id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
  key: '',
  value: '',
});

export const paletteNodes: PaletteNodeDefinition[] = [
  {
    type: 'start',
    label: 'Start Node',
    description: 'Entry point for the workflow.',
    accentClassName: 'from-emerald-500 to-teal-500',
  },
  {
    type: 'task',
    label: 'Task Node',
    description: 'Assign work to an HR team member.',
    accentClassName: 'from-sky-500 to-blue-500',
  },
  {
    type: 'approval',
    label: 'Approval Node',
    description: 'Route work to a role-based approver.',
    accentClassName: 'from-amber-500 to-orange-500',
  },
  {
    type: 'automation',
    label: 'Automated Step',
    description: 'Trigger a mock automation action.',
    accentClassName: 'from-violet-500 to-fuchsia-500',
  },
  {
    type: 'end',
    label: 'End Node',
    description: 'Marks the end of the workflow.',
    accentClassName: 'from-rose-500 to-pink-500',
  },
];

export function createDefaultNodeData(type: WorkflowNodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return {
        type,
        startTitle: 'Employee created',
        metadata: [],
      } satisfies StartNodeData;
    case 'task':
      return {
        type,
        title: 'New task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      } satisfies TaskNodeData;
    case 'approval':
      return {
        type,
        title: 'Approval step',
        approverRole: 'Manager',
        autoApproveThreshold: null,
      } satisfies ApprovalNodeData;
    case 'automation':
      return {
        type,
        title: 'Automated step',
        actionId: '',
        actionParams: {},
      } satisfies AutomationNodeData;
    case 'end':
      return {
        type,
        endMessage: 'Workflow complete',
        summaryFlag: true,
      } satisfies EndNodeData;
  }
}

export function createEmptyKeyValuePair() {
  return createPair();
}

export function getNodeTitle(data: WorkflowNodeData) {
  switch (data.type) {
    case 'start':
      return data.startTitle || 'Start';
    case 'task':
      return data.title || 'Untitled task';
    case 'approval':
      return data.title || 'Approval';
    case 'automation':
      return data.title || 'Automated step';
    case 'end':
      return data.endMessage || 'End';
  }
}

export function getNodeSubtitle(data: WorkflowNodeData, automations: AutomationAction[] = []) {
  switch (data.type) {
    case 'start':
      return data.metadata.length ? `${data.metadata.length} metadata pairs` : 'Workflow trigger';
    case 'task':
      return data.assignee ? `Assigned to ${data.assignee}` : 'Manual HR action';
    case 'approval':
      return data.approverRole ? `${data.approverRole} approval` : 'Approval routing';
    case 'automation': {
      const action = automations.find((item) => item.id === data.actionId);
      return action ? action.label : data.actionId || 'Choose an automation';
    }
    case 'end':
      return data.summaryFlag ? 'Sends summary signal' : 'Silent completion';
  }
}

export function getNodeTypeLabel(type: WorkflowNodeType) {
  return paletteNodes.find((item) => item.type === type)?.label ?? type;
}
