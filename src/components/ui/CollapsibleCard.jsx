import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function CollapsibleCard({ title, children, badge }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-text">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-xs font-medium">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
