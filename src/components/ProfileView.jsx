import { useState } from 'react';
import { 
  UserCircle, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfileView() {
  const { admin, checkAuth } = useAuth();

  const [username, setUsername] = useState(admin?.username || '');
  const [email, setEmail] = useState(admin?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Username cannot be empty.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Email cannot be empty.');
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setErrorMsg('Please enter your current password to set a new password.');
        return;
      }
      if (newPassword.length < 8) {
        setErrorMsg('New password must be at least 8 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New password and confirmation do not match.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        ...(newPassword ? { currentPassword, newPassword } : {})
      };

      const res = await api.updateProfile(payload);
      if (res.success) {
        setSuccessMsg(res.message || 'Profile updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (checkAuth) checkAuth();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-forest text-gold flex items-center justify-center font-bold text-xl uppercase shadow-xs">
              {username ? username.charAt(0).toUpperCase() : 'A'}
            </div>
            <img 
              src="/favicon.png" 
              alt="Green Gate" 
              className="w-5 h-5 rounded-md absolute -bottom-1 -right-1 border-2 border-white bg-white shadow-xs object-contain"
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-forest-dark">
              Admin Profile & Security
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Manage your administrator credentials and login password
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <img 
            src="/logo.png" 
            alt="Green Gate Advisory" 
            className="h-6 w-auto object-contain hidden sm:inline opacity-80"
          />
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-gold/20 text-gold-dark border border-gold/30">
            {admin?.role || 'Superadmin'}
          </span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-subtle">
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-forest border-b border-sand-border/80 pb-2">
              Basic Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <UserCircle className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-border text-xs text-charcoal bg-sand-surface/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-border text-xs text-charcoal bg-sand-surface/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-sand-border/80 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-forest">
                Change Password (Optional)
              </h3>
              <span className="text-[11px] text-charcoal-muted">
                Leave blank if keeping current password
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Required only if changing password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-sand-border text-xs text-charcoal bg-sand-surface/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-3 text-charcoal-muted hover:text-forest"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-sand-border text-xs text-charcoal bg-sand-surface/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-3 text-charcoal-muted hover:text-forest"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-border text-xs text-charcoal bg-sand-surface/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-bold transition-all shadow-subtle disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-gold" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
