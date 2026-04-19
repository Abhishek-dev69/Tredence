import { useEffect, useRef } from 'react';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';
import { serializeWorkflow } from '@/features/workflow/serializers/workflowSerializer';
import { loadWorkflowDraft, saveWorkflowDraft } from '@/services/api/workflowDraftStorage';

export function useWorkflowPersistence() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const importWorkflow = useWorkflowStore((state) => state.importWorkflow);
  const setDraftAvailable = useWorkflowStore((state) => state.setDraftAvailable);
  const setLastSavedAt = useWorkflowStore((state) => state.setLastSavedAt);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    const draft = loadWorkflowDraft();

    if (!draft) {
      setDraftAvailable(false);
      hasHydratedRef.current = true;
      return;
    }

    setDraftAvailable(true);
    setLastSavedAt(draft.savedAt);
    const result = importWorkflow(draft.workflow);
    if (result.success) {
      setLastSavedAt(draft.savedAt);
    }
    hasHydratedRef.current = true;
  }, [importWorkflow, setDraftAvailable, setLastSavedAt]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    if (nodes.length === 0 && edges.length === 0) {
      return;
    }

    const savedAt = saveWorkflowDraft(serializeWorkflow(nodes, edges));
    setDraftAvailable(true);
    setLastSavedAt(savedAt);
  }, [edges, nodes, setDraftAvailable, setLastSavedAt]);
}
