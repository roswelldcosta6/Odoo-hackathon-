import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Server,
  AlertCircle,
  CheckCircle2,
  User,
  Building
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithCredentials, isBackendLive, authError } = useHRMS();

  const [email, setEmail] = useState('admin@dayflow.com');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    const res = await loginWithCredentials(targetEmail, targetPass);
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Check credentials.');
    } else if (onClose) {
      onClose();
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    handleLogin(undefined, demoEmail, 'Password@123');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-dark/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-surface-border rounded-3xl shadow-float w-full max-w-md overflow-hidden animate-scale-in">
        
        {/* Top Header with Electric Blue Banner */}
        <div className="bg-gradient-to-r from-brand-blue to-accent-cyan p-6 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center mb-3 shadow-md">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Dayflow HRMS</h2>
          <p className="text-xs text-white/85 mt-1 font-medium">
            Sign in to access your enterprise workspace
          </p>

          {/* Backend Status Live Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold mt-3 border border-white/30">
            <span className={`w-2 h-2 rounded-full ${isBackendLive ? 'bg-accent-mint animate-pulse' : 'bg-accent-amber'}`} />
            <span>{isBackendLive ? 'Backend API Live (Port 5000)' : 'Standalone Demo Mode'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Quick Demo 1-Click Buttons */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-muted block mb-2 text-center">
              1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@dayflow.com')}
                className="p-2 rounded-xl bg-surface-bg hover:bg-brand-light hover:text-brand-blue border border-surface-border text-center transition-all group"
              >
                <div className="text-xs font-black text-slate-dark group-hover:text-brand-blue">Admin</div>
                <div className="text-[10px] text-slate-light truncate">Alex Morgan</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('hr@dayflow.com')}
                className="p-2 rounded-xl bg-surface-bg hover:bg-brand-light hover:text-brand-blue border border-surface-border text-center transition-all group"
              >
                <div className="text-xs font-black text-slate-dark group-hover:text-brand-blue">HR Officer</div>
                <div className="text-[10px] text-slate-light truncate">Sarah J.</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('employee@dayflow.com')}
                className="p-2 rounded-xl bg-surface-bg hover:bg-brand-light hover:text-brand-blue border border-surface-border text-center transition-all group"
              >
                <div className="text-xs font-black text-slate-dark group-hover:text-brand-blue">Employee</div>
                <div className="text-[10px] text-slate-light truncate">John Doe</div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-surface-border" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-light tracking-wider">or credentials</span>
            <div className="flex-grow border-t border-surface-border" />
          </div>

          {/* Error display */}
          {(errorMessage || authError) && (
            <div className="p-3 rounded-xl bg-accent-rose-light border border-accent-rose/30 text-xs text-accent-rose font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage || authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => handleLogin(e)} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-dark mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dayflow.com"
                  className="w-full bg-surface-bg border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-slate-dark font-medium focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-dark mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password@123"
                  className="w-full bg-surface-bg border border-surface-border rounded-xl pl-9 pr-3 py-2.5 text-slate-dark font-medium focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-brand-blue/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-bg border-t border-surface-border text-center text-[11px] text-slate-light">
          Protected with JWT & Role-Based Access Control (RBAC)
        </div>

      </div>
    </div>
  );
};
