import { Download } from 'lucide-react';
import { useStore } from '@/store';

export function CompletionScreen() {
  const { caseCount, exportAll } = useStore();

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-6 text-center px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900">All done!</h1>
          <p className="text-sm text-slate-500">
            You've reviewed {caseCount} prescription{caseCount !== 1 ? 's' : ''}. Export your results below.
          </p>
        </div>
        <button
          onClick={exportAll}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Download className="size-4" /> Export All Results
        </button>
      </div>
    </div>
  );
}
