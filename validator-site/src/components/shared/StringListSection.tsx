import { useState } from 'react';
import { X } from 'lucide-react';
import { SectionShell } from './SectionShell';
import { useItemEdit } from '@/hooks/useItemEdit';

interface StringListSectionProps {
  title: string;
  items: string[];
  onItemsChange: (updated: string[]) => void;
  placeholder?: string;
}

export function StringListSection({ title, items, onItemsChange, placeholder }: StringListSectionProps) {
  const { editingIndex, isNewItem, startEdit, stopEdit } = useItemEdit();

  const handleAdd = () => {
    onItemsChange([...items, '']);
    startEdit(items.length, true);
  };

  const handleSave = (index: number, value: string) => {
    if (!value.trim()) {
      onItemsChange(items.filter((_, i) => i !== index));
    } else {
      onItemsChange(items.map((x, i) => (i === index ? value.trim() : x)));
    }
    stopEdit();
  };

  const handleRemove = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
    stopEdit();
  };

  const handleCancel = (index: number) => {
    if (isNewItem) onItemsChange(items.filter((_, i) => i !== index));
    stopEdit();
  };

  return (
    <SectionShell title={title} onAdd={handleAdd}>
      {items.map((item, index) =>
        editingIndex === index ? (
          <StringEditForm
            key={index}
            value={item}
            placeholder={placeholder}
            onSave={(val) => handleSave(index, val)}
            onCancel={() => handleCancel(index)}
            onRemove={() => handleRemove(index)}
          />
        ) : (
          <StringViewItem
            key={index}
            value={item}
            onClick={() => startEdit(index)}
            onRemove={() => handleRemove(index)}
          />
        )
      )}
    </SectionShell>
  );
}

function StringViewItem({
  value,
  onClick,
  onRemove,
}: {
  value: string;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="group flex items-start justify-between px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
      onClick={onClick}
    >
      <span className="text-sm text-slate-700 flex-1 leading-relaxed">{value}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all flex-shrink-0 mt-0.5"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function StringEditForm({
  value,
  placeholder,
  onSave,
  onCancel,
  onRemove,
}: {
  value: string;
  placeholder?: string;
  onSave: (val: string) => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const [local, setLocal] = useState(value);

  return (
    <div className="flex flex-col gap-3 p-3 border-2 border-emerald-500 rounded-lg bg-white shadow-sm">
      <textarea
        autoFocus
        rows={2}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
      />
      <div className="flex items-center justify-between">
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
