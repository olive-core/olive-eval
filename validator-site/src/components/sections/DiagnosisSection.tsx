import { useState } from 'react';
import { X } from 'lucide-react';
import { SectionShell } from '@/components/shared/SectionShell';
import { useItemEdit } from '@/hooks/useItemEdit';
import type { EvalDiagnosis, EvalPrescription } from '@/types';

interface DiagnosisSectionProps {
  prescription: EvalPrescription;
  onChange: (updated: EvalPrescription) => void;
}

const emptyDiagnosis = (): EvalDiagnosis => ({
  diagnosis_name: '',
  icd_code: '',
  confidence: 80,
  reasoning: '',
});

export function DiagnosisSection({ prescription, onChange }: DiagnosisSectionProps) {
  const { editingIndex, isNewItem, startEdit, stopEdit } = useItemEdit();
  const items = prescription.diagnoses;

  const updateItems = (updated: EvalDiagnosis[]) =>
    onChange({ ...prescription, diagnoses: updated });

  const handleAdd = () => {
    updateItems([...items, emptyDiagnosis()]);
    startEdit(items.length, true);
  };

  const handleSave = (index: number, item: EvalDiagnosis) => {
    if (!item.diagnosis_name.trim()) {
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
    <SectionShell title="Diagnoses" onAdd={handleAdd} highlight="diagnosis">
      {items.map((item, index) =>
        editingIndex === index ? (
          <DiagnosisEditForm
            key={index}
            item={item}
            onSave={(updated) => handleSave(index, updated)}
            onCancel={() => handleCancel(index)}
            onRemove={() => handleRemove(index)}
          />
        ) : (
          <DiagnosisViewItem
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

function DiagnosisViewItem({
  item,
  onClick,
  onRemove,
}: {
  item: EvalDiagnosis;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="group flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/80 border border-emerald-100 cursor-pointer hover:border-emerald-300 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="font-medium text-slate-700 truncate">{item.diagnosis_name}</span>
        {item.icd_code && (
          <span className="text-xs text-slate-400 font-mono flex-shrink-0">{item.icd_code}</span>
        )}
        {item.confidence > 0 && (
          <span className="text-xs font-bold text-emerald-600 flex-shrink-0">{item.confidence}%</span>
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

function DiagnosisEditForm({
  item,
  onSave,
  onCancel,
  onRemove,
}: {
  item: EvalDiagnosis;
  onSave: (updated: EvalDiagnosis) => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const [local, setLocal] = useState(item);

  return (
    <div className="flex flex-col gap-3 p-3 border-2 border-emerald-500 rounded-lg bg-white shadow-sm">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Diagnosis</label>
          <input
            autoFocus
            className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            value={local.diagnosis_name}
            placeholder="e.g. Acid Peptic Disease"
            onChange={(e) => setLocal({ ...local, diagnosis_name: e.target.value })}
          />
        </div>
        <div className="w-28">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ICD Code</label>
          <input
            className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 font-mono"
            value={local.icd_code}
            placeholder="K21.9"
            onChange={(e) => setLocal({ ...local, icd_code: e.target.value })}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Confidence
          </label>
          <span className="text-xs font-bold text-emerald-600">{local.confidence}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={local.confidence}
          onChange={(e) => setLocal({ ...local, confidence: parseInt(e.target.value) })}
          className="w-full accent-emerald-500"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reasoning</label>
        <textarea
          rows={2}
          className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
          value={local.reasoning}
          placeholder="Clinical reasoning..."
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
