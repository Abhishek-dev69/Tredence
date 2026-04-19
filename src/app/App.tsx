import { ReactFlowProvider } from '@xyflow/react';
import { AppShell } from '@/components/layout/AppShell';
import { useWorkflowInitialization } from '@/features/workflow/hooks/useWorkflowInitialization';

export default function App() {
  useWorkflowInitialization();

  return (
    <ReactFlowProvider>
      <AppShell />
    </ReactFlowProvider>
  );
}
