import { useStore } from '@/store';
import { allCases } from '@/data/cases';
import type { EvalPrescription } from '@/types';
import { SummarySection } from './sections/SummarySection';
import { ChiefComplaintsSection } from './sections/ChiefComplaintsSection';
import { HistorySection } from './sections/HistorySection';
import { DiagnosisSection } from './sections/DiagnosisSection';
import { MedicineSection } from './sections/MedicineSection';
import { InvestigationSection } from './sections/InvestigationSection';
import { AdviceSection } from './sections/AdviceSection';

export function PrescriptionEditor() {
  const { currentIndex, cases, updatePrescription } = useStore();
  const currentCase = allCases[currentIndex];
  const prescription = cases[currentCase.id]?.prescription ?? currentCase.expected_prescription;

  const handleChange = (updated: EvalPrescription) => {
    updatePrescription(currentCase.id, updated);
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-3xl">
      <ChiefComplaintsSection prescription={prescription} onChange={handleChange} />
      <HistorySection prescription={prescription} onChange={handleChange} />
      <DiagnosisSection prescription={prescription} onChange={handleChange} />
      <MedicineSection prescription={prescription} onChange={handleChange} />
      <InvestigationSection prescription={prescription} onChange={handleChange} />
      <AdviceSection prescription={prescription} onChange={handleChange} />
      <SummarySection prescription={prescription} onChange={handleChange} />
    </div>
  );
}
