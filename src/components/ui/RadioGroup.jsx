export default function RadioGroup({ label, options, value, onChange, error, row = true, required, children }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className={`flex flex-wrap ${row ? 'flex-row gap-3' : 'flex-col gap-2'}`}>
        {options.map(opt => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <label
              key={optValue}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 text-sm
                ${value === optValue
                  ? 'border-primary bg-primary-light text-primary font-medium shadow-sm'
                  : 'border-border bg-surface hover:border-primary/40 text-text'
                }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={value === optValue}
                onChange={() => onChange(optValue)}
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                ${value === optValue ? 'border-primary' : 'border-text-muted'}`}>
                {value === optValue && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              {optLabel}
            </label>
          );
        })}
      </div>
      {children && value && <div className="mt-2 animate-fade-in">{children}</div>}
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
}
