import { Cloud } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';

export default function AutoSaveIndicator() {
  const { state } = useWizard();

  if (!state.lastSaved) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-success animate-pulse-save">
      <Cloud size={12} />
      <span>Saved</span>
    </div>
  );
}
