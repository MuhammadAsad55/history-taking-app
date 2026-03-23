import { WizardProvider, useWizard } from './context/WizardContext';
import HomeScreen from './components/home/HomeScreen';
import WizardShell from './components/wizard/WizardShell';
import SummaryScreen from './components/summary/SummaryScreen';

function AppContent() {
  const { state } = useWizard();

  switch (state.view) {
    case 'wizard':
      return <WizardShell />;
    case 'summary':
      return <SummaryScreen />;
    case 'home':
    default:
      return <HomeScreen />;
  }
}

export default function App() {
  return (
    <WizardProvider>
      <AppContent />
    </WizardProvider>
  );
}
