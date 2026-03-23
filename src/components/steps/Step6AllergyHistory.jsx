import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { ALLERGY_TYPES, ALLERGY_REACTIONS, ALLERGY_SEVERITIES } from '../../data/conditions';
import { Plus } from 'lucide-react';
import FormSection from '../ui/FormSection';
import RadioGroup from '../ui/RadioGroup';
import SelectDropdown from '../ui/SelectDropdown';
import TextInput from '../ui/TextInput';
import AddEntryList from '../ui/AddEntryList';

const EMPTY_ALLERGY = { allergen: '', type: '', typeText: '', reaction: '', reactionText: '', severity: '' };

export default function Step6AllergyHistory({ errors, onRegisterBeforeNext }) {
  const { state, setField } = useWizard();
  const d = state.data;
  const [draft, setDraft] = useState({ ...EMPTY_ALLERGY });

  // Register beforeNext check
  useEffect(() => {
    if (onRegisterBeforeNext) {
      onRegisterBeforeNext(() => {
        const isPartiallyFilled = draft.allergen || draft.reaction;
        const hasAnyEntries = d.allergyEntries?.length > 0;
        return { shouldWarn: isPartiallyFilled && hasAnyEntries };
      });
    }
  }, [draft, d.allergyEntries, onRegisterBeforeNext]);
  const [draftErrors, setDraftErrors] = useState({});

  const addAllergy = () => {
    const e = {};
    if (!draft.allergen?.trim()) e.allergen = 'Allergen is required';
    const type = draft.type === 'Other' ? draft.typeText : draft.type;
    if (!type) e.type = 'Type is required';
    const reaction = draft.reaction === 'Other' ? draft.reactionText : draft.reaction;
    if (!reaction) e.reaction = 'Reaction is required';
    if (!draft.severity) e.severity = 'Severity is required';
    if (Object.keys(e).length > 0) { setDraftErrors(e); return; }

    const entry = {
      allergen: draft.allergen,
      type: draft.type === 'Other' ? draft.typeText : draft.type,
      reaction: draft.reaction === 'Other' ? draft.reactionText : draft.reaction,
      severity: draft.severity,
    };
    setField('allergyEntries', [...(d.allergyEntries || []), entry]);
    setDraft({ ...EMPTY_ALLERGY });
    setDraftErrors({});
  };

  return (
    <div className="space-y-6">
      <FormSection title="Allergy History">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.hasAllergies}
          onChange={v => setField('hasAllergies', v)}
          error={errors.hasAllergies}
          required
        />
        {d.hasAllergies === 'Yes' && (
          <div className="space-y-4 animate-fade-in">
            <AddEntryList
              entries={d.allergyEntries}
              onRemove={idx => setField('allergyEntries', d.allergyEntries.filter((_, i) => i !== idx))}
              renderLabel={e => `${e.allergen} — ${e.reaction} — ${e.severity}`}
            />
            {errors.entries && <p className="text-danger text-xs">{errors.entries}</p>}

            <div className="space-y-3 p-4 rounded-xl bg-surface-dim border border-border">
              <p className="text-sm font-medium text-text-secondary">Add Allergy</p>
              <TextInput label="Allergen" value={draft.allergen} onChange={v => setDraft({ ...draft, allergen: v })} error={draftErrors.allergen} placeholder="e.g. Penicillin" required />
              <SelectDropdown label="Type" options={ALLERGY_TYPES} value={draft.type} onChange={v => setDraft({ ...draft, type: v })} error={draftErrors.type} required />
              {draft.type === 'Other' && (
                <TextInput value={draft.typeText} onChange={v => setDraft({ ...draft, typeText: v })} placeholder="Specify type" />
              )}
              <SelectDropdown label="Reaction" options={ALLERGY_REACTIONS} value={draft.reaction} onChange={v => setDraft({ ...draft, reaction: v })} error={draftErrors.reaction} required />
              {draft.reaction === 'Other' && (
                <TextInput value={draft.reactionText} onChange={v => setDraft({ ...draft, reactionText: v })} placeholder="Specify reaction" />
              )}
              <RadioGroup
                label="Severity"
                options={ALLERGY_SEVERITIES}
                value={draft.severity}
                onChange={v => setDraft({ ...draft, severity: v })}
                error={draftErrors.severity}
                required
              />
              <button type="button" onClick={addAllergy}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                <Plus size={16} /> Add Allergy
              </button>
            </div>
          </div>
        )}
      </FormSection>
    </div>
  );
}
