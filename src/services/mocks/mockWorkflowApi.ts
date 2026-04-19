import type {
  AutomationAction,
  SimulateWorkflowRequest,
  SimulateWorkflowResponse,
} from '@/features/workflow/types/api';
import type { SerializedWorkflowNode } from '@/features/workflow/types/api';
import { traverseWorkflow } from '@/features/workflow/utils/graph';
import { mockAutomations } from '@/services/mocks/automationData';

const NETWORK_DELAY_MS = 500;
const SIMULATION_DELAY_MS = 900;

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function formatSimulationStep(node: SerializedWorkflowNode, automations: AutomationAction[]) {
  switch (node.data.type) {
    case 'start':
      return 'Workflow started';
    case 'task':
      return `Task: ${node.data.title} assigned to ${node.data.assignee || 'Unassigned'}`;
    case 'approval':
      return `Approval: ${node.data.approverRole || 'Approver'} approval requested`;
    case 'automation': {
      const action = automations.find((item) => item.id === node.data.actionId);
      return `Automation: ${(action?.label ?? node.data.actionId) || 'Unknown action'} executed`;
    }
    case 'end':
      return 'Workflow completed';
  }
}

export const mockWorkflowApi = {
  async getAutomations(): Promise<AutomationAction[]> {
    await delay(NETWORK_DELAY_MS);
    return mockAutomations;
  },

  async simulateWorkflow(request: SimulateWorkflowRequest): Promise<SimulateWorkflowResponse> {
    await delay(SIMULATION_DELAY_MS);

    const startNode = request.workflow.nodes.find((node) => node.type === 'start');

    if (!startNode) {
      return {
        success: false,
        steps: [],
        errors: ['Simulation failed because no Start node was found.'],
      };
    }

    const nodeLookup = new Map(request.workflow.nodes.map((node) => [node.id, node]));
    const orderedIds = traverseWorkflow(startNode.id, request.workflow.edges);
    const steps = orderedIds
      .map((nodeId) => nodeLookup.get(nodeId))
      .filter((node): node is SerializedWorkflowNode => Boolean(node))
      .map((node) => formatSimulationStep(node, mockAutomations));

    return {
      success: true,
      steps,
      errors: [],
    };
  },
};
