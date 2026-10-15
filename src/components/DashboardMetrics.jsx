import { Inbox, Sparkles, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function DashboardMetrics({ counts, activeStatusFilter, onSelectStatus }) {
  const allCount = counts?.all || 0;
  const newCount = counts?.new || 0;
  const inProgressCount = counts?.in_progress || 0;
  const resolvedCount = (counts?.resolved || 0) + (counts?.contacted || 0);

  const CARDS = [
    {
      id: 'all',
      title: 'Total Submissions',
      value: allCount,
      subtitle: 'All-time client enquiries',
      icon: Inbox,
      gradient: 'from-forest to-forest-dark',
      iconBg: 'bg-white/10 text-gold-light',
      borderColor: 'border-sand-border',
      activeRing: activeStatusFilter === 'all'
    },
    {
      id: 'new',
      title: 'Actionable & New',
      value: newCount,
      subtitle: 'Awaiting primary review',
      icon: Sparkles,
      gradient: 'from-amber-600/10 to-amber-500/5',
      iconBg: 'bg-amber-100 text-amber-700',
      borderColor: 'border-amber-200',
      badge: 'Immediate Action',
      activeRing: activeStatusFilter === 'new'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      value: inProgressCount,
      subtitle: 'Under advisory assessment',
      icon: Clock,
      gradient: 'from-blue-600/10 to-blue-500/5',
      iconBg: 'bg-blue-100 text-blue-700',
      borderColor: 'border-blue-200',
      activeRing: activeStatusFilter === 'in_progress'
    },
    {
      id: 'resolved',
      title: 'Resolved / Contacted',
      value: resolvedCount,
      subtitle: 'Briefings & proposals sent',
      icon: CheckCircle2,
      gradient: 'from-emerald-600/10 to-emerald-500/5',
      iconBg: 'bg-emerald-100 text-emerald-700',
      borderColor: 'border-emerald-200',
      activeRing: activeStatusFilter === 'resolved' || activeStatusFilter === 'contacted'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`text-left p-5 rounded-2xl bg-white border transition-all duration-200 shadow-subtle hover:shadow-premium group relative overflow-hidden ${
              card.activeRing 
                ? 'ring-2 ring-forest border-forest bg-sand-surface/60' 
                : `${card.borderColor} hover:border-forest/40`
            }`}
          >
            {/* Top Row: Icon & Status Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg} shadow-2xs`}>
                <Icon className="w-5 h-5" />
              </div>

              {card.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                  {card.badge}
                </span>
              )}

              <ArrowUpRight className="w-4 h-4 text-charcoal-muted/40 group-hover:text-forest transition-colors" />
            </div>

            {/* Metric Value */}
            <div className="space-y-0.5">
              <div className="font-display font-bold text-3xl text-forest-dark tracking-tight">
                {card.value}
              </div>
              <div className="text-xs font-semibold text-charcoal">
                {card.title}
              </div>
              <div className="text-[11px] text-charcoal-muted">
                {card.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
