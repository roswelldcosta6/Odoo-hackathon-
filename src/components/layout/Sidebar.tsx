import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Network,
  Sparkles,
  ShieldAlert,
  Settings,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { UserRole } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    activeTab,
    setActiveTab,
    setIsCopilotOpen,
    logout
  } = useHRMS();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: '10' },
    { id: 'attendance', label: 'Attendance', icon: Clock, badge: 'Live' },
    { id: 'leaves', label: 'Leave Management', icon: CalendarCheck, alert: true },
    { id: 'payroll', label: 'Payroll & Slips (₹)', icon: CreditCard },
    { id: 'org-chart', label: 'Org Hierarchy', icon: Network },
    { id: 'copilot', label: 'AI HR Copilot', icon: Sparkles, highlight: true },
    { id: 'audit', label: 'Audit Trail', icon: ShieldAlert, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border border-surface-border rounded-2xl shadow-card m-4 mr-0 p-4 flex flex-col justify-between hidden md:flex h-[calc(100vh-2rem)] sticky top-4 select-none z-20">
      {/* Top Branding */}
      <div>
        <div className="flex items-center gap-3 px-2 py-2 mb-6 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-accent-cyan flex items-center justify-center text-white shadow-md shadow-brand-blue/30">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-slate-dark text-lg tracking-tight">Dayflow</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-light text-brand-blue border border-brand-subtle">
                HRMS
              </span>
            </div>
            <p className="text-[11px] text-slate-muted font-medium">Odoo India Edition (₹)</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            if (item.adminOnly && currentRole === 'EMPLOYEE') return null;

            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'copilot') {
                    setIsCopilotOpen(true);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 font-semibold'
                    : item.highlight
                    ? 'bg-accent-lavender-light/60 text-slate-dark hover:bg-accent-lavender-light hover:text-brand-blue'
                    : 'text-slate-muted hover:bg-surface-hover hover:text-slate-dark'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-brand-blue'
                        : 'text-slate-muted group-hover:text-brand-blue'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-surface-border text-slate-muted'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
                  )}
                  {item.highlight && !isActive && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-light text-brand-blue">
                      AI
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher & User Profile Mini-Card */}
      <div className="space-y-3 pt-3 border-t border-surface-border">
        {/* Quick Role Switcher Pill Container */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-light px-2 mb-1.5 flex items-center justify-between">
            <span>Demo Role Switcher</span>
            <span className="text-[9px] bg-accent-mint-light text-accent-mint font-bold px-1 rounded">
              Active
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-surface-bg p-1 rounded-xl border border-surface-border text-[11px]">
            <button
              onClick={() => setCurrentRole('ADMIN')}
              className={`py-1 rounded-lg font-medium transition-all text-center ${
                currentRole === 'ADMIN'
                  ? 'bg-brand-blue text-white shadow-sm font-bold'
                  : 'text-slate-muted hover:text-slate-dark'
              }`}
              title="Marcus Vance (VP HR)"
            >
              Admin
            </button>
            <button
              onClick={() => setCurrentRole('HR_OFFICER')}
              className={`py-1 rounded-lg font-medium transition-all text-center ${
                currentRole === 'HR_OFFICER'
                  ? 'bg-brand-blue text-white shadow-sm font-bold'
                  : 'text-slate-muted hover:text-slate-dark'
              }`}
              title="Sarah Jenkins (HR Officer)"
            >
              HR Off.
            </button>
            <button
              onClick={() => setCurrentRole('EMPLOYEE')}
              className={`py-1 rounded-lg font-medium transition-all text-center ${
                currentRole === 'EMPLOYEE'
                  ? 'bg-brand-blue text-white shadow-sm font-bold'
                  : 'text-slate-muted hover:text-slate-dark'
              }`}
              title="John Doe (Lead Engineer)"
            >
              Emp.
            </button>
          </div>
        </div>

        {/* User Mini Profile with Logout Action */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-bg border border-surface-border">
          <div
            onClick={() => setActiveTab('employees')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
          >
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover border border-white shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-mint border-2 border-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-dark truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-muted font-mono truncate">{currentUser.loginId || currentUser.designation}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-400 hover:text-accent-rose hover:bg-rose-50 transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
