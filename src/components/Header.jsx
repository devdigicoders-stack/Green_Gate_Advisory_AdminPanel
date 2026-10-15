import { useState } from 'react';
import { 
  Menu, 
  Search, 
  RotateCw, 
  Bell, 
  ExternalLink, 
  User, 
  LogOut, 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ 
  activeTab, 
  searchTerm, 
  setSearchTerm, 
  onRefresh, 
  isRefreshing, 
  counts,
  onOpenMobileSidebar 
}) {
  const { admin, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'profile':
        return 'Admin Profile & Security';
      case 'settings':
        return 'Portal Settings';
      case 'inquiries':
      default:
        return 'Website Inquiries';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-sand-border/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-charcoal hover:bg-sand-surface border border-sand-border transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-charcoal-muted">
              <span className="font-mono uppercase tracking-wider font-semibold text-[10px] text-forest">
                Green Gate
              </span>
              <span>/</span>
              <span className="truncate">{getBreadcrumbTitle()}</span>
            </div>
            <h1 className="text-sm sm:text-base font-display font-bold text-forest-dark truncate">
              {getBreadcrumbTitle()}
            </h1>
          </div>
        </div>

        {/* Center: Live Search Bar (Active on Inquiries tab) */}
        {activeTab === 'inquiries' && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clients, company, email, requirements..."
                className="w-full pl-9 pr-14 py-2 text-xs bg-sand-surface hover:bg-white focus:bg-white rounded-xl border border-sand-border focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-[10px] font-mono text-charcoal-muted/60 bg-sand-border/40 px-1.5 py-0.5 rounded border border-sand-border">
                  ⌘K
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Status Indicator, Refresh Button, Public Site, User */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live Server Pulse */}
          <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">API :5050 Online</span>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Realtime Data"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-sand-border bg-white hover:bg-sand-surface text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-forest ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl border border-sand-border bg-white hover:bg-sand-surface text-charcoal transition-colors"
              title="Recent Notifications"
            >
              <Bell className="w-4 h-4 text-charcoal" />
              {counts?.new > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-forest-dark text-[10px] font-bold font-mono flex items-center justify-center border-2 border-white shadow-xs">
                  {counts.new}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-sand-border p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-sand-border">
                  <span className="text-xs font-bold text-forest-dark">Notifications</span>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                    {counts?.new || 0} New
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {counts?.new > 0 ? (
                    <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20 text-charcoal">
                      <p className="font-semibold text-xs text-forest">
                        {counts.new} Actionable Enquiries
                      </p>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">
                        New client requests are waiting for initial consultation response.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-charcoal-muted text-xs">
                      All caught up! No unread enquiries.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Public Website External Link */}
          <a
            href={import.meta.env.VITE_SITE_URL || 'https://green-gate-advisory.vercel.app'}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Public Website"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-dark hover:bg-forest text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </a>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border border-sand-border bg-white hover:bg-sand-surface transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-forest text-gold flex items-center justify-center font-bold text-xs uppercase">
                {admin?.username ? admin.username.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-forest-dark">
                {admin?.username || 'Admin'}
              </span>
              <ChevronDown className="w-3 h-3 text-charcoal-muted" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-sand-border p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-sand-border/80">
                  <p className="text-xs font-bold text-forest-dark truncate">
                    {admin?.username || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-charcoal-muted font-mono truncate">
                    {admin?.email || 'admin@greengateadvisory.com'}
                  </p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-gold/20 text-gold-dark border border-gold/30">
                    {admin?.role || 'Superadmin'}
                  </span>
                </div>

                <div className="pt-1 space-y-1">
                  <a
                    href={import.meta.env.VITE_SITE_URL || 'https://green-gate-advisory.vercel.app'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-charcoal hover:bg-sand-surface transition-colors"
                  >
                    <span>View Public Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-charcoal-muted" />
                  </a>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
