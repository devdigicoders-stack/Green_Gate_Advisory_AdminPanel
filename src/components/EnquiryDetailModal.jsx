import { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Building2, 
  Globe2, 
  User, 
  Calendar, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Clock, 
  Send,
  AlertCircle
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New Enquiry' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'archived', label: 'Archived' }
];

export default function EnquiryDetailModal({ 
  enquiry, 
  onClose, 
  onUpdateStatus, 
  onDelete 
}) {
  const [currentStatus, setCurrentStatus] = useState(enquiry?.status || 'new');
  const [notes, setNotes] = useState(enquiry?.adminNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!enquiry) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMsg('');
    try {
      await onUpdateStatus(enquiry._id, {
        status: currentStatus,
        adminNotes: notes
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update enquiry.');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = new Date(enquiry.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-forest-dark/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-sand-border/80 w-full max-w-3xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-sand-surface border-b border-sand-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={currentStatus} />
            <span className="text-xs font-mono text-charcoal-muted">
              ID: {enquiry._id}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-forest/5 text-forest border border-forest/10">
              {enquiry.language === 'es' ? '🇪🇸 Spanish' : '🇬🇧 English'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-muted hover:text-forest hover:bg-forest/5 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Client Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-sage-light border border-sand-border/60">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-charcoal-muted block">Full Name & Role</span>
                <span className="font-semibold text-forest text-base block">{enquiry.fullName}</span>
                {enquiry.role && (
                  <span className="text-xs text-charcoal block">{enquiry.role}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-charcoal-muted block">Organisation</span>
                <span className="font-medium text-forest block">
                  {enquiry.organisation || 'Independent / Individual'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-charcoal-muted block">Work Email</span>
                <a 
                  href={`mailto:${enquiry.workEmail}`}
                  className="font-medium text-deep-green hover:underline break-all block"
                >
                  {enquiry.workEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-charcoal-muted block">Phone / Contact Method</span>
                <span className="font-medium text-forest block">
                  {enquiry.phone || 'No phone provided'}
                </span>
                <span className="text-xs text-charcoal-muted block">
                  Preferred: {enquiry.preferredContactMethod || 'Email'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <Globe2 className="w-4 h-4 text-gold-dark mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs text-charcoal-muted block">Location / Territory</span>
                <span className="font-medium text-forest">{enquiry.countryOrRegion}</span>
              </div>
            </div>
          </div>

          {/* Service & Engagement Scope */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest-dark">
                Service Interest
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-gold/15 text-forest font-semibold">
                {enquiry.serviceInterest}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest-dark block mb-1">
                Client Requirement Description
              </span>
              <div className="p-4 rounded-2xl bg-white border border-sand-border/80 text-charcoal leading-relaxed whitespace-pre-wrap font-sans text-sm">
                {enquiry.requirementDescription}
              </div>
            </div>
          </div>

          {/* Technical Connection Metadata */}
          <div className="p-4 rounded-xl bg-sand-surface border border-sand-border/60 text-xs space-y-1.5 font-mono text-charcoal-muted">
            <div className="flex items-center justify-between">
              <span>Submitted At:</span>
              <span className="text-charcoal font-semibold">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Notification Dispatch:</span>
              <span className="text-charcoal font-semibold uppercase">{enquiry.notificationStatus || 'pending'}</span>
            </div>
            {enquiry.ipAddress && (
              <div className="flex items-center justify-between">
                <span>Origin IP:</span>
                <span className="text-charcoal">{enquiry.ipAddress}</span>
              </div>
            )}
          </div>

          {/* Workflow Status & Admin Notes */}
          <div className="space-y-4 pt-2 border-t border-sand-border">
            <div>
              <label htmlFor="enquiry-status" className="block text-xs font-mono font-bold uppercase tracking-wider text-forest-dark mb-1.5">
                Update Workflow Status
              </label>
              <select
                id="enquiry-status"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-sand-border bg-white text-sm font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-forest"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="admin-notes" className="block text-xs font-mono font-bold uppercase tracking-wider text-forest-dark mb-1.5">
                Internal Administrative Notes
              </label>
              <textarea
                id="admin-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add confidential team follow-up notes, assigned consultants, or meeting outcomes..."
                className="w-full p-3.5 rounded-2xl border border-sand-border bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-sand-surface border-t border-sand-border flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onDelete(enquiry._id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved</span>
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-sand border border-sand-border text-xs font-semibold text-charcoal transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-gold" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
