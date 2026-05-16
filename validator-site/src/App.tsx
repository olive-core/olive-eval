import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@/store';
import { allCases } from '@/data/cases';
import { ReviewerSetup } from '@/components/ReviewerSetup';
import { CompletionScreen } from '@/components/CompletionScreen';
import { Navigator } from '@/components/Navigator';
import { ConversationPanel } from '@/components/ConversationPanel';
import { PrescriptionEditor } from '@/components/PrescriptionEditor';
import { cn } from '@/lib/utils';

const MIN_PANEL_WIDTH = 240;
const MAX_PANEL_WIDTH = 600;
const DEFAULT_PANEL_WIDTH = 380;

type MobileTab = 'conversation' | 'prescription';

export function App() {
  const reviewer = useStore(s => s.reviewer);
  const caseCount = useStore(s => s.caseCount);
  const completed = useStore(s => s.completed);
  const currentIndex = useStore(s => s.currentIndex);
  const goToCase = useStore(s => s.goToCase);
  const activeCases = allCases.slice(0, caseCount);
  const currentCase = activeCases[currentIndex];

  const [mobileTab, setMobileTab] = useState<MobileTab>('prescription');
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const startDrag = useCallback(() => {
    isDragging.current = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const newWidth = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, e.clientX - containerLeft));
      setPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (!reviewer) return <ReviewerSetup />;
  if (completed) return <CompletionScreen />;

  if (!currentCase) {
    goToCase(0);
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Navigator />

      {/* Mobile tab bar */}
      <div className="flex md:hidden border-b border-slate-200 bg-white flex-shrink-0">
        <MobileTabButton
          label="Conversation"
          active={mobileTab === 'conversation'}
          onClick={() => setMobileTab('conversation')}
        />
        <MobileTabButton
          label="Prescription"
          active={mobileTab === 'prescription'}
          onClick={() => setMobileTab('prescription')}
        />
      </div>

      {/* Mobile: single panel */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        {mobileTab === 'conversation' ? (
          <div className="flex-1 bg-white flex flex-col overflow-hidden">
            <ConversationPanel evalCase={currentCase} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <PrescriptionEditor key={currentCase.id} />
          </div>
        )}
      </div>

      {/* Desktop: side-by-side with draggable divider */}
      <div className="hidden md:flex flex-1 overflow-hidden" ref={containerRef}>
        <div
          style={{ width: panelWidth }}
          className="flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden"
        >
          <ConversationPanel evalCase={currentCase} />
        </div>

        <div
          onMouseDown={startDrag}
          className="w-1.5 flex-shrink-0 bg-slate-200 hover:bg-emerald-400 active:bg-emerald-500 cursor-col-resize transition-colors"
        />

        <div className="flex-1 overflow-y-auto">
          <PrescriptionEditor key={currentCase.id} />
        </div>
      </div>
    </div>
  );
}

function MobileTabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 py-2.5 text-sm font-bold transition-colors border-b-2',
        active
          ? 'text-emerald-600 border-emerald-500'
          : 'text-slate-400 border-transparent hover:text-slate-600'
      )}
    >
      {label}
    </button>
  );
}
