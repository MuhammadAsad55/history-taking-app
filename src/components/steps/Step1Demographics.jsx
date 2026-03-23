import { useWizard } from '../../context/WizardContext';
import { calculateAge, isValidDate } from '../../utils/helpers';
import FormSection from '../ui/FormSection';
import TextInput from '../ui/TextInput';
import DOBPicker from '../ui/DOBPicker';
import RadioGroup from '../ui/RadioGroup';

export default function Step1Demographics({ errors }) {
  const { state, setField } = useWizard();
  const { name, dob, gender, wardName, bedNumber } = state.data;
  const validDob = isValidDate(dob);
  const age = validDob ? calculateAge(dob) : null;

  return (
    <div className="space-y-6">
      <FormSection title="Patient Demographics" description="Enter patient identification details">
        <TextInput
          label="Name"
          value={name}
          onChange={v => setField('name', v)}
          error={errors.name}
          placeholder="Patient full name"
          required
        />
        <DOBPicker
          value={dob}
          onChange={v => setField('dob', v)}
          error={errors.dob}
          required
        />
        {validDob && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-light border border-primary/20 animate-fade-in">
            <span className="text-sm text-text-secondary">Age:</span>
            <span className="text-sm font-semibold text-primary">{age} years</span>
          </div>
        )}
        <RadioGroup
          label="Gender"
          options={['Male', 'Female']}
          value={gender}
          onChange={v => setField('gender', v)}
          error={errors.gender}
          required
        />
        <TextInput
          label="Ward Name"
          value={wardName}
          onChange={v => setField('wardName', v)}
          placeholder="Optional"
        />
        <TextInput
          label="Bed Number"
          value={bedNumber}
          onChange={v => setField('bedNumber', v)}
          placeholder="Optional"
        />
      </FormSection>
    </div>
  );
}
