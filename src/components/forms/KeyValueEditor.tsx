import type { KeyValuePair } from '@/features/workflow/types/workflow';
import { createEmptyKeyValuePair } from '@/features/workflow/utils/nodeCatalog';
import { Button } from '@/components/common/Button';

interface KeyValueEditorProps {
  label: string;
  items: KeyValuePair[];
  addButtonLabel: string;
  onChange: (nextItems: KeyValuePair[]) => void;
}

export function KeyValueEditor({ label, items, addButtonLabel, onChange }: KeyValueEditorProps) {
  const updateItem = (id: string, field: 'key' | 'value', value: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const addItem = () => {
    onChange([...items, createEmptyKeyValuePair()]);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="field-label mb-0">{label}</label>
        <Button type="button" variant="ghost" className="px-3 py-1.5 text-xs" onClick={addItem}>
          {addButtonLabel}
        </Button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
            No entries added yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Key</label>
                  <input
                    className="field-input"
                    value={item.key}
                    onChange={(event) => updateItem(item.id, 'key', event.target.value)}
                    placeholder="department"
                  />
                </div>
                <div>
                  <label className="field-label">Value</label>
                  <input
                    className="field-input"
                    value={item.value}
                    onChange={(event) => updateItem(item.id, 'value', event.target.value)}
                    placeholder="Finance"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="mt-3 text-xs font-semibold text-rose-600 transition hover:text-rose-700"
              >
                Remove row
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
