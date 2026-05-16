export type MealTime =
  | 'before_breakfast'
  | 'after_breakfast'
  | 'before_lunch'
  | 'after_lunch'
  | 'before_dinner'
  | 'after_dinner';

export type EvalChiefComplaint = {
  complaint: string;
  duration: string;
  timing?: string;
};

export type EvalDiagnosis = {
  diagnosis_name: string;
  icd_code: string;
  confidence: number;
  reasoning: string;
};

export type EvalMedicineRoutine = {
  meal_times?: MealTime[];
  gap_hours?: number;
  as_needed?: string;
  per_day?: string;
};

export type EvalMedicine = {
  generic_name: string;
  trade_name: string;
  dosage: string;
  routine: EvalMedicineRoutine;
  duration: string;
  purpose: string;
};

export type EvalInvestigation = {
  investigation_name: string;
  reasoning?: string;
};

export type EvalPrescription = {
  chief_complaints: EvalChiefComplaint[];
  history: string[];
  summary: string;
  diagnoses: EvalDiagnosis[];
  medicines: EvalMedicine[];
  investigations: EvalInvestigation[];
  advice: string[];
};

export type EvalCaseParameters = {
  category: string;
  age: number;
  sex: string;
  visit_type?: string;
  setting?: string;
  occupation?: string;
  language_mix?: string;
  pre_visit_action?: string;
  companion?: string;
  length?: string;
  articulation?: string;
  specific_concern?: string;
  education?: string;
};

export type EvalCase = {
  id: string;
  description: string;
  parameters: EvalCaseParameters;
  conversation: string;
  expected_prescription: EvalPrescription;
};

export type CaseState = {
  prescription: EvalPrescription;
  lastModified: string | null;
};
