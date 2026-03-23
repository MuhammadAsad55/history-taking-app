import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { LIVING_SITUATIONS } from '../../data/conditions';
import { Plus } from 'lucide-react';
import FormSection from '../ui/FormSection';
import RadioGroup from '../ui/RadioGroup';
import SelectDropdown from '../ui/SelectDropdown';
import TextInput from '../ui/TextInput';
import MonthYearPicker from '../ui/MonthYearPicker';
import AddEntryList from '../ui/AddEntryList';

export default function Step8SocialHistory({ errors, onRegisterBeforeNext }) {
  const { state, setField } = useWizard();
  const d = state.data;
  const [travelDraft, setTravelDraft] = useState({ where: '', when: '', duration: '' });

  // Register beforeNext check
  useEffect(() => {
    if (onRegisterBeforeNext) {
      onRegisterBeforeNext(() => {
        const isPartiallyFilled = travelDraft.where || travelDraft.when;
        const hasAnyEntries = d.travelEntries?.length > 0;
        return { shouldWarn: isPartiallyFilled && hasAnyEntries };
      });
    }
  }, [travelDraft, d.travelEntries, onRegisterBeforeNext]);

  const addTravel = () => {
    if (!travelDraft.where?.trim() || !travelDraft.when || !travelDraft.duration?.trim()) return;
    setField('travelEntries', [...(d.travelEntries || []), { ...travelDraft }]);
    setTravelDraft({ where: '', when: '', duration: '' });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-text">Social History</h2>

      {/* Smoking */}
      <FormSection title="Smoking">
        <RadioGroup
          options={['Yes', 'No', 'Ex-Smoker']}
          value={d.smoker}
          onChange={v => setField('smoker', v)}
          error={errors.smoker}
          required
        />
        {(d.smoker === 'Yes' || d.smoker === 'Ex-Smoker') && (
          <div className="space-y-3 animate-fade-in">
            <MonthYearPicker label="Since" value={d.smokerSince} onChange={v => setField('smokerSince', v)} error={errors.smokerSince} required />
            {d.smoker === 'Ex-Smoker' && (
              <MonthYearPicker label="Till" value={d.smokerTill} onChange={v => setField('smokerTill', v)} error={errors.smokerTill} required />
            )}
            {d.smoker === 'Yes' && (
              <TextInput label="Frequency" value={d.smokerFrequency} onChange={v => setField('smokerFrequency', v)} error={errors.smokerFrequency} placeholder="e.g. 10/day" required />
            )}
          </div>
        )}
      </FormSection>

      {/* Alcohol */}
      <FormSection title="Alcohol">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.alcohol}
          onChange={v => setField('alcohol', v)}
          error={errors.alcohol}
          required
        />
        {d.alcohol === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <MonthYearPicker label="Since" value={d.alcoholSince} onChange={v => setField('alcoholSince', v)} error={errors.alcoholSince} required />
            <TextInput label="Frequency" value={d.alcoholFrequency} onChange={v => setField('alcoholFrequency', v)} error={errors.alcoholFrequency} placeholder="e.g. 14 units/week" required />
          </div>
        )}
      </FormSection>

      {/* Occupation */}
      <FormSection title="Occupation">
        <RadioGroup
          options={['Unemployed', 'Employed']}
          value={d.occupation}
          onChange={v => setField('occupation', v)}
          error={errors.occupation}
          required
        />
        {d.occupation === 'Employed' && (
          <TextInput
            label="Employment"
            value={d.employment}
            onChange={v => setField('employment', v)}
            error={errors.employment}
            placeholder="Job title / role"
            required
            className="animate-fade-in"
          />
        )}
      </FormSection>

      {/* Living Situation */}
      <FormSection title="Living Situation">
        <SelectDropdown
          options={LIVING_SITUATIONS}
          value={d.livingSituation}
          onChange={v => setField('livingSituation', v)}
          error={errors.livingSituation}
          required
        />
      </FormSection>

      {/* Exercise */}
      <FormSection title="Exercise">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.exercise}
          onChange={v => setField('exercise', v)}
          error={errors.exercise}
          required
        />
        {d.exercise === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <RadioGroup
              label="Type"
              options={['Weight lifting', 'Cardio', 'Both']}
              value={d.exerciseType}
              onChange={v => setField('exerciseType', v)}
              error={errors.exerciseType}
              required
            />
            <RadioGroup
              label="Frequency"
              options={['Infrequent', 'Regular', 'Daily']}
              value={d.exerciseFrequency}
              onChange={v => setField('exerciseFrequency', v)}
              error={errors.exerciseFrequency}
              required
            />
          </div>
        )}
      </FormSection>

      {/* Diet */}
      <FormSection title="Diet">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.diet}
          onChange={v => setField('diet', v)}
          error={errors.diet}
          required
        />
        {d.diet === 'Yes' && (
          <TextInput
            label="What diet?"
            value={d.dietWhat}
            onChange={v => setField('dietWhat', v)}
            error={errors.dietWhat}
            placeholder="Relevant diet history"
            required
            className="animate-fade-in"
          />
        )}
      </FormSection>

      {/* Travel History */}
      <FormSection title="Travel History">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.travelHistory}
          onChange={v => setField('travelHistory', v)}
          error={errors.travelHistory}
          required
        />
        {d.travelHistory === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <AddEntryList
              entries={d.travelEntries}
              onRemove={idx => setField('travelEntries', d.travelEntries.filter((_, i) => i !== idx))}
              renderLabel={e => `${e.where} — ${e.when} — ${e.duration}`}
            />
            {errors.travelEntries && <p className="text-danger text-xs">{errors.travelEntries}</p>}
            <div className="space-y-2 p-3 rounded-xl bg-surface-dim border border-border">
              <TextInput label="Where" value={travelDraft.where} onChange={v => setTravelDraft({ ...travelDraft, where: v })} placeholder="Country / region" required />
              <MonthYearPicker label="When" value={travelDraft.when} onChange={v => setTravelDraft({ ...travelDraft, when: v })} required />
              <TextInput label="Duration" value={travelDraft.duration} onChange={v => setTravelDraft({ ...travelDraft, duration: v })} placeholder="e.g. 2 weeks" required />
              <button type="button" onClick={addTravel}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                <Plus size={16} /> Add Travel
              </button>
            </div>
          </div>
        )}
      </FormSection>
    </div>
  );
}
