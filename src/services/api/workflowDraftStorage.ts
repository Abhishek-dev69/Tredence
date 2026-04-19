import type { SerializedWorkflowGraph } from '@/features/workflow/types/api';

const STORAGE_KEY = 'hr-workflow-designer:draft';

interface PersistedWorkflowDraft {
  savedAt: number;
  workflow: SerializedWorkflowGraph;
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function saveWorkflowDraft(workflow: SerializedWorkflowGraph) {
  if (!isBrowser()) {
    return null;
  }

  const payload: PersistedWorkflowDraft = {
    savedAt: Date.now(),
    workflow,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload.savedAt;
}

export function loadWorkflowDraft(): PersistedWorkflowDraft | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedWorkflowDraft;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearWorkflowDraft() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasWorkflowDraft() {
  return loadWorkflowDraft() !== null;
}
