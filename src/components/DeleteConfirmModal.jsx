import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="fixed inset-0 bg-forest-dark/60 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-sand-border/80 w-full max-w-md p-6 sm:p-8 z-10 space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl text-forest">
            Permanently Delete Enquiry?
          </h3>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            This action cannot be undone. The client enquiry and all associated consultation metadata will be permanently deleted from the database.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl border border-sand-border text-xs font-semibold text-charcoal hover:bg-sand-surface transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
