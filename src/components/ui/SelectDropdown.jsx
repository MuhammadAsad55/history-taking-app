export default function SelectDropdown({ label, options, value, onChange, error, placeholder = 'Select...', required }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        className={`w-full px-3 py-2.5 rounded-lg border bg-surface text-text cursor-pointer
          transition-all duration-200 outline-none appearance-none
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
          bg-[length:20px] bg-[right_8px_center] bg-no-repeat pr-10
          ${error ? 'border-danger focus:ring-2 focus:ring-danger/20' : 'border-border focus:border-border-focus focus:ring-2 focus:ring-primary/20'}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => {
          if (typeof opt === 'object' && opt.group) {
            return (
              <optgroup key={`group-${opt.group || idx}`} label={opt.group}>
                {opt.options.map((subOpt, subIdx) => (
                  <option key={`subopt-${opt.group}-${subOpt}-${subIdx}`} value={subOpt}>
                    {subOpt}
                  </option>
                ))}
              </optgroup>
            );
          }
          const val = typeof opt === 'string' ? opt : (opt?.label || idx);
          return (
            <option key={`option-${val}-${idx}`} value={val}>
              {val}
            </option>
          );
        })}
      </select>
      {error && <p className="text-danger text-xs">{error}</p>}
    </div>
  );
}
