import { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SystemHealthView() {
  const { admin } = useAuth();
  const [copiedScript, setCopiedScript] = useState(false);
  const [healthData, setHealthData] = useState({
    status: 'checking',
    db: 'checking',
    timestamp: null
  });

  const checkHealth = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/health');
      if (res.ok) {
        const json = await res.json();
        setHealthData({
          status: 'online',
          db: json.mongodb || (json.dbStatus === 'connected' ? 'connected' : 'development-mock'),
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        setHealthData({
          status: 'online',
          db: 'development-mock',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (err) {
      setHealthData({
        status: 'offline',
        db: 'disconnected',
        timestamp: new Date().toLocaleTimeString()
      });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const copyScriptToClipboard = () => {
    const text = 'node scripts/createAdmin.js admin admin@greengateadvisory.com Admin@123456';
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest text-gold flex items-center justify-center shadow-xs flex-shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-forest-dark">
              Architecture & System Health
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Shared MERN backend configuration for Public Website and Admin Panel
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={checkHealth}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-sand-border bg-sand-surface hover:bg-white text-xs font-semibold text-charcoal transition-all shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-forest" />
          <span>Check Status</span>
        </button>
      </div>

      {/* Grid: Server, Database, Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Express Server */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-forest/10 text-forest">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-forest-dark">
                Express Backend API
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Port 5050
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-sand-border/50">
              <span className="text-charcoal-muted">API Base URL:</span>
              <span className="font-mono font-semibold text-charcoal">http://localhost:5050</span>
            </div>
            <div className="flex justify-between py-1 border-b border-sand-border/50">
              <span className="text-charcoal-muted">Environment:</span>
              <span className="font-mono font-semibold text-charcoal">development</span>
            </div>
            <div className="flex justify-between py-1 border-b border-sand-border/50">
              <span className="text-charcoal-muted">CORS Whitelist:</span>
              <span className="font-mono text-[11px] text-charcoal">:5173, :5174</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal-muted">Last Checked:</span>
              <span className="font-mono text-charcoal-muted">{healthData.timestamp || 'Just now'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: MongoDB Database */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gold/15 text-gold-dark">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-forest-dark">
                Database Engine
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
              MongoDB Mongoose
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-sand-surface border border-sand-border text-[11px] text-charcoal-muted leading-relaxed">
              If MongoDB Atlas URI is unconfigured in <code className="text-forest font-mono">server/.env</code>, the backend operates in <strong>In-Memory Mock Mode</strong> with complete CRUD functionality.
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-charcoal-muted">Active Engine:</span>
              <span className="font-mono font-bold text-forest">
                {healthData.db === 'connected' ? 'MongoDB Atlas (Connected)' : 'Development In-Memory Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Admin Session */}
        <div className="bg-white rounded-3xl p-6 border border-sand-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-forest-dark">
                Active Session
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-gold/20 text-gold-dark border border-gold/30">
              {admin?.role || 'superadmin'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-sand-border/50">
              <span className="text-charcoal-muted">Logged Username:</span>
              <span className="font-mono font-semibold text-charcoal">{admin?.username || 'admin'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-sand-border/50">
              <span className="text-charcoal-muted">Security:</span>
              <span className="font-mono text-emerald-700 font-semibold">JWT / HttpOnly Cookie</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal-muted">Session Duration:</span>
              <span className="font-mono text-charcoal">7 Days (Auto-refresh)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Admin Password & Account Creation Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-subtle space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-forest text-gold">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-forest-dark">
              Admin Password & Account Provisioning
            </h3>
            <p className="text-xs text-charcoal-muted">
              How to create new administrator credentials or update the existing password
            </p>
          </div>
        </div>

        <p className="text-xs text-charcoal leading-relaxed">
          To reset or add a new admin account with encrypted bcrypt hashing, execute the script inside the <code className="bg-sand-surface px-1.5 py-0.5 rounded text-forest font-mono">server/</code> directory:
        </p>

        <div className="relative rounded-2xl bg-[#0A251D] text-sand-surface p-4 font-mono text-xs overflow-x-auto border border-emerald-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-gold flex-shrink-0" />
            <code className="text-gold-light">
              node scripts/createAdmin.js admin admin@greengateadvisory.com YourNewPassword123!
            </code>
          </div>

          <button
            type="button"
            onClick={copyScriptToClipboard}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
            title="Copy command"
          >
            {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold" />}
          </button>
        </div>
      </div>
    </div>
  );
}
