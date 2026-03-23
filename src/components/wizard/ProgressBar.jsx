import { useWizard } from '../../context/WizardContext';
import { Check } from 'lucide-react';

const STEP_LABELS = [
  'Demographics', 'Complaint', 'HPC', 'PMH', 'Drugs',
  'Allergies', 'Family', 'Social', 'Systems',
];

export default function ProgressBar({ onStepClick, isClickable }) {
  const { state } = useWizard();
  const { currentStep } = state;
  const totalSteps = 9;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-primary">Step {currentStep} of {totalSteps}</span>
        <span className="text-xs text-text-secondary">{STEP_LABELS[currentStep - 1]}</span>
      </div>
      <div className="relative mt-2">
        <div className="absolute top-3 left-[5.55%] right-[5.55%] h-1.5 bg-border rounded-full -translate-y-1/2" />
        <div className="absolute top-3 left-[5.55%] right-[5.55%] h-1.5 rounded-full -translate-y-1/2 z-0 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative grid grid-cols-9 z-10">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const done = stepNum < currentStep;
            const active = stepNum === currentStep;

            return (
              <div key={label} className="flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(stepNum)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                    ${done ? 'bg-primary text-white' : active ? 'bg-primary text-white scale-110 shadow-md shadow-primary/30' : 'bg-surface-dim border border-border text-text-muted'}
                    ${isClickable ? 'cursor-pointer hover:ring-4 hover:ring-primary/20 active:scale-95' : 'cursor-default'}`}
                >
                  {done ? <Check size={12} strokeWidth={3} /> : stepNum}
                </button>
                <span className={`text-[10px] mt-1 hidden sm:block ${active ? 'text-primary font-medium' : 'text-text-muted'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
