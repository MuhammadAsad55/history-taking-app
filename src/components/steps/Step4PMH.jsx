import { useState, useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { MEDICAL_CONDITIONS, SURGICAL_PROCEDURES } from '../../data/conditions';
import { Plus } from 'lucide-react';
import FormSection from '../ui/FormSection';
import RadioGroup from '../ui/RadioGroup';
import SelectDropdown from '../ui/SelectDropdown';
import TextInput from '../ui/TextInput';
import MonthYearPicker from '../ui/MonthYearPicker';
import NumberInput from '../ui/NumberInput';
import AddEntryList from '../ui/AddEntryList';
import DatePicker from '../ui/DatePicker';

function AddButton({ onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40">
      Add
    </button>
  );
}

export default function Step4PMH({ errors, onRegisterBeforeNext }) {
  const { state, setNestedField } = useWizard();
  const d = state.data;
  const gender = d.gender;

  // Draft states
  const [condDraft, setCondDraft] = useState({ condition: '', text: '', date: '' });
  const [surgDraft, setSurgDraft] = useState({ procedure: '', text: '', date: '' });
  const [hospDraft, setHospDraft] = useState({ reason: '', date: '' });
  const [psyDraft, setPsyDraft] = useState({ detail: '' });

  const surgicalOptions = gender === 'Male'
    ? SURGICAL_PROCEDURES.filter(p => p !== 'Hysterectomy')
    : SURGICAL_PROCEDURES;

  const addCondition = () => {
    const name = condDraft.condition === 'Other' ? condDraft.text : condDraft.condition;
    if (!name || !condDraft.date) return;
    const entries = [...(d.medicalConditions?.entries || []), { condition: name, date: condDraft.date }];
    setNestedField('medicalConditions', 'entries', entries);
    setCondDraft({ condition: '', text: '', date: '' });
  };

  const addSurgery = () => {
    const name = surgDraft.procedure === 'Other' ? surgDraft.text : surgDraft.procedure;
    if (!name || !surgDraft.date) return;
    const entries = [...(d.surgicalHistory?.entries || []), { procedure: name, date: surgDraft.date }];
    setNestedField('surgicalHistory', 'entries', entries);
    setSurgDraft({ procedure: '', text: '', date: '' });
  };

  const addHosp = () => {
    if (!hospDraft.reason?.trim() || !hospDraft.date) return;
    const entries = [...(d.hospitalisations?.entries || []), { reason: hospDraft.reason, date: hospDraft.date }];
    setNestedField('hospitalisations', 'entries', entries);
    setHospDraft({ reason: '', date: '' });
  };

  const addPsy = () => {
    if (!psyDraft.detail?.trim()) return;
    const entries = [...(d.psychiatricHistory?.entries || []), { detail: psyDraft.detail }];
    setNestedField('psychiatricHistory', 'entries', entries);
    setPsyDraft({ detail: '' });
  };

  // Register beforeNext check
  useEffect(() => {
    if (onRegisterBeforeNext) {
      onRegisterBeforeNext(() => {
        const hasMedical = (condDraft.condition || condDraft.text || condDraft.date) && (d.medicalConditions?.entries?.length > 0);
        const hasSurgical = (surgDraft.procedure || surgDraft.text || surgDraft.date) && (d.surgicalHistory?.entries?.length > 0);
        const hasHosp = (hospDraft.reason || hospDraft.date) && (d.hospitalisations?.entries?.length > 0);
        const hasPsy = psyDraft.detail?.trim() && (d.psychiatricHistory?.entries?.length > 0);

        return { shouldWarn: hasMedical || hasSurgical || hasHosp || hasPsy };
      });
    }
  }, [condDraft, surgDraft, hospDraft, psyDraft, d, onRegisterBeforeNext]);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-text">Past Medical History</h2>

      {/* Medical Conditions */}
      <FormSection title="Medical Conditions">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.medicalConditions?.hasConditions}
          onChange={v => setNestedField('medicalConditions', 'hasConditions', v)}
          error={errors['medicalConditions.hasConditions']}
          required
        />
        {d.medicalConditions?.hasConditions === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <AddEntryList
              entries={d.medicalConditions?.entries}
              onRemove={idx => setNestedField('medicalConditions', 'entries', d.medicalConditions.entries.filter((_, i) => i !== idx))}
              renderLabel={e => `${e.condition} (${e.date})`}
            />
            {errors['medicalConditions.entries'] && <p className="text-danger text-xs">{errors['medicalConditions.entries']}</p>}
            <div className="space-y-2 p-3 rounded-lg bg-surface-dim border border-border">
              <SelectDropdown
                options={MEDICAL_CONDITIONS.filter(opt => opt === 'Other' || !d.medicalConditions?.entries?.some(e => e.condition === opt))}
                value={condDraft.condition}
                onChange={v => setCondDraft({ ...condDraft, condition: v })}
                placeholder="Select condition..."
              />
              {condDraft.condition === 'Other' && (
                <TextInput value={condDraft.text} onChange={v => setCondDraft({ ...condDraft, text: v })} placeholder="Specify condition" />
              )}
              <MonthYearPicker label="Month / Year Diagnosed" value={condDraft.date} onChange={v => setCondDraft({ ...condDraft, date: v })} required />
              <AddButton onClick={addCondition} />
            </div>
          </div>
        )}
      </FormSection>

      {/* Surgical History */}
      <FormSection title="Surgical History">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.surgicalHistory?.hasSurgery}
          onChange={v => setNestedField('surgicalHistory', 'hasSurgery', v)}
          error={errors['surgicalHistory.hasSurgery']}
          required
        />
        {d.surgicalHistory?.hasSurgery === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <AddEntryList
              entries={d.surgicalHistory?.entries}
              onRemove={idx => setNestedField('surgicalHistory', 'entries', d.surgicalHistory.entries.filter((_, i) => i !== idx))}
              renderLabel={e => `${e.procedure} (${e.date})`}
            />
            {errors['surgicalHistory.entries'] && <p className="text-danger text-xs">{errors['surgicalHistory.entries']}</p>}
            <div className="space-y-2 p-3 rounded-lg bg-surface-dim border border-border">
              <SelectDropdown
                options={surgicalOptions.filter(opt => opt === 'Other' || !d.surgicalHistory?.entries?.some(e => e.procedure === opt))}
                value={surgDraft.procedure}
                onChange={v => setSurgDraft({ ...surgDraft, procedure: v })}
                placeholder="Select procedure..."
              />
              {surgDraft.procedure === 'Other' && (
                <TextInput value={surgDraft.text} onChange={v => setSurgDraft({ ...surgDraft, text: v })} placeholder="Specify procedure" />
              )}
              <MonthYearPicker label="Month / Year" value={surgDraft.date} onChange={v => setSurgDraft({ ...surgDraft, date: v })} required />
              <AddButton onClick={addSurgery} />
            </div>
          </div>
        )}
      </FormSection>

      {/* Hospitalisations */}
      <FormSection title="Hospitalisations">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.hospitalisations?.hasHospitalisations}
          onChange={v => setNestedField('hospitalisations', 'hasHospitalisations', v)}
          error={errors['hospitalisations.hasHospitalisations']}
          required
        />
        {d.hospitalisations?.hasHospitalisations === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <AddEntryList
              entries={d.hospitalisations?.entries}
              onRemove={idx => setNestedField('hospitalisations', 'entries', d.hospitalisations.entries.filter((_, i) => i !== idx))}
              renderLabel={e => `${e.reason} (${e.date})`}
            />
            {errors['hospitalisations.entries'] && <p className="text-danger text-xs">{errors['hospitalisations.entries']}</p>}
            <div className="space-y-2 p-3 rounded-lg bg-surface-dim border border-border">
              <TextInput value={hospDraft.reason} onChange={v => setHospDraft({ ...hospDraft, reason: v })} placeholder="Reason for hospitalisation" required />
              <MonthYearPicker label="Month / Year" value={hospDraft.date} onChange={v => setHospDraft({ ...hospDraft, date: v })} required />
              <AddButton onClick={addHosp} />
            </div>
          </div>
        )}
      </FormSection>

      {/* Psychiatric History */}
      <FormSection title="Psychiatric History">
        <RadioGroup
          options={['Yes', 'No']}
          value={d.psychiatricHistory?.hasPsychiatric}
          onChange={v => setNestedField('psychiatricHistory', 'hasPsychiatric', v)}
          error={errors['psychiatricHistory.hasPsychiatric']}
          required
        />
        {d.psychiatricHistory?.hasPsychiatric === 'Yes' && (
          <div className="space-y-3 animate-fade-in">
            <AddEntryList
              entries={d.psychiatricHistory?.entries}
              onRemove={idx => setNestedField('psychiatricHistory', 'entries', d.psychiatricHistory.entries.filter((_, i) => i !== idx))}
              renderLabel={e => e.detail}
            />
            {errors['psychiatricHistory.entries'] && <p className="text-danger text-xs">{errors['psychiatricHistory.entries']}</p>}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <TextInput value={psyDraft.detail} onChange={v => setPsyDraft({ detail: v })} placeholder="Condition / Treatment" />
              </div>
              <AddButton onClick={addPsy} />
            </div>
          </div>
        )}
      </FormSection>

      {/* Obs / Gynae History (Female only) */}
      {gender === 'Female' && (
        <FormSection title="Obstetric / Gynaecological History">
          <RadioGroup
            options={['Yes', 'No']}
            value={d.obsGynae?.hasObsGynae}
            onChange={v => setNestedField('obsGynae', 'hasObsGynae', v)}
            error={errors['obsGynae.hasObsGynae']}
            required
          />
          {d.obsGynae?.hasObsGynae === 'Yes' && (
            <div className="space-y-4 animate-fade-in">
              <RadioGroup
                label="Menopausal Status"
                options={['Pre', 'Peri', 'Post']}
                value={d.obsGynae?.menopausalStatus}
                onChange={v => setNestedField('obsGynae', 'menopausalStatus', v)}
                error={errors['obsGynae.menopausalStatus']}
                required
              />
              {d.obsGynae?.menopausalStatus && d.obsGynae.menopausalStatus !== 'Post' && (
                <DatePicker
                  label="Last Menstrual Period"
                  value={d.obsGynae?.lmp}
                  onChange={v => setNestedField('obsGynae', 'lmp', v)}
                  error={errors['obsGynae.lmp']}
                  required
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <NumberInput
                  label="Gravida"
                  value={d.obsGynae?.gravida}
                  onChange={v => setNestedField('obsGynae', 'gravida', v)}
                  error={errors['obsGynae.gravida']}
                  min={0}
                  required
                />
                <NumberInput
                  label="Para"
                  value={d.obsGynae?.para}
                  onChange={v => setNestedField('obsGynae', 'para', v)}
                  error={errors['obsGynae.para']}
                  min={0}
                  required
                />
              </div>
              <RadioGroup
                label="Complications"
                options={['Yes', 'No']}
                value={d.obsGynae?.complications}
                onChange={v => setNestedField('obsGynae', 'complications', v)}
                error={errors['obsGynae.complications']}
                required
              />
              {d.obsGynae?.complications === 'Yes' && (
                <TextInput
                  value={d.obsGynae?.complicationsDetail}
                  onChange={v => setNestedField('obsGynae', 'complicationsDetail', v)}
                  error={errors['obsGynae.complicationsDetail']}
                  placeholder="Describe complications"
                  required
                  multiline
                />
              )}
            </div>
          )}
        </FormSection>
      )}
    </div>
  );
}
