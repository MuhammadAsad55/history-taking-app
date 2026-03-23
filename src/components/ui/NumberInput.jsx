export default function NumberInput({ label, value, onChange, error, placeholder, required, min, max, className = '' }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type="number"
        className={`w-full px-3 py-2.5 rounded-lg border bg-surface text-text placeholder-text-muted
          transition-all duration-200 outline-none
          ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-border focus:border-border-focus focus:ring-2 focus:ring-primary/20'}
          ${className}`}
        value={value ?? ''}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
