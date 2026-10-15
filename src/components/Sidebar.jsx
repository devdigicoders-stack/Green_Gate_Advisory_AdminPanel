import { 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  Server, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  ChevronRight, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'enquiries', label: 'Enquiries Hub', icon: Inbox, badgeKey: 'new' },
  { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
  { id: 'system', label: 'System & Database', icon: Server },
];

const SERVICE_QUICK_FILTERS = [
  { label: 'Carbon Markets', color: 'bg-emerald-400' },
  { label: 'CBAM Advisory', color: 'bg-amber-400' },
  { label: 'ETS & Article 6', color: 'bg-blue-400' },
  { label: 'Nature-Based Solutions', color: 'bg-teal-400' },
  { label: 'Corporate Climate & ESG', color: 'bg-purple-400' },
  { label: 'Climate Finance', color: 'bg-gold' }
];

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  counts, 
  onSelectServiceFilter,
  isOpenMobile, 
  setIsOpenMobile 
}) {
  const { admin, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-forest-dark/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0A251D] via-[#0E3327] to-[#071C15] text-white border-r border-emerald-950/60 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-gold/30 flex items-center justify-center p-1.5 shadow-sm">
              <img 
                src="/logo-white.png" 
                alt="Green Gate" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-wide text-white">
                  GREEN GATE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gold/20 text-gold-light border border-gold/30 font-bold uppercase">
                  Admin
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-200/60 tracking-wider block">
                Advisory Management Suite
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button 
            type="button" 
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300/50">
              Core Operations
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const newCount = item.badgeKey ? counts?.new || 0 : 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpenMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-800/80 to-emerald-900/60 text-white border border-gold/30 shadow-md' 
                        : 'text-sand-surface/80 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-gold' : 'text-emerald-300/70 group-hover:text-gold-light'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    {newCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gold text-forest-dark shadow-sm animate-pulse">
                        {newCount} new
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Pillar Filter */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300/50">
              <span>Service Pillars</span>
              <Layers className="w-3 h-3 text-emerald-300/40" />
            </div>
            <div className="space-y-0.5">
              {SERVICE_QUICK_FILTERS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setActiveTab('enquiries');
                    if (onSelectServiceFilter) onSelectServiceFilter(s.label);
                    setIsOpenMobile(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] text-emerald-100/70 hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Public Website Preview Card */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gold-light">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </div>
            <p className="text-[11px] text-emerald-100/70 leading-relaxed">
              Verify client-side enquiry form and live advisory pages on port 5173.
            </p>
            <a 
              href="http://localhost:5173" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-emerald-800/80 hover:bg-emerald-700/80 px-3 py-1.5 rounded-lg border border-emerald-600/40 transition-colors w-full justify-center"
            >
              <span>Open Public Site</span>
              <ExternalLink className="w-3 h-3 text-gold" />
            </a>
          </div>
        </div>

        {/* Footer Admin Profile */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                {admin?.username ? admin.username.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white truncate block">
                  {admin?.username || 'Administrator'}
                </span>
                <span className="text-[10px] font-mono text-emerald-300/60 uppercase block">
                  {admin?.role || 'Superadmin'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl text-sand-surface/60 hover:text-rose-300 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
