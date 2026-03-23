export default function TextInput({ label, value, onChange, error, placeholder, required, multiline, className = '' }) {
  const baseClass = `w-full px-3 py-2.5 rounded-lg border bg-surface text-text placeholder-text-muted
    transition-all duration-200 outline-none
    ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-border focus:border-border-focus focus:ring-2 focus:ring-primary/20'}
    ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          className={`${baseClass} min-h-[100px] resize-y`}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type="text"
          className={baseClass}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
