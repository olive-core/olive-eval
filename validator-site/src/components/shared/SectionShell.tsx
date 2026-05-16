import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type HighlightVariant = 'diagnosis' | 'medicine' | false;

interface SectionShellProps {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
  highlight?: HighlightVariant;
}

const CONTAINER_CLASS: Record<string, string> = {
  diagnosis: 'bg-emerald-50/40 border-2 border-emerald-500',
  medicine:  'bg-amber-50/40 border-2 border-amber-400',
  default:   'border border-slate-100 bg-white',
};

const TITLE_CLASS: Record<string, string> = {
  diagnosis: 'text-emerald-700',
  medicine:  'text-amber-700',
  default:   'text-slate-500',
};

const ADD_BUTTON_CLASS: Record<string, string> = {
  diagnosis: 'text-emerald-600 hover:text-emerald-700',
  medicine:  'text-amber-600 hover:text-amber-700',
  default:   'text-emerald-600 hover:text-emerald-700',
};

export function SectionShell({ title, onAdd, children, highlight = false }: SectionShellProps) {
  const variant = highlight || 'default';

  return (
    <div className={cn('flex flex-col gap-2 p-3 rounded-xl', CONTAINER_CLASS[variant])}>
      <div className="flex items-center justify-between">
        <h3 className={cn('text-xs font-bold uppercase tracking-widest', TITLE_CLASS[variant])}>
          {title}
        </h3>
        <button
          onClick={onAdd}
          className={cn(
            'flex items-center gap-1 text-xs font-bold transition-colors',
            ADD_BUTTON_CLASS[variant]
          )}
        >
          <PlusCircle className="size-3" />
          ADD
        </button>
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}
