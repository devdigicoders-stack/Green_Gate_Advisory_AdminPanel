import { 
  Inbox, 
  UserCircle, 
  Settings, 
  ExternalLink, 
  LogOut, 
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'inquiries', label: 'Website Inquiries', icon: Inbox, badgeKey: 'new' },
  { id: 'profile', label: 'Admin Profile', icon: UserCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  counts, 
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
                Inquiries Portal
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
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300/50">
              Navigation
            </div>
            <nav className="space-y-1.5">
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

          {/* Website Link Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-xs font-semibold text-gold-light block">
              Live Website
            </span>
            <p className="text-[11px] text-emerald-100/70 leading-relaxed">
              Inquiry forms submitted on the public website appear directly here.
            </p>
            <a 
              href="http://localhost:5173" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-emerald-800/80 hover:bg-emerald-700/80 px-3 py-2 rounded-xl border border-emerald-600/40 transition-colors w-full justify-center"
            >
              <span>Open Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-gold" />
            </a>
          </div>
        </div>

        {/* Footer Admin Profile */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => {
                setActiveTab('profile');
                setIsOpenMobile(false);
              }}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                {admin?.username ? admin.username.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white truncate block">
                  {admin?.username || 'Admin'}
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
