import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  FileText,
  Printer,
  CheckCircle2,
  TrendingUp,
  Download,
  Play,
  Calculator,
  Shield,
  Search,
  Sparkles
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
    currentRole
  } = useHRMS();

  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalDisbursed = payslips.reduce((acc, curr) => acc + curr.netPayable, 0);

  const filteredSlips = payslips.filter(s =>
    s.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunBatch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      processPayrollBatch(selectedMonth);
      setIsProcessing(false);
    }, 1200);
  };

  const handleOpenSlip = (slip: Payslip) => {
    setSelectedPayslip(slip);
    setIsPayslipModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Payroll Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Monthly Payout */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>Total Monthly Net</span>
            <span className="text-accent-mint font-bold">+4.2% YoY</span>
          </div>
          <h3 className="text-2xl font-black text-slate-dark mt-1 font-mono">
            ${totalDisbursed.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-light mt-1">Disbursed for {selectedMonth}</p>
        </div>

        {/* Total Slips Generated */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>Processed Slips</span>
            <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-dark mt-1 font-mono">
            {payslips.length} / {employees.length}
          </h3>
          <p className="text-xs text-slate-light mt-1">100% Direct Deposit Dispatched</p>
        </div>

        {/* Avg Salary / Employee */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>Average Net Salary</span>
            <span className="text-brand-blue font-mono font-bold">USD</span>
          </div>
          <h3 className="text-2xl font-black text-slate-dark mt-1 font-mono">
            ${payslips.length > 0 ? Math.round(totalDisbursed / payslips.length).toLocaleString() : '8,425'}
          </h3>
          <p className="text-xs text-slate-light mt-1">Per active headcount</p>
        </div>

        {/* Batch Generator Action Card */}
        <div className="bg-gradient-to-tr from-brand-blue to-accent-cyan rounded-2xl p-5 text-white shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Cycle Runner</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Auto Tax</span>
          </div>
          <p className="text-xs text-white/90 my-1">
            Compute gross-to-net, generate PDF payslips with QR stamps.
          </p>
          {(currentRole === 'ADMIN' || currentRole === 'HR_OFFICER') ? (
            <button
              onClick={handleRunBatch}
              disabled={isProcessing}
              className="w-full py-2 rounded-xl bg-white text-brand-blue font-bold text-xs hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-70"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isProcessing ? 'Processing Batch...' : 'Run Payroll Batch'}</span>
            </button>
          ) : (
            <span className="text-xs text-white/80 italic">Viewing your personal slips</span>
          )}
        </div>
      </div>

      {/* Dynamic Formula Builder Breakdown Card */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-blue" />
            <h3 className="font-extrabold text-slate-dark text-sm">
              Enterprise Compensation Formula & Deductions Policy
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-light text-brand-blue">
            Standard Structure
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
            <span className="text-slate-muted text-[10px] uppercase font-bold">Basic Pay</span>
            <div className="font-extrabold text-slate-dark text-sm mt-0.5">50% Gross</div>
            <p className="text-[10px] text-slate-light mt-0.5">Taxable baseline</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
            <span className="text-slate-muted text-[10px] uppercase font-bold">House Rent (HRA)</span>
            <div className="font-extrabold text-slate-dark text-sm mt-0.5">30% Gross</div>
            <p className="text-[10px] text-slate-light mt-0.5">Exemption eligible</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
            <span className="text-slate-muted text-[10px] uppercase font-bold">Special Allowances</span>
            <div className="font-extrabold text-slate-dark text-sm mt-0.5">20% Gross</div>
            <p className="text-[10px] text-slate-light mt-0.5">Flexible benefits</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
            <span className="text-slate-muted text-[10px] uppercase font-bold">Provident Fund (PF)</span>
            <div className="font-extrabold text-accent-rose text-sm mt-0.5">-12% Basic</div>
            <p className="text-[10px] text-slate-light mt-0.5">Statutory retirement</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
            <span className="text-slate-muted text-[10px] uppercase font-bold">Tax & Insurance</span>
            <div className="font-extrabold text-accent-rose text-sm mt-0.5">TDS + PTax</div>
            <p className="text-[10px] text-slate-light mt-0.5">Monthly withholding</p>
          </div>
        </div>
      </div>

      {/* Payslips Registry Table */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-dark tracking-tight">
              Payslip Archive & Digital Disbursement
            </h2>
            <p className="text-xs text-slate-muted">
              Itemized salary breakdowns and 1-click downloadable signed PDF slips
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search payslip by staff..."
                className="w-full bg-surface-bg border border-surface-border text-xs rounded-xl pl-9 pr-3 py-2 text-slate-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-surface-bg border border-surface-border text-slate-dark text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
              <option value="June 2026">June 2026</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-surface-border rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-bg border-b border-surface-border text-slate-muted uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Ref Number</th>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4 text-right">Gross Earnings</th>
                <th className="py-3.5 px-4 text-right">Deductions</th>
                <th className="py-3.5 px-4 text-right">Net Take-Home</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredSlips.map(slip => (
                <tr key={slip.id} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-muted">{slip.slipNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-dark">{slip.employeeName}</div>
                    <div className="text-[10px] text-slate-light font-mono">{slip.employeeCode}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-dark">{slip.designation}</div>
                    <div className="text-[10px] text-slate-muted">{slip.department}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-dark">
                    ${slip.earnings.grossTotal.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-accent-rose">
                    -${slip.deductions.totalDeductions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-brand-blue text-sm">
                    ${slip.netPayable.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-mint-light text-accent-mint border border-accent-mint/30">
                      {slip.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenSlip(slip)}
                      className="px-3 py-1.5 rounded-xl bg-brand-light hover:bg-brand-blue hover:text-white text-brand-blue font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Payslip Modal */}
      <PayslipModal />
    </div>
  );
};
