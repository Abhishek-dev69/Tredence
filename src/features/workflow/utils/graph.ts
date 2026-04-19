import type { WorkflowEdge, WorkflowNode } from '@/features/workflow/types/workflow';

export function buildGraphMaps(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const incoming = new Map<string, WorkflowEdge[]>();
  const outgoing = new Map<string, WorkflowEdge[]>();

  nodes.forEach((node) => {
    incoming.set(node.id, []);
    outgoing.set(node.id, []);
  });

  edges.forEach((edge) => {
    incoming.get(edge.target)?.push(edge);
    outgoing.get(edge.source)?.push(edge);
  });

  return { incoming, outgoing };
}

export function getReachableNodeIds(startId: string, edges: WorkflowEdge[]) {
  const adjacency = new Map<string, string[]>();

  edges.forEach((edge) => {
    const current = adjacency.get(edge.source) ?? [];
    current.push(edge.target);
    adjacency.set(edge.source, current);
  });

  const visited = new Set<string>();
  const stack = [startId];

  while (stack.length) {
    const current = stack.pop();
    if (!current || visited.has(current)) {
      continue;
    }

    visited.add(current);
    const targets = adjacency.get(current) ?? [];
    targets.forEach((target) => {
      if (!visited.has(target)) {
        stack.push(target);
      }
    });
  }

  return visited;
}

export function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  const adjacency = new Map<string, string[]>();

  nodes.forEach((node) => {
    adjacency.set(node.id, []);
  });

  edges.forEach((edge) => {
    adjacency.get(edge.source)?.push(edge.target);
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) {
      return true;
    }
    if (visited.has(nodeId)) {
      return false;
    }

    visiting.add(nodeId);

    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (visit(neighbor)) {
        return true;
      }
    }

    visiting.delete(nodeId);
    visited.add(nodeId);

    return false;
  };

  return nodes.some((node) => visit(node.id));
}

export function traverseWorkflow(startId: string, edges: WorkflowEdge[]) {
  const adjacency = new Map<string, string[]>();
  edges.forEach((edge) => {
    const existing = adjacency.get(edge.source) ?? [];
    existing.push(edge.target);
    adjacency.set(edge.source, existing);
  });

  const visited = new Set<string>();
  const ordered: string[] = [];

  const dfs = (nodeId: string) => {
    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);
    ordered.push(nodeId);

    for (const nextId of adjacency.get(nodeId) ?? []) {
      dfs(nextId);
    }
  };

  dfs(startId);

  return ordered;
}
