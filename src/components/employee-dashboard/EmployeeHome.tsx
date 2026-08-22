import React from 'react';
import {
  Clock,
  Play,
  Square,
  Coffee,
  CalendarCheck,
  CreditCard,
  User,
  Sparkles,
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
    setIsCopilotOpen,
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

  const weeklySchedule = [
    { day: 'Mon', date: 'Aug 17', hours: '8.4h', status: 'PRESENT' },
    { day: 'Tue', date: 'Aug 18', hours: '8.2h', status: 'PRESENT' },
    { day: 'Wed', date: 'Aug 19', hours: '8.5h', status: 'PRESENT' },
    { day: 'Thu', date: 'Aug 20', hours: '8.1h', status: 'PRESENT' },
    { day: 'Fri', date: 'Aug 21', hours: '8.0h', status: 'PRESENT' },
    { day: 'Sat', date: 'Aug 22', hours: `${(secondsWorkedToday / 3600).toFixed(1)}h`, status: 'TODAY' },
    { day: 'Sun', date: 'Aug 23', hours: '-', status: 'OFF' },
  ];

  const handleOpenMyPayslip = () => {
    const slip = payslips.find(s => s.employeeId === userEmployee.id) || payslips[0];
    setSelectedPayslip(slip);
    setIsPayslipModalOpen(true);
  };

  const handleOpenMyProfile = () => {
    setSelectedEmployee(userEmployee);
    setIsEmployeeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-light shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent-mint border-2 border-white shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-dark tracking-tight">
                Hello, {currentUser.name} 👋
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-blue text-xs font-bold">
                {userEmployee.designation}
              </span>
            </div>
            <p className="text-xs text-slate-muted mt-0.5">
              {userEmployee.department} · Employee Code: <strong className="font-mono text-slate-dark">{userEmployee.employeeCode}</strong>
            </p>
          </div>
        </div>

        {/* Gamified Streak & AI trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-amber-light text-accent-amber border border-accent-amber/30 text-xs font-bold shadow-sm">
            <Flame className="w-4 h-4 fill-accent-amber text-accent-amber animate-bounce" />
            <div>
              <div className="leading-tight">{streakDays}-Day Streak!</div>
              <div className="text-[10px] opacity-80">Punctuality Champ 🏆</div>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-accent-cyan text-white text-xs font-bold shadow-md shadow-brand-blue/20 hover:opacity-95 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Dayflow AI</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Punch Widget + Stats + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Punch Clock Card (1 col) */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-muted">
              Live Punch Clock
            </span>
            
            {/* Geofence tag */}
            <button
              onClick={() => setPunchNetworkType(punchNetworkType === 'OFFICE_WIFI' ? 'REMOTE_IP' : 'OFFICE_WIFI')}
              className="flex items-center gap-1 text-[11px] font-semibold text-brand-blue bg-brand-light px-2.5 py-1 rounded-full border border-brand-subtle"
            >
              {punchNetworkType === 'OFFICE_WIFI' ? (
                <>
                  <Wifi className="w-3 h-3 text-brand-blue" />
                  <span>Office HQ</span>
                </>
              ) : (
                <>
                  <Home className="w-3 h-3 text-accent-lavender" />
                  <span>Remote WFH</span>
                </>
              )}
            </button>
          </div>

          {/* Circular SVG Timer */}
          <div className="relative w-48 h-48 flex items-center justify-center my-2">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="text-surface-border stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke={isBreakActive ? '#FF9F43' : isClockedIn ? '#007BFF' : '#CBD5E1'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Timer digits inside donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-2xl font-black text-slate-dark tracking-tight">
                {formatTime(secondsWorkedToday)}
              </span>
              <span className="text-[11px] font-bold text-slate-muted mt-0.5">
                Target: 8h 00m
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase ${
                  isBreakActive
                    ? 'bg-accent-amber-light text-accent-amber'
                    : isClockedIn
                    ? 'bg-accent-mint-light text-accent-mint'
                    : 'bg-slate-100 text-slate-light'
                }`}
              >
                {isBreakActive ? 'Break Time' : isClockedIn ? 'Active · Clocked In' : 'Punched Out'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-muted mb-4">
            {isClockedIn
              ? `Checked in at ${punchInTime} · IP: 192.168.1.104`
              : 'You are currently clocked out. Punch in to track workday.'}
          </p>

          {/* Punch Actions */}
          <div className="w-full flex items-center gap-3">
            <button
              onClick={togglePunchClock}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                isClockedIn
                  ? 'bg-accent-rose hover:bg-red-600 shadow-accent-rose/20'
                  : 'bg-brand-blue hover:bg-brand-hover shadow-brand-blue/30'
              }`}
            >
              {isClockedIn ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Punch Out</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Punch In</span>
                </>
              )}
            </button>

            {isClockedIn && (
              <button
                onClick={toggleBreak}
                className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  isBreakActive
                    ? 'bg-accent-amber text-white border-accent-amber shadow-sm'
                    : 'bg-surface-bg text-slate-dark hover:bg-surface-border border-surface-border'
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span>{isBreakActive ? 'Resume' : 'Break'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Columns: Stats & Timesheets (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Action Cards Grid (4 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={handleOpenMyProfile}
              className="bg-white border border-surface-border rounded-2xl p-4 shadow-card hover:border-brand-blue hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-dark">My Profile</h4>
              <p className="text-[11px] text-slate-muted mt-0.5">Contact & Vault</p>
            </div>

            <div
              onClick={() => setActiveTab('attendance')}
              className="bg-white border border-surface-border rounded-2xl p-4 shadow-card hover:border-accent-cyan hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-cyan-light text-accent-cyan flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-dark">Attendance</h4>
              <p className="text-[11px] text-slate-muted mt-0.5">Timesheet Logs</p>
            </div>

            <div
              onClick={() => setActiveTab('leaves')}
              className="bg-white border border-surface-border rounded-2xl p-4 shadow-card hover:border-accent-mint hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-mint-light text-accent-mint flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-dark">Time-Off</h4>
              <p className="text-[11px] text-slate-muted mt-0.5">Apply & Balances</p>
            </div>

            <div
              onClick={handleOpenMyPayslip}
              className="bg-white border border-surface-border rounded-2xl p-4 shadow-card hover:border-accent-lavender hover:shadow-md cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-lavender-light text-accent-lavender flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-dark">My Payroll</h4>
              <p className="text-[11px] text-slate-muted mt-0.5">PDF Payslips</p>
            </div>
          </div>

          {/* Leave Quota Balance Overview */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-dark text-sm">
                  My Leave Balances
                </h3>
                <p className="text-xs text-slate-muted">Annual Quota Cycle 2026</p>
              </div>
              <button
                onClick={() => setActiveTab('leaves')}
                className="text-xs font-bold text-brand-blue hover:text-brand-hover"
              >
                Apply for Leave →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Paid Annual */}
              <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-border">
                <div className="flex items-center justify-between text-xs font-bold text-slate-dark mb-1">
                  <span>Paid Annual Leave</span>
                  <span className="text-brand-blue font-mono">{userLeaveBalance.paidAnnual.remaining} Left</span>
                </div>
                <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden my-2">
                  <div
                    className="bg-brand-blue h-full rounded-full"
                    style={{ width: `${(userLeaveBalance.paidAnnual.remaining / userLeaveBalance.paidAnnual.total) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-light flex justify-between">
                  <span>Used: {userLeaveBalance.paidAnnual.used}d</span>
                  <span>Quota: {userLeaveBalance.paidAnnual.total}d</span>
                </div>
              </div>

              {/* Sick Leave */}
              <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-border">
                <div className="flex items-center justify-between text-xs font-bold text-slate-dark mb-1">
                  <span>Sick Leave</span>
                  <span className="text-accent-mint font-mono">{userLeaveBalance.sickLeave.remaining} Left</span>
                </div>
                <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden my-2">
                  <div
                    className="bg-accent-mint h-full rounded-full"
                    style={{ width: `${(userLeaveBalance.sickLeave.remaining / userLeaveBalance.sickLeave.total) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-light flex justify-between">
                  <span>Used: {userLeaveBalance.sickLeave.used}d</span>
                  <span>Quota: {userLeaveBalance.sickLeave.total}d</span>
                </div>
              </div>

              {/* Casual Leave */}
              <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-border">
                <div className="flex items-center justify-between text-xs font-bold text-slate-dark mb-1">
                  <span>Casual Leave</span>
                  <span className="text-accent-amber font-mono">{userLeaveBalance.casualLeave.remaining} Left</span>
                </div>
                <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden my-2">
                  <div
                    className="bg-accent-amber h-full rounded-full"
                    style={{ width: `${(userLeaveBalance.casualLeave.remaining / userLeaveBalance.casualLeave.total) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-light flex justify-between">
                  <span>Used: {userLeaveBalance.casualLeave.used}d</span>
                  <span>Quota: {userLeaveBalance.casualLeave.total}d</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Timesheet Summary */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-dark text-sm">
                  Weekly Attendance Timesheet
                </h3>
                <p className="text-xs text-slate-muted">Week 34 · Total 41.2 Hours Logged</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-accent-mint-light text-accent-mint text-[11px] font-bold">
                100% On-Time
              </span>
            </div>

            {/* Days pills grid */}
            <div className="grid grid-cols-7 gap-2">
              {weeklySchedule.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${
                    item.status === 'TODAY'
                      ? 'bg-brand-light border-brand-blue shadow-sm'
                      : item.status === 'PRESENT'
                      ? 'bg-surface-bg border-surface-border'
                      : 'bg-slate-50 border-dashed border-surface-border text-slate-light'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-slate-muted">{item.day}</span>
                  <span className="text-xs font-black text-slate-dark my-1">{item.hours}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      item.status === 'TODAY'
                        ? 'bg-brand-blue text-white'
                        : item.status === 'PRESENT'
                        ? 'bg-accent-mint-light text-accent-mint'
                        : 'text-slate-light'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
