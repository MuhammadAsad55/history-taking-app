import { useWizard } from '../../context/WizardContext';
import { SYSTEMS_REVIEW } from '../../data/systemsReview';
import CollapsibleCard from '../ui/CollapsibleCard';
import TextInput from '../ui/TextInput';

export default function Step9SystemsReview() {
  const { state, setField } = useWizard();
  const d = state.data;
  const gender = d.gender;
  const sr = d.systemsReview || {};

  const toggleSymptom = (systemId, symptom) => {
    const system = sr[systemId] || { symptoms: [], other: '' };
    const symptoms = system.symptoms.includes(symptom)
      ? system.symptoms.filter(s => s !== symptom)
      : [...system.symptoms, symptom];
    setField('systemsReview', { ...sr, [systemId]: { ...system, symptoms } });
  };

  const setSystemOther = (systemId, text) => {
    const system = sr[systemId] || { symptoms: [], other: '' };
    setField('systemsReview', { ...sr, [systemId]: { ...system, other: text } });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-text">Systems Review</h2>
        <p className="text-sm text-text-secondary mt-1">Expand each system and check any relevant symptoms</p>
      </div>

      {SYSTEMS_REVIEW.map(system => {
        const allSymptoms = [
          ...system.symptoms,
          ...(gender === 'Male' && system.maleOnly ? system.maleOnly : []),
          ...(gender === 'Female' && system.femaleOnly ? system.femaleOnly : []),
        ];
        const checked = sr[system.id]?.symptoms || [];
        const badge = checked.length > 0 ? `${checked.length}` : null;

        return (
          <CollapsibleCard key={system.id} title={system.name} badge={badge}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allSymptoms.map(symptom => (
                  <label key={symptom} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm
                    ${checked.includes(symptom) ? 'bg-primary-light border border-primary/30 text-primary font-medium' : 'bg-surface-dim border border-transparent hover:border-border text-text'}`}>
                    <input
                      type="checkbox"
                      checked={checked.includes(symptom)}
                      onChange={() => toggleSymptom(system.id, symptom)}
                      className="sr-only"
                    />
                    <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
                      ${checked.includes(symptom) ? 'bg-primary border-primary' : 'border-text-muted'}`}>
                      {checked.includes(symptom) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {symptom}
                  </label>
                ))}
              </div>
              <TextInput
                value={sr[system.id]?.other || ''}
                onChange={v => setSystemOther(system.id, v)}
                placeholder="Other symptoms for this system..."
              />
            </div>
          </CollapsibleCard>
        );
      })}

      {/* Global Other */}
      <div className="pt-4 border-t border-border">
        <TextInput
          label="Other (not covered above)"
          value={d.systemsReviewOther}
          onChange={v => setField('systemsReviewOther', v)}
          placeholder="Any other symptoms not fitting the above categories..."
          multiline
        />
      </div>
    </div>
  );
}
