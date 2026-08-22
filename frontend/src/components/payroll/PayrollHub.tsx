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
  Plus,
  X,
  AlertCircle
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Payslip, Employee } from '../../types';
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
  const [isAddSlipOpen, setIsAddSlipOpen] = useState(false);

  // New slip form state
  const [newSlipEmpId, setNewSlipEmpId] = useState(employees[0]?.id || '');
  const [newSlipMonth, setNewSlipMonth] = useState('August 2026');
  const [newSlipBasic, setNewSlipBasic] = useState(65000);
  const [newSlipBonus, setNewSlipBonus] = useState(2500);
  const [newSlipWorkingDays, setNewSlipWorkingDays] = useState(22);
  const [newSlipDaysWorked, setNewSlipDaysWorked] = useState(22);

  const isEmployee = currentRole === 'EMPLOYEE';
  const canManagePayroll = currentRole === 'ADMIN' || currentRole === 'HR_OFFICER';

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

  const handleCreateNewSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === newSlipEmpId) || employees[0];
    if (!emp) return;

    const basic = Number(newSlipBasic) || 65000;
    const hra = Math.round(basic * 0.40);
    const conveyance = 1600;
    const special = Math.round(basic * 0.20);
    const bonus = Number(newSlipBonus) || 0;
    const gross = basic + hra + conveyance + special + bonus;

    const pf = Math.min(Math.round(basic * 0.12), 1800);
    const pt = gross > 10000 ? 200 : 0;
    const tds = Math.round(basic * 0.05);
    const ins = 500;
    const totDed = pf + pt + tds + ins;
    const net = gross - totDed;

    const newSlip: Payslip = {
      id: `ps-${Date.now()}`,
      slipNumber: `PAY-2026-${(payslips.length + 1).toString().padStart(4, '0')}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      employeeCode: emp.employeeCode,
      loginId: emp.loginId,
      designation: emp.designation,
      department: emp.department,
      panNumber: emp.pan || 'ABCDE1234F',
      bankAccount: emp.bankAccountNo || '50200012345678',
      ifscCode: emp.ifscCode || 'HDFC0001234',
      uanNumber: emp.uanNumber || '100123456789',
      month: newSlipMonth,
      payDate: '2026-08-31',
      workingDays: Number(newSlipWorkingDays) || 22,
      daysWorked: Number(newSlipDaysWorked) || 22,
      earnings: {
        basic,
        hra,
        conveyance,
        specialAllowance: special,
        performanceBonus: bonus,
        grossTotal: gross
      },
      deductions: {
        employeePF: pf,
        professionalTax: pt,
        incomeTaxTDS: tds,
        healthInsurance: ins,
        totalDeductions: totDed
      },
      netPayable: net,
      netPayableWords: 'Rupees ' + net.toLocaleString('en-IN') + ' Only',
      paymentStatus: 'PAID'
    };

    payslips.unshift(newSlip);
    setIsAddSlipOpen(false);
    handleOpenSlip(newSlip);
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

          <div className="flex items-center gap-3 flex-wrap">
            {canManagePayroll && (
              <button
                type="button"
                onClick={() => setIsAddSlipOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-brand-blue/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Generate New Slip</span>
              </button>
            )}

            {!isEmployee && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search staff, code, dept..."
                  className="bg-surface-bg border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-dark focus:border-brand-blue focus:outline-none w-52"
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
                      className="px-3 py-1.5 rounded-xl bg-brand-light hover:bg-brand-blue hover:text-white text-brand-blue font-bold text-xs transition-all flex items-center gap-1 ml-auto shadow-sm"
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

      {/* Generate New Payslip Modal */}
      {isAddSlipOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-surface-border rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in my-8">
            <div className="bg-gradient-to-r from-slate-900 to-brand-blue flex items-center justify-between p-5 text-white">
              <div>
                <h3 className="font-extrabold text-lg">Generate Indian Payslip (₹)</h3>
                <p className="text-xs text-white/80">Issue an official salary statement with statutory Indian tax compliance.</p>
              </div>
              <button onClick={() => setIsAddSlipOpen(false)} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSlip} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-dark mb-1">Select Employee</label>
                <select
                  value={newSlipEmpId}
                  onChange={(e) => {
                    setNewSlipEmpId(e.target.value);
                    const emp = employees.find(x => x.id === e.target.value);
                    if (emp?.salary?.basic) setNewSlipBasic(emp.salary.basic);
                  }}
                  className="w-full bg-surface-bg border border-surface-border text-slate-dark font-bold rounded-xl p-2.5"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.loginId || emp.employeeCode}) - {emp.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Salary Month</label>
                  <select
                    value={newSlipMonth}
                    onChange={(e) => setNewSlipMonth(e.target.value)}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  >
                    <option value="August 2026">August 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="October 2026">October 2026</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Basic Salary (₹)</label>
                  <input
                    type="number"
                    step="1000"
                    value={newSlipBasic}
                    onChange={(e) => setNewSlipBasic(Number(e.target.value))}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark font-bold font-mono rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Bonus (₹)</label>
                  <input
                    type="number"
                    step="500"
                    value={newSlipBonus}
                    onChange={(e) => setNewSlipBonus(Number(e.target.value))}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Total Days</label>
                  <input
                    type="number"
                    value={newSlipWorkingDays}
                    onChange={(e) => setNewSlipWorkingDays(Number(e.target.value))}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Days Worked</label>
                  <input
                    type="number"
                    value={newSlipDaysWorked}
                    onChange={(e) => setNewSlipDaysWorked(Number(e.target.value))}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* Live Indian Salary Preview */}
              <div className="p-3.5 bg-brand-light/50 border border-brand-subtle rounded-2xl space-y-1.5">
                <div className="flex justify-between font-bold text-slate-dark">
                  <span>Gross Pay (Basic + HRA + Allowances + Bonus):</span>
                  <span className="font-mono text-brand-blue">
                    ₹{(Number(newSlipBasic) + Math.round(Number(newSlipBasic) * 0.4) + 1600 + Math.round(Number(newSlipBasic) * 0.2) + Number(newSlipBonus)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-muted">
                  <span>EPFO (12%) + Professional Tax (₹200) + TDS:</span>
                  <span className="font-mono text-accent-rose">
                    -₹{(Math.min(Math.round(Number(newSlipBasic) * 0.12), 1800) + 200 + Math.round(Number(newSlipBasic) * 0.05) + 500).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between font-black text-slate-dark pt-1 border-t border-brand-subtle text-sm">
                  <span>Net Take-Home Payable:</span>
                  <span className="font-mono text-accent-mint">
                    ₹{(
                      Number(newSlipBasic) + Math.round(Number(newSlipBasic) * 0.4) + 1600 + Math.round(Number(newSlipBasic) * 0.2) + Number(newSlipBonus) -
                      (Math.min(Math.round(Number(newSlipBasic) * 0.12), 1800) + 200 + Math.round(Number(newSlipBasic) * 0.05) + 500)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsAddSlipOpen(false)} className="px-4 py-2 rounded-xl text-slate-muted hover:text-slate-dark font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold shadow-md shadow-brand-blue/30">
                  Generate & View Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      <PayslipModal />
    </div>
  );
};

export default PayrollHub;
