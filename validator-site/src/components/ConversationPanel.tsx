import type { EvalCase } from '@/types';
import { cn } from '@/lib/utils';

type Speaker = 'doctor' | 'patient' | 'other';

type ParsedLine = {
  speaker: Speaker;
  text: string;
};

function parseConversationLine(line: string): ParsedLine {
  if (line.startsWith('ডাক্তার:')) return { speaker: 'doctor', text: line.replace('ডাক্তার:', '').trim() };
  if (line.startsWith('রোগী:')) return { speaker: 'patient', text: line.replace('রোগী:', '').trim() };
  return { speaker: 'other', text: line };
}

const SPEAKER_LABEL: Record<Speaker, string> = {
  doctor: 'Doctor',
  patient: 'Patient',
  other: '',
};

const BUBBLE_CLASS: Record<Speaker, string> = {
  doctor: 'bg-blue-50 border-blue-100 ml-2',
  patient: 'bg-slate-50 border-slate-100 mr-2',
  other: 'bg-transparent border-transparent text-slate-400 text-xs italic',
};

const LABEL_CLASS: Record<Speaker, string> = {
  doctor: 'text-blue-500',
  patient: 'text-slate-400',
  other: '',
};

interface ConversationPanelProps {
  evalCase: EvalCase;
}

export function ConversationPanel({ evalCase }: ConversationPanelProps) {
  const lines = evalCase.conversation
    .split('\n')
    .filter(line => line.trim())
    .map(parseConversationLine);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Conversation</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {evalCase.description}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {lines.map((line, index) => (
          <div
            key={index}
            className={cn('rounded-lg border px-3 py-2 text-sm', BUBBLE_CLASS[line.speaker])}
          >
            {line.speaker !== 'other' && (
              <span className={cn('text-[10px] font-bold uppercase tracking-widest block mb-0.5', LABEL_CLASS[line.speaker])}>
                {SPEAKER_LABEL[line.speaker]}
              </span>
            )}
            <span className="text-slate-800 leading-relaxed">{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
