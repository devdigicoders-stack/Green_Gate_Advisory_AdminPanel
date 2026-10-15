import { useState } from 'react';
import { 
  Settings, 
  Mail, 
  Server, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Globe2 
} from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-forest-dark">
              Portal & Inquiry Settings
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Configuration for website inquiry notifications and shared system endpoints
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2 Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Enquiry Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-border">
            <div className="p-2 rounded-xl bg-forest/10 text-forest">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-forest-dark">
                Inquiry Notification Recipient
              </h3>
              <p className="text-[11px] text-charcoal-muted">
                Where website inquiries are delivered
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-sand-surface border border-sand-border/80 space-y-1">
              <span className="text-[11px] text-charcoal-muted block">Default Notification Inbox:</span>
              <span className="font-mono font-bold text-forest text-xs block">
                contact@greengateadvisory.com
              </span>
            </div>

            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Configured via <code className="font-mono text-forest">server/.env</code> (<code className="font-mono">ENQUIRY_RECEIVER_EMAIL</code>). All website submissions are stored in this admin database and dispatched via email.
            </p>
          </div>
        </div>

        {/* Card 2: Website & Server Integration */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-sand-border">
            <div className="p-2 rounded-xl bg-gold/15 text-gold-dark">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-forest-dark">
                Public Website Integration
              </h3>
              <p className="text-[11px] text-charcoal-muted">
                Live inquiry form connection
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-sand-border/50">
              <span className="text-charcoal-muted">Public Website:</span>
              <a 
                href={import.meta.env.VITE_SITE_URL || 'https://green-gate-advisory.vercel.app'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono font-semibold text-deep-green hover:underline flex items-center gap-1"
              >
                <span>{import.meta.env.VITE_SITE_URL || 'https://green-gate-advisory.vercel.app'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex justify-between py-1.5 border-b border-sand-border/50">
              <span className="text-charcoal-muted">Submission API:</span>
              <span className="font-mono font-semibold text-charcoal">POST /api/enquiries</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-charcoal-muted">Backend Server:</span>
              <span className="font-mono font-semibold text-emerald-700">Port 5050 (Online)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Card 3: Brand Assets & Identity Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-subtle space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-sand-border">
          <div className="flex items-center gap-3">
            <img 
              src="/favicon.png" 
              alt="Green Gate" 
              className="w-9 h-9 rounded-xl object-contain border border-sand-border shadow-xs" 
            />
            <div>
              <h3 className="font-display font-bold text-base text-forest-dark">
                Official Brand Assets & Identity
              </h3>
              <p className="text-xs text-charcoal-muted">
                High-resolution logos & emblems configured across the admin panel
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active in Portal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Asset 1: Favicon Emblem */}
          <div className="p-4 rounded-2xl bg-sand-surface border border-sand-border/80 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white p-2.5 border border-sand-border shadow-xs flex items-center justify-center">
              <img src="/favicon.png" alt="Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-forest-dark block">Brand Emblem</span>
              <span className="text-[10px] font-mono text-charcoal-muted block">favicon.png (1:1)</span>
            </div>
            <span className="text-[10px] text-charcoal-muted">Used in Sidebar, Header & Modals</span>
          </div>

          {/* Asset 2: Dark Surface Logo */}
          <div className="p-4 rounded-2xl bg-forest-dark text-white border border-forest/60 flex flex-col items-center text-center space-y-2">
            <div className="w-full h-16 rounded-xl bg-white/5 p-2 border border-white/10 flex items-center justify-center">
              <img src="/logo-white.png" alt="White Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <span className="font-bold text-white block">White Horizontal Logo</span>
              <span className="text-[10px] font-mono text-sand-surface/60 block">logo-white.png (3:1)</span>
            </div>
            <span className="text-[10px] text-sand-surface/60">Used in Login & Dark Navbars</span>
          </div>

          {/* Asset 3: Light Surface Logo */}
          <div className="p-4 rounded-2xl bg-sand-surface border border-sand-border/80 flex flex-col items-center text-center space-y-2">
            <div className="w-full h-16 rounded-xl bg-white p-2 border border-sand-border shadow-xs flex items-center justify-center">
              <img src="/logo.png" alt="Dark Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <span className="font-bold text-forest-dark block">Standard Color Logo</span>
              <span className="text-[10px] font-mono text-charcoal-muted block">logo.png (3:1)</span>
            </div>
            <span className="text-[10px] text-charcoal-muted">Used in Headers & Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}
