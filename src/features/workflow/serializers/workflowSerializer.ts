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

export function deserializeWorkflow(serializedWorkflow: SerializedWorkflowGraph) {
  if (!serializedWorkflow || !Array.isArray(serializedWorkflow.nodes) || !Array.isArray(serializedWorkflow.edges)) {
    throw new Error('Imported JSON is not a valid workflow graph.');
  }

  const nodes = serializedWorkflow.nodes.map((node) => {
    if (!node.id || !node.type || !node.position || !node.data) {
      throw new Error('Imported workflow contains an invalid node definition.');
    }

    return {
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    } as WorkflowNode;
  });

  const edges = serializedWorkflow.edges.map((edge) => {
    if (!edge.id || !edge.source || !edge.target) {
      throw new Error('Imported workflow contains an invalid edge definition.');
    }

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: false,
    } as WorkflowEdge;
  });

  return { nodes, edges };
}
