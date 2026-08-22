import React, { useState } from 'react';
import {
  MoreVertical,
  Eye,
  FileText,
  MessageSquare,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Employee } from '../../types';

export const MusterRollTable: React.FC = () => {
  const {
    employees,
    setSelectedEmployee,
    setIsEmployeeModalOpen,
    setSelectedPayslip,
    setIsPayslipModalOpen,
    payslips,
    setActiveTab
  } = useHRMS();

  const [filterDept, setFilterDept] = useState<string>('ALL');

  const filteredEmployees = employees.filter(emp => {
    if (filterDept === 'ALL') return true;
    return emp.department === filterDept;
  });

  const getStatusBadge = (rating: Employee['performanceRating']) => {
    switch (rating) {
      case 'EXCELLENT':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent-mint-light text-accent-mint border border-accent-mint/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
            EXCELLENT
          </span>
        );
      case 'GOOD':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-blue border border-brand-subtle flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
            GOOD
          </span>
        );
      case 'AVERAGE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent-lavender-light text-slate-dark border border-accent-lavender flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-lavender" />
            AVERAGE
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent-amber-light text-accent-amber border border-accent-amber/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" />
            ATTENTION
          </span>
        );
      default:
        return null;
    }
  };

  const handleViewProfile = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleViewPayslip = (emp: Employee) => {
    const slip = payslips.find(s => s.employeeId === emp.id) || payslips[0];
    setSelectedPayslip(slip);
    setIsPayslipModalOpen(true);
  };

  return (
    <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-dark text-base tracking-tight">
              Employee Performance / Muster Roll
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-accent-mint-light text-accent-mint text-[10px] font-bold">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-muted">
            Individual attendance health, efficiency ratings, and direct actions
          </p>
        </div>

        {/* Filter by Department */}
        <div className="flex items-center gap-2">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-surface-bg border border-surface-border text-slate-dark text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>

          <button
            onClick={() => setActiveTab('employees')}
            className="text-xs font-bold text-brand-blue hover:text-brand-hover px-2.5 py-1.5 rounded-xl hover:bg-brand-light transition-colors whitespace-nowrap"
          >
            View All ({employees.length}) →
          </button>
        </div>
      </div>

      {/* Table Container with Soft Border & Rounded Corners */}
      <div className="overflow-x-auto border border-surface-border rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-bg border-b border-surface-border text-slate-muted uppercase font-bold text-[10px] tracking-wider">
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department & Role</th>
              <th className="py-3 px-4 text-center">Attendance %</th>
              <th className="py-3 px-4 text-center">Performance Rating</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filteredEmployees.slice(0, 5).map(emp => (
              <tr
                key={emp.id}
                className="hover:bg-surface-hover transition-colors group cursor-pointer"
                onClick={() => handleViewProfile(emp)}
              >
                {/* Employee Name & Avatar */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={emp.avatarUrl}
                        alt={emp.firstName}
                        className="w-9 h-9 rounded-xl object-cover border border-white shadow-sm"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          emp.employmentStatus === 'ACTIVE'
                            ? 'bg-accent-mint'
                            : emp.employmentStatus === 'ON_LEAVE'
                            ? 'bg-accent-amber'
                            : 'bg-slate-light'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-dark group-hover:text-brand-blue transition-colors">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="text-[10px] text-slate-light font-mono">
                        {emp.employeeCode}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Designation & Dept */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-dark">{emp.designation}</div>
                  <div className="text-[10px] text-slate-muted">{emp.department}</div>
                </td>

                {/* Attendance Rate */}
                <td className="py-3 px-4 text-center">
                  <div className="inline-flex items-center gap-1.5 font-bold font-mono text-slate-dark">
                    <div className="w-12 bg-surface-border rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-accent-cyan h-full rounded-full"
                        style={{ width: `${emp.attendanceRate}%` }}
                      />
                    </div>
                    <span>{emp.attendanceRate}%</span>
                  </div>
                </td>

                {/* Performance Pill Badge */}
                <td className="py-3 px-4 text-center">
                  <div className="inline-flex justify-center">
                    {getStatusBadge(emp.performanceRating)}
                  </div>
                </td>

                {/* Employment Status */}
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      emp.employmentStatus === 'ACTIVE'
                        ? 'bg-accent-mint-light text-accent-mint'
                        : emp.employmentStatus === 'ON_LEAVE'
                        ? 'bg-accent-amber-light text-accent-amber'
                        : 'bg-slate-100 text-slate-muted'
                    }`}
                  >
                    {emp.employmentStatus.replace('_', ' ')}
                  </span>
                </td>

                {/* Actions */}
                <td
                  className="py-3 px-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleViewProfile(emp)}
                      className="p-1.5 rounded-lg text-slate-muted hover:text-brand-blue hover:bg-brand-light transition-colors"
                      title="View Full Profile & Vault"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewPayslip(emp)}
                      className="p-1.5 rounded-lg text-slate-muted hover:text-brand-blue hover:bg-brand-light transition-colors"
                      title="Download PDF Payslip"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer quick info */}
      <div className="pt-3 mt-2 border-t border-surface-border flex items-center justify-between text-xs text-slate-muted">
        <span>Showing top performers across all active business units</span>
        <button
          onClick={() => setActiveTab('attendance')}
          className="text-xs font-semibold text-brand-blue hover:underline"
        >
          Open Attendance Muster Roll →
        </button>
      </div>
    </div>
  );
};
