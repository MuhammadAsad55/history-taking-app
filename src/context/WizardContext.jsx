import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { generateId } from '../utils/helpers';

const WizardContext = createContext(null);

const INITIAL_STEP_DATA = {
  // Step 1 - Demographics
  name: '', dob: '', gender: '', wardName: '', bedNumber: '',
  // Step 2 - Presenting Complaint
  presentingComplaint: '',
  // Step 3 - HPC (SOCRATES)
  site: { option: '', value: '', text: '' },
  onset: { type: '', description: '', date: '' },
  character: { option: '', value: '', text: '' },
  radiation: { option: '', description: '' },
  alleviating: { option: '', entries: [] },
  timing: { option: '', pattern: '', text: '' },
  exacerbating: { option: '', entries: [] },
  severity: { option: '', scale: '', value: 0 },
  // Step 4 - PMH
  medicalConditions: { hasConditions: '', entries: [] },
  surgicalHistory: { hasSurgery: '', entries: [] },
  hospitalisations: { hasHospitalisations: '', entries: [] },
  psychiatricHistory: { hasPsychiatric: '', entries: [] },
  obsGynae: { hasObsGynae: '', menopausalStatus: '', lmp: '', gravida: '', para: '', complications: '', complicationsDetail: '' },
  // Step 5 - Drug History
  hasDrugs: '', drugEntries: [],
  // Step 6 - Allergy History
  hasAllergies: '', allergyEntries: [],
  // Step 7 - Family History
  hasFamilyHistory: '', familyEntries: [],
  // Step 8 - Social History
  smoker: '', smokerSince: '', smokerTill: '', smokerFrequency: '',
  alcohol: '', alcoholSince: '', alcoholFrequency: '',
  occupation: '', employment: '',
  livingSituation: '',
  exercise: '', exerciseType: '', exerciseFrequency: '',
  diet: '', dietWhat: '',
  travelHistory: '', travelEntries: [],
  // Step 9 - Systems Review
  systemsReview: {},
  systemsReviewOther: '',
};

const INITIAL_STATE = {
  currentStep: 1,
  historyId: null,
  data: { ...INITIAL_STEP_DATA },
  verifiedAt: null,
  view: 'home', // 'home' | 'wizard' | 'summary'
  savedHistories: [],
  lastSaved: null,
  isEditingVerified: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, data: { ...state.data, [action.field]: action.value }, lastSaved: null };
    case 'SET_NESTED_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          [action.field]: { ...state.data[action.field], [action.key]: action.value },
        },
        lastSaved: null,
      };
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'START_NEW': {
      const id = generateId();
      const timestamp = new Date().toISOString();
      return { ...state, historyId: id, currentStep: 1, data: { ...INITIAL_STEP_DATA }, verifiedAt: null, dateCreated: timestamp, dateModified: timestamp, view: 'wizard', isEditingVerified: false, };
    }
    case 'LOAD_HISTORY': {
      const history = state.savedHistories.find(h => h.id === action.id);
      if (!history) return state;
      if (history.verifiedAt) {
        return {
          ...state,
          historyId: history.id,
          data: history.data,
          verifiedAt: history.verifiedAt,
          dateCreated: history.dateCreated,
          dateModified: history.dateModified,
          currentStep: 1,
          view: 'summary'
        };
      } else {
        return {
          ...state,
          historyId: history.id,
          data: history.data,
          verifiedAt: null,
          dateCreated: history.dateCreated,
          dateModified: history.dateModified,
          currentStep: history.currentStep || 1,
          view: 'wizard'
        };
      }
    }
    case 'UPDATE_DRAFT': {
      const timestamp = new Date().toISOString();
      const existing = state.savedHistories.findIndex(h => h.id === state.historyId);
      const existingEntry = existing >= 0 ? state.savedHistories[existing] : null;

      // If the existing saved copy is verified, don't overwrite it during editing
      if (existingEntry?.verifiedAt) {
        return { ...state, lastSaved: Date.now() };
      }

      const draft = {
        id: state.historyId,
        data: { ...state.data },
        verifiedAt: null,
        currentStep: state.currentStep,
        dateCreated: state.dateCreated || timestamp,
        dateModified: timestamp,
      };

      const histories = [...state.savedHistories];
      if (existing >= 0) histories[existing] = draft;
      else histories.unshift(draft);
      return { ...state, savedHistories: histories, lastSaved: Date.now() };
    }
    case 'VERIFY': {
      const timestamp = new Date().toISOString();
      const existingIdx = state.savedHistories.findIndex(h => h.id === state.historyId);
      const existing = existingIdx >= 0 ? state.savedHistories[existingIdx] : null;

      const newHistory = {
        id: state.historyId,
        data: { ...state.data },
        verifiedAt: timestamp,
        dateCreated: existing?.dateCreated || timestamp,
        dateModified: timestamp,
      };

      const histories = [...state.savedHistories];
      if (existingIdx >= 0) histories[existingIdx] = newHistory;
      else histories.unshift(newHistory);

      return {
        ...state,
        savedHistories: histories,
        verifiedAt: timestamp,
        dateCreated: newHistory.dateCreated,
        dateModified: newHistory.dateModified,
        view: 'summary',
        isEditingVerified: false,
      };
    }
    case 'EDIT_HISTORY': {
      const timestamp = new Date().toISOString();
      return {
        ...state,
        verifiedAt: null,
        dateModified: timestamp,
        currentStep: 1,
        view: 'wizard',
        isEditingVerified: true,
      };
    }
    case 'DELETE_HISTORY': {
      return { ...state, savedHistories: state.savedHistories.filter(h => h.id !== action.id) };
    }
    case 'LOAD_SAVED_HISTORIES':
      return { ...state, savedHistories: action.histories };
    case 'MARK_SAVED':
      return { ...state, lastSaved: Date.now() };
    case 'RESET':
      return { ...INITIAL_STATE, savedHistories: state.savedHistories };
    default:
      return state;
  }
}

export function WizardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Load saved histories on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hta_saved_histories');
      if (saved) dispatch({ type: 'LOAD_SAVED_HISTORIES', histories: JSON.parse(saved) });
    } catch (e) { console.error('Failed to load saved data', e); }
  }, []);

  // Save histories to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('hta_saved_histories', JSON.stringify(state.savedHistories));
    } catch (e) { console.error('Failed to save histories', e); }
  }, [state.savedHistories]);

  // Auto-save draft
  useEffect(() => {
    if (state.view !== 'wizard' || !state.historyId || state.verifiedAt) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'UPDATE_DRAFT' });
    }, 500);
    return () => clearTimeout(timer);
  }, [state.data, state.currentStep, state.view, state.historyId, state.verifiedAt]);

  const setField = useCallback((field, value) => dispatch({ type: 'SET_FIELD', field, value }), []);
  const setNestedField = useCallback((field, key, value) => dispatch({ type: 'SET_NESTED_FIELD', field, key, value }), []);

  return (
    <WizardContext.Provider value={{ state, dispatch, setField, setNestedField }}>
      {children}
    </WizardContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used within WizardProvider');
  return ctx;
}
