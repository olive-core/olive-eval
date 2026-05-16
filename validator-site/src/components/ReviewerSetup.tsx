import { useState } from 'react';
import { useStore } from '@/store';
import { allCases } from '@/data/cases';

const STEPS = [
  'Read the conversation between doctor and patient on the left.',
  'Review the prescription on the right.',
  'Edit any field that is wrong, missing, or imprecise.',
  'Click Next to move to the next case — repeat for all cases.',
  'Click Export All when done to download your validated results.',
];

export function ReviewerSetup() {
  const [name, setName] = useState('');
  const [caseCount, setCaseCount] = useState(allCases.length);
  const beginReview = useStore(s => s.beginReview);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) beginReview(name.trim(), caseCount);
  };

  const handleCaseCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(allCases.length, parseInt(e.target.value) || 1));
    setCaseCount(val);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-sm">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Olive Eval Validator</h1>
          <p className="text-sm text-slate-500 mt-1">Validate prescriptions against consultations.</p>
        </div>

        <ol className="mb-6 flex flex-col gap-2">
          {STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            className="h-10 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="Your name (e.g. Dr. Rahim)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">
              Number of cases to review (max {allCases.length})
            </label>
            <input
              type="number"
              min={1}
              max={allCases.length}
              className="h-10 w-full px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={caseCount}
              onChange={handleCaseCountChange}
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="h-10 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Begin Review
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-4">
          Progress saves automatically in this browser.
        </p>
      </div>
    </div>
  );
}
