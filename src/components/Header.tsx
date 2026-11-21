import React from 'react';
import { Plus, RotateCcw } from 'lucide-react';

export type Section = 'plano' | 'metas';

interface HeaderProps {
  section: Section;
  onSectionChange: (section: Section) => void;
  onOpenCreateModal: () => void;
  onResetSamples: () => void;
}

const NAV: { id: Section; label: string }[] = [
  { id: 'plano', label: 'Plano DPE-AM' },
  { id: 'metas', label: 'Minhas metas' },
];

export const Header: React.FC<HeaderProps> = ({ section, onSectionChange, onOpenCreateModal, onResetSamples }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
        <h1 className="font-display text-2xl text-stone-900">
          Study<span className="text-sage-600">Flow</span>
        </h1>

        <nav className="flex gap-1 rounded-full border border-stone-200/80 bg-white/70 p-1" aria-label="Seções">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              aria-current={section === item.id ? 'page' : undefined}
              className={
                'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer sm:px-4 sm:text-sm ' +
                (section === item.id ? 'bg-sage-700 text-white' : 'text-stone-600 hover:text-stone-900')
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden min-w-[150px] justify-end gap-2 sm:flex">
          {section === 'metas' && (
            <>
              <button
                type="button"
                onClick={onResetSamples}
                title="Restaurar objetivos de exemplo"
                aria-label="Restaurar objetivos de exemplo"
                className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-sage-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sage-800 cursor-pointer"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Nova meta
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
