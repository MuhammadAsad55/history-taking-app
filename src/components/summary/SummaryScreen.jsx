import { useWizard } from '../../context/WizardContext';
import { calculateAge, formatTimestamp } from '../../utils/helpers';
import { generatePDF } from '../../utils/pdfExport';
import ThemeToggle from '../ui/ThemeToggle';
import { Edit2, FileDown, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { SYSTEMS_REVIEW } from '../../data/systemsReview';

function Section({ title, children, id }) {
  return (
    <div className="mb-6 space-y-2 print:break-inside-avoid scroll-mt-24" id={id}>
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary border-b border-border pb-1">
        {title}
      </h3>
      <div className="text-sm text-text space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex sm:block xl:flex xl:items-baseline gap-2 xl:gap-4 print:flex print:items-baseline print:block">
      <span className="font-semibold min-w-32">{label}:</span>
      <span className="flex-1 whitespace-pre-wrap">{value}</span>
    </div>
  );
}

export default function SummaryScreen() {
  const { state, dispatch } = useWizard();
  const d = state.data;
  const verified = !!state.verifiedAt;
  const dateCreated = state.dateCreated || state.verifiedAt || new Date().toISOString();
  const dateModified = state.dateModified || state.verifiedAt || new Date().toISOString();
  const hasBeenModified = dateCreated !== dateModified;

  const [downloading, setDownloading] = useState(false);

  const handleEdit = () => {
    dispatch({ type: 'EDIT_HISTORY' });
  };

  const handleVerify = async () => {
    if (!verified) dispatch({ type: 'VERIFY' });
    setDownloading(true);
    await generatePDF('pdf-content', d.name, dateModified);
    setDownloading(false);
  };

  const handleDone = () => dispatch({ type: 'SET_VIEW', view: 'home' });

  // Render HPC safely
  const renderHPC = () => {
    return (
      <Section title="History of Presenting Complaint (SOCRATES)">
        <Row label="Site" value={d.site?.option === 'Specify' ? (d.site?.value === 'Other' ? d.site?.text : d.site?.value) : 'N/A'} />
        <Row label="Onset" value={`${d.onset?.type} — ${d.onset?.description}${d.onset?.date ? ` (${d.onset.date})` : ''}`} />
        <Row label="Character" value={d.character?.option === 'Specify' ? (d.character?.value === 'Other' ? d.character?.text : d.character?.value) : 'N/A'} />
        <Row label="Radiation" value={d.radiation?.option === 'Yes' ? d.radiation?.description : 'None'} />
        <Row label="Alleviating Factors" value={d.alleviating?.option === 'Yes' ? d.alleviating?.entries?.join(', ') : 'None'} />
        <Row label="Timing" value={d.timing?.option === 'Intermittent' ? `${d.timing.option} — ${d.timing.pattern === 'Other' ? d.timing.text : d.timing.pattern}` : d.timing?.option} />
        <Row label="Exacerbating Factors" value={d.exacerbating?.option === 'Yes' ? d.exacerbating?.entries?.join(', ') : 'None'} />
        <Row label="Severity" value={d.severity?.option === 'Rate' ? `${d.severity?.value} (${d.severity?.scale})` : 'N/A'} />
      </Section>
    );
  };

  const renderPMH = () => (
    <Section title="Past Medical History">
      <Row label="Medical Cond." value={d.medicalConditions?.hasConditions === 'Yes' ? d.medicalConditions.entries?.map(e => `${e.condition} (${e.date})`).join(', ') : 'None'} />
      <Row label="Surgical" value={d.surgicalHistory?.hasSurgery === 'Yes' ? d.surgicalHistory.entries?.map(e => `${e.procedure} (${e.date})`).join(', ') : 'None'} />
      <Row label="Hospitalisations" value={d.hospitalisations?.hasHospitalisations === 'Yes' ? d.hospitalisations.entries?.map(e => `${e.reason} (${e.date})`).join(', ') : 'None'} />
      <Row label="Psychiatric" value={d.psychiatricHistory?.hasPsychiatric === 'Yes' ? d.psychiatricHistory.entries?.map(e => e.detail).join('; ') : 'None'} />
      {d.gender === 'Female' && (
        <Row label="Obs/Gynae" value={d.obsGynae?.hasObsGynae === 'Yes' ?
          `Status: ${d.obsGynae.menopausalStatus}${d.obsGynae.lmp ? `, LMP: ${d.obsGynae.lmp}` : ''}; G${d.obsGynae.gravida}P${d.obsGynae.para}
          ${d.obsGynae.complications === 'Yes' ? `Complications: ${d.obsGynae.complicationsDetail}` : 'No complications'}`
          : 'None'} />
      )}
    </Section>
  );

  const renderSR = () => {
    const sr = d.systemsReview || {};
    const hasAny = Object.keys(sr).length > 0 || d.systemsReviewOther;
    if (!hasAny) return <Section title="Systems Review"><p className="italic text-text-muted">No specific findings reviewed</p></Section>;

    return (
      <Section title="Systems Review">
        {Object.entries(sr).map(([sysId, sysData]) => {
          if (!sysData || (sysData.symptoms.length === 0 && !sysData.other)) return null;
          const sys = SYSTEMS_REVIEW.find(s => s.id === sysId);
          const name = sys?.name || sysId;
          return <Row key={sysId} label={name} value={`${sysData.symptoms.join(', ')} ${sysData.other ? `— ${sysData.other}` : ''}`} />;
        })}
        {d.systemsReviewOther && <Row label="Other" value={d.systemsReviewOther} />}
      </Section>
    );
  };

  return (
    <div className="min-h-dvh flex flex-col bg-surface-dim">
      <header className="sticky top-0 z-10 bg-surface border-b border-border shadow-sm print:hidden">
        <div className="max-w-2xl mx-auto w-full px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-text">Review & Export</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!verified && (
              <button onClick={handleEdit} className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1">
                <Edit2 size={16} /> Edit
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 print:p-0 print:pb-0">
        <div id="pdf-content" className="max-w-3xl mx-auto w-full bg-surface shadow-md rounded-xl p-6 sm:p-8 print:shadow-none print:border-none overflow-hidden">
          {/* Document Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-border">
            <h2 className="text-2xl font-black text-text uppercase tracking-widest">Clinical History</h2>
            <div className="flex flex-col items-center gap-0.5 mt-1">
              <p className="text-xs font-medium text-text-secondary">Created: {formatTimestamp(dateCreated)}</p>
              {hasBeenModified && (
                <p className="text-xs font-medium text-text-secondary">Last Modified: {formatTimestamp(dateModified)}</p>
              )}
            </div>
          </div>

          <Section id="demographics" title="Patient Demographics">
            <div className="space-y-1.5">
              <Row label="Name" value={d.name} />
              <Row label="DOB" value={`${d.dob} (${calculateAge(d.dob)} yrs)`} />
              <Row label="Gender" value={d.gender} />
              <Row label="Ward / Bed" value={`${d.wardName || 'N/A'} / ${d.bedNumber || 'N/A'}`} />
            </div>
          </Section>

          <Section id="pc" title="Presenting Complaint">
            <Row label="Complaint" value={d.presentingComplaint} />
          </Section>

          <div id="hpc">{renderHPC()}</div>
          <div id="pmh">{renderPMH()}</div>

          <Section id="drugs" title="Drug History">
            <Row label="Medications" value={d.hasDrugs === 'Yes' ? d.drugEntries?.map(e => `${e.medication} ${e.dose} ${e.frequency} (${e.route}) [${e.adherence}]`).join('\n') : 'None'} />
          </Section>

          <Section id="allergies" title="Allergy History">
            <Row label="Allergies" value={d.hasAllergies === 'Yes' ? d.allergyEntries?.map(e => `${e.allergen} (${e.reaction}) — ${e.severity}`).join('\n') : 'None known'} />
          </Section>

          <Section id="family" title="Family History">
            <Row label="History" value={d.hasFamilyHistory === 'Yes' ? d.familyEntries?.map(e => `${e.relative}: ${e.condition}${e.deceased === 'Yes' ? ` (Died at ${e.ageAtDeath})` : ''}`).join('\n') : d.hasFamilyHistory} />
          </Section>

          <Section id="social" title="Social History">
            <Row label="Smoking" value={d.smoker === 'Yes' ? `Yes (${d.smokerFrequency}, since ${d.smokerSince})` : d.smoker === 'Ex-Smoker' ? `Ex (${d.smokerSince} to ${d.smokerTill})` : 'No'} />
            <Row label="Alcohol" value={d.alcohol === 'Yes' ? `Yes (${d.alcoholFrequency}, since ${d.alcoholSince})` : 'No'} />
            <Row label="Occupation" value={d.occupation === 'Employed' ? d.employment : 'Unemployed'} />
            <Row label="Living" value={d.livingSituation} />
            <Row label="Exercise" value={d.exercise === 'Yes' ? `${d.exerciseType} (${d.exerciseFrequency})` : 'No'} />
            <Row label="Diet" value={d.diet === 'Yes' ? d.dietWhat : 'Regular'} />
            <Row label="Travel" value={d.travelHistory === 'Yes' ? d.travelEntries?.map(e => `${e.where} (${e.when}, ${e.duration})`).join('\n') : 'None'} />
          </Section>

          <div id="systems">{renderSR()}</div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] print:hidden">
        <div className="max-w-3xl mx-auto w-full px-4 py-4 flex max-sm:flex-col gap-3">
          <div className="flex gap-3 flex-1">
            <button
              onClick={handleDone}
              className="flex-1 py-3 px-4 rounded-xl font-medium border border-border bg-surface text-text hover:bg-surface-hover transition-colors"
            >
              Home
            </button>
            <button
              onClick={handleEdit}
              className="flex-1 py-3 px-4 rounded-xl font-medium border border-border bg-surface text-text hover:bg-surface-hover transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 size={16} /> Edit
            </button>
          </div>
          <button
            onClick={handleVerify}
            disabled={downloading}
            className={`flex-[1.5] flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-semibold text-white transition-all
              ${verified ? 'bg-success hover:bg-success/90' : 'bg-primary hover:bg-primary-hover'} shadow-md`}
          >
            {downloading ? 'Generating PDF...' : (
              <>
                {verified ? <FileDown size={18} /> : <CheckCircle size={18} />}
                {verified ? 'Download PDF' : 'Verify & Export'}
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
