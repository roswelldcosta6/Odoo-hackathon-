import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  Clock,
  ShieldAlert,
  User,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { LeaveCategory, LeaveRequest } from '../../types';

export const LeaveManagement: React.FC = () => {
  const {
    leaveRequests,
    userLeaveBalance,
    applyLeave,
    reviewLeaveRequest,
    currentRole,
    currentUser,
    setIsCopilotOpen
  } = useHRMS();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Application form state
  const [leaveType, setLeaveType] = useState<LeaveCategory>('PAID_ANNUAL');
  const [startDate, setStartDate] = useState('2026-08-24');
  const [endDate, setEndDate] = useState('2026-08-26');
  const [reason, setReason] = useState('Family gathering & vacation trip.');

  // Review modal state
  const [reviewingRequest, setReviewingRequest] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewerNote, setReviewerNote] = useState('');

  // Calculate days excluding weekends
  const calculateWorkingDays = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      if (end < start) return 1;
      let count = 0;
      const cur = new Date(start);
      while (cur <= end) {
        const dayOfWeek = cur.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          count++;
        }
        cur.setDate(cur.getDate() + 1);
      }
      return count > 0 ? count : 1;
    } catch {
      return 1;
    }
  };

  const estimatedDays = calculateWorkingDays(startDate, endDate);

  // Check collision banner preview in real-time
  const isEngCollisionDates =
    (startDate <= '2026-08-26' && endDate >= '2026-08-24') ||
    (startDate <= '2026-08-21' && endDate >= '2026-08-20');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || estimatedDays <= 0) return;

    applyLeave({
      leaveType,
      startDate,
      endDate,
      reason,
      totalDays: estimatedDays
    });

    setIsApplyModalOpen(false);
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingRequest || !reviewerNote) return;

    reviewLeaveRequest(reviewingRequest.id, reviewAction, reviewerNote);
    setReviewingRequest(null);
    setReviewerNote('');
  };

  const filteredRequests = leaveRequests.filter(req => {
    if (filterStatus === 'ALL') return true;
    return req.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quota Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Paid Annual */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>Paid Annual</span>
            <span className="text-brand-blue font-mono font-black text-sm">
              {userLeaveBalance.paidAnnual.remaining}d Left
            </span>
          </div>
          <div className="w-full bg-surface-border rounded-full h-2 my-2.5 overflow-hidden">
            <div
              className="bg-brand-blue h-full rounded-full"
              style={{
                width: `${(userLeaveBalance.paidAnnual.remaining / userLeaveBalance.paidAnnual.total) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-light">
            <span>Used: {userLeaveBalance.paidAnnual.used}d</span>
            <span>Total: {userLeaveBalance.paidAnnual.total}d</span>
          </div>
        </div>

        {/* Sick Leave */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>Sick Leave</span>
            <span className="text-accent-mint font-mono font-black text-sm">
              {userLeaveBalance.sickLeave.remaining}d Left
            </span>
          </div>
          <div className="w-full bg-surface-border rounded-full h-2 my-2.5 overflow-hidden">
            <div
              className="bg-accent-mint h-full rounded-full"
              style={{
                width: `${(userLeaveBalance.sickLeave.remaining / userLeaveBalance.sickLeave.total) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-light">
            <span>Used: {userLeaveBalance.sickLeave.used}d</span>
            <span>Total: {userLeaveBalance.sickLeave.total}d</span>
          </div>
        </div>

        {/* Casual Leave */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-muted uppercase">
            <span>Casual Leave</span>
            <span className="text-accent-amber font-mono font-black text-sm">
              {userLeaveBalance.casualLeave.remaining}d Left
            </span>
          </div>
          <div className="w-full bg-surface-border rounded-full h-2 my-2.5 overflow-hidden">
            <div
              className="bg-accent-amber h-full rounded-full"
              style={{
                width: `${(userLeaveBalance.casualLeave.remaining / userLeaveBalance.casualLeave.total) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-light">
            <span>Used: {userLeaveBalance.casualLeave.used}d</span>
            <span>Total: {userLeaveBalance.casualLeave.total}d</span>
          </div>
        </div>

        {/* Action Trigger Card */}
        <div className="bg-gradient-to-tr from-brand-blue to-accent-cyan rounded-2xl p-5 text-white shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Time-Off Engine</span>
            <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold">
              Bandwidth Shield
            </span>
          </div>
          <p className="text-xs text-white/90 my-1">
            Automated calendar clash detection & multi-tier approval.
          </p>
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full py-2 rounded-xl bg-white text-brand-blue font-bold text-xs hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply for Time-Off</span>
          </button>
        </div>
      </div>

      {/* Standout Feature Highlight: Collision & Bandwidth Engine Notice */}
      <div className="bg-gradient-to-r from-accent-amber-light to-orange-50 border border-accent-amber/40 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-xl bg-accent-amber text-white flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-dark text-sm">
              Smart Leave Collision & Bandwidth Engine Active
            </span>
            <span className="px-2 py-0.5 rounded-full bg-accent-amber text-white font-bold text-[10px]">
              Standout Feature
            </span>
          </div>
          <p className="text-slate-muted mt-1">
            The system automatically scans sprint calendars to ensure departmental headcount never falls below <strong>60% capacity</strong>. Conflicting team requests trigger visual warning badges for HR review.
          </p>
        </div>
      </div>

      {/* Main Request Queue */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-dark tracking-tight">
              Time-Off Approval Command Center
            </h2>
            <p className="text-xs text-slate-muted">
              Pending requests, team clash radar, and historical time-off logs
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-brand-blue text-white shadow-sm font-bold'
                    : 'bg-surface-bg text-slate-muted hover:text-slate-dark'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.map(req => (
            <div
              key={req.id}
              className={`p-4 rounded-2xl border transition-all ${
                req.hasCollisionWarning && req.status === 'PENDING'
                  ? 'bg-orange-50/40 border-accent-amber/50 shadow-sm'
                  : 'bg-surface-bg/60 border-surface-border hover:bg-surface-bg'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Applicant Info & Reason */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={req.employeeAvatar}
                    alt={req.employeeName}
                    className="w-11 h-11 rounded-xl object-cover border border-white shadow-sm flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-dark text-sm">{req.employeeName}</span>
                      <span className="text-xs text-slate-muted font-medium">({req.department} · {req.designation})</span>
                      <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-blue text-[10px] font-bold">
                        {req.leaveType.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Dates & Duration */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-dark mt-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                      <span>{req.startDate} to {req.endDate}</span>
                      <span className="px-2 py-0.2 rounded bg-surface-border text-slate-dark font-mono text-[11px]">
                        {req.totalDays} Working Day{req.totalDays > 1 ? 's' : ''}
                      </span>
                    </div>

                    <p className="text-xs text-slate-muted italic mt-1.5">
                      "{req.reason}"
                    </p>

                    {/* Collision Alert Banner */}
                    {req.hasCollisionWarning && req.status === 'PENDING' && (
                      <div className="mt-2.5 p-2 rounded-xl bg-accent-amber-light border border-accent-amber/40 text-[11px] text-accent-amber font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 text-accent-amber" />
                        <span>{req.collisionDetails || '⚠️ High Team Overlap Detected on these dates.'}</span>
                      </div>
                    )}

                    {/* Review Note if reviewed */}
                    {req.reviewedBy && (
                      <div className="mt-2 text-[11px] text-slate-light">
                        <strong className="text-slate-dark">{req.reviewedBy}:</strong> {req.reviewerComment} ({req.reviewedAt})
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Review Actions */}
                <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      req.status === 'APPROVED'
                        ? 'bg-accent-mint-light text-accent-mint border border-accent-mint/30'
                        : req.status === 'REJECTED'
                        ? 'bg-accent-rose-light text-accent-rose border border-accent-rose/30'
                        : 'bg-accent-amber-light text-accent-amber border border-accent-amber/30 animate-pulse'
                    }`}
                  >
                    {req.status}
                  </span>

                  {/* 1-Click Approve / Reject (HR/Admin) */}
                  {(currentRole === 'ADMIN' || currentRole === 'HR_OFFICER') && req.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReviewingRequest(req);
                          setReviewAction('APPROVED');
                          setReviewerNote('Approved. Team bandwidth managed.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-accent-mint text-white font-bold text-xs hover:bg-emerald-600 shadow-sm transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => {
                          setReviewingRequest(req);
                          setReviewAction('REJECTED');
                          setReviewerNote('Declined due to concurrent sprint deployment.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-accent-rose text-white font-bold text-xs hover:bg-red-600 shadow-sm transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-border rounded-2xl shadow-float w-full max-w-lg p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-brand-blue" />
                <h3 className="font-extrabold text-slate-dark text-base">Request Time-Off</h3>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-muted hover:text-slate-dark">
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-dark mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveCategory)}
                  className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 font-semibold text-slate-dark focus:border-brand-blue focus:outline-none"
                >
                  <option value="PAID_ANNUAL">Paid Annual Leave ({userLeaveBalance.paidAnnual.remaining}d remaining)</option>
                  <option value="SICK_LEAVE">Sick Leave ({userLeaveBalance.sickLeave.remaining}d remaining)</option>
                  <option value="CASUAL_LEAVE">Casual Leave ({userLeaveBalance.casualLeave.remaining}d remaining)</option>
                  <option value="UNPAID_LOP">Unpaid Leave / LOP</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 font-mono focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 font-mono focus:border-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              {/* Working days calculator readout */}
              <div className="p-3 rounded-xl bg-brand-light/60 border border-brand-subtle flex items-center justify-between">
                <span className="font-semibold text-slate-dark">Total Deductible Days:</span>
                <span className="font-mono font-black text-brand-blue text-sm">
                  {estimatedDays} Working Day{estimatedDays > 1 ? 's' : ''}
                </span>
              </div>

              {/* Live Collision Warning Banner inside modal */}
              {isEngCollisionDates && (
                <div className="p-3 rounded-xl bg-accent-amber-light border border-accent-amber/40 text-[11px] text-accent-amber font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Collision Warning: Devon Miles & Jordan Kaye are off on these dates.</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-dark mb-1">Reason for Absence *</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide context for your team lead..."
                  className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 text-xs focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-muted hover:bg-surface-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-hover shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingRequest && (
        <div className="fixed inset-0 z-50 bg-slate-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-border rounded-2xl shadow-float w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-extrabold text-slate-dark text-base">
                {reviewAction === 'APPROVED' ? 'Approve Time-Off Request' : 'Reject Time-Off Request'}
              </h3>
              <button onClick={() => setReviewingRequest(null)} className="text-slate-muted hover:text-slate-dark">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReview} className="space-y-4 pt-4 text-xs">
              <div className="bg-surface-bg p-3 rounded-xl border border-surface-border">
                <p className="font-bold text-slate-dark">{reviewingRequest.employeeName}</p>
                <p className="text-slate-muted">{reviewingRequest.startDate} to {reviewingRequest.endDate} ({reviewingRequest.totalDays} days)</p>
                <p className="text-slate-light italic mt-1">"{reviewingRequest.reason}"</p>
              </div>

              <div>
                <label className="block font-bold text-slate-dark mb-1">Reviewer Feedback Note *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewerNote}
                  onChange={(e) => setReviewerNote(e.target.value)}
                  placeholder="Enter notes or conditions for approval..."
                  className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 text-xs focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setReviewingRequest(null)}
                  className="px-4 py-2 rounded-xl text-slate-muted hover:bg-surface-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white font-bold shadow-sm ${
                    reviewAction === 'APPROVED' ? 'bg-accent-mint hover:bg-emerald-600' : 'bg-accent-rose hover:bg-red-600'
                  }`}
                >
                  Confirm {reviewAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
