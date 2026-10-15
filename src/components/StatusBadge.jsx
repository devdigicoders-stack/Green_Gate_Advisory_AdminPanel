const STATUS_STYLES = {
  new: {
    label: 'New Enquiry',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500 animate-pulse'
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  contacted: {
    label: 'Contacted',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500'
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500'
  },
  closed: {
    label: 'Closed',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400'
  },
  archived: {
    label: 'Archived',
    bg: 'bg-stone-100 text-stone-600 border-stone-200',
    dot: 'bg-stone-400'
  }
};

export default function StatusBadge({ status = 'new', className = '' }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.new;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
