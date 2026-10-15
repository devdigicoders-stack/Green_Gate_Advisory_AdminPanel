import { useState, useRef } from 'react';
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
  EyeOff,
  Camera,
  Trash2,
  Upload,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfileView() {
  const { admin, updateAdminUser, checkSession } = useAuth();

  const [username, setUsername] = useState(admin?.username || '');
  const [avatar, setAvatar] = useState(admin?.avatar || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  // Handle image upload and resize to lightweight base64
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Selected file is too large. Maximum size allowed is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High quality square avatar resize
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Draw cropped square center
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setAvatar(dataUrl);
        setErrorMsg('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Username cannot be empty.');
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
        avatar: avatar,
        ...(newPassword ? { currentPassword, newPassword } : {})
      };

      const res = await api.updateProfile(payload);
      if (res.success && res.admin) {
        setSuccessMsg(res.message || 'Profile updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Update global AuthContext state so all headers and sidebars reflect changes instantly
        if (updateAdminUser) {
          updateAdminUser(res.admin);
        }
        if (checkSession) {
          checkSession();
        }
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
            {avatar ? (
              <img 
                src={avatar} 
                alt={username || 'Admin'} 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-gold/40 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-forest text-gold flex items-center justify-center font-bold text-2xl uppercase shadow-xs">
                {username ? username.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <img 
              src="/favicon.png" 
              alt="Green Gate" 
              className="w-5 h-5 rounded-md absolute -bottom-1 -right-1 border-2 border-white bg-white shadow-xs object-contain"
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-forest-dark flex items-center gap-2">
              <span className="capitalize">{username || 'Admin'}</span>
              <span className="text-xs font-normal text-charcoal-muted">Profile & Security</span>
            </h2>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Customize your administrative username, profile photo, and password
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
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Profile Photo Upload */}
          <div className="space-y-3 pb-6 border-b border-sand-border/80">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-forest">
              Administrator Profile Photo
            </h3>

            <div className="flex items-center gap-5 p-4 rounded-2xl bg-sand-surface/60 border border-sand-border/80">
              <div className="relative group flex-shrink-0">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-forest shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-forest text-gold flex items-center justify-center font-bold text-2xl uppercase shadow-xs">
                    {username ? username.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  title="Upload new image"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFile}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-gold" />
                    <span>Upload Photo</span>
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-charcoal-muted leading-tight">
                  Supports JPG, PNG or WEBP. Uploaded photo will appear in the top header and sidebar.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Account Credentials */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-forest border-b border-sand-border/80 pb-2">
              Account Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username: EDITABLE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-charcoal">
                    Admin Username
                  </label>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                    Editable
                  </span>
                </div>
                <div className="relative">
                  <UserCircle className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-border text-xs text-charcoal bg-sand-surface/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest transition-all"
                  />
                </div>
                <p className="text-[10px] text-charcoal-muted mt-1">
                  Ye naam pure portal me welcome greeting aur profile me dikhega.
                </p>
              </div>

              {/* Email: READ-ONLY / PROTECTED */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-charcoal">
                    Email Address
                  </label>
                  <span className="text-[10px] font-mono text-charcoal-muted flex items-center gap-1 bg-sand-surface border border-sand-border px-1.5 py-0.5 rounded font-semibold">
                    <Lock className="w-2.5 h-2.5 text-gold-dark" /> Read-only (Protected)
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-muted/70 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    disabled
                    readOnly
                    value={admin?.email || 'admin@greengateadvisory.com'}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-border text-xs text-charcoal-muted bg-sand-border/25 cursor-not-allowed select-none focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-charcoal-muted mt-1">
                  Primary administrator email account security ke liye change nahi kiya ja sakta.
                </p>
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
