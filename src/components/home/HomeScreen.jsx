import { useState } from 'react';
import { useWizard } from '../../context/WizardContext';
import { formatTimestamp, calculateAge } from '../../utils/helpers';
import ThemeToggle from '../ui/ThemeToggle';
import { FileText, Search, Plus, Trash2, MapPin } from 'lucide-react';

export default function HomeScreen() {
  const { state, dispatch } = useWizard();
  const { savedHistories } = state;
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filtered = savedHistories.filter(h => {
    const name = h.data.name?.toLowerCase() || '';
    const ward = h.data.wardName?.toLowerCase() || '';
    const q = search.toLowerCase();
    return name.includes(q) || ward.includes(q);
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      dispatch({ type: 'DELETE_HISTORY', id: deleteConfirmId });
      setDeleteConfirmId(null);
    }
  };

  const startNew = () => dispatch({ type: 'START_NEW' });
  const openHistory = (id) => dispatch({ type: 'LOAD_HISTORY', id });

  return (
    <div className="min-h-dvh flex flex-col bg-surface-dim">
      <header className="sticky top-0 z-10 bg-primary shadow-md">
        <div className="max-w-3xl mx-auto w-full px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <FileText size={24} />
            <h1 className="text-xl font-bold tracking-wide">History Taking App</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={startNew}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors backdrop-blur-sm"
            >
              <Plus size={18} /> New Patient
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 animate-fade-in relative pb-24">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl shadow-sm text-text placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Search by patient name or ward..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        {savedHistories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center mb-4 border border-primary/20">
              <FileText size={32} />
            </div>
            <h2 className="text-lg font-bold text-text mb-2">No histories yet</h2>
            <p className="text-text-secondary text-sm max-w-[250px] mx-auto">
              Tap the button to start a new patient history.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-text-secondary">No matching histories found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(hist => (
              <div
                key={hist.id}
                onClick={() => openHistory(hist.id)}
                className="group relative bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary/50 cursor-pointer transition-all duration-200"
              >
                <div className="flex justify-between items-start pr-8">
                  <div>
                    <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                      {hist.data.name || 'Unnamed Patient'}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-sm text-text-secondary">
                      <span className="flex items-center gap-1 bg-surface-hover px-2 py-0.5 rounded-md text-xs font-medium border border-border">
                        {calculateAge(hist.data.dob)} yrs — {hist.data.gender || '?'}
                      </span>
                      {(hist.data.wardName || hist.data.bedNumber) && (
                        <span className="flex items-center gap-1 truncate max-w-[150px] sm:max-w-sm">
                          <MapPin size={12} className="text-text-muted shrink-0" />
                          <span className="truncate">{hist.data.wardName || 'Unknown Ward'} {hist.data.bedNumber ? `(Bed ${hist.data.bedNumber})` : ''}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-text-muted">
                      Created: {formatTimestamp(hist.dateCreated || hist.verifiedAt)}
                    </span>
                    {hist.dateModified && hist.dateModified !== hist.dateCreated && (
                      <span className="text-[10px] font-medium text-primary">
                        Last Modified: {formatTimestamp(hist.dateModified)}
                      </span>
                    )}
                    {!hist.verifiedAt && (
                      <span className="text-[10px] font-bold text-primary uppercase tracking-tight">
                        Draft (Step {hist.currentStep || 1})
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(hist.id, e)}
                    className="p-1.5 text-text-muted hover:text-danger hover:bg-danger-light rounded-md transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                    title="Delete History"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={startNew}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:bg-primary-hover hover:scale-105 active:scale-95 flex items-center justify-center transition-all z-20"
      >
        <Plus size={24} />
      </button>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-text mb-2">Delete History?</h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Are you sure you want to permanently delete this patient record? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium border border-border bg-surface text-text hover:bg-surface-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium bg-danger text-white hover:bg-danger-hover transition-colors shadow-sm shadow-danger/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

