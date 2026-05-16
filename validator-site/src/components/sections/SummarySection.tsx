import { useState } from 'react';
import type { EvalPrescription } from '@/types';

interface SummarySectionProps {
  prescription: EvalPrescription;
  onChange: (updated: EvalPrescription) => void;
}

export function SummarySection({ prescription, onChange }: SummarySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(prescription.summary);

  const handleSave = () => {
    onChange({ ...prescription, summary: draft.trim() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(prescription.summary);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Summary</h3>
        {!isEditing && (
          <button
            onClick={() => { setDraft(prescription.summary); setIsEditing(true); }}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            EDIT
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-xs font-bold px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <p
          className="text-sm text-slate-700 leading-relaxed cursor-pointer hover:text-slate-900 transition-colors"
          onClick={() => { setDraft(prescription.summary); setIsEditing(true); }}
        >
          {prescription.summary || <span className="text-slate-400 italic">No summary</span>}
        </p>
      )}
    </div>
  );
}
