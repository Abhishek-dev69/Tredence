import { describe, expect, it } from 'vitest';
import { validateWorkflow } from '@/features/workflow/validation/validateWorkflow';
import { createSampleWorkflow, createEdgeId } from '@/features/workflow/utils/nodeFactory';
import type { WorkflowEdge, WorkflowNode } from '@/features/workflow/types/workflow';

describe('validateWorkflow', () => {
  it('accepts the bundled sample workflow', () => {
    const graph = createSampleWorkflow();
    const result = validateWorkflow(graph.nodes, graph.edges);

    expect(result.isValid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('rejects a graph with more than one start node', () => {
    const graph = createSampleWorkflow();
    const extraStart: WorkflowNode = {
      id: 'start-2',
      type: 'start',
      position: { x: 120, y: 300 },
      data: {
        type: 'start',
        startTitle: 'Secondary start',
        metadata: [],
      },
    };

    const result = validateWorkflow([...graph.nodes, extraStart], graph.edges);

    expect(result.isValid).toBe(false);
    expect(result.issues.some((issue) => issue.message.includes('Exactly one Start node is required'))).toBe(true);
  });

  it('detects unreachable nodes and missing start-to-end paths', () => {
    const graph = createSampleWorkflow();
    const detachedTask: WorkflowNode = {
      id: 'task-detached',
      type: 'task',
      position: { x: 300, y: 340 },
      data: {
        type: 'task',
        title: 'Detached task',
        description: '',
        assignee: 'HR Ops',
        dueDate: '',
        customFields: [],
      },
    };

    const result = validateWorkflow([...graph.nodes, detachedTask], graph.edges);

    expect(result.isValid).toBe(false);
    expect(result.issues.some((issue) => issue.message.includes('not reachable from Start'))).toBe(true);
  });

  it('detects simple cycles', () => {
    const graph = createSampleWorkflow();
    const cycleEdge: WorkflowEdge = {
      id: createEdgeId('automation-1', 'task-1'),
      source: 'automation-1',
      target: 'task-1',
    };

    const result = validateWorkflow(graph.nodes, [...graph.edges, cycleEdge]);

    expect(result.isValid).toBe(false);
    expect(result.issues.some((issue) => issue.message.includes('cycle'))).toBe(true);
  });
});
