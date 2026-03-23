export const DRUG_CATEGORIES = {
  'Antihypertensives': ['Amlodipine', 'Ramipril', 'Lisinopril', 'Bisoprolol', 'Atenolol', 'Losartan', 'Bendroflumethiazide'],
  'Diabetes': ['Metformin', 'Insulin (specify)', 'Gliclazide', 'Empagliflozin', 'Sitagliptin'],
  'Respiratory': ['Salbutamol', 'Beclometasone', 'Tiotropium', 'Montelukast', 'Prednisolone'],
  'Cardiac': ['Aspirin', 'Clopidogrel', 'Atorvastatin', 'Simvastatin', 'Digoxin', 'Warfarin', 'Apixaban'],
  'GI': ['Omeprazole', 'Lansoprazole', 'Metoclopramide', 'Loperamide', 'Lactulose'],
  'Neuro/Psych': ['Amitriptyline', 'Sertraline', 'Fluoxetine', 'Citalopram', 'Diazepam', 'Levetiracetam'],
  'Analgesia': ['Paracetamol', 'Ibuprofen', 'Naproxen', 'Codeine', 'Morphine', 'Tramadol'],
  'Thyroid': ['Levothyroxine', 'Carbimazole'],
  'Other': ['Methotrexate', 'Hydroxychloroquine', 'Allopurinol', 'Ferrous Sulphate'],
};

export const ALL_DRUGS = Object.values(DRUG_CATEGORIES).flat();

export const DOSE_UNITS = ['mg', 'mcg', 'units', 'ml'];
export const FREQUENCIES = ['OD', 'BD', 'TDS', 'QDS', 'PRN', 'Weekly', 'Other'];
export const ROUTES = ['Oral', 'IV', 'IM', 'SC', 'Inhaled', 'Topical', 'Sublingual', 'Other'];
export const DRUG_TYPES = ['Prescription', 'Over the Counter', 'Recreational'];
