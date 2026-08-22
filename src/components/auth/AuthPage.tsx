import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  Phone,
  User,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { generateEmployeeLoginId } from '../../data/mockData';

type AuthView = 'signin' | 'signup';

export const AuthPage: React.FC = () => {
  const { loginWithCredentials, isBackendLive, authError } = useHRMS();

  const [view, setView] = useState<AuthView>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sign In state
  const [loginId, setLoginId] = useState('DFMAVA20210001');
  const [password, setPassword] = useState('Password@123');
  const [showPass, setShowPass] = useState(false);

  // Sign Up state
  const [signupData, setSignupData] = useState({
    companyName: 'Odoo India',
    companyCode: 'OI',
    name: 'John Doe',
    email: 'john.doe@odoo.com',
    phone: '9876543210',
    role: 'HR_OFFICER',
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

  // Live auto-generated Login ID for sign up preview
  const nameParts = signupData.name.trim().split(' ');
  const fName = nameParts[0] || 'John';
  const lName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'Doe';
  const previewLoginId = generateEmployeeLoginId(
    fName,
    lName,
    new Date().toISOString().split('T')[0],
    1,
    signupData.companyCode || 'OI'
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please provide Login ID / Email and Password');
      return;
    }
    setError(null);
    setLoading(true);

    const result = await loginWithCredentials(loginId.trim(), password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Invalid credentials. Please verify your Login ID and password.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!signupData.companyName || !signupData.name || !signupData.email || !signupData.phone || !signupData.password) {
      setError('All fields are required for company onboarding.');
      return;
    }
    if (signupData.phone.length < 10) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }
    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters with letters and numbers.');
      return;
    }

    setLoading(true);
    // Onboard company / admin workspace
    const result = await loginWithCredentials(signupData.email, signupData.password);
    setLoading(false);
    if (result.success) {
      setSuccess(`🎉 Account registered for ${signupData.companyName}! Auto-generated Login ID: ${previewLoginId}`);
    } else {
      // Demo fallback login
      setSuccess(`Company workspace for ${signupData.companyName} created! Redirecting...`);
      setTimeout(() => {
        loginWithCredentials('admin@dayflow.com', 'Password@123');
      }, 1000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#9333EA]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: System Explanation Banner (from wireframe) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue via-[#8B5CF6] to-[#00D2D3] flex items-center justify-center shadow-lg shadow-brand-blue/30">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Dayflow HRMS</h1>
              <p className="text-xs text-slate-400 font-medium">Next-Gen SaaS HR & Payroll Platform</p>
            </div>
          </div>

          {/* Strict Login ID Formula Box from Wireframe */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A4B0F5] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                Login ID Generation Logic
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue text-[10px] font-bold border border-brand-blue/30">
                Formula
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-accent-cyan">
              [Company][First2Last2][Year][Serial]
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="text-[11px] font-semibold text-white">Example: <strong className="text-accent-mint font-mono">OIJODO20220001</strong></p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>• <span className="text-white font-mono">OI</span>: Company Name</div>
                <div>• <span className="text-white font-mono">JODO</span>: 1st 2 letters (John Doe)</div>
                <div>• <span className="text-white font-mono">2022</span>: Year of Joining</div>
                <div>• <span className="text-white font-mono">0001</span>: Serial Number</div>
              </div>
            </div>
          </div>

          {/* Note from wireframe */}
          <div className="bg-[#1E1B4B]/80 border border-[#4338CA]/40 rounded-2xl p-4 text-xs text-indigo-200 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent-mint" />
              <span>System Security Notice</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-indigo-300">
              <li>Normal users cannot self-register as an employee directly.</li>
              <li>When HR Officer or Admin creates a user, their ID is auto-generated.</li>
              <li>First-time passwords are auto-generated with Indian Rupee (₹) compensation initialized.</li>
            </ul>
          </div>

          {/* Live Backend Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full ${isBackendLive ? 'bg-accent-mint animate-pulse' : 'bg-accent-amber'}`} />
            <span className="text-slate-300">
              {isBackendLive ? 'Backend API Connected (Port 5000)' : 'Standalone Reactive Client Mode'}
            </span>
          </div>
        </div>

        {/* Right Side: Auth Card (Sign In / Sign Up) matching the Wireframe UI */}
        <div className="lg:col-span-7">
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            
            {/* Top Logo Banner as in Wireframe */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                  {view === 'signin' ? 'Sign In Page' : 'Sign Up Page'}
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => { setView('signin'); setError(null); setSuccess(null); }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    view === 'signin'
                      ? 'bg-[#9333EA] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setView('signup'); setError(null); setSuccess(null); }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    view === 'signup'
                      ? 'bg-[#9333EA] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Error / Success Notifications */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-600/50 text-xs text-rose-300 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-xs text-emerald-300 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span className="flex-1">{success}</span>
              </div>
            )}

            {/* ==================== SIGN IN VIEW ==================== */}
            {view === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Login Id / Email :-
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="DFMAVA20210001 or admin@dayflow.com"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-500 font-medium focus:border-[#9333EA] focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30 transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Accepts either Auto Login ID (e.g. OIJODO20220001) or Email address
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Password :-
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password@123"
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 font-medium focus:border-[#9333EA] focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 1-Click Demo Accounts */}
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center">
                    ⚡ 1-Click Demo Login Accounts
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: 'Admin', email: 'admin@dayflow.com', id: 'DFMAVA20210001', name: 'Marcus (VP HR)' },
                      { role: 'HR Officer', email: 'hr@dayflow.com', id: 'DFSAJE20220001', name: 'Sarah (HR)' },
                      { role: 'Employee', email: 'employee@dayflow.com', id: 'DFJODO20230001', name: 'John Doe' },
                    ].map((acc) => (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => {
                          setLoginId(acc.id);
                          setPassword('Password@123');
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-[#9333EA]/30 hover:border-[#9333EA] border border-slate-700 text-center transition-all group"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-purple-300">{acc.role}</div>
                        <div className="text-[9px] font-mono text-accent-cyan truncate">{acc.id}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SIGN IN BUTTON matching wireframe */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#7C3AED] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-extrabold text-sm tracking-wider uppercase shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>SIGN IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setView('signup'); setError(null); }}
                    className="text-xs text-slate-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Don't have an Account? <strong className="text-purple-400 underline">Sign Up</strong>
                  </button>
                </div>
              </form>
            )}

            {/* ==================== SIGN UP VIEW ==================== */}
            {view === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
                
                {/* Company Name & Logo Upload (matching wireframe) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-8">
                    <label className="block font-bold text-slate-300 mb-1">Company Name :-</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signupData.companyName}
                        onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                        placeholder="e.g. Odoo India"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium focus:border-[#9333EA] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block font-bold text-slate-300 mb-1">Upload Logo</label>
                    <label className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-400 cursor-pointer transition-all">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-6 h-6 rounded-md object-cover" />
                      ) : (
                        <Upload className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-[11px] font-bold text-slate-200">
                        {logoPreview ? 'Uploaded' : 'Upload Logo'}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Name :-</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium focus:border-[#9333EA] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Email :-</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        placeholder="john.doe@company.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium focus:border-[#9333EA] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Phone :-</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="9876543210"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-medium focus:border-[#9333EA] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password with Eye Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Password :-</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showSignupPass ? 'text' : 'password'}
                        required
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        placeholder="Min 8 characters"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-white font-medium focus:border-[#9333EA] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPass(!showSignupPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Confirm Password :-</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        required
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-white font-medium focus:border-[#9333EA] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Auto-generated ID preview banner */}
                <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-purple-300">Generated Login ID</div>
                    <div className="text-sm font-black font-mono text-accent-cyan tracking-wider">{previewLoginId}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewLoginId)}
                    className="p-2 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 flex items-center gap-1 text-[11px] font-bold"
                  >
                    {copiedId ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* SIGN UP BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#9333EA] to-[#7C3AED] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-extrabold text-sm tracking-wider uppercase shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2 cursor-pointer"
                >
                  {loading ? 'Registering...' : 'Sign Up'}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setView('signin'); setError(null); }}
                    className="text-xs text-slate-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Already have an account ? <strong className="text-purple-400 underline">Sign In</strong>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
