import type { Edge, Node, XYPosition } from '@xyflow/react';

export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automation' | 'end';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

interface WorkflowNodeDataBase extends Record<string, unknown> {
  type: WorkflowNodeType;
}

export interface StartNodeData extends WorkflowNodeDataBase {
  type: 'start';
  startTitle: string;
  metadata: KeyValuePair[];
}

export interface TaskNodeData extends WorkflowNodeDataBase {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

export interface ApprovalNodeData extends WorkflowNodeDataBase {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number | null;
}

export interface AutomationNodeData extends WorkflowNodeDataBase {
  type: 'automation';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData extends WorkflowNodeDataBase {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomationNodeData
  | EndNodeData;

export type StartWorkflowNode = Node<StartNodeData, 'start'>;
export type TaskWorkflowNode = Node<TaskNodeData, 'task'>;
export type ApprovalWorkflowNode = Node<ApprovalNodeData, 'approval'>;
export type AutomationWorkflowNode = Node<AutomationNodeData, 'automation'>;
export type EndWorkflowNode = Node<EndNodeData, 'end'>;

export type WorkflowNode =
  | StartWorkflowNode
  | TaskWorkflowNode
  | ApprovalWorkflowNode
  | AutomationWorkflowNode
  | EndWorkflowNode;

export type WorkflowEdge = Edge;

export type NodeDataByType<T extends WorkflowNodeType> = Extract<WorkflowNodeData, { type: T }>;

export interface WorkflowGraphSnapshot {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface PaletteNodeDefinition {
  type: WorkflowNodeType;
  label: string;
  description: string;
  accentClassName: string;
}

export interface AddNodeOptions {
  type: WorkflowNodeType;
  position: XYPosition;
}

export interface SandboxState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}
