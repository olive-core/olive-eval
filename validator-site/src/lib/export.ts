import type { EvalCase, EvalPrescription, CaseState } from '@/types';

type ExportedCase = {
  id: string;
  last_modified: string | null;
  original_prescription: EvalPrescription;
  validated_prescription: EvalPrescription;
};

export type ExportPayload = {
  exported_at: string;
  reviewer: string;
  summary: { total: number; modified: number };
  cases: ExportedCase[];
};

export function buildExportPayload(
  reviewer: string,
  evalCases: EvalCase[],
  caseStates: Record<string, CaseState>
): ExportPayload {
  const exportedCases: ExportedCase[] = evalCases.map(c => ({
    id: c.id,
    last_modified: caseStates[c.id]?.lastModified ?? null,
    original_prescription: c.expected_prescription,
    validated_prescription: caseStates[c.id]?.prescription ?? c.expected_prescription,
  }));

  const modified = exportedCases.filter(c => c.last_modified !== null).length;

  return {
    exported_at: new Date().toISOString(),
    reviewer,
    summary: { total: evalCases.length, modified },
    cases: exportedCases,
  };
}

export function triggerDownload(reviewer: string, payload: ExportPayload) {
  const date = new Date().toISOString().split('T')[0];
  const safeReviewer = reviewer.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const filename = `olive-eval-${safeReviewer}-${date}.json`;

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
