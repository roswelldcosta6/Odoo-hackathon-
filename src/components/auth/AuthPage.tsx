import React, { useState } from 'react';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Building2,
  Phone, User, Upload, CheckCircle2, AlertCircle, X, Copy, ShieldCheck
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

type AuthView = 'signin' | 'signup';

export const AuthPage: React.FC = () => {
  const { loginWithCredentials } = useHRMS();

  const [view, setView] = useState<AuthView>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sign In state
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Sign Up state
  const [signupData, setSignupData] = useState({
    companyName: '',
    companyCode: 'DF',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Generate employee login ID formula: [CompanyCode2][First2Last2][Year][Serial]
  const generateLoginId = (name: string, companyCode: string): string => {
    const parts = (name || 'John Doe').trim().split(' ');
    const first = parts[0] || 'John';
    const last = parts[1] || 'Doe';
    const cc = (companyCode || 'DF').toUpperCase().slice(0, 2).padEnd(2, 'X');
    const f2 = first.toUpperCase().slice(0, 2).padEnd(2, 'X');
    const l2 = last.toUpperCase().slice(0, 2).padEnd(2, 'X');
    const yr = new Date().getFullYear().toString();
    return `${cc}${f2}${l2}${yr}0001`;
  };

  const sampleLoginId = generateLoginId(signupData.name, signupData.companyCode);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanId = loginId.trim();
    if (!cleanId) {
      setError('Please enter your Login ID or Corporate Email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await loginWithCredentials(cleanId, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid credentials. Please verify your Login ID and password.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!signupData.companyName.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!signupData.name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!signupData.email.trim() || !signupData.email.includes('@')) {
      setError('A valid corporate email is required.');
      return;
    }
    if (!signupData.phone.trim() || signupData.phone.length < 10) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (!signupData.password || signupData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const result = await loginWithCredentials(signupData.email, signupData.password);
    setLoading(false);

    if (result.success) {
      setSuccess(`Workspace created for ${signupData.companyName}! Redirecting...`);
    } else {
      setError('Registration failed. Please sign in or try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue to-accent-cyan shadow-lg shadow-brand-blue/30 mb-3">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-dark tracking-tight">Dayflow HRMS</h1>
          <p className="text-xs text-slate-muted mt-0.5">Enterprise HR & Indian Payroll Platform</p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white border border-surface-border rounded-3xl shadow-xl overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-surface-border">
            <button
              onClick={() => { setView('signin'); setError(null); setSuccess(null); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                view === 'signin'
                  ? 'text-brand-blue border-b-2 border-brand-blue bg-brand-light/30'
                  : 'text-slate-muted hover:text-slate-dark'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setView('signup'); setError(null); setSuccess(null); }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                view === 'signup'
                  ? 'text-brand-blue border-b-2 border-brand-blue bg-brand-light/30'
                  : 'text-slate-muted hover:text-slate-dark'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Error & Success Alerts */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-auto"><X className="w-3.5 h-3.5" /></button>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* ============ SIGN IN FORM ============ */}
            {view === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">Login ID / Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={e => setLoginId(e.target.value)}
                      placeholder="e.g. DFMAVA20210001 or you@company.com"
                      className="w-full bg-surface-bg border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-dark font-medium focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>
                  <p className="text-[10px] text-slate-muted mt-1">Format: [CompanyCode][Name][Year][Serial] e.g. DFMAVA20210001</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-surface-bg border border-surface-border rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-dark font-medium focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-light hover:text-slate-dark"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold text-sm shadow-md shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {loading ? 'Signing In...' : (<><span>SIGN IN</span><ArrowRight className="w-4 h-4" /></>)}
                </button>
              </form>
            )}

            {/* ============ SIGN UP FORM ============ */}
            {view === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-dark mb-1.5">Company Name</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signupData.companyName}
                        onChange={e => setSignupData(p => ({ ...p, companyName: e.target.value }))}
                        placeholder="Company Name"
                        className="w-full bg-surface-bg border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-dark font-medium focus:border-brand-blue focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-bold text-slate-dark mb-1.5">Code (2L)</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={signupData.companyCode}
                      onChange={e => setSignupData(p => ({ ...p, companyCode: e.target.value.toUpperCase() }))}
                      placeholder="DF"
                      className="w-full bg-surface-bg border border-surface-border rounded-xl px-3 py-2.5 text-sm text-slate-dark font-bold text-center focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">Upload Company Logo</label>
                  <label className="flex items-center gap-3 p-3 border-2 border-dashed border-surface-border rounded-xl cursor-pointer hover:border-brand-blue hover:bg-brand-light/30 transition-all">
                    {logoPreview ? (
                      <img src={logoPreview} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface-bg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-slate-light" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-dark">{logoPreview ? 'Logo Attached' : 'Click to Upload Logo'}</p>
                      <p className="text-[10px] text-slate-light">PNG, JPG up to 2MB</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.name}
                      onChange={e => setSignupData(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Marcus Vance"
                      className="w-full bg-surface-bg border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-dark font-medium focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-dark mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={e => setSignupData(p => ({ ...p, email: e.target.value }))}
                      placeholder="admin@company.com"
                      className="w-full bg-surface-bg border border-surface-border rounded-xl px-3 py-2.5 text-sm text-slate-dark font-medium focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-dark mb-1.5">Phone</label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={signupData.phone}
                      onChange={e => setSignupData(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                      placeholder="9876543210"
                      className="w-full bg-surface-bg border border-surface-border rounded-xl px-3 py-2.5 text-sm text-slate-dark font-medium focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignupPass ? 'text' : 'password'}
                      required
                      value={signupData.password}
                      onChange={e => setSignupData(p => ({ ...p, password: e.target.value }))}
                      placeholder="Min 6 characters"
                      className="w-full bg-surface-bg border border-surface-border rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-dark font-medium focus:border-brand-blue focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowSignupPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-light">
                      {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required
                      value={signupData.confirmPassword}
                      onChange={e => setSignupData(p => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Repeat password"
                      className="w-full bg-surface-bg border border-surface-border rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-dark font-medium focus:border-brand-blue focus:outline-none"
                    />
                    <button type="button" onClick={() => setShowConfirmPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-light">
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Auto-Generated Login ID preview */}
                <div className="bg-brand-light/50 border border-brand-subtle rounded-xl p-3">
                  <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-1">Generated Admin Login ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-black text-slate-dark tracking-widest">{sampleLoginId}</code>
                    <button type="button" onClick={() => copyToClipboard(sampleLoginId)} className="ml-auto">
                      {copiedId ? <CheckCircle2 className="w-4 h-4 text-accent-mint" /> : <Copy className="w-4 h-4 text-brand-blue" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold text-sm shadow-md shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  {loading ? 'Registering Workspace...' : (<><span>Sign Up</span><ArrowRight className="w-4 h-4" /></>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
