import { useState } from 'react';
import { X } from 'lucide-react';
import { SectionShell } from '@/components/shared/SectionShell';
import { useItemEdit } from '@/hooks/useItemEdit';
import type { EvalInvestigation, EvalPrescription } from '@/types';

interface InvestigationSectionProps {
  prescription: EvalPrescription;
  onChange: (updated: EvalPrescription) => void;
}

const emptyInvestigation = (): EvalInvestigation => ({ investigation_name: '', reasoning: '' });

export function InvestigationSection({ prescription, onChange }: InvestigationSectionProps) {
  const { editingIndex, isNewItem, startEdit, stopEdit } = useItemEdit();
  const items = prescription.investigations;

  const updateItems = (updated: EvalInvestigation[]) =>
    onChange({ ...prescription, investigations: updated });

  const handleAdd = () => {
    updateItems([...items, emptyInvestigation()]);
    startEdit(items.length, true);
  };

  const handleSave = (index: number, item: EvalInvestigation) => {
    if (!item.investigation_name.trim()) {
      updateItems(items.filter((_, i) => i !== index));
    } else {
      updateItems(items.map((x, i) => (i === index ? item : x)));
    }
    stopEdit();
  };

  const handleRemove = (index: number) => {
    updateItems(items.filter((_, i) => i !== index));
    stopEdit();
  };

  const handleCancel = (index: number) => {
    if (isNewItem) updateItems(items.filter((_, i) => i !== index));
    stopEdit();
  };

  return (
    <SectionShell title="Investigations" onAdd={handleAdd}>
      {items.map((item, index) =>
        editingIndex === index ? (
          <InvestigationEditForm
            key={index}
            item={item}
            onSave={(updated) => handleSave(index, updated)}
            onCancel={() => handleCancel(index)}
            onRemove={() => handleRemove(index)}
          />
        ) : (
          <InvestigationViewItem
            key={index}
            item={item}
            onClick={() => startEdit(index)}
            onRemove={() => handleRemove(index)}
          />
        )
      )}
    </SectionShell>
  );
}

function InvestigationViewItem({
  item,
  onClick,
  onRemove,
}: {
  item: EvalInvestigation;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="group flex items-start justify-between px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
      onClick={onClick}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-slate-700">{item.investigation_name}</span>
        {item.reasoning && (
          <span className="text-xs text-slate-400 leading-relaxed">{item.reasoning}</span>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all flex-shrink-0 mt-0.5"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function InvestigationEditForm({
  item,
  onSave,
  onCancel,
  onRemove,
}: {
  item: EvalInvestigation;
  onSave: (updated: EvalInvestigation) => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const [local, setLocal] = useState(item);

  return (
    <div className="flex flex-col gap-3 p-3 border-2 border-emerald-500 rounded-lg bg-white shadow-sm">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Investigation</label>
        <input
          autoFocus
          className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={local.investigation_name}
          placeholder="e.g. Upper GI Endoscopy"
          onChange={(e) => setLocal({ ...local, investigation_name: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && onSave(local)}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reasoning</label>
        <textarea
          rows={2}
          className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
          value={local.reasoning ?? ''}
          placeholder="Why this investigation is needed..."
          onChange={(e) => setLocal({ ...local, reasoning: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
        <button
          onClick={onRemove}
          className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
        >
          Remove
        </button>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(local)}
            className="text-xs font-bold px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
