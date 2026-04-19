import type {
  AutomationAction,
  SimulateWorkflowRequest,
  SimulateWorkflowResponse,
} from '@/features/workflow/types/api';
import { mockWorkflowApi } from '@/services/mocks/mockWorkflowApi';

export const apiClient = {
  getAutomations(): Promise<AutomationAction[]> {
    return mockWorkflowApi.getAutomations();
  },
  simulateWorkflow(request: SimulateWorkflowRequest): Promise<SimulateWorkflowResponse> {
    return mockWorkflowApi.simulateWorkflow(request);
  },
};
