import { useState, useEffect, useRef } from 'react';
import { useWizard } from '../../context/WizardContext';
import { validateStep, hasErrors } from '../../utils/validation';
import ProgressBar from './ProgressBar';
import NavigationButtons from './NavigationButtons';
import AutoSaveIndicator from './AutoSaveIndicator';
import ThemeToggle from '../ui/ThemeToggle';
import Modal from '../ui/Modal';
import Step1Demographics from '../steps/Step1Demographics';
import Step2PresentingComplaint from '../steps/Step2PresentingComplaint';
import Step3HPC from '../steps/Step3HPC';
import Step4PMH from '../steps/Step4PMH';
import Step5DrugHistory from '../steps/Step5DrugHistory';
import Step6AllergyHistory from '../steps/Step6AllergyHistory';
import Step7FamilyHistory from '../steps/Step7FamilyHistory';
import Step8SocialHistory from '../steps/Step8SocialHistory';
import Step9SystemsReview from '../steps/Step9SystemsReview';

const STEPS = [
  Step1Demographics, Step2PresentingComplaint, Step3HPC, Step4PMH,
  Step5DrugHistory, Step6AllergyHistory, Step7FamilyHistory, Step8SocialHistory, Step9SystemsReview,
];

function getStepData(step, data) {
  switch (step) {
    case 1: return { name: data.name, dob: data.dob, gender: data.gender, wardName: data.wardName, bedNumber: data.bedNumber };
    case 2: return { presentingComplaint: data.presentingComplaint };
    case 3: return { site: data.site, onset: data.onset, character: data.character, radiation: data.radiation, alleviating: data.alleviating, timing: data.timing, exacerbating: data.exacerbating, severity: data.severity };
    case 4: return { gender: data.gender, medicalConditions: data.medicalConditions, surgicalHistory: data.surgicalHistory, hospitalisations: data.hospitalisations, psychiatricHistory: data.psychiatricHistory, obsGynae: data.obsGynae, };
    case 5: return { hasDrugs: data.hasDrugs, entries: data.drugEntries };
    case 6: return { hasAllergies: data.hasAllergies, entries: data.allergyEntries };
    case 7: return { hasFamilyHistory: data.hasFamilyHistory, entries: data.familyEntries };
    case 8: return data;
    case 9: return { systemsReview: data.systemsReview, systemsReviewOther: data.systemsReviewOther };
    default: return data;
  }
}

export default function WizardShell() {
  const { state, dispatch } = useWizard();
  const { currentStep, data } = state;
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const beforeNextRef = useRef(null);

  const StepComponent = STEPS[currentStep - 1];

  const isEditingVerified = state.isEditingVerified;

  // Registry for steps to intercept "Next"
  const registerBeforeNext = (fn) => {
    beforeNextRef.current = fn;
  };

  // Reset interceptor on step change
  useEffect(() => {
    beforeNextRef.current = null;
  }, [currentStep]);

  const proceedNext = () => {
    setShowConfirm(false);
    if (currentStep === 9) {
      dispatch({ type: 'VERIFY' });
    } else {
      dispatch({ type: 'SET_STEP', step: currentStep + 1 });
    }
  };

  const handleNext = () => {
    const stepData = getStepData(currentStep, data);
    const stepErrors = validateStep(currentStep, stepData);
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    // Check if step component wants to intercept
    if (beforeNextRef.current) {
      const { shouldWarn } = beforeNextRef.current();
      if (shouldWarn) {
        setShowConfirm(true);
        return;
      }
    }

    proceedNext();
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep === 1) {
      dispatch({ type: 'SET_VIEW', view: 'home' });
    } else {
      dispatch({ type: 'SET_STEP', step: currentStep - 1 });
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-surface-dim">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <h1 className="text-lg font-bold text-text">History Taking App</h1>
            <div className="flex items-center gap-3">
              <AutoSaveIndicator />
              <ThemeToggle />
            </div>
          </div>
          <ProgressBar
            isClickable={!!state.verifiedAt}
            onStepClick={(s) => dispatch({ type: 'SET_STEP', step: s })}
          />
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full px-4 py-6 animate-fade-in" key={currentStep}>
          <StepComponent errors={errors} onRegisterBeforeNext={registerBeforeNext} />
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Unadded Content"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-2.5 px-4 rounded-xl font-medium border border-border bg-surface text-text hover:bg-surface-hover transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={proceedNext}
              className="flex-1 py-2.5 px-4 rounded-xl font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Proceed Anyway
            </button>
          </div>
        }
      >
        <p className="text-text-secondary leading-relaxed">
          You have entered information in a field but haven't clicked <strong>"Add"</strong>.
          Do you want to proceed without including this item?
        </p>
      </Modal>

      {/* Navigation */}
      <footer className="sticky bottom-0 bg-surface border-t border-border">
        <div className="max-w-2xl mx-auto w-full px-4">
          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            isFirst={currentStep === 1}
            isLast={currentStep === 9}
            isVerified={!!state.verifiedAt}
            isEditingVerified={isEditingVerified}
          />
        </div>
      </footer>
    </div>
  );
}
