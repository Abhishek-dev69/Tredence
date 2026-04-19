import { useEffect } from 'react';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';

export function useWorkflowInitialization() {
  const loadAutomations = useWorkflowStore((state) => state.loadAutomations);

  useEffect(() => {
    void loadAutomations();
  }, [loadAutomations]);
}
