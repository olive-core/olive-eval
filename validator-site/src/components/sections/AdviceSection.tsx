import { StringListSection } from '@/components/shared/StringListSection';
import type { EvalPrescription } from '@/types';

interface AdviceSectionProps {
  prescription: EvalPrescription;
  onChange: (updated: EvalPrescription) => void;
}

export function AdviceSection({ prescription, onChange }: AdviceSectionProps) {
  return (
    <StringListSection
      title="Advice"
      items={prescription.advice}
      onItemsChange={(advice) => onChange({ ...prescription, advice })}
      placeholder="e.g. Maintain fixed meal timing"
    />
  );
}
