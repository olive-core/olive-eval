import { useState } from 'react';
import { X } from 'lucide-react';
import { SectionShell } from '@/components/shared/SectionShell';
import { useItemEdit } from '@/hooks/useItemEdit';
import { cn } from '@/lib/utils';
import type { EvalMedicine, EvalMedicineRoutine, EvalPrescription, MealTime } from '@/types';

interface MedicineSectionProps {
  prescription: EvalPrescription;
  onChange: (updated: EvalPrescription) => void;
}

const MEAL_SLOTS = [
  { label: 'Morning', before: 'before_breakfast' as MealTime, after: 'after_breakfast' as MealTime },
  { label: 'Lunch',   before: 'before_lunch'     as MealTime, after: 'after_lunch'     as MealTime },
  { label: 'Night',   before: 'before_dinner'    as MealTime, after: 'after_dinner'    as MealTime },
];

type RoutineMode = 'meal' | 'interval' | 'other';

function detectRoutineMode(routine: EvalMedicineRoutine): RoutineMode {
  if (routine.gap_hours) return 'interval';
  if (routine.as_needed || routine.per_day) return 'other';
  return 'meal';
}

function formatRoutineSummary(routine: EvalMedicineRoutine): string {
  const parts: string[] = [];

  if (routine.meal_times && routine.meal_times.length > 0) {
    const counts = MEAL_SLOTS.map(slot => {
      const hasBefore = routine.meal_times!.includes(slot.before);
      const hasAfter  = routine.meal_times!.includes(slot.after);
      return hasBefore ? 'pre' : hasAfter ? 'post' : null;
    });
    const mealStr = counts.map(c => (c ? '1' : '0')).join('+');
    parts.push(mealStr);
  }

  if (routine.gap_hours) parts.push(`Every ${routine.gap_hours}h`);
  if (routine.as_needed)  parts.push(`As needed: ${routine.as_needed}`);
  if (routine.per_day)    parts.push(routine.per_day);

  return parts.length > 0 ? parts.join(' · ') : 'No routine set';
}

function toggleMealTime(times: MealTime[], mealTime: MealTime): MealTime[] {
  return times.includes(mealTime)
    ? times.filter(t => t !== mealTime)
    : [...times, mealTime];
}

const emptyMedicine = (): EvalMedicine => ({
  generic_name: '',
  trade_name: '',
  dosage: '',
  routine: { meal_times: [] },
  duration: '',
  purpose: '',
});

export function MedicineSection({ prescription, onChange }: MedicineSectionProps) {
  const { editingIndex, isNewItem, startEdit, stopEdit } = useItemEdit();
  const items = prescription.medicines;

  const updateItems = (updated: EvalMedicine[]) =>
    onChange({ ...prescription, medicines: updated });

  const handleAdd = () => {
    updateItems([...items, emptyMedicine()]);
    startEdit(items.length, true);
  };

  const handleSave = (index: number, item: EvalMedicine) => {
    if (!item.generic_name.trim() && !item.trade_name.trim()) {
      updateItems(items.filter((_, i) => i !== index));
    } else {
      updateItems(items.map((x, i) => (i === index ? item : x)));
    }
    stopEdit();
  };

  const handleRemove = (index: number) => {
    updateItems(items.filter((_, i) => i !== index));
    stopEdit();
  };

  const handleCancel = (index: number) => {
    if (isNewItem) updateItems(items.filter((_, i) => i !== index));
    stopEdit();
  };

  return (
    <SectionShell title="Medicines (Rx)" onAdd={handleAdd} highlight="medicine">
      {items.map((item, index) =>
        editingIndex === index ? (
          <MedicineEditForm
            key={index}
            item={item}
            onSave={(updated) => handleSave(index, updated)}
            onCancel={() => handleCancel(index)}
            onRemove={() => handleRemove(index)}
          />
        ) : (
          <MedicineViewItem
            key={index}
            item={item}
            onClick={() => startEdit(index)}
            onRemove={() => handleRemove(index)}
          />
        )
      )}
    </SectionShell>
  );
}

function MedicineViewItem({
  item,
  onClick,
  onRemove,
}: {
  item: EvalMedicine;
  onClick: () => void;
  onRemove: () => void;
}) {
  const displayName = item.trade_name || item.generic_name;

  return (
    <div
      className="group flex items-start justify-between px-3 py-2 rounded-lg bg-white/80 border border-amber-100 cursor-pointer hover:border-amber-300 transition-colors"
      onClick={onClick}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-slate-700">{displayName}</span>
          {item.dosage && <span className="text-xs text-slate-500">{item.dosage}</span>}
        </div>
        <span className="text-xs text-slate-400">{formatRoutineSummary(item.routine)}</span>
        {item.duration && <span className="text-xs text-slate-400">{item.duration}</span>}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all flex-shrink-0 mt-0.5"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function MedicineEditForm({
  item,
  onSave,
  onCancel,
  onRemove,
}: {
  item: EvalMedicine;
  onSave: (updated: EvalMedicine) => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const [local, setLocal] = useState(item);
  const [routineMode, setRoutineMode] = useState<RoutineMode>(() => detectRoutineMode(item.routine));

  const activeMealTimes = local.routine.meal_times ?? [];

  const handleMealTimeToggle = (mealTime: MealTime) => {
    setLocal(prev => ({
      ...prev,
      routine: { meal_times: toggleMealTime(prev.routine.meal_times ?? [], mealTime) },
    }));
  };

  const handleRoutineModeChange = (mode: RoutineMode) => {
    setRoutineMode(mode);
    if (mode === 'meal')     setLocal(prev => ({ ...prev, routine: { meal_times: [] } }));
    if (mode === 'interval') setLocal(prev => ({ ...prev, routine: { gap_hours: undefined } }));
    if (mode === 'other')    setLocal(prev => ({ ...prev, routine: { as_needed: '' } }));
  };

  const otherRoutineText = local.routine.as_needed ?? local.routine.per_day ?? '';

  return (
    <div className="flex flex-col gap-3 p-3 border-2 border-amber-400 rounded-lg bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trade Name</label>
          <input
            autoFocus
            className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={local.trade_name}
            placeholder="e.g. Sergel 40"
            onChange={(e) => setLocal({ ...local, trade_name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Generic Name</label>
          <input
            className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={local.generic_name}
            placeholder="e.g. Esomeprazole 40mg"
            onChange={(e) => setLocal({ ...local, generic_name: e.target.value })}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Routine</label>
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            {(['meal', 'interval', 'other'] as RoutineMode[]).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => handleRoutineModeChange(mode)}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-bold rounded-md transition-all capitalize',
                  routineMode === mode
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {routineMode === 'meal' && (
          <div className="flex items-center gap-4">
            {MEAL_SLOTS.map(slot => (
              <MealSlotToggle
                key={slot.label}
                label={slot.label}
                slot={slot}
                activeTimes={activeMealTimes}
                onToggle={handleMealTimeToggle}
              />
            ))}
          </div>
        )}

        {routineMode === 'interval' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Every</span>
            <input
              type="number"
              className="w-20 h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 text-center"
              value={local.routine.gap_hours ?? ''}
              onChange={(e) =>
                setLocal(prev => ({ ...prev, routine: { gap_hours: parseInt(e.target.value) || undefined } }))
              }
            />
            <span className="text-sm text-slate-600">hours</span>
          </div>
        )}

        {routineMode === 'other' && (
          <input
            className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={otherRoutineText}
            placeholder="e.g. As needed for pain, or Once daily IV"
            onChange={(e) =>
              setLocal(prev => ({ ...prev, routine: { as_needed: e.target.value } }))
            }
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dosage</label>
          <input
            className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={local.dosage}
            placeholder="e.g. 1 tablet"
            onChange={(e) => setLocal({ ...local, dosage: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</label>
          <input
            className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            value={local.duration}
            placeholder="e.g. 4 weeks"
            onChange={(e) => setLocal({ ...local, duration: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Purpose</label>
        <input
          className="mt-1 w-full h-9 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
          value={local.purpose}
          placeholder="e.g. Acid suppression"
          onChange={(e) => setLocal({ ...local, purpose: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-2">
        <button
          onClick={onRemove}
          className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
        >
          Remove
        </button>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(local)}
            className="text-xs font-bold px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function MealSlotToggle({
  label,
  slot,
  activeTimes,
  onToggle,
}: {
  label: string;
  slot: { before: MealTime; after: MealTime };
  activeTimes: MealTime[];
  onToggle: (mealTime: MealTime) => void;
}) {
  const hasBefore = activeTimes.includes(slot.before);
  const hasAfter  = activeTimes.includes(slot.after);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
      <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
        <button
          type="button"
          onClick={() => onToggle(slot.before)}
          className={cn(
            'px-2.5 py-1 text-[9px] font-black rounded-md transition-all',
            hasBefore ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          PRE
        </button>
        <span className="text-slate-300 text-xs px-0.5">|</span>
        <button
          type="button"
          onClick={() => onToggle(slot.after)}
          className={cn(
            'px-2.5 py-1 text-[9px] font-black rounded-md transition-all',
            hasAfter ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
          )}
        >
          POST
        </button>
      </div>
    </div>
  );
}
