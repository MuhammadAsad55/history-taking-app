import { X } from 'lucide-react';

export default function AddEntryList({ entries, onRemove, renderLabel, emptyText = 'No entries added' }) {
  if (!entries || entries.length === 0) {
    return <p className="text-sm text-text-muted italic">{emptyText}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-surface text-text text-base font-medium
            border border-border shadow-sm animate-fade-in"
        >
          <span className="truncate pr-4">{renderLabel ? renderLabel(entry) : entry}</span>
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger-light transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
