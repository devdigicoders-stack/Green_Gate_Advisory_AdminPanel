import { useState, useEffect } from 'react';
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
  AlertCircle,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New Enquiry' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
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
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (enquiry) {
      setCurrentStatus(enquiry.status || 'new');
      setNotes(enquiry.adminNotes || '');
      setSaveSuccess(false);
      setErrorMsg('');
    }
  }, [enquiry]);

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

  const copyEmail = () => {
    if (!enquiry?.workEmail) return;
    navigator.clipboard.writeText(enquiry.workEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
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
        <div className="px-6 py-4 bg-sand-surface border-b border-sand-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/favicon.png" 
              alt="Green Gate Emblem" 
              className="w-7 h-7 rounded-lg object-contain border border-sand-border shadow-xs flex-shrink-0" 
            />
            <StatusBadge status={currentStatus} />
            <span className="text-xs font-mono text-charcoal-muted hidden sm:inline">
              ID: {enquiry._id}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-forest/5 text-forest border border-forest/10">
              {enquiry.language === 'es' ? '🇪🇸 Spanish' : '🇬🇧 English'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Green Gate Advisory" 
              className="h-6 w-auto object-contain hidden md:inline opacity-85" 
            />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-charcoal-muted hover:text-forest hover:bg-forest/5 transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-sand-surface/60 border border-sand-border/80">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest/10 border border-gold/30 text-forest flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 mt-0.5">
                {enquiry.fullName ? enquiry.fullName.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <span className="text-xs text-charcoal-muted block">Client Name & Role</span>
                <span className="font-display font-bold text-forest-dark text-base block">{enquiry.fullName}</span>
                {enquiry.role && (
                  <span className="text-xs text-charcoal block">{enquiry.role}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-gold-dark mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-charcoal-muted block">Organisation</span>
                <span className="font-semibold text-forest-dark block">
                  {enquiry.organisation || 'Independent / Individual'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gold-dark mt-1 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-charcoal-muted block">Work Email</span>
                <div className="flex items-center gap-2">
                  <a 
                    href={`mailto:${enquiry.workEmail}`}
                    className="font-semibold text-deep-green hover:underline truncate text-xs sm:text-sm"
                  >
                    {enquiry.workEmail}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="p-1 rounded text-charcoal-muted hover:text-forest transition-colors"
                    title="Copy email"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gold-dark mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-charcoal-muted block">Phone & Preferred Channel</span>
                <span className="font-semibold text-forest-dark block">
                  {enquiry.phone || 'No phone provided'}
                </span>
                <span className="text-xs text-charcoal-muted block">
                  Preferred: {enquiry.preferredContactMethod || 'Email'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <Globe2 className="w-4 h-4 text-gold-dark mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-charcoal-muted block">Location / Territory</span>
                <span className="font-semibold text-forest-dark">{enquiry.countryOrRegion || 'International'}</span>
              </div>
            </div>
          </div>

          {/* Service & Client Requirement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest-dark">
                Service Requested
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-forest/5 text-forest border border-forest/15">
                {enquiry.serviceInterest || 'General Advisory'}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest-dark block mb-1.5">
                Client Requirement Message
              </span>
              <div className="p-4 rounded-2xl bg-white border border-sand-border text-charcoal leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm shadow-2xs">
                {enquiry.requirementDescription || 'No requirement description provided.'}
              </div>
            </div>
          </div>

          {/* Status Update & Internal Admin Notes */}
          <div className="p-5 rounded-2xl bg-sand-surface/60 border border-sand-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-forest-dark block">
                  Workflow Status
                </span>
                <span className="text-[11px] text-charcoal-muted">
                  Update consultation pipeline stage
                </span>
              </div>

              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="bg-white border border-sand-border text-xs rounded-xl px-3 py-2 text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-forest cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label 
                htmlFor="adminNotes" 
                className="block text-xs font-mono font-bold uppercase tracking-wider text-forest-dark mb-1.5"
              >
                Internal Admin Notes
              </label>
              <textarea
                id="adminNotes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add confidential notes on client status, meeting summary, or follow-up details..."
                className="w-full p-3 rounded-xl border border-sand-border text-xs text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-forest resize-none placeholder-charcoal-muted/50"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-emerald-700 font-semibold">
                {saveSuccess && '✓ Notes and status saved successfully!'}
              </span>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-gold" />
                <span>{isSaving ? 'Saving...' : 'Save Updates'}</span>
              </button>
            </div>
          </div>

          {/* Submission Timestamp Metadata */}
          <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-muted border-t border-sand-border pt-3">
            <span>Submitted: {formattedDate}</span>
            <span>Channel: Website Form</span>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-sand-surface border-t border-sand-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => onDelete(enquiry._id)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-sand-border text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${enquiry.workEmail}?subject=Green Gate Advisory — Response to Consultation Request`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-gold" />
              <span>Email Client</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-sand-border bg-white hover:bg-sand-surface text-charcoal text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
