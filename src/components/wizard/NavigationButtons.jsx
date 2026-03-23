import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

export default function NavigationButtons({ onBack, onNext, isFirst, isLast, loading, isVerified, isEditingVerified }) {
  return (
    <div className="flex items-center justify-between py-4">
      {!isFirst ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
            text-text-secondary hover:text-text hover:bg-surface-hover border border-border
            transition-all duration-200 active:scale-95"
        >
          <ChevronLeft size={16} /> Back
        </button>
      ) : !isVerified && !isEditingVerified ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
            text-text-secondary hover:text-text hover:bg-surface-hover border border-border
            transition-all duration-200 active:scale-95"
        >
          <ChevronLeft size={16} /> Save & Home
        </button>
      ) : (
        <div /> // Spacer to keep Next on the right
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-200 active:scale-95 shadow-md
          ${isLast
            ? 'bg-success text-white hover:bg-success/90 shadow-success/25'
            : 'bg-primary text-white hover:bg-primary-hover shadow-primary/25'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLast ? (
          <><CheckCircle size={16} /> Done</>
        ) : (
          <>Next <ChevronRight size={16} /></>
        )}
      </button>
    </div>
  );
}
