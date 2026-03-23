import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { Plus } from 'lucide-react';
import FormSection from '../ui/FormSection';
import RadioGroup from '../ui/RadioGroup';
import SelectDropdown from '../ui/SelectDropdown';
import TextInput from '../ui/TextInput';
import DatePicker from '../ui/DatePicker';
import AddEntryList from '../ui/AddEntryList';

const SITE_OPTIONS = ['Head', 'Chest', 'Abdomen', 'Back', 'Upper limb', 'Lower limb', 'Other'];
const CHARACTER_OPTIONS = ['Sharp', 'Dull', 'Burning', 'Throbbing', 'Crushing', 'Other'];
const ALLEVIATING_OPTIONS = ['Rest', 'Analgesia', 'Other'];
const EXACERBATING_OPTIONS = ['Food', 'Position Change', 'Other'];
const TIMING_PATTERNS = ['More during day', 'More during night', 'Other'];

export default function Step3HPC({ errors, onRegisterBeforeNext }) {
  const { state, setNestedField, setField } = useWizard();
  const d = state.data;

  // Temp states for ADD pattern fields
  const [alleviatingDraft, setAlleviatingDraft] = useState({ dropdown: '', text: '' });
  const [exacerbatingDraft, setExacerbatingDraft] = useState({ dropdown: '', text: '' });

  // Register beforeNext check
  useEffect(() => {
    if (onRegisterBeforeNext) {
      onRegisterBeforeNext(() => {
        const hasAllev = (alleviatingDraft.dropdown || alleviatingDraft.text) && (d.alleviating?.entries?.length > 0);
        const hasExac = (exacerbatingDraft.dropdown || exacerbatingDraft.text) && (d.exacerbating?.entries?.length > 0);
        return { shouldWarn: hasAllev || hasExac };
      });
    }
  }, [alleviatingDraft, exacerbatingDraft, d, onRegisterBeforeNext]);

  const addAlleviating = () => {
    const label = alleviatingDraft.dropdown === 'Other' ? alleviatingDraft.text : alleviatingDraft.dropdown;
    if (!label?.trim()) return;
    const entries = [...(d.alleviating?.entries || []), label];
    setNestedField('alleviating', 'entries', entries);
    setAlleviatingDraft({ dropdown: '', text: '' });
  };

  const addExacerbating = () => {
    const label = exacerbatingDraft.dropdown === 'Other' ? exacerbatingDraft.text : exacerbatingDraft.dropdown;
    if (!label?.trim()) return;
    const entries = [...(d.exacerbating?.entries || []), label];
    setNestedField('exacerbating', 'entries', entries);
    setExacerbatingDraft({ dropdown: '', text: '' });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-text">History of Presenting Complaint</h2>
      <p className="text-sm text-text-secondary -mt-4">SOCRATES assessment</p>

      {/* Site */}
      <FormSection title="Site">
        <RadioGroup
          options={['N/A', 'Specify']}
          value={d.site?.option === 'N/A' ? 'N/A' : d.site?.option ? 'Specify' : ''}
          onChange={v => {
            if (v === 'N/A') setField('site', { option: 'N/A', value: '', text: '' });
            else setField('site', { ...d.site, option: 'Specify' });
          }}
          error={errors['site.option']}
          required
        />
        {d.site?.option === 'Specify' && (
          <div className="space-y-3 animate-fade-in">
            <SelectDropdown options={SITE_OPTIONS} value={d.site?.value} onChange={v => setNestedField('site', 'value', v)} error={errors['site.value']} placeholder="Select site..." required />
            {d.site?.value === 'Other' && (
              <TextInput value={d.site?.text} onChange={v => setNestedField('site', 'text', v)} placeholder="Specify site" />
            )}
          </div>
        )}
      </FormSection>

      {/* Onset */}
      <FormSection title="Onset">
        <RadioGroup
          options={['Sudden', 'Gradual']}
          value={d.onset?.type}
          onChange={v => setNestedField('onset', 'type', v)}
          error={errors['onset.type']}
          required
        />
        <TextInput
          label="Describe onset"
          value={d.onset?.description}
          onChange={v => setNestedField('onset', 'description', v)}
          error={errors['onset.description']}
          placeholder="When did it start?"
          required
        />
        <DatePicker
          label="Date of onset (optional)"
          value={d.onset?.date}
          onChange={v => setNestedField('onset', 'date', v)}
          error={errors['onset.date']}
        />
      </FormSection>

      {/* Character */}
      <FormSection title="Character">
        <RadioGroup
          options={['N/A', 'Specify']}
          value={d.character?.option === 'N/A' ? 'N/A' : d.character?.option ? 'Specify' : ''}
          onChange={v => {
            if (v === 'N/A') setField('character', { option: 'N/A', value: '', text: '' });
            else setField('character', { ...d.character, option: 'Specify' });
          }}
          error={errors['character.option']}
          required
        />
        {d.character?.option === 'Specify' && (
          <div className="space-y-3 animate-fade-in">
            <SelectDropdown options={CHARACTER_OPTIONS} value={d.character?.value} onChange={v => setNestedField('character', 'value', v)} error={errors['character.value']} placeholder="Select character..." required />
            {d.character?.value === 'Other' && (
              <TextInput value={d.character?.text} onChange={v => setNestedField('character', 'text', v)} placeholder="Describe character" />
            )}
          </div>
        )}
      </FormSection>

      {/* Radiation */}
      <FormSection title="Radiation">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.radiation?.option}
          onChange={v => setField('radiation', { option: v, description: v === 'No' ? '' : d.radiation?.description })}
          error={errors['radiation.option']}
          required
        />
        {d.radiation?.option === 'Yes' && (
          <TextInput
            value={d.radiation?.description}
            onChange={v => setNestedField('radiation', 'description', v)}
            error={errors['radiation.description']}
            placeholder="Where does it radiate to?"
            required
            className="animate-fade-in"
          />
        )}
      </FormSection>

      {/* Alleviating Factors */}
      <FormSection title="Alleviating Factors">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.alleviating?.option}
          onChange={v => setField('alleviating', { option: v, entries: v === 'No' ? [] : d.alleviating?.entries || [] })}
          error={errors['alleviating.option']}
          required
        />
        {d.alleviating?.option === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <AddEntryList
              entries={d.alleviating?.entries}
              onRemove={idx => setNestedField('alleviating', 'entries', d.alleviating.entries.filter((_, i) => i !== idx))}
            />
            {errors['alleviating.entries'] && <p className="text-danger text-xs">{errors['alleviating.entries']}</p>}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <SelectDropdown
                  options={ALLEVIATING_OPTIONS.filter(opt => opt === 'Other' || !d.alleviating?.entries?.includes(opt))}
                  value={alleviatingDraft.dropdown}
                  onChange={v => setAlleviatingDraft({ ...alleviatingDraft, dropdown: v })}
                  placeholder="Select factor..."
                />
              </div>
              {alleviatingDraft.dropdown === 'Other' && (
                <div className="flex-1">
                  <TextInput value={alleviatingDraft.text} onChange={v => setAlleviatingDraft({ ...alleviatingDraft, text: v })} placeholder="Specify..." />
                </div>
              )}
              <button type="button" onClick={addAlleviating} className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                Add
              </button>
            </div>
          </div>
        )}
      </FormSection>

      {/* Timing */}
      <FormSection title="Timing">
        <RadioGroup
          options={['Constant', 'Intermittent', 'N/A']}
          value={d.timing?.option}
          onChange={v => setField('timing', { option: v, pattern: v === 'Intermittent' ? d.timing?.pattern : '', text: '' })}
          error={errors['timing.option']}
          required
        />
        {d.timing?.option === 'Intermittent' && (
          <div className="space-y-3 animate-fade-in">
            <SelectDropdown options={TIMING_PATTERNS} value={d.timing?.pattern} onChange={v => setNestedField('timing', 'pattern', v)} placeholder="Select pattern..." />
            {d.timing?.pattern === 'Other' && (
              <TextInput value={d.timing?.text} onChange={v => setNestedField('timing', 'text', v)} placeholder="Describe timing pattern" />
            )}
          </div>
        )}
      </FormSection>

      {/* Exacerbating Factors */}
      <FormSection title="Exacerbating Factors">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.exacerbating?.option}
          onChange={v => setField('exacerbating', { option: v, entries: v === 'No' ? [] : d.exacerbating?.entries || [] })}
          error={errors['exacerbating.option']}
          required
        />
        {d.exacerbating?.option === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <AddEntryList
              entries={d.exacerbating?.entries}
              onRemove={idx => setNestedField('exacerbating', 'entries', d.exacerbating.entries.filter((_, i) => i !== idx))}
            />
            {errors['exacerbating.entries'] && <p className="text-danger text-xs">{errors['exacerbating.entries']}</p>}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <SelectDropdown
                  options={EXACERBATING_OPTIONS.filter(opt => opt === 'Other' || !d.exacerbating?.entries?.includes(opt))}
                  value={exacerbatingDraft.dropdown}
                  onChange={v => setExacerbatingDraft({ ...exacerbatingDraft, dropdown: v })}
                  placeholder="Select factor..."
                />
              </div>
              {exacerbatingDraft.dropdown === 'Other' && (
                <div className="flex-1">
                  <TextInput value={exacerbatingDraft.text} onChange={v => setExacerbatingDraft({ ...exacerbatingDraft, text: v })} placeholder="Specify..." />
                </div>
              )}
              <button type="button" onClick={addExacerbating} className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                Add
              </button>
            </div>
          </div>
        )}
      </FormSection>

      {/* Severity */}
      <FormSection title="Severity">
        <RadioGroup
          options={['N/A', 'Rate']}
          value={d.severity?.option === 'N/A' ? 'N/A' : d.severity?.option ? 'Rate' : ''}
          onChange={v => {
            if (v === 'N/A') setField('severity', { option: 'N/A', scale: '', value: 0 });
            else setField('severity', { ...d.severity, option: 'Rate' });
          }}
          error={errors['severity.option']}
          required
        />
        {d.severity?.option === 'Rate' && (
          <div className="space-y-4 animate-fade-in">
            <RadioGroup
              label="Scale"
              options={['NRS (0-10)', 'Mild / Moderate / Severe']}
              value={d.severity?.scale}
              onChange={v => setNestedField('severity', 'scale', v)}
              error={errors['severity.scale']}
              row={false}
            />
            {d.severity?.scale === 'NRS (0-10)' && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Pain: <span className="font-bold text-primary text-lg">{d.severity?.value || 0}</span></span>
                </div>
                <input
                  type="range"
                  min="0" max="10"
                  value={d.severity?.value || 0}
                  onChange={e => setNestedField('severity', 'value', Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>0 — No pain</span><span>10 — Worst pain</span>
                </div>
              </div>
            )}
            {d.severity?.scale === 'Mild / Moderate / Severe' && (
              <RadioGroup
                options={['Mild', 'Moderate', 'Severe']}
                value={d.severity?.value}
                onChange={v => setNestedField('severity', 'value', v)}
                error={errors['severity.value']}
              />
            )}
          </div>
        )}
      </FormSection>
    </div>
  );
}
