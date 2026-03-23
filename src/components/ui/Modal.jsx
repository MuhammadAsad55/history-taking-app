import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-dim">
          <h3 className="text-lg font-bold text-text">{title}</h3>
          <button onClick={onClose} className="p-1 text-text-muted hover:text-text rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 bg-surface-dim border-t border-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
