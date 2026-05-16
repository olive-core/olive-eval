import { useState } from 'react';
import { X } from 'lucide-react';
import { SectionShell } from '@/components/shared/SectionShell';
import { useItemEdit } from '@/hooks/useItemEdit';
import type { EvalChiefComplaint, EvalPrescription } from '@/types';

interface ChiefComplaintsSectionProps {
  prescription: EvalPrescription;
  onChange: (updated: EvalPrescription) => void;
}

const emptyComplaint = (): EvalChiefComplaint => ({ complaint: '', duration: '' });

export function ChiefComplaintsSection({ prescription, onChange }: ChiefComplaintsSectionProps) {
  const { editingIndex, isNewItem, startEdit, stopEdit } = useItemEdit();
  const items = prescription.chief_complaints;

  const updateItems = (updated: EvalChiefComplaint[]) =>
    onChange({ ...prescription, chief_complaints: updated });

  const handleAdd = () => {
    updateItems([...items, emptyComplaint()]);
    startEdit(items.length, true);
  };

  const handleSave = (index: number, item: EvalChiefComplaint) => {
    if (!item.complaint.trim()) {
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
    <SectionShell title="Chief Complaints" onAdd={handleAdd}>
      {items.map((item, index) =>
        editingIndex === index ? (
          <ComplaintEditForm
            key={index}
            item={item}
            onSave={(updated) => handleSave(index, updated)}
            onCancel={() => handleCancel(index)}
            onRemove={() => handleRemove(index)}
          />
        ) : (
          <ComplaintViewItem
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

function ComplaintViewItem({
  item,
  onClick,
  onRemove,
}: {
  item: EvalChiefComplaint;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="group flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="font-medium text-slate-700 truncate">{item.complaint}</span>
        {item.duration && (
          <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">— {item.duration}</span>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all flex-shrink-0"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function ComplaintEditForm({
  item,
  onSave,
  onCancel,
  onRemove,
}: {
  item: EvalChiefComplaint;
  onSave: (updated: EvalChiefComplaint) => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const [local, setLocal] = useState(item);

  return (
    <div className="flex flex-col gap-3 p-3 border-2 border-emerald-500 rounded-lg bg-white shadow-sm">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Complaint</label>
          <input
            autoFocus
            className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            value={local.complaint}
            placeholder="e.g. Epigastric burning"
            onChange={(e) => setLocal({ ...local, complaint: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSave(local)}
          />
        </div>
        <div className="w-1/3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</label>
          <input
            className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            value={local.duration}
            placeholder="e.g. 2 weeks"
            onChange={(e) => setLocal({ ...local, duration: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSave(local)}
          />
        </div>
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
