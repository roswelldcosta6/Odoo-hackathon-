import React, { useState } from 'react';
import {
  CreditCard,
  FileText,
  Printer,
  CheckCircle2,
  TrendingUp,
  Download,
  Play,
  Calculator,
  Shield,
  Search,
  Lock
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Payslip } from '../../types';
import { PayslipModal } from './PayslipModal';

export const PayrollHub: React.FC = () => {
  const {
    payslips,
    selectedPayslip,
    setSelectedPayslip,
    isPayslipModalOpen,
    setIsPayslipModalOpen,
    processPayrollBatch,
    employees,
    currentRole,
    currentUser
  } = useHRMS();

  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isEmployee = currentRole === 'EMPLOYEE';

  // Role security: Employees ONLY see their own payslips
  const accessibleSlips = isEmployee
    ? payslips.filter(s =>
        s.employeeId === currentUser.employeeId ||
        s.employeeName.toLowerCase() === currentUser.name.toLowerCase() ||
        (currentUser.loginId && s.loginId === currentUser.loginId)
      )
    : payslips;

  const totalDisbursed = accessibleSlips.reduce((acc, curr) => acc + curr.netPayable, 0);

  const filteredSlips = accessibleSlips.filter(s =>
    s.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.loginId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunBatch = () => {
    if (isEmployee) return;
    setIsProcessing(true);
    setTimeout(() => {
      processPayrollBatch(selectedMonth);
      setIsProcessing(false);
    }, 1000);
  };

  const handleOpenSlip = (slip: Payslip) => {
    setSelectedPayslip(slip);
    setIsPayslipModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Payroll Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>{isEmployee ? 'My Monthly Net' : 'Total Monthly Net'}</span>
            <span className="text-accent-mint font-bold">+4.2% MoM</span>
          </div>
          <h3 className="text-2xl font-black text-slate-dark mt-1 font-mono">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-light mt-1">Disbursed for {selectedMonth}</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>{isEmployee ? 'My Generated Slips' : 'Processed Slips'}</span>
            <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-dark mt-1 font-mono">
            {accessibleSlips.length} {isEmployee ? 'Available' : `/ ${employees.length}`}
          </h3>
          <p className="text-xs text-slate-light mt-1">100% Direct Bank Transfer Dispatched</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>{isEmployee ? 'Payment Currency' : 'Average Net Salary'}</span>
            <span className="text-brand-blue font-mono font-bold">INR (₹)</span>
          </div>
          <h3 className="text-2xl font-black text-slate-dark mt-1 font-mono">
            ₹{accessibleSlips.length > 0 ? Math.round(totalDisbursed / accessibleSlips.length).toLocaleString('en-IN') : '75,000'}
          </h3>
          <p className="text-xs text-slate-light mt-1">{isEmployee ? 'Direct NEFT / RTGS Transfer' : 'Per active headcount'}</p>
        </div>

        {/* Metric 4 / Batch Runner */}
        <div className="bg-gradient-to-tr from-brand-blue to-accent-cyan rounded-2xl p-5 text-white shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>{isEmployee ? 'Payroll Status' : 'Indian Payroll Batch'}</span>
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="my-2">
            <div className="text-xs text-white/80">Batch: {selectedMonth}</div>
            <div className="text-sm font-extrabold text-white">EPFO, ESI & TDS Compliant</div>
          </div>
          {!isEmployee ? (
            <button
              onClick={handleRunBatch}
              disabled={isProcessing}
              className="w-full py-2 rounded-xl bg-white text-brand-blue font-bold text-xs hover:bg-white/90 shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-75"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isProcessing ? 'Processing Batch...' : 'Disburse Salaries'}</span>
            </button>
          ) : (
            <div className="text-xs text-white/90 font-medium">Disbursed on last working day</div>
          )}
        </div>
      </div>

      {/* Main Payslip Table */}
      <div className="bg-white border border-surface-border rounded-2xl shadow-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-dark tracking-tight">
              {isEmployee ? 'My Official Salary Payslips' : 'Indian Payroll Register & Salary Slips'}
            </h3>
            <p className="text-xs text-slate-muted">
              {isEmployee
                ? 'View and download your monthly salary statements with EPF, PT, and tax breakdowns.'
                : 'Auto-calculated PF (12%), Professional Tax (₹200), ESI (0.75%), TDS, and Direct Bank NEFT/RTGS.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isEmployee && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search staff, code, dept..."
                  className="bg-surface-bg border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-dark focus:border-brand-blue focus:outline-none w-56"
                />
              </div>
            )}

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-surface-bg border border-surface-border rounded-xl px-3 py-2 text-xs font-bold text-slate-dark focus:border-brand-blue focus:outline-none"
            >
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
            </select>
          </div>
        </div>

        {/* Payslips Table */}
        <div className="overflow-x-auto border border-surface-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-slate-muted font-bold uppercase">
              <tr>
                <th className="p-3.5">Employee</th>
                <th className="p-3.5">Login / Staff ID</th>
                <th className="p-3.5">Gross Earnings (₹)</th>
                <th className="p-3.5">EPF (12%)</th>
                <th className="p-3.5">PT / TDS</th>
                <th className="p-3.5">Net Payable (₹)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredSlips.map((slip) => (
                <tr key={slip.id} className="hover:bg-surface-bg/50 transition-colors">
                  <td className="p-3.5">
                    <div>
                      <div className="font-extrabold text-slate-dark">{slip.employeeName}</div>
                      <div className="text-[10px] text-slate-muted">{slip.designation} &bull; {slip.department}</div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-brand-blue">
                    {slip.loginId || slip.employeeCode}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-dark">
                    ₹{slip.earnings.grossTotal.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-mono text-slate-dark">
                    ₹{slip.deductions.employeePF.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-mono text-slate-dark">
                    ₹{(slip.deductions.professionalTax + slip.deductions.incomeTaxTDS).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-mono font-black text-accent-mint text-sm">
                    ₹{slip.netPayable.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-mint-light text-accent-mint font-bold text-[10px] uppercase">
                      {slip.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleOpenSlip(slip)}
                      className="px-3 py-1.5 rounded-xl bg-brand-light hover:bg-brand-blue hover:text-white text-brand-blue font-bold text-xs transition-all flex items-center gap-1 ml-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Payslip Modal */}
      <PayslipModal />
    </div>
  );
};

export default PayrollHub;
