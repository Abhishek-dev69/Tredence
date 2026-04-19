import { useMemo, type ChangeEvent, type ReactNode } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { Icon } from '@/components/common/Icons';
import { useWorkflowStore } from '@/features/workflow/store/workflowStore';
import type {
  ApprovalNodeData,
  AutomationNodeData,
  EndNodeData,
  StartNodeData,
  TaskNodeData,
  WorkflowNode,
} from '@/features/workflow/types/workflow';
import { getNodeTypeLabel } from '@/features/workflow/utils/nodeCatalog';
import { KeyValueEditor } from '@/components/forms/KeyValueEditor';

const approvalRoleOptions = ['Manager', 'HRBP', 'Director', 'IT Admin', 'People Ops'];

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs font-medium text-rose-600">{message}</p>;
}

function FormCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function StartNodeForm({ node }: { node: WorkflowNode & { data: StartNodeData } }) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const titleError = !node.data.startTitle.trim() ? 'Start title is required.' : undefined;

  return (
    <div className="space-y-5">
      <FormCard title="Trigger settings" description="Define how the workflow starts and what context gets attached.">
        <div>
          <label className="field-label">Start Title</label>
          <input
            className="field-input"
            value={node.data.startTitle}
            onChange={(event) => updateNodeData(node.id, 'start', { startTitle: event.target.value })}
            placeholder="Employee created"
          />
          <FieldError message={titleError} />
        </div>
      </FormCard>

      <FormCard title="Metadata" description="Optional key-value details such as source system, region, or policy family.">
        <KeyValueEditor
          label="Metadata"
          items={node.data.metadata}
          addButtonLabel="Add metadata"
          onChange={(metadata) => updateNodeData(node.id, 'start', { metadata })}
        />
      </FormCard>
    </div>
  );
}

function TaskNodeForm({ node }: { node: WorkflowNode & { data: TaskNodeData } }) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const titleError = !node.data.title.trim() ? 'Task title is required.' : undefined;

  return (
    <div className="space-y-5">
      <FormCard title="Task details" description="Configure what needs to happen and who is responsible.">
        <div className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input
              className="field-input"
              value={node.data.title}
              onChange={(event) => updateNodeData(node.id, 'task', { title: event.target.value })}
              placeholder="Collect documents"
            />
            <FieldError message={titleError} />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              className="field-input min-h-[96px] resize-y"
              value={node.data.description}
              onChange={(event) => updateNodeData(node.id, 'task', { description: event.target.value })}
              placeholder="Optional details for the HR operator"
            />
          </div>
        </div>
      </FormCard>

      <FormCard title="Ownership and SLA" description="Assign the task and set a completion target.">
        <div className="space-y-4">
          <div>
            <label className="field-label">Assignee</label>
            <input
              className="field-input"
              value={node.data.assignee}
              onChange={(event) => updateNodeData(node.id, 'task', { assignee: event.target.value })}
              placeholder="HR Ops"
            />
          </div>

          <div>
            <label className="field-label">Due Date</label>
            <input
              type="date"
              className="field-input"
              value={node.data.dueDate}
              onChange={(event) => updateNodeData(node.id, 'task', { dueDate: event.target.value })}
            />
          </div>
        </div>
      </FormCard>

      <FormCard title="Custom fields" description="Capture additional workflow-specific metadata for this task.">
        <KeyValueEditor
          label="Custom Fields"
          items={node.data.customFields}
          addButtonLabel="Add field"
          onChange={(customFields) => updateNodeData(node.id, 'task', { customFields })}
        />
      </FormCard>
    </div>
  );
}

function ApprovalNodeForm({ node }: { node: WorkflowNode & { data: ApprovalNodeData } }) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const handleThresholdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateNodeData(node.id, 'approval', {
      autoApproveThreshold: value === '' ? null : Number(value),
    });
  };

  return (
    <div className="space-y-5">
      <FormCard title="Approval policy" description="Define who reviews the request and when the step can auto-progress.">
        <div className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input
              className="field-input"
              value={node.data.title}
              onChange={(event) => updateNodeData(node.id, 'approval', { title: event.target.value })}
              placeholder="Manager approval"
            />
          </div>

          <div>
            <label className="field-label">Approver Role</label>
            <input
              list="approval-role-options"
              className="field-input"
              value={node.data.approverRole}
              onChange={(event) => updateNodeData(node.id, 'approval', { approverRole: event.target.value })}
              placeholder="Manager"
            />
            <datalist id="approval-role-options">
              {approvalRoleOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="field-label">Auto-Approve Threshold (hours)</label>
            <input
              type="number"
              min="0"
              className="field-input"
              value={node.data.autoApproveThreshold ?? ''}
              onChange={handleThresholdChange}
              placeholder="48"
            />
          </div>
        </div>
      </FormCard>
    </div>
  );
}

function AutomationNodeForm({ node }: { node: WorkflowNode & { data: AutomationNodeData } }) {
  const automations = useWorkflowStore((state) => state.automations);
  const automationsLoading = useWorkflowStore((state) => state.automationsLoading);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const selectedAction = automations.find((item) => item.id === node.data.actionId);
  const actionError = !node.data.actionId ? 'Select an automation action.' : undefined;

  const handleActionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const actionId = event.target.value;
    const automation = automations.find((item) => item.id === actionId);
    const actionParams = (automation?.params ?? []).reduce<Record<string, string>>((accumulator, key) => {
      accumulator[key] = node.data.actionParams[key] ?? '';
      return accumulator;
    }, {});

    updateNodeData(node.id, 'automation', {
      actionId,
      actionParams,
    });
  };

  return (
    <div className="space-y-5">
      <FormCard title="Automation setup" description="Choose the system action and wire up its runtime parameters.">
        <div className="space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input
              className="field-input"
              value={node.data.title}
              onChange={(event) => updateNodeData(node.id, 'automation', { title: event.target.value })}
              placeholder="Send welcome email"
            />
          </div>

          <div>
            <label className="field-label">Action</label>
            <select className="field-input" value={node.data.actionId} onChange={handleActionChange}>
              <option value="">{automationsLoading ? 'Loading actions...' : 'Select an action'}</option>
              {automations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <FieldError message={actionError} />
          </div>
        </div>
      </FormCard>

      {selectedAction ? (
        <FormCard title="Action parameters" description="This schema is coming from the mock automation catalog.">
          <div className="space-y-4">
            {selectedAction.params.map((param) => (
              <div key={param}>
                <label className="field-label">{param}</label>
                <input
                  className="field-input"
                  value={node.data.actionParams[param] ?? ''}
                  onChange={(event) =>
                    updateNodeData(node.id, 'automation', {
                      actionParams: {
                        ...node.data.actionParams,
                        [param]: event.target.value,
                      },
                    })
                  }
                  placeholder={`Enter ${param}`}
                />
              </div>
            ))}
          </div>
        </FormCard>
      ) : null}
    </div>
  );
}

function EndNodeForm({ node }: { node: WorkflowNode & { data: EndNodeData } }) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  return (
    <div className="space-y-5">
      <FormCard title="Completion step" description="Set the final message and configure whether a summary signal should be emitted.">
        <div className="space-y-4">
          <div>
            <label className="field-label">End Message</label>
            <textarea
              className="field-input min-h-[96px] resize-y"
              value={node.data.endMessage}
              onChange={(event) => updateNodeData(node.id, 'end', { endMessage: event.target.value })}
              placeholder="Workflow completed"
            />
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Include Summary Flag</p>
              <p className="mt-1 text-xs text-slate-500">Useful for demoing downstream notifications or audit completion.</p>
            </div>
            <input
              type="checkbox"
              checked={node.data.summaryFlag}
              onChange={(event) => updateNodeData(node.id, 'end', { summaryFlag: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
            />
          </label>
        </div>
      </FormCard>
    </div>
  );
}

function renderForm(node: WorkflowNode) {
  switch (node.data.type) {
    case 'start':
      return <StartNodeForm node={node as WorkflowNode & { data: StartNodeData }} />;
    case 'task':
      return <TaskNodeForm node={node as WorkflowNode & { data: TaskNodeData }} />;
    case 'approval':
      return <ApprovalNodeForm node={node as WorkflowNode & { data: ApprovalNodeData }} />;
    case 'automation':
      return <AutomationNodeForm node={node as WorkflowNode & { data: AutomationNodeData }} />;
    case 'end':
      return <EndNodeForm node={node as WorkflowNode & { data: EndNodeData }} />;
  }
}

export function NodeConfigPanel() {
  const selectedNodeId = useWorkflowStore((state) => state.selectedNodeId);
  const selectedNode = useWorkflowStore((state) => state.nodes.find((node) => node.id === selectedNodeId) ?? null);
  const validationIssues = useWorkflowStore((state) => state.validation.issues);
  const nodeIssues = useMemo(
    () => validationIssues.filter((issue) => issue.nodeId === selectedNodeId),
    [selectedNodeId, validationIssues],
  );

  if (!selectedNode) {
    return (
      <aside className="panel h-full overflow-hidden p-5">
        <div className="border-b border-slate-200 pb-4">
          <p className="text-lg font-semibold text-slate-900">Configuration</p>
          <p className="mt-1 text-sm text-slate-500">Node settings appear here when a block is selected.</p>
        </div>
        <div className="mt-6">
          <EmptyState
            title="No node selected"
            description="Click any block on the canvas to inspect its fields, metadata, and type-specific workflow settings."
            iconName="settings"
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="panel h-full overflow-hidden p-5">
      <div className="sticky top-0 h-full">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <Icon name="settings" className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">Configuration</p>
                <p className="mt-1 text-sm text-slate-500">{getNodeTypeLabel(selectedNode.data.type)}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Inspector
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                Live sync
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">{selectedNode.id}</p>
        </div>

        {nodeIssues.length > 0 ? (
          <div className="mt-4 space-y-2">
            {nodeIssues.map((issue) => (
              <div key={issue.id} className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-700">
                {issue.message}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-5 h-[calc(100%-96px)] overflow-auto pr-1">{renderForm(selectedNode)}</div>
      </div>
    </aside>
  );
}
