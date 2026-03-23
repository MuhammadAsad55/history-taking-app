import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { DRUG_CATEGORIES, ALL_DRUGS, DOSE_UNITS, FREQUENCIES, ROUTES, DRUG_TYPES } from '../../data/drugs';
import { Plus } from 'lucide-react';
import FormSection from '../ui/FormSection';
import RadioGroup from '../ui/RadioGroup';
import SelectDropdown from '../ui/SelectDropdown';
import TextInput from '../ui/TextInput';
import NumberInput from '../ui/NumberInput';
import AddEntryList from '../ui/AddEntryList';

const EMPTY_DRUG = { medication: '', medicationText: '', type: '', dose: '', doseUnit: '', amountFrequency: '', frequency: '', frequencyText: '', route: '', routeText: '', adherence: '' };

export default function Step5DrugHistory({ errors, onRegisterBeforeNext }) {
  const { state, setField } = useWizard();
  const d = state.data;
  const [draft, setDraft] = useState({ ...EMPTY_DRUG });

  // Register beforeNext check
  useEffect(() => {
    if (onRegisterBeforeNext) {
      onRegisterBeforeNext(() => {
        const isPartiallyFilled = draft.medication || draft.type || draft.dose;
        const hasAnyEntries = d.drugEntries?.length > 0;
        return { shouldWarn: isPartiallyFilled && hasAnyEntries };
      });
    }
  }, [draft, d.drugEntries, onRegisterBeforeNext]);
  const [draftErrors, setDraftErrors] = useState({});

  const validateDraft = () => {
    const e = {};
    const med = draft.medication === 'Other' ? draft.medicationText : draft.medication;
    if (!med?.trim()) e.medication = 'Medication is required';
    
    if (!draft.type) e.type = 'Type is required';
    if (draft.type === 'Recreational') {
      if (!draft.amountFrequency?.trim()) e.amountFrequency = 'Amount/ Frequency is required';
    } else {
      if (!draft.dose && draft.dose !== 0) e.dose = 'Dose is required';
      if (!draft.doseUnit) e.doseUnit = 'Unit is required';
    }
    const freq = draft.frequency === 'Other' ? draft.frequencyText : draft.frequency;
    if (draft.type !== 'Recreational' && !freq) e.frequency = 'Frequency is required';
    const route = draft.route === 'Other' ? draft.routeText : draft.route;
    if (!route) e.route = 'Route is required';
    if (draft.type === 'Prescription' && !draft.adherence) e.adherence = 'Adherence is required';
    return e;
  };

  const addDrug = () => {
    const e = validateDraft();
    if (Object.keys(e).length > 0) { setDraftErrors(e); return; }
    const entry = {
      medication: draft.medication === 'Other' ? draft.medicationText : draft.medication,
      type: draft.type,
      dose: draft.type === 'Recreational' ? draft.amountFrequency : `${draft.dose} ${draft.doseUnit}`,
      frequency: draft.type === 'Recreational' ? 'N/A' : (draft.frequency === 'Other' ? draft.frequencyText : draft.frequency),
      route: draft.route === 'Other' ? draft.routeText : draft.route,
      adherence: draft.type === 'Prescription' ? draft.adherence : 'N/A',
    };
    setField('drugEntries', [...(d.drugEntries || []), entry]);
    setDraft({ ...EMPTY_DRUG });
    setDraftErrors({});
  };

  return (
    <div className="space-y-6">
      <FormSection title="Drug History" description="Current medications and recreational drugs">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.hasDrugs}
          onChange={v => setField('hasDrugs', v)}
          error={errors.hasDrugs}
          required
        />
        {d.hasDrugs === 'Yes' && (
          <div className="space-y-4 animate-fade-in">
            <AddEntryList
              entries={d.drugEntries}
              onRemove={idx => setField('drugEntries', d.drugEntries.filter((_, i) => i !== idx))}
              renderLabel={e => `${e.medication} ${e.dose} ${e.type === 'Recreational' ? '' : e.frequency} (${e.route})`}
            />
            {errors.entries && <p className="text-danger text-xs">{errors.entries}</p>}

            <div className="space-y-3 p-4 rounded-xl bg-surface-dim border border-border">
              <p className="text-sm font-medium text-text-secondary">Add Medication</p>

              <SelectDropdown
                options={[
                  ...Object.entries(DRUG_CATEGORIES).map(([group, options]) => ({ group, options })),
                  'Other'
                ]}
                value={draft.medication}
                onChange={v => setDraft({ ...draft, medication: v })}
                placeholder="Select medication..."
                error={draftErrors.medication}
              />
              {draft.medication === 'Other' && (
                <TextInput value={draft.medicationText} onChange={v => setDraft({ ...draft, medicationText: v })} placeholder="Medication name" />
              )}

              <RadioGroup
                label="Type"
                options={DRUG_TYPES}
                value={draft.type}
                onChange={v => setDraft({ ...draft, type: v })}
                error={draftErrors.type}
                required
              />

              {draft.type === 'Recreational' ? (
                <TextInput label="Amount/ Frequency" value={draft.amountFrequency} onChange={v => setDraft({ ...draft, amountFrequency: v })} error={draftErrors.amountFrequency} placeholder="e.g. 1g once a week" required />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput label="Dose" value={draft.dose} onChange={v => setDraft({ ...draft, dose: v })} error={draftErrors.dose} min={0} required />
                  <SelectDropdown label="Unit" options={DOSE_UNITS} value={draft.doseUnit} onChange={v => setDraft({ ...draft, doseUnit: v })} error={draftErrors.doseUnit} required />
                </div>
              )}

              {draft.type !== 'Recreational' && (
                <>
                  <SelectDropdown label="Frequency" options={FREQUENCIES} value={draft.frequency} onChange={v => setDraft({ ...draft, frequency: v })} error={draftErrors.frequency} required />
                  {draft.frequency === 'Other' && (
                    <TextInput value={draft.frequencyText} onChange={v => setDraft({ ...draft, frequencyText: v })} placeholder="Specify frequency" />
                  )}
                </>
              )}

              <SelectDropdown label="Route" options={ROUTES} value={draft.route} onChange={v => setDraft({ ...draft, route: v })} error={draftErrors.route} required />
              {draft.route === 'Other' && (
                <TextInput value={draft.routeText} onChange={v => setDraft({ ...draft, routeText: v })} placeholder="Specify route" />
              )}

              {draft.type === 'Prescription' && (
                <RadioGroup
                  label="Adherence"
                  options={['Yes', 'No', 'Sometimes']}
                  value={draft.adherence}
                  onChange={v => setDraft({ ...draft, adherence: v })}
                  error={draftErrors.adherence}
                  required
                />
              )}

              <button type="button" onClick={addDrug}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                <Plus size={16} /> Add Medication
              </button>
            </div>
          </div>
        )}
      </FormSection>
    </div>
  );
}
