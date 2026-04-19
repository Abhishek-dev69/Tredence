import type { ValidationIssue, ValidationResult } from '@/features/workflow/types/validation';
import type { WorkflowEdge, WorkflowNode } from '@/features/workflow/types/workflow';
import { buildGraphMaps, detectCycle, getReachableNodeIds } from '@/features/workflow/utils/graph';

function createIssue(partial: Omit<ValidationIssue, 'id'>, index: number): ValidationIssue {
  return {
    id: `issue-${index + 1}`,
    ...partial,
  };
}

export function validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult {
  const issues: ValidationIssue[] = [];
  const { incoming, outgoing } = buildGraphMaps(nodes, edges);
  const startNodes = nodes.filter((node) => node.data.type === 'start');
  const endNodes = nodes.filter((node) => node.data.type === 'end');

  if (nodes.length === 0) {
    issues.push(
      createIssue(
        {
          severity: 'warning',
          scope: 'workflow',
          message: 'Canvas is empty. Add nodes to begin designing a workflow.',
        },
        issues.length,
      ),
    );
  }

  if (startNodes.length !== 1) {
    issues.push(
      createIssue(
        {
          severity: 'error',
          scope: 'workflow',
          message: `Exactly one Start node is required. Current count: ${startNodes.length}.`,
        },
        issues.length,
      ),
    );
  }

  if (endNodes.length === 0) {
    issues.push(
      createIssue(
        {
          severity: 'error',
          scope: 'workflow',
          message: 'Add at least one End node so the workflow can complete.',
        },
        issues.length,
      ),
    );
  }

  edges.forEach((edge) => {
    if (edge.source === edge.target) {
      issues.push(
        createIssue(
          {
            severity: 'error',
            scope: 'edge',
            edgeId: edge.id,
            message: 'Self-referencing edges are not allowed.',
          },
          issues.length,
        ),
      );
    }
  });

  nodes.forEach((node) => {
    const incomingEdges = incoming.get(node.id) ?? [];
    const outgoingEdges = outgoing.get(node.id) ?? [];

    if (node.data.type === 'start' && incomingEdges.length > 0) {
      issues.push(
        createIssue(
          {
            severity: 'error',
            scope: 'node',
            nodeId: node.id,
            message: 'Start node cannot have incoming edges.',
          },
          issues.length,
        ),
      );
    }

    if (node.data.type === 'end' && outgoingEdges.length > 0) {
      issues.push(
        createIssue(
          {
            severity: 'error',
            scope: 'node',
            nodeId: node.id,
            message: 'End node cannot have outgoing edges.',
          },
          issues.length,
        ),
      );
    }

    if (incomingEdges.length === 0 && outgoingEdges.length === 0) {
      issues.push(
        createIssue(
          {
            severity: 'error',
            scope: 'node',
            nodeId: node.id,
            message: 'Node is disconnected from the workflow.',
          },
          issues.length,
        ),
      );
    }

    if (node.data.type === 'start' && !node.data.startTitle.trim()) {
      issues.push(
        createIssue(
          {
            severity: 'error',
            scope: 'node',
            nodeId: node.id,
            message: 'Start node requires a startTitle value.',
          },
          issues.length,
        ),
      );
    }

    if (node.data.type === 'task' && !node.data.title.trim()) {
      issues.push(
        createIssue(
          {
            severity: 'error',
            scope: 'node',
            nodeId: node.id,
            message: 'Task node requires a title.',
          },
          issues.length,
        ),
      );
    }

    if (node.data.type === 'automation' && !node.data.actionId) {
      issues.push(
        createIssue(
          {
            severity: 'error',
            scope: 'node',
            nodeId: node.id,
            message: 'Automated Step requires an action selection.',
          },
          issues.length,
        ),
      );
    }
  });

  const startNode = startNodes[0];

  if (startNode) {
    const reachable = getReachableNodeIds(startNode.id, edges);

    nodes
      .filter((node) => node.id !== startNode.id && !reachable.has(node.id))
      .forEach((node) => {
        issues.push(
          createIssue(
            {
              severity: 'error',
              scope: 'node',
              nodeId: node.id,
              message: 'Node is not reachable from Start.',
            },
            issues.length,
          ),
        );
      });

    const endReachable = endNodes.some((node) => reachable.has(node.id));

    if (!endReachable) {
      issues.push(
        createIssue(
          {
            severity: 'error',
            scope: 'workflow',
            message: 'At least one path from Start to End is required.',
          },
          issues.length,
        ),
      );
    }
  }

  if (detectCycle(nodes, edges)) {
    issues.push(
      createIssue(
        {
          severity: 'error',
          scope: 'workflow',
          message: 'A cycle was detected. Workflow graphs must remain acyclic.',
        },
        issues.length,
      ),
    );
  }

  const nodeIssueCount = issues.reduce<Record<string, number>>((accumulator, issue) => {
    if (issue.nodeId) {
      accumulator[issue.nodeId] = (accumulator[issue.nodeId] ?? 0) + 1;
    }
    return accumulator;
  }, {});

  return {
    isValid: issues.every((issue) => issue.severity !== 'error'),
    issues,
    nodeIssueCount,
  };
}
