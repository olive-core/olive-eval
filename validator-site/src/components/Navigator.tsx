import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useStore } from '@/store';
import { allCases } from '@/data/cases';

export function Navigator() {
  const { currentIndex, caseCount, reviewer, goToCase, setCompleted, exportAll } = useStore();
  const activeCases = allCases.slice(0, caseCount);
  const currentCase = activeCases[currentIndex];
  const { age, sex } = currentCase.parameters;
  const isLast = currentIndex === activeCases.length - 1;

  const handleNext = () => {
    if (isLast) setCompleted();
    else goToCase(currentIndex + 1);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center gap-3 flex-shrink-0 flex-wrap">
      <button
        onClick={() => goToCase(currentIndex - 1)}
        disabled={currentIndex === 0}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="size-4" /> Prev
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">
          Case {currentIndex + 1} / {activeCases.length}
        </span>
        <span className="text-slate-300">·</span>
        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
          {age}y {sex}
        </span>
      </div>

      <button
        onClick={handleNext}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        {isLast ? 'Finish' : 'Next'} <ChevronRight className="size-4" />
      </button>

      <button
        onClick={exportAll}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
      >
        <Download className="size-3" /> Export All
      </button>

      <span className="text-xs font-medium text-slate-400 flex-shrink-0 hidden sm:block">
        {reviewer}
      </span>
    </div>
  );
}
