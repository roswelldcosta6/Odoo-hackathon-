import React from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building,
  QrCode
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Payslip } from '../../types';

export const PayslipModal: React.FC = () => {
  const { selectedPayslip, isPayslipModalOpen, setIsPayslipModalOpen } = useHRMS();

  if (!isPayslipModalOpen || !selectedPayslip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-dark/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-surface-border rounded-2xl shadow-float w-full max-w-2xl overflow-hidden animate-scale-in my-8">
        
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="no-print bg-surface-bg border-b border-surface-border p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-dark text-sm">Official Payslip Preview</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-accent-mint-light text-accent-mint border border-accent-mint/30">
              Verified & Signed
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-brand-blue text-white hover:bg-brand-hover text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsPayslipModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-muted hover:text-slate-dark hover:bg-surface-border transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Document Container */}
        <div id="printable-payslip" className="p-8 text-slate-dark bg-white space-y-6">
          
          {/* Header & Company Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-brand-blue pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center text-white font-black text-xl shadow-md">
                DF
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-dark tracking-tight">
                  Dayflow Technologies Inc.
                </h1>
                <p className="text-xs text-slate-muted">
                  500 Howard Street, Suite 400 · San Francisco, CA 94105
                </p>
                <p className="text-[10px] text-slate-light font-mono">
                  EIN: 84-2910482 · HR Payroll Division
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                Confidential Payslip
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
                <span className="text-slate-muted">Employee ID:</span>{' '}
                <strong className="text-slate-dark font-mono">{selectedPayslip.employeeCode}</strong>
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
                <span className="text-slate-muted">Disbursement Date:</span>{' '}
                <strong className="text-slate-dark font-mono">{selectedPayslip.payDate}</strong>
              </div>
              <div>
                <span className="text-slate-muted">Bank Account:</span>{' '}
                <strong className="text-slate-dark font-mono">{selectedPayslip.bankAccount}</strong>
              </div>
              <div>
                <span className="text-slate-muted">Tax PAN:</span>{' '}
                <strong className="text-slate-dark font-mono">{selectedPayslip.panNumber}</strong>
              </div>
              <div>
                <span className="text-slate-muted">Paid Days:</span>{' '}
                <strong className="text-slate-dark font-mono">22 / 22 Working Days</strong>
              </div>
            </div>
          </div>

          {/* Itemized Earnings vs Deductions Table */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Earnings Column */}
            <div className="border border-surface-border rounded-xl overflow-hidden text-xs">
              <div className="bg-surface-bg p-2.5 font-extrabold text-slate-dark border-b border-surface-border flex justify-between">
                <span>Earnings Breakdown</span>
                <span>Amount (USD)</span>
              </div>
              <div className="divide-y divide-surface-border p-2 space-y-1">
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>Basic Pay (50%)</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.earnings.basic.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.earnings.hra.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>Conveyance Allowance</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.earnings.conveyance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>Special Allowance</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.earnings.specialAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>Performance Incentive Bonus</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.earnings.performanceBonus.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-brand-light/40 p-2.5 font-bold text-slate-dark border-t border-brand-subtle flex justify-between">
                <span>Gross Total Earnings</span>
                <span className="font-mono text-brand-blue">${selectedPayslip.earnings.grossTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-surface-border rounded-xl overflow-hidden text-xs">
              <div className="bg-surface-bg p-2.5 font-extrabold text-slate-dark border-b border-surface-border flex justify-between">
                <span>Deductions</span>
                <span>Amount (USD)</span>
              </div>
              <div className="divide-y divide-surface-border p-2 space-y-1">
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>Provident Fund (PF - 12%)</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.deductions.providentFund.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>Professional Tax</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.deductions.professionalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>Income Tax (TDS Deduction)</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.deductions.incomeTaxTDS.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-muted">
                  <span>Group Health Insurance</span>
                  <span className="font-mono font-semibold text-slate-dark">${selectedPayslip.deductions.healthInsurance.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-accent-rose-light/40 p-2.5 font-bold text-slate-dark border-t border-accent-rose/20 flex justify-between mt-auto">
                <span>Total Deductions</span>
                <span className="font-mono text-accent-rose">-${selectedPayslip.deductions.totalDeductions.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Net Salary Highlight Box */}
          <div className="bg-gradient-to-r from-brand-blue to-accent-cyan rounded-xl p-4 text-white flex items-center justify-between">
            <div>
              <div className="text-xs uppercase font-bold text-white/85">Net Disbursed Take-Home Pay</div>
              <div className="text-2xl font-black font-mono mt-0.5">
                ${selectedPayslip.netPayable.toLocaleString()} USD
              </div>
              <div className="text-[11px] text-white/90 italic mt-0.5">
                {selectedPayslip.netPayableWords}
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-white text-brand-blue font-bold text-xs shadow-sm">
                DIRECT DEPOSIT VERIFIED
              </span>
            </div>
          </div>

          {/* Digital Signature & QR Verification Section */}
          <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-surface-bg border border-surface-border rounded-lg flex items-center justify-center p-1">
                {/* Simulated QR Pattern */}
                <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-white">
                  <div className="bg-slate-dark rounded-xs" /><div className="bg-slate-dark rounded-xs" /><div className="bg-white" /><div className="bg-slate-dark rounded-xs" />
                  <div className="bg-slate-dark rounded-xs" /><div className="bg-white" /><div className="bg-slate-dark rounded-xs" /><div className="bg-slate-dark rounded-xs" />
                  <div className="bg-white" /><div className="bg-slate-dark rounded-xs" /><div className="bg-slate-dark rounded-xs" /><div className="bg-white" />
                  <div className="bg-slate-dark rounded-xs" /><div className="bg-white" /><div className="bg-slate-dark rounded-xs" /><div className="bg-slate-dark rounded-xs" />
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-dark flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-accent-mint" />
                  <span>Verifiable Digital Certificate</span>
                </div>
                <p className="text-[10px] text-slate-light font-mono">
                  SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-bold text-brand-blue text-sm">
                Marcus Vance
              </div>
              <div className="text-[10px] text-slate-light">
                Authorized Signatory · VP of HR
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="no-print bg-surface-bg border-t border-surface-border p-4 px-6 flex items-center justify-between text-xs">
          <span className="text-slate-muted">Click 'Print / Save PDF' to output in A4 format.</span>
          <button
            onClick={() => setIsPayslipModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-dark font-bold hover:bg-slate-300 transition-colors"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
};
