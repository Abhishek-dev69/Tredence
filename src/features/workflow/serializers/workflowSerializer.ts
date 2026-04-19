import type { SerializedWorkflowGraph } from '@/features/workflow/types/api';
import type { WorkflowEdge, WorkflowNode } from '@/features/workflow/types/workflow';

export function serializeWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): SerializedWorkflowGraph {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.data.type,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    })),
  };
}
