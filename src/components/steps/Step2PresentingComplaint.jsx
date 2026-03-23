import { useWizard } from '../../context/WizardContext';
import FormSection from '../ui/FormSection';
import TextInput from '../ui/TextInput';

export default function Step2PresentingComplaint({ errors }) {
  const { state, setField } = useWizard();

  return (
    <div className="space-y-6">
      <FormSection title="Presenting Complaint" description="Record the complaint in the patient's own words">
        <TextInput
          value={state.data.presentingComplaint}
          onChange={v => setField('presentingComplaint', v)}
          error={errors.presentingComplaint}
          placeholder="e.g. 'I've had chest pain for the last 3 days'"
          multiline
          required
        />
      </FormSection>
    </div>
  );
}
