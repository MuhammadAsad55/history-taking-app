export default function DatePicker({ label, value, onChange, error, required, type = 'date' }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3 py-2.5 rounded-lg border bg-surface text-text
          transition-all duration-200 outline-none cursor-pointer
          ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-border focus:border-border-focus focus:ring-2 focus:ring-primary/20'}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        min="1900-01-01"
        max={new Date().toISOString().split('T')[0]}
      />
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
