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
                href="http://localhost:5173" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono font-semibold text-deep-green hover:underline flex items-center gap-1"
              >
                <span>http://localhost:5173</span>
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
    </div>
  );
}
