import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Network,
  ShieldAlert,
  Settings,
  LogOut,
  LucideIcon
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  alert?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    currentRole,
    currentUser,
    activeTab,
    setActiveTab,
    logout,
    employees,
    leaveRequests
  } = useHRMS();

  const pendingLeaves = leaveRequests.filter(r => r.status === 'PENDING').length;

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: employees.length.toString() },
    { id: 'attendance', label: 'Attendance', icon: Clock, badge: 'Live' },
    { id: 'leaves', label: 'Leave Approvals', icon: CalendarCheck, alert: pendingLeaves > 0 },
    { id: 'payroll', label: 'Payroll & Slips (₹)', icon: CreditCard },
    { id: 'org-chart', label: 'Org Hierarchy', icon: Network },
    { id: 'audit', label: 'Audit Trail', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const employeeNavItems: NavItem[] = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'My Attendance', icon: Clock, badge: 'Live' },
    { id: 'leaves', label: 'Apply Leave', icon: CalendarCheck },
    { id: 'payroll', label: 'My Payslips (₹)', icon: CreditCard },
    { id: 'settings', label: 'My Settings', icon: Settings },
  ];

  const navItems = currentRole === 'EMPLOYEE' ? employeeNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-white border border-surface-border rounded-2xl shadow-card m-4 mr-0 p-4 flex flex-col justify-between hidden md:flex h-[calc(100vh-2rem)] sticky top-4 select-none z-20">
      {/* Branding */}
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
                {currentRole === 'EMPLOYEE' ? 'Portal' : 'Admin'}
              </span>
            </div>
            <p className="text-[11px] text-slate-muted font-medium">Enterprise HR & Payroll</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/30 font-semibold'
                    : 'text-slate-muted hover:bg-surface-hover hover:text-slate-dark'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-muted group-hover:text-brand-blue'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-border text-slate-muted'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Mini-Card & Logout */}
      <div className="pt-3 border-t border-surface-border">
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-bg border border-surface-border">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
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

export default Sidebar;
