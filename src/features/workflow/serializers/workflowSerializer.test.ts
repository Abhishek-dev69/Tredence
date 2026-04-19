import { describe, expect, it } from 'vitest';
import { deserializeWorkflow, serializeWorkflow } from '@/features/workflow/serializers/workflowSerializer';
import { createSampleWorkflow } from '@/features/workflow/utils/nodeFactory';

describe('workflowSerializer', () => {
  it('serializes the graph into API-safe JSON', () => {
    const graph = createSampleWorkflow();
    const serialized = serializeWorkflow(graph.nodes, graph.edges);

    expect(serialized.nodes).toHaveLength(graph.nodes.length);
    expect(serialized.edges).toHaveLength(graph.edges.length);
    expect(serialized.nodes[0]).toMatchObject({
      id: 'start-1',
      type: 'start',
    });
  });

  it('deserializes exported workflow JSON back into graph state', () => {
    const graph = createSampleWorkflow();
    const serialized = serializeWorkflow(graph.nodes, graph.edges);
    const restored = deserializeWorkflow(serialized);

    expect(restored.nodes).toHaveLength(graph.nodes.length);
    expect(restored.edges).toHaveLength(graph.edges.length);
    expect(restored.nodes[0].data.type).toBe('start');
  });

  it('throws for malformed workflow JSON', () => {
    expect(() =>
      deserializeWorkflow({
        nodes: [{ id: 'broken', type: 'task', position: { x: 0, y: 0 } } as never],
        edges: [],
      }),
    ).toThrow('invalid node definition');
  });
});
