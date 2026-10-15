import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      setErrorMsg('Please enter both your administrative username/email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await login(usernameOrEmail.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-sand-surface selection:bg-gold/30">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-deep-green/40 via-forest to-forest-dark -z-10" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-deep-green/30 blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-5 shadow-elevated">
          <img 
            src="/logo-white.png" 
            alt="Green Gate Advisory" 
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
          Admin Management Portal
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-sand-surface/75 font-sans">
          Green Gate Advisory — Client Enquiries & Workflow System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20 text-charcoal">
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="usernameOrEmail" 
                className="block text-xs font-mono font-bold uppercase tracking-wider text-forest-dark mb-1.5"
              >
                Administrator Username or Email
              </label>
              <div className="relative rounded-2xl shadow-subtle">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  autoComplete="username"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin or name@greengateadvisory.com"
                  className="block w-full pl-10 pr-3.5 py-3 rounded-xl border border-sand-border text-sm text-charcoal bg-white placeholder-charcoal-muted/50 focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-mono font-bold uppercase tracking-wider text-forest-dark mb-1.5"
              >
                Password
              </label>
              <div className="relative rounded-2xl shadow-subtle">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-3 rounded-xl border border-sand-border text-sm text-charcoal bg-white placeholder-charcoal-muted/50 focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-charcoal-muted hover:text-forest"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-light active:bg-forest-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-sand-border text-[11px] text-charcoal-muted flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Restricted administrative system. All authentication attempts and session access are securely verified and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
