import React from 'react';
import {
  X,
  Printer,
  ArrowLeft,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

export const PayslipModal: React.FC = () => {
  const { selectedPayslip, isPayslipModalOpen, setIsPayslipModalOpen, setSelectedPayslip } = useHRMS();

  if (!isPayslipModalOpen || !selectedPayslip) return null;

  const handleClose = () => {
    setIsPayslipModalOpen(false);
    setSelectedPayslip(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const earnings = selectedPayslip.earnings;
  const deductions = selectedPayslip.deductions;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-surface-border rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in my-8">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="no-print bg-surface-bg border-b border-surface-border p-4 px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-surface-border text-slate-dark hover:bg-brand-light hover:text-brand-blue font-bold text-xs shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Payroll</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-brand-blue text-white hover:bg-brand-hover text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-muted hover:text-slate-dark hover:bg-surface-border transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Document Container */}
        <div id="printable-payslip" className="p-8 text-slate-dark bg-white space-y-5">
          
          {/* Header & Company Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-brand-blue pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center text-white font-black text-xl shadow-md">
                DF
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-dark tracking-tight">
                  Dayflow Technologies India Pvt. Ltd.
                </h1>
                <p className="text-xs text-slate-muted">
                  Bandra-Kurla Complex (BKC), G-Block &bull; Mumbai, Maharashtra 400051
                </p>
                <p className="text-[10px] text-slate-light font-mono">
                  CIN: U72200MH2021PTC123456 &bull; GSTIN: 27AABCD1234F1ZK
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                Salary Statement
              </div>
              <div className="text-sm font-black font-mono mt-0.5">
                {selectedPayslip.month}
              </div>
              <div className="text-[10px] text-slate-light font-mono">
                Ref: {selectedPayslip.slipNumber}
              </div>
            </div>
          </div>

          {/* Employee & Bank Info Grid */}
          <div className="grid grid-cols-2 gap-4 bg-surface-bg p-4 rounded-xl border border-surface-border text-xs">
            <div className="space-y-1.5">
              <div>
                <span className="text-slate-muted">Employee Name:</span>{' '}
                <strong className="text-slate-dark">{selectedPayslip.employeeName}</strong>
              </div>
              <div>
                <span className="text-slate-muted">Login / Staff ID:</span>{' '}
                <strong className="text-brand-blue font-mono">{selectedPayslip.loginId || selectedPayslip.employeeCode}</strong>
              </div>
              <div>
                <span className="text-slate-muted">Designation:</span>{' '}
                <strong className="text-slate-dark">{selectedPayslip.designation}</strong>
              </div>
              <div>
                <span className="text-slate-muted">Department:</span>{' '}
                <strong className="text-slate-dark">{selectedPayslip.department}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <div>
                <span className="text-slate-muted">Bank Account:</span>{' '}
                <strong className="text-slate-dark font-mono">{selectedPayslip.bankAccount}</strong>
              </div>
              <div>
                <span className="text-slate-muted">IFSC Code:</span>{' '}
                <strong className="text-slate-dark font-mono">{selectedPayslip.ifscCode || 'HDFC0001234'}</strong>
              </div>
              <div>
                <span className="text-slate-muted">PAN Number:</span>{' '}
                <strong className="text-slate-dark font-mono">{selectedPayslip.panNumber}</strong>
              </div>
              <div>
                <span className="text-slate-muted">UAN / EPFO:</span>{' '}
                <strong className="text-slate-dark font-mono">{selectedPayslip.uanNumber}</strong>
              </div>
            </div>
          </div>

          {/* Working Days Summary */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs bg-surface-bg/60 p-2.5 rounded-xl border border-surface-border">
            <div>
              <span className="text-slate-muted block text-[10px] uppercase font-bold">Total Days</span>
              <strong className="font-mono">{selectedPayslip.workingDays}</strong>
            </div>
            <div>
              <span className="text-slate-muted block text-[10px] uppercase font-bold">Days Worked</span>
              <strong className="font-mono text-accent-mint">{selectedPayslip.daysWorked}</strong>
            </div>
            <div>
              <span className="text-slate-muted block text-[10px] uppercase font-bold">Disbursement Date</span>
              <strong className="font-mono">{selectedPayslip.payDate}</strong>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Earnings */}
            <div className="border border-surface-border rounded-xl overflow-hidden">
              <div className="bg-brand-light px-3.5 py-2 font-extrabold text-brand-blue flex justify-between">
                <span>Earnings Breakdown</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-surface-border p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-muted">Basic Salary</span>
                  <span className="font-mono font-semibold">₹{earnings.basic.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-muted">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold">₹{earnings.hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-muted">Conveyance Allowance</span>
                  <span className="font-mono font-semibold">₹{earnings.conveyance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-muted">Special Allowance</span>
                  <span className="font-mono font-semibold">₹{earnings.specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-muted">Performance Incentive</span>
                  <span className="font-mono font-semibold">₹{earnings.performanceBonus.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-dark border-t border-surface-border">
                  <span>Gross Earnings</span>
                  <span className="font-mono text-brand-blue">₹{earnings.grossTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-surface-border rounded-xl overflow-hidden">
              <div className="bg-accent-amber-light px-3.5 py-2 font-extrabold text-accent-amber flex justify-between">
                <span>Statutory Deductions</span>
                <span>Amount (₹)</span>
              </div>
              <div className="divide-y divide-surface-border p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-muted">Provident Fund (EPF 12%)</span>
                  <span className="font-mono font-semibold">₹{deductions.employeePF.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-muted">Professional Tax (PT)</span>
                  <span className="font-mono font-semibold">₹{deductions.professionalTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-muted">Income Tax (TDS)</span>
                  <span className="font-mono font-semibold">₹{deductions.incomeTaxTDS.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-muted">Group Health Insurance</span>
                  <span className="font-mono font-semibold">₹{deductions.healthInsurance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-dark border-t border-surface-border">
                  <span>Total Deductions</span>
                  <span className="font-mono text-accent-rose">₹{deductions.totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight Box */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Net Salary Payable</span>
              <div className="text-2xl font-black font-mono text-accent-mint mt-0.5">
                ₹{selectedPayslip.netPayable.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-300 italic mt-0.5">{selectedPayslip.netPayableWords}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Payment Status</span>
              <div className="flex items-center gap-1.5 text-accent-mint font-bold text-sm mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Disbursed</span>
              </div>
            </div>
          </div>

          {/* Footer & Digital QR Authentication */}
          <div className="flex items-center justify-between pt-3 border-t border-surface-border text-[11px] text-slate-muted">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-surface-bg border border-surface-border flex items-center justify-center p-1">
                <QrCode className="w-10 h-10 text-slate-dark" />
              </div>
              <div>
                <p className="font-bold text-slate-dark">Digitally Certified by Dayflow Automated Payroll</p>
                <p className="text-[10px] text-slate-light">Scan QR to authenticate payslip hash on secure ledger.</p>
              </div>
            </div>

            <div className="text-right">
              <div className="w-32 border-b border-slate-300 pb-1 text-center font-bold text-slate-dark font-mono text-xs">
                Marcus Vance
              </div>
              <span className="text-[10px] text-slate-light">Authorized Signatory</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PayslipModal;
