import { LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { admin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-forest text-white border-b border-forest-light/40 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo-white.png" 
              alt="Green Gate Advisory" 
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="border-l border-white/20 pl-3">
              <span className="font-display font-bold text-sm tracking-wide text-white block">
                Green Gate Advisory
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gold-light block">
                Admin Management Portal
              </span>
            </div>
          </div>

          {/* Right: Authenticated Admin Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-sand-surface">
              <User className="w-3.5 h-3.5 text-gold-light" />
              <span className="font-medium">{admin?.username || 'Admin'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-gold text-forest-dark">
                {admin?.role || 'admin'}
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-200 border border-white/20 hover:border-rose-400/40 text-xs font-semibold transition-all duration-200"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
