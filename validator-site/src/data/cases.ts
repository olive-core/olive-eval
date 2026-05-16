import type { EvalCase } from '@/types';

const modules = import.meta.glob('../../../samples/case_*.json', { eager: true });

export const allCases: EvalCase[] = Object.entries(modules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, mod]) => {
    const m = mod as { default?: EvalCase } | EvalCase;
    return ('default' in m ? m.default : m) as EvalCase;
  });
