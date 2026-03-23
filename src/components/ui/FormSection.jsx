export default function FormSection({ title, children, description, id }) {
  return (
    <div className="space-y-4 scroll-mt-20" id={id}>
      <div>
        <h3 className="text-base font-semibold text-text">{title}</h3>
        {description && <p className="text-sm text-text-secondary mt-0.5">{description}</p>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
