import { ReactFlowProvider } from '@xyflow/react';
import { AppShell } from '@/components/layout/AppShell';
import { useWorkflowInitialization } from '@/features/workflow/hooks/useWorkflowInitialization';
import { useWorkflowPersistence } from '@/features/workflow/hooks/useWorkflowPersistence';

export default function App() {
  useWorkflowInitialization();
  useWorkflowPersistence();

  return (
    <ReactFlowProvider>
      <AppShell />
    </ReactFlowProvider>
  );
}
