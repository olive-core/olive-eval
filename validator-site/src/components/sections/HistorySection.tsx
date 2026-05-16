import { StringListSection } from '@/components/shared/StringListSection';
import type { EvalPrescription } from '@/types';

interface HistorySectionProps {
  prescription: EvalPrescription;
  onChange: (updated: EvalPrescription) => void;
}

export function HistorySection({ prescription, onChange }: HistorySectionProps) {
  return (
    <StringListSection
      title="History"
      items={prescription.history}
      onItemsChange={(history) => onChange({ ...prescription, history })}
      placeholder="e.g. Hypertension for 5 years"
    />
  );
}
