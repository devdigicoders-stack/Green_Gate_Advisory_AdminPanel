import { 
  BarChart3, 
  PieChart, 
  Globe2, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Users,
  Compass
} from 'lucide-react';

export default function AnalyticsView({ enquiries = [], counts = {} }) {
  // Compute Service Distribution
  const serviceStats = {};
  enquiries.forEach((item) => {
    const s = item.serviceInterest || 'Other';
    serviceStats[s] = (serviceStats[s] || 0) + 1;
  });

  const sortedServices = Object.entries(serviceStats).sort((a, b) => b[1] - a[1]);
  const totalEnquiries = enquiries.length || 1;

  // Compute Country Distribution
  const countryStats = {};
  enquiries.forEach((item) => {
    const c = item.countryOrRegion || 'International';
    countryStats[c] = (countryStats[c] || 0) + 1;
  });
  const sortedCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Compute Language Distribution
  const languages = { en: 0, es: 0 };
  enquiries.forEach((item) => {
    if (item.language === 'es') languages.es += 1;
    else languages.en += 1;
  });

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-gradient-to-r from-forest to-forest-dark text-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-gold/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold-light text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Advisory Intelligence</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Client Demand & Engagement Analytics
          </h2>
          <p className="text-xs sm:text-sm text-sand-surface/80 leading-relaxed font-sans">
            Realtime metrics across Green Gate Advisory's core service pillars, regional footprint, and consultation conversion pipeline.
          </p>
        </div>
      </div>

      {/* Grid: Service Demand + Pipeline Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Service Pillar Demand */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-forest/10 text-forest">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-forest-dark">
                  Service Pillar Demand
                </h3>
                <p className="text-[11px] text-charcoal-muted">
                  Client inquiry volume by advisory sector
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-forest">
              {enquiries.length} Records
            </span>
          </div>

          <div className="space-y-4">
            {sortedServices.length > 0 ? (
              sortedServices.map(([service, count], idx) => {
                const percent = Math.round((count / totalEnquiries) * 100);
                return (
                  <div key={service} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-charcoal truncate max-w-[200px] sm:max-w-xs">
                        {service}
                      </span>
                      <span className="font-mono text-charcoal-muted text-[11px]">
                        {count} inquiries ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-sand-surface overflow-hidden border border-sand-border/60">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0 
                            ? 'bg-gradient-to-r from-forest to-deep-green' 
                            : idx === 1 
                            ? 'bg-gradient-to-r from-gold to-gold-dark' 
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-charcoal-muted text-center py-6">
                No inquiries submitted yet to generate distribution data.
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Workflow Pipeline Stage */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gold/15 text-gold-dark">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-forest-dark">
                  Consultation Funnel
                </h3>
                <p className="text-[11px] text-charcoal-muted">
                  Lifecycle progression of incoming requests
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active Pipeline
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-700">
                New Actionable
              </span>
              <div className="font-display font-bold text-2xl text-amber-900">
                {counts?.new || 0}
              </div>
              <span className="text-[10px] text-amber-700/80 block">Initial triage</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-blue-700">
                In Review
              </span>
              <div className="font-display font-bold text-2xl text-blue-900">
                {counts?.in_progress || 0}
              </div>
              <span className="text-[10px] text-blue-700/80 block">Scope evaluation</span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-teal-700">
                Contacted
              </span>
              <div className="font-display font-bold text-2xl text-teal-900">
                {counts?.contacted || 0}
              </div>
              <span className="text-[10px] text-teal-700/80 block">Meeting / Call done</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-700">
                Resolved
              </span>
              <div className="font-display font-bold text-2xl text-emerald-900">
                {counts?.resolved || 0}
              </div>
              <span className="text-[10px] text-emerald-700/80 block">Proposal delivered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-700">
                Closed
              </span>
              <div className="font-display font-bold text-2xl text-slate-800">
                {counts?.closed || 0}
              </div>
              <span className="text-[10px] text-slate-600 block">Completed cycle</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-stone-700">
                Archived
              </span>
              <div className="font-display font-bold text-2xl text-stone-800">
                {counts?.archived || 0}
              </div>
              <span className="text-[10px] text-stone-600 block">Historical record</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Top Countries & Language Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Geographic Presence */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-border">
            <div className="p-2 rounded-xl bg-forest/10 text-forest">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-forest-dark">
                Regional Origins
              </h3>
              <p className="text-[11px] text-charcoal-muted">
                Top countries requesting climate advisory services
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {sortedCountries.length > 0 ? (
              sortedCountries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between p-3 rounded-2xl bg-sand-surface border border-sand-border/80">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌐</span>
                    <span className="text-xs font-semibold text-charcoal">{country}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white border border-sand-border text-forest">
                    {count} submissions
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-charcoal-muted text-center py-4">No countries recorded yet.</p>
            )}
          </div>
        </div>

        {/* Portal Demographics */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-border">
            <div className="p-2 rounded-xl bg-gold/15 text-gold-dark">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-forest-dark">
                Language & Channels
              </h3>
              <p className="text-[11px] text-charcoal-muted">
                Multilingual submission split (English / Spanish)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center space-y-1">
              <span className="text-2xl">🇬🇧</span>
              <div className="font-display font-bold text-xl text-forest-dark">
                {languages.en}
              </div>
              <span className="text-xs font-semibold text-charcoal">English Route</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-center space-y-1">
              <span className="text-2xl">🇪🇸</span>
              <div className="font-display font-bold text-xl text-forest-dark">
                {languages.es}
              </div>
              <span className="text-xs font-semibold text-charcoal">Spanish Route</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sand-surface border border-sand-border text-xs text-charcoal-muted flex items-start gap-2">
            <Compass className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
            <span>
              Both English and Spanish enquiries automatically map into this shared management portal with IP location and localized timestamps.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
