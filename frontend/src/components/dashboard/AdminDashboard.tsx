import React from 'react';
import { MetricsRow } from './MetricsRow';
import { AttendanceSalaryChart } from './AttendanceSalaryChart';
import { DepartmentAnalysisChart } from './DepartmentAnalysisChart';
import { EmployeeStructureChart } from './EmployeeStructureChart';
import { MusterRollTable } from './MusterRollTable';
import { Calendar, ArrowRight, ShieldCheck, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

export const AdminDashboard: React.FC = () => {
  const { currentUser, currentRole, setActiveTab, leaveRequests, employees } = useHRMS();

  const pendingLeaves = leaveRequests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-blue via-[#0069D9] to-accent-cyan rounded-2xl p-6 text-white shadow-card relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-48 bottom-0 translate-y-12 w-48 h-48 rounded-full bg-accent-mint/20 blur-xl pointer-events-none" />

        <div className="relative z-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
              {currentRole === 'ADMIN' ? '👑 Executive Admin View' : '💼 HR Command View'}
            </span>
            <span className="text-white/80 text-xs">·</span>
            <span className="text-white/80 text-xs font-medium">Saturday, August 22, 2026</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-sm text-white/85 mt-1 max-w-xl">
            Real-time workforce health is running at <strong className="text-accent-mint font-bold">92.4% presence</strong> with {employees.length} active team members.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-3 relative z-0">
          {pendingLeaves > 0 && (
            <button
              onClick={() => setActiveTab('leaves')}
              className="px-4 py-2.5 rounded-xl bg-white text-brand-blue font-bold text-xs hover:bg-slate-50 transition-all shadow-md flex items-center gap-2"
            >
              <span>Review Time-Off ({pendingLeaves})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setActiveTab('payroll')}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 backdrop-blur-sm transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Payroll Register</span>
          </button>
        </div>
      </div>

      {/* Row 1: Key Metrics */}
      <MetricsRow />

      {/* Row 2: Charts Grid (Attendance & Salary Unit Breakdown + Department Share) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceSalaryChart />
        </div>
        <div>
          <DepartmentAnalysisChart />
        </div>
      </div>

      {/* Row 3: Employee Structure & Diversity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <EmployeeStructureChart />
        </div>
      </div>

      {/* Row 4: Daily Muster Roll & Live Presence Register */}
      <MusterRollTable />
    </div>
  );
};

export default AdminDashboard;
