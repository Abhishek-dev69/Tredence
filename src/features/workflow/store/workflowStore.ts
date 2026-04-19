import { addEdge, applyEdgeChanges, applyNodeChanges, type Connection, type EdgeChange, type NodeChange } from '@xyflow/react';
import { create } from 'zustand';
import type { AutomationAction, SerializedWorkflowGraph, SimulateWorkflowResponse } from '@/features/workflow/types/api';
import type { ValidationResult } from '@/features/workflow/types/validation';
import type {
  NodeDataByType,
  SandboxState,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeType,
} from '@/features/workflow/types/workflow';
import { deserializeWorkflow, serializeWorkflow } from '@/features/workflow/serializers/workflowSerializer';
import { createEdgeId, createSampleWorkflow, createWorkflowNode } from '@/features/workflow/utils/nodeFactory';
import { validateWorkflow } from '@/features/workflow/validation/validateWorkflow';
import { apiClient } from '@/services/api/mockApiClient';

interface WorkflowStoreState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  automations: AutomationAction[];
  automationsLoading: boolean;
  draftAvailable: boolean;
  lastSavedAt: number | null;
  validation: ValidationResult;
  simulationResult: SimulateWorkflowResponse | null;
  sandbox: SandboxState;
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: WorkflowNodeType, position: { x: number; y: number }) => boolean;
  setSelectedNodeId: (nodeId: string | null) => void;
  updateNodeData: <T extends WorkflowNodeType>(
    nodeId: string,
    type: T,
    patch: Partial<NodeDataByType<T>>,
  ) => void;
  deleteSelectedNode: () => void;
  deleteEdge: (edgeId: string) => void;
  clearWorkflow: () => void;
  resetToDemo: () => void;
  importWorkflow: (serializedWorkflow: SerializedWorkflowGraph) => { success: boolean; error?: string };
  setDraftAvailable: (value: boolean) => void;
  setLastSavedAt: (value: number | null) => void;
  setSandboxError: (message: string | null) => void;
  openSandbox: () => void;
  closeSandbox: () => void;
  loadAutomations: () => Promise<void>;
  runSimulation: () => Promise<void>;
}

const initialGraph = createSampleWorkflow();
const initialValidation = validateWorkflow(initialGraph.nodes, initialGraph.edges);

function withValidation(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
  return {
    nodes,
    edges,
    validation: validateWorkflow(nodes, edges),
  };
}

export const useWorkflowStore = create<WorkflowStoreState>((set, get) => ({
  nodes: initialGraph.nodes,
  edges: initialGraph.edges,
  selectedNodeId: null,
  automations: [],
  automationsLoading: false,
  draftAvailable: false,
  lastSavedAt: null,
  validation: initialValidation,
  simulationResult: null,
  sandbox: {
    isOpen: false,
    isLoading: false,
    error: null,
  },

  onNodesChange: (changes) => {
    const nextNodes = applyNodeChanges(changes, get().nodes);
    set((state) => ({
      ...withValidation(nextNodes, state.edges),
      selectedNodeId: nextNodes.some((node) => node.id === state.selectedNodeId) ? state.selectedNodeId : null,
    }));
  },

  onEdgesChange: (changes) => {
    const nextEdges = applyEdgeChanges(changes, get().edges);
    set((state) => withValidation(state.nodes, nextEdges));
  },

  onConnect: (connection) => {
    if (!connection.source || !connection.target || connection.source === connection.target) {
      return;
    }

    const { edges, nodes } = get();
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if (!sourceNode || !targetNode) {
      return;
    }

    if (sourceNode.data.type === 'end' || targetNode.data.type === 'start') {
      return;
    }

    const duplicate = edges.some((edge) => edge.source === connection.source && edge.target === connection.target);

    if (duplicate) {
      return;
    }

    const nextEdges = addEdge(
      {
        ...connection,
        id: createEdgeId(connection.source, connection.target),
        type: 'smoothstep',
        animated: false,
      },
      edges,
    );

    set((state) => withValidation(state.nodes, nextEdges));
  },

  addNode: (type, position) => {
    if (type === 'start' && get().nodes.some((node) => node.data.type === 'start')) {
      return false;
    }

    const nextNode = createWorkflowNode(type, position);
    const nextNodes = [...get().nodes, nextNode];

    set((state) => ({
      ...withValidation(nextNodes, state.edges),
      selectedNodeId: nextNode.id,
    }));

    return true;
  },

  setSelectedNodeId: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  updateNodeData: (nodeId, type, patch) => {
    const nextNodes = get().nodes.map((node) => {
      if (node.id !== nodeId || node.data.type !== type) {
        return node;
      }

      return {
        ...node,
        data: {
          ...node.data,
          ...patch,
        },
      };
    }) as WorkflowNode[];

    set((state) => withValidation(nextNodes, state.edges));
  },

  deleteSelectedNode: () => {
    const { selectedNodeId, nodes, edges } = get();

    if (!selectedNodeId) {
      return;
    }

    const nextNodes = nodes.filter((node) => node.id !== selectedNodeId);
    const nextEdges = edges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId);

    set({
      ...withValidation(nextNodes, nextEdges),
      selectedNodeId: null,
    });
  },

  deleteEdge: (edgeId) => {
    const nextEdges = get().edges.filter((edge) => edge.id !== edgeId);
    set((state) => withValidation(state.nodes, nextEdges));
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      validation: validateWorkflow([], []),
      simulationResult: null,
      sandbox: {
        isOpen: false,
        isLoading: false,
        error: null,
      },
    });
  },

  resetToDemo: () => {
    const graph = createSampleWorkflow();
    set({
      ...withValidation(graph.nodes, graph.edges),
      selectedNodeId: null,
      simulationResult: null,
      sandbox: {
        isOpen: false,
        isLoading: false,
        error: null,
      },
    });
  },

  importWorkflow: (serializedWorkflow) => {
    try {
      const graph = deserializeWorkflow(serializedWorkflow);
      set({
        ...withValidation(graph.nodes, graph.edges),
        selectedNodeId: null,
        simulationResult: null,
        sandbox: {
          isOpen: false,
          isLoading: false,
          error: null,
        },
      });

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to import the workflow JSON.';
      set((state) => ({
        sandbox: {
          ...state.sandbox,
          isOpen: true,
          isLoading: false,
          error: message,
        },
      }));
      return { success: false, error: message };
    }
  },

  setDraftAvailable: (value) => {
    set({ draftAvailable: value });
  },

  setLastSavedAt: (value) => {
    set({ lastSavedAt: value });
  },

  setSandboxError: (message) => {
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        isOpen: message ? true : state.sandbox.isOpen,
        error: message,
        isLoading: false,
      },
    }));
  },

  openSandbox: () => {
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        isOpen: true,
      },
    }));
  },

  closeSandbox: () => {
    set((state) => ({
      sandbox: {
        ...state.sandbox,
        isOpen: false,
      },
    }));
  },

  loadAutomations: async () => {
    set({ automationsLoading: true });

    try {
      const automations = await apiClient.getAutomations();
      set({ automations, automationsLoading: false });
    } catch {
      set({
        automationsLoading: false,
        sandbox: {
          isOpen: true,
          isLoading: false,
          error: 'Failed to load automation actions from the mock API.',
        },
      });
    }
  },

  runSimulation: async () => {
    const { nodes, edges } = get();
    const validation = validateWorkflow(nodes, edges);

    set({
      validation,
      sandbox: {
        isOpen: true,
        isLoading: false,
        error: null,
      },
      simulationResult: null,
    });

    if (!validation.isValid) {
      set((state) => ({
        sandbox: {
          ...state.sandbox,
          error: 'Fix validation issues before running the simulation.',
        },
      }));
      return;
    }

    set((state) => ({
      sandbox: {
        ...state.sandbox,
        isLoading: true,
        error: null,
      },
    }));

    try {
      const simulationResult = await apiClient.simulateWorkflow({
        workflow: serializeWorkflow(nodes, edges),
      });

      set((state) => ({
        simulationResult,
        sandbox: {
          ...state.sandbox,
          isLoading: false,
          error: simulationResult.success ? null : simulationResult.errors[0] ?? 'Simulation failed.',
        },
      }));
    } catch {
      set((state) => ({
        sandbox: {
          ...state.sandbox,
          isLoading: false,
          error: 'Simulation failed due to an unexpected mock API error.',
        },
      }));
    }
  },
}));
