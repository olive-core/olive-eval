import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EvalPrescription, CaseState } from '@/types';
import { allCases } from '@/data/cases';
import { buildExportPayload, triggerDownload } from '@/lib/export';

type StoreState = {
  reviewer: string | null;
  caseCount: number;
  currentIndex: number;
  completed: boolean;
  cases: Record<string, CaseState>;
};

type StoreActions = {
  beginReview: (name: string, caseCount: number) => void;
  goToCase: (index: number) => void;
  setCompleted: () => void;
  updatePrescription: (caseId: string, prescription: EvalPrescription) => void;
  exportAll: () => void;
};

function resolvedCaseState(caseId: string, cases: Record<string, CaseState>): CaseState {
  if (cases[caseId]) return cases[caseId];
  const evalCase = allCases.find(c => c.id === caseId)!;
  return { prescription: evalCase.expected_prescription, lastModified: null };
}

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      reviewer: null,
      caseCount: allCases.length,
      currentIndex: 0,
      completed: false,
      cases: {},

      beginReview: (name, caseCount) => set({
        reviewer: name,
        caseCount,
        currentIndex: 0,
        completed: false,
      }),

      goToCase: (index) => set({ currentIndex: index }),

      setCompleted: () => set({ completed: true }),

      updatePrescription: (caseId, prescription) => {
        const existing = resolvedCaseState(caseId, get().cases);
        set(state => ({
          cases: {
            ...state.cases,
            [caseId]: { ...existing, prescription, lastModified: new Date().toISOString() },
          },
        }));
      },

      exportAll: () => {
        const { reviewer, caseCount, cases } = get();
        if (!reviewer) return;
        const payload = buildExportPayload(reviewer, allCases.slice(0, caseCount), cases);
        triggerDownload(reviewer, payload);
      },
    }),
    { name: 'olive-eval-store' }
  )
);
