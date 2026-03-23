import { useState, useEffect } from 'react';

export default function DOBPicker({ value, onChange, error, required }) {
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => String(currentYear - i));

  const parts = value ? value.split('-') : ['', '', ''];
  const [year, setYear] = useState(parts[0] || '');
  const [month, setMonth] = useState(parts[1] || '');
  const [day, setDay] = useState(parts[2] || '');

  useEffect(() => {
    if (year && month && day) onChange(`${year}-${month}-${day}`);
    else onChange('');
  }, [year, month, day]);

  const sel = (hasError) => `w-full px-3 py-2.5 rounded-lg border bg-surface text-text cursor-pointer
    transition-all duration-200 outline-none appearance-none
    ${hasError ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-border focus:border-border-focus focus:ring-2 focus:ring-primary/20'}`;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-text-secondary">
        Date of Birth {required && <span className="text-danger">*</span>}
      </label>
      <div className="grid grid-cols-3 gap-2">
        <select value={day} onChange={e => setDay(e.target.value)} className={sel(error)}>
          <option value="">Day</option>
          {days.map(d => <option key={d} value={d}>{parseInt(d)}</option>)}
        </select>
        <select value={month} onChange={e => setMonth(e.target.value)} className={sel(error)}>
          <option value="">Month</option>
          {months.map((m, i) => <option key={m} value={m}>{monthLabels[i]}</option>)}
        </select>
        <select value={year} onChange={e => setYear(e.target.value)} className={sel(error)}>
          <option value="">Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
