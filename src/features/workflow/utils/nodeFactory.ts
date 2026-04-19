import type { XYPosition } from '@xyflow/react';
import type { WorkflowGraphSnapshot, WorkflowNode, WorkflowNodeType } from '@/features/workflow/types/workflow';
import { createDefaultNodeData } from '@/features/workflow/utils/nodeCatalog';

function createId(prefix: string) {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.round(Math.random() * 10000)}`;
}

export function createWorkflowNode(type: WorkflowNodeType, position: XYPosition): WorkflowNode {
  return {
    id: createId(type),
    type,
    position,
    data: createDefaultNodeData(type),
  } as WorkflowNode;
}

export function createEdgeId(source: string, target: string) {
  return `edge-${source}-${target}`;
}

export function createSampleWorkflow(): WorkflowGraphSnapshot {
  const start: WorkflowNode = {
    id: 'start-1',
    type: 'start',
    position: { x: 50, y: 120 },
    data: {
      type: 'start',
      startTitle: 'Onboarding initiated',
      metadata: [
        { id: 'meta-1', key: 'source', value: 'HRIS' },
        { id: 'meta-2', key: 'region', value: 'India' },
      ],
    },
  };

  const task: WorkflowNode = {
    id: 'task-1',
    type: 'task',
    position: { x: 300, y: 120 },
    data: {
      type: 'task',
      title: 'Collect Documents',
      description: 'Gather employee ID proof and signed policy pack.',
      assignee: 'HR Ops',
      dueDate: '2026-04-24',
      customFields: [{ id: 'field-1', key: 'channel', value: 'Employee Portal' }],
    },
  };

  const approval: WorkflowNode = {
    id: 'approval-1',
    type: 'approval',
    position: { x: 570, y: 120 },
    data: {
      type: 'approval',
      title: 'Manager Approval',
      approverRole: 'Manager',
      autoApproveThreshold: 48,
    },
  };

  const automation: WorkflowNode = {
    id: 'automation-1',
    type: 'automation',
    position: { x: 840, y: 120 },
    data: {
      type: 'automation',
      title: 'Send Welcome Email',
      actionId: 'send_email',
      actionParams: {
        to: 'new.joiner@company.com',
        subject: 'Welcome to the organization',
      },
    },
  };

  const end: WorkflowNode = {
    id: 'end-1',
    type: 'end',
    position: { x: 1110, y: 120 },
    data: {
      type: 'end',
      endMessage: 'Onboarding workflow completed',
      summaryFlag: true,
    },
  };

  return {
    nodes: [start, task, approval, automation, end],
    edges: [
      { id: createEdgeId(start.id, task.id), source: start.id, target: task.id },
      { id: createEdgeId(task.id, approval.id), source: task.id, target: approval.id },
      { id: createEdgeId(approval.id, automation.id), source: approval.id, target: automation.id },
      { id: createEdgeId(automation.id, end.id), source: automation.id, target: end.id },
    ],
  };
}
