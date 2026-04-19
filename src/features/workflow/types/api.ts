import type { WorkflowEdge, WorkflowNodeData, WorkflowNodeType } from '@/features/workflow/types/workflow';

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SerializedWorkflowNode {
  id: string;
  type: WorkflowNodeType;
  position: {
    x: number;
    y: number;
  };
  data: WorkflowNodeData;
}

export interface SerializedWorkflowGraph {
  nodes: SerializedWorkflowNode[];
  edges: Array<Pick<WorkflowEdge, 'id' | 'source' | 'target'>>;
}

export interface SimulateWorkflowRequest {
  workflow: SerializedWorkflowGraph;
}

export interface SimulateWorkflowResponse {
  success: boolean;
  steps: string[];
  errors: string[];
}
