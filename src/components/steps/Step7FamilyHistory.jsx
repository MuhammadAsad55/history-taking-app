import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { FAMILY_RELATIVES, MEDICAL_CONDITIONS } from '../../data/conditions';
import { Plus } from 'lucide-react';
import FormSection from '../ui/FormSection';
import RadioGroup from '../ui/RadioGroup';
import SelectDropdown from '../ui/SelectDropdown';
import TextInput from '../ui/TextInput';
import NumberInput from '../ui/NumberInput';
import AddEntryList from '../ui/AddEntryList';

const EMPTY_ENTRY = { relative: '', relativeText: '', condition: '', conditionText: '', ageOfOnset: '', deceased: '', ageAtDeath: '' };

export default function Step7FamilyHistory({ errors, onRegisterBeforeNext }) {
  const { state, setField } = useWizard();
  const d = state.data;
  const [draft, setDraft] = useState({ ...EMPTY_ENTRY });

  // Register beforeNext check
  useEffect(() => {
    if (onRegisterBeforeNext) {
      onRegisterBeforeNext(() => {
        const isPartiallyFilled = draft.relative || draft.condition;
        const hasAnyEntries = d.familyEntries?.length > 0;
        return { shouldWarn: isPartiallyFilled && hasAnyEntries };
      });
    }
  }, [draft, d.familyEntries, onRegisterBeforeNext]);
  const [draftErrors, setDraftErrors] = useState({});

  const addEntry = () => {
    const e = {};
    const rel = draft.relative === 'Other' ? draft.relativeText : draft.relative;
    if (!rel) e.relative = 'Relative is required';
    const cond = draft.condition === 'Other' ? draft.conditionText : draft.condition;
    if (!cond) e.condition = 'Condition is required';
    if (!draft.deceased) e.deceased = 'Deceased status is required';
    if (Object.keys(e).length > 0) { setDraftErrors(e); return; }

    const entry = {
      relative: rel,
      condition: cond,
      ageOfOnset: draft.ageOfOnset || 'Unknown',
      deceased: draft.deceased,
      ageAtDeath: draft.deceased === 'Yes' ? draft.ageAtDeath : 'N/A',
    };
    setField('familyEntries', [...(d.familyEntries || []), entry]);
    setDraft({ ...EMPTY_ENTRY });
    setDraftErrors({});
  };

  return (
    <div className="space-y-6">
      <FormSection title="Family History">
        <RadioGroup
          options={['Yes', 'No', 'Unknown']}
          value={d.hasFamilyHistory}
          onChange={v => setField('hasFamilyHistory', v)}
          error={errors.hasFamilyHistory}
          required
        />
        {d.hasFamilyHistory === 'Yes' && (
          <div className="space-y-4 animate-fade-in">
            <AddEntryList
              entries={d.familyEntries}
              onRemove={idx => setField('familyEntries', d.familyEntries.filter((_, i) => i !== idx))}
              renderLabel={e => `${e.relative}: ${e.condition}${e.deceased === 'Yes' ? ' (deceased)' : ''}`}
            />
            {errors.entries && <p className="text-danger text-xs">{errors.entries}</p>}

            <div className="space-y-3 p-4 rounded-xl bg-surface-dim border border-border">
              <p className="text-sm font-medium text-text-secondary">Add Family Member</p>
              <SelectDropdown label="Relative" options={FAMILY_RELATIVES} value={draft.relative} onChange={v => setDraft({ ...draft, relative: v })} error={draftErrors.relative} required />
              {draft.relative === 'Other' && (
                <TextInput value={draft.relativeText} onChange={v => setDraft({ ...draft, relativeText: v })} placeholder="Specify relative" />
              )}
              <SelectDropdown label="Condition" options={MEDICAL_CONDITIONS} value={draft.condition} onChange={v => setDraft({ ...draft, condition: v })} error={draftErrors.condition} required />
              {draft.condition === 'Other' && (
                <TextInput value={draft.conditionText} onChange={v => setDraft({ ...draft, conditionText: v })} placeholder="Specify condition" />
              )}
              <NumberInput label="Age of Onset (optional)" value={draft.ageOfOnset} onChange={v => setDraft({ ...draft, ageOfOnset: v })} min={0} />
              <RadioGroup
                label="Deceased"
                options={['Yes', 'No']}
                value={draft.deceased}
                onChange={v => setDraft({ ...draft, deceased: v })}
                error={draftErrors.deceased}
                required
              />
              {draft.deceased === 'Yes' && (
                <NumberInput label="Age at Death (optional)" value={draft.ageAtDeath} onChange={v => setDraft({ ...draft, ageAtDeath: v })} error={draftErrors.ageAtDeath} min={0} />
              )}
              <button type="button" onClick={addEntry}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                <Plus size={16} /> Add Entry
              </button>
            </div>
          </div>
        )}
      </FormSection>
    </div>
  );
}
