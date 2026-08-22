import React from 'react';
import {
  Clock,
  Play,
  Square,
  Coffee,
  CalendarCheck,
  CreditCard,
  User,
  Flame,
  Wifi,
  Home,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

export const EmployeeHome: React.FC = () => {
  const {
    currentUser,
    isClockedIn,
    isBreakActive,
    punchInTime,
    secondsWorkedToday,
    togglePunchClock,
    toggleBreak,
    punchNetworkType,
    setPunchNetworkType,
    streakDays,
    userLeaveBalance,
    leaveRequests,
    setActiveTab,
    setSelectedEmployee,
    setIsEmployeeModalOpen,
    employees,
    payslips,
    setSelectedPayslip,
    setIsPayslipModalOpen
  } = useHRMS();

  const userEmployee = employees.find(e => e.id === currentUser.employeeId) || employees[2];

  const formatTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const targetHoursSecs = 8 * 3600;
  const progressPercent = Math.min(100, (secondsWorkedToday / targetHoursSecs) * 100);

  // SVG circular timer calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleOpenMyProfile = () => {
    if (userEmployee) {
      setSelectedEmployee(userEmployee);
      setIsEmployeeModalOpen(true);
    }
  };

  const myPayslips = payslips.filter(s =>
    s.employeeId === currentUser.employeeId ||
    s.employeeName.toLowerCase() === currentUser.name.toLowerCase() ||
    (currentUser.loginId && s.loginId === currentUser.loginId)
  );

  const handleOpenLatestSlip = () => {
    if (myPayslips.length > 0) {
      setSelectedPayslip(myPayslips[0]);
      setIsPayslipModalOpen(true);
    } else {
      setActiveTab('payroll');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-blue rounded-2xl p-6 text-white shadow-card relative overflow-hidden">
        <div className="relative z-0 flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775?w=150'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md bg-slate-800"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent-mint border-2 border-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-accent-cyan text-xs font-bold font-mono">
                {currentUser.loginId || 'DFJODO20230001'}
              </span>
              <span className="text-white/60 text-xs">&bull;</span>
              <span className="text-white/80 text-xs font-medium">{currentUser.designation}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Welcome back, {currentUser.name}
            </h2>
            <p className="text-xs text-white/70 mt-0.5">
              Enterprise Employee Portal &bull; Direct access to attendance, leave balances, and salary payslips.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-0">
          <button
            onClick={handleOpenMyProfile}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-dark font-bold text-xs hover:bg-slate-50 transition-all shadow-md flex items-center gap-2"
          >
            <User className="w-3.5 h-3.5 text-brand-blue" />
            <span>My Profile & Vault</span>
          </button>
        </div>
      </div>

      {/* Grid: Punch Clock + Leave Balances + Salary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Interactive Circular Punch Clock */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-muted font-bold mb-2">
            <span>Shift Tracker (8h)</span>
            <span className="text-brand-blue font-mono">{punchInTime ? `In: ${punchInTime}` : 'Not Checked In'}</span>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative my-2">
            <svg className="w-40 h-40 -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-surface-border fill-transparent"
                strokeWidth="10"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-brand-blue fill-transparent transition-all duration-1000 ease-linear"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-black font-mono text-slate-dark tracking-tight">
                {formatTime(secondsWorkedToday)}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                isClockedIn ? (isBreakActive ? 'text-accent-amber' : 'text-accent-mint') : 'text-slate-muted'
              }`}>
                {isClockedIn ? (isBreakActive ? 'On Break' : 'Active Duty') : 'Off Duty'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full space-y-2 mt-2">
            <button
              onClick={togglePunchClock}
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isClockedIn
                  ? 'bg-accent-rose hover:bg-red-600 text-white'
                  : 'bg-brand-blue hover:bg-brand-hover text-white'
              }`}
            >
              {isClockedIn ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isClockedIn ? 'Clock Out Shift' : 'Clock In Now'}</span>
            </button>

            {isClockedIn && (
              <button
                onClick={toggleBreak}
                className={`w-full py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  isBreakActive
                    ? 'bg-accent-amber text-white border-accent-amber'
                    : 'bg-surface-bg border-surface-border text-slate-dark hover:bg-white'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{isBreakActive ? 'End Break' : 'Take a Short Break'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Leave Balances */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-muted font-bold mb-4">
              <span>Time-Off Balances</span>
              <button onClick={() => setActiveTab('leaves')} className="text-brand-blue hover:underline">
                Apply Leave &rarr;
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="p-3 bg-surface-bg border border-surface-border rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-dark text-xs">Paid Annual Leave</div>
                  <span className="text-[10px] text-slate-muted">{userLeaveBalance.paidAnnual.used} used of {userLeaveBalance.paidAnnual.total} days</span>
                </div>
                <span className="font-black text-sm text-brand-blue font-mono">
                  {userLeaveBalance.paidAnnual.remaining} Left
                </span>
              </div>

              <div className="p-3 bg-surface-bg border border-surface-border rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-dark text-xs">Paid Sick Leave</div>
                  <span className="text-[10px] text-slate-muted">{userLeaveBalance.sickLeave.used} used of {userLeaveBalance.sickLeave.total} days</span>
                </div>
                <span className="font-black text-sm text-accent-mint font-mono">
                  {userLeaveBalance.sickLeave.remaining} Left
                </span>
              </div>

              <div className="p-3 bg-surface-bg border border-surface-border rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-dark text-xs">Casual Leaves</div>
                  <span className="text-[10px] text-slate-muted">{userLeaveBalance.casualLeave.used} used of {userLeaveBalance.casualLeave.total} days</span>
                </div>
                <span className="font-black text-sm text-accent-amber font-mono">
                  {userLeaveBalance.casualLeave.remaining} Left
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('leaves')}
            className="w-full mt-4 py-2.5 rounded-xl bg-surface-bg hover:bg-brand-light text-slate-dark hover:text-brand-blue font-bold text-xs border border-surface-border transition-all flex items-center justify-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Manage All Leaves</span>
          </button>
        </div>

        {/* Card 3: Salary & Latest Payslip */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-muted font-bold mb-4">
              <span>My Compensation (₹)</span>
              <span className="text-accent-mint font-bold uppercase text-[10px] bg-accent-mint-light px-2 py-0.5 rounded-full">Disbursed</span>
            </div>

            <div className="p-4 bg-gradient-to-br from-brand-blue to-accent-cyan rounded-2xl text-white shadow-md">
              <span className="text-[10px] uppercase font-bold text-white/80">Monthly Net Take-Home</span>
              <div className="text-2xl font-black font-mono mt-0.5">
                ₹{userEmployee?.salary?.netSalary?.toLocaleString('en-IN') || '99,850'}
              </div>
              <div className="text-[10px] text-white/80 mt-1">
                Annual CTC: ₹{userEmployee?.salary?.ctc?.toLocaleString('en-IN') || '12,67,200'}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-muted">
                <span>Basic Salary:</span>
                <span className="font-bold text-slate-dark font-mono">₹{userEmployee?.salary?.basic?.toLocaleString('en-IN') || '65,000'}</span>
              </div>
              <div className="flex justify-between text-slate-muted">
                <span>EPF Contribution (12%):</span>
                <span className="font-bold text-slate-dark font-mono">₹{userEmployee?.salary?.providentFund?.toLocaleString('en-IN') || '1,800'}</span>
              </div>
              <div className="flex justify-between text-slate-muted">
                <span>Professional Tax (PT):</span>
                <span className="font-bold text-slate-dark font-mono">₹{userEmployee?.salary?.professionalTax || '200'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenLatestSlip}
            className="w-full mt-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-brand-blue/20 transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Latest Payslip (August 2026)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmployeeHome;
