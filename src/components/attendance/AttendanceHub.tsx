import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Wifi,
  Home,
  Edit3,
  Save,
  X,
  Play,
  Square,
  Coffee,
  Check,
  Plus
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';

export const AttendanceHub: React.FC = () => {
  const {
    attendanceRecords,
    isClockedIn,
    isBreakActive,
    punchInTime,
    secondsWorkedToday,
    togglePunchClock,
    toggleBreak,
    punchNetworkType,
    setPunchNetworkType,
    overrideAttendance,
    recordStaffAttendance,
    employees,
    currentRole,
    currentUser
  } = useHRMS();

  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Override modal state
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [overrideTime, setOverrideTime] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');

  // Add attendance modal state (for Admin/HR)
  const [isAddAttendanceOpen, setIsAddAttendanceOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [markStatus, setMarkStatus] = useState<AttendanceStatus>('PRESENT');
  const [markCheckIn, setMarkCheckIn] = useState('09:00 AM');
  const [markRemarks, setMarkRemarks] = useState('Marked by Admin');

  const canManageAttendance = currentRole === 'ADMIN' || currentRole === 'HR_OFFICER';

  const filteredRecords = attendanceRecords.filter(rec => {
    const matchesDept = filterDept === 'ALL' || rec.department === filterDept;
    const matchesStatus = filterStatus === 'ALL' || rec.status === filterStatus;
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const lateCount = attendanceRecords.filter(r => r.isLate).length;
  const onLeaveCount = attendanceRecords.filter(r => r.status === 'ON_LEAVE').length;

  const handleExportCSV = () => {
    const headers = 'Employee,Department,Date,CheckIn,CheckOut,Hours,Status,Network,IP\n';
    const rows = attendanceRecords
      .map(
        r =>
          `"${r.employeeName}","${r.department}","${r.date}","${r.checkIn}","${r.checkOut || '-'}","${r.totalHours}","${r.status}","${r.networkType}","${r.ipAddress}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dayflow_Attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord || !overrideTime || !overrideReason) return;
    overrideAttendance(editingRecord.id, overrideTime, overrideReason);
    setEditingRecord(null);
    setOverrideTime('');
    setOverrideReason('');
  };

  const handleSaveNewAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    recordStaffAttendance(selectedEmpId, markStatus, markCheckIn, markStatus === 'PRESENT' ? '06:00 PM' : undefined, markRemarks);
    setIsAddAttendanceOpen(false);
  };

  const formatSecs = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Presence */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-muted uppercase tracking-wider">Present Today</span>
            <h3 className="text-2xl font-black text-slate-dark mt-1">{presentCount}</h3>
            <span className="text-xs text-accent-mint font-bold">+92.4% Occupancy</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-cyan-light text-accent-cyan flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Late Check-ins */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-muted uppercase tracking-wider">Late Arrivals</span>
            <h3 className="text-2xl font-black text-accent-amber mt-1">{lateCount}</h3>
            <span className="text-xs text-slate-light">&gt; 09:30 AM Flag</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-amber-light text-accent-amber flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* On Leave */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-muted uppercase tracking-wider">On Leave / WFH</span>
            <h3 className="text-2xl font-black text-slate-dark mt-1">{onLeaveCount}</h3>
            <span className="text-xs text-slate-light">Approved Time-Off</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand-blue flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Network & Live Clock */}
        <div className="bg-gradient-to-tr from-brand-blue to-accent-cyan rounded-2xl p-5 text-white shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold">My Punch Ticker</span>
            <button
              onClick={() => setPunchNetworkType(punchNetworkType === 'OFFICE_WIFI' ? 'REMOTE_IP' : 'OFFICE_WIFI')}
              className="font-mono bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[11px] font-bold transition-all"
              title="Click to toggle Network mode"
            >
              {punchNetworkType === 'OFFICE_WIFI' ? 'HQ Wi-Fi' : 'Remote'}
            </button>
          </div>
          <div className="font-mono text-2xl font-black tracking-tight my-1">
            {formatSecs(secondsWorkedToday)}
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>{isClockedIn ? (punchInTime ? `In: ${punchInTime}` : 'Working active') : 'Clocked out'}</span>
            <button
              onClick={togglePunchClock}
              className={`px-3 py-1 rounded-lg font-bold shadow-sm transition-all ${
                isClockedIn
                  ? 'bg-accent-rose text-white hover:bg-red-600'
                  : 'bg-white text-brand-blue hover:bg-slate-50'
              }`}
            >
              {isClockedIn ? 'Punch Out' : 'Punch In'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Console & Filter Bar */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-dark tracking-tight">
              Company Muster Roll & Real-Time Punch Register
            </h2>
            <p className="text-xs text-slate-muted">
              Live biometric & IP geofenced check-in log with daily presence timestamps
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {canManageAttendance && (
              <button
                type="button"
                onClick={() => setIsAddAttendanceOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand-blue/20 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Staff Punch</span>
              </button>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff, dept..."
                className="bg-surface-bg border border-surface-border rounded-xl pl-8 pr-3 py-2 text-xs text-slate-dark focus:border-brand-blue focus:outline-none w-44"
              />
            </div>

            {/* Dept Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-surface-bg border border-surface-border text-slate-dark text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-surface-bg border border-surface-border text-slate-dark text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="ABSENT">Absent</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-surface-bg hover:bg-surface-border border border-surface-border text-slate-dark text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-surface-border rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-bg border-b border-surface-border text-slate-muted uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4">Check-In</th>
                <th className="py-3.5 px-4">Hours Logged</th>
                <th className="py-3.5 px-4">Network & IP</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-surface-hover transition-colors">
                  {/* Employee */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rec.employeeAvatar || 'https://images.unsplash.com/photo-1534528741775?w=150'}
                        alt={rec.employeeName}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-dark">{rec.employeeName}</div>
                        <div className="text-[10px] text-slate-light font-mono">{rec.date}</div>
                      </div>
                    </div>
                  </td>

                  {/* Dept & Designation */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-dark">{rec.designation}</div>
                    <div className="text-[10px] text-slate-muted">{rec.department}</div>
                  </td>

                  {/* Check-In */}
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className={rec.isLate ? 'text-accent-amber' : 'text-slate-dark'}>
                        {rec.checkIn}
                      </span>
                      {rec.isLate && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-accent-amber-light text-accent-amber font-bold">
                          Late
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Hours */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold font-mono text-slate-dark">
                      {rec.totalHours > 0 ? `${rec.totalHours} hrs` : '-'}
                    </div>
                    {rec.remarks && (
                      <div className="text-[10px] text-slate-light italic truncate max-w-[150px]">
                        {rec.remarks}
                      </div>
                    )}
                  </td>

                  {/* Network / Geofence Tag */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {rec.networkType === 'OFFICE_WIFI' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-light text-brand-blue">
                          <Wifi className="w-3 h-3" />
                          <span>Office HQ</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-lavender-light text-slate-dark">
                          <Home className="w-3 h-3 text-accent-lavender" />
                          <span>Remote</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-light mt-0.5">{rec.ipAddress}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rec.status === 'PRESENT'
                          ? 'bg-accent-mint-light text-accent-mint border border-accent-mint/30'
                          : rec.status === 'HALF_DAY'
                          ? 'bg-accent-amber-light text-accent-amber border border-accent-amber/30'
                          : rec.status === 'ON_LEAVE'
                          ? 'bg-brand-light text-brand-blue border border-brand-subtle'
                          : 'bg-slate-100 text-slate-light'
                      }`}
                    >
                      {rec.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    {canManageAttendance ? (
                      <button
                        onClick={() => {
                          setEditingRecord(rec);
                          setOverrideTime(rec.checkIn === '-' ? '09:00 AM' : rec.checkIn);
                          setOverrideReason('Manager punch adjustment');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-surface-bg hover:bg-brand-light text-slate-muted hover:text-brand-blue font-bold text-xs border border-surface-border transition-colors inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Adjust</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-light italic">Read only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Staff Attendance Modal (Admin/HR) */}
      {isAddAttendanceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-border rounded-2xl shadow-float w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-extrabold text-slate-dark text-base">
                Log Staff Attendance
              </h3>
              <button onClick={() => setIsAddAttendanceOpen(false)} className="text-slate-muted hover:text-slate-dark">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAttendance} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-dark mb-1">Select Employee</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full bg-surface-bg border border-surface-border text-slate-dark font-bold rounded-xl p-2.5"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Status</label>
                  <select
                    value={markStatus}
                    onChange={(e) => setMarkStatus(e.target.value as any)}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="HALF_DAY">Half Day</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Check-In Time</label>
                  <input
                    type="text"
                    value={markCheckIn}
                    onChange={(e) => setMarkCheckIn(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-dark mb-1">Remarks</label>
                <input
                  type="text"
                  value={markRemarks}
                  onChange={(e) => setMarkRemarks(e.target.value)}
                  placeholder="e.g. Client meeting / WFH check-in"
                  className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsAddAttendanceOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-muted hover:bg-surface-bg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-hover shadow-sm"
                >
                  Log Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Override Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-border rounded-2xl shadow-float w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-extrabold text-slate-dark text-base">
                Manual Attendance Correction
              </h3>
              <button onClick={() => setEditingRecord(null)} className="text-slate-muted hover:text-slate-dark">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4 pt-4 text-xs">
              <div className="bg-surface-bg p-3 rounded-xl border border-surface-border">
                <p className="font-bold text-slate-dark">{editingRecord.employeeName}</p>
                <p className="text-slate-muted">{editingRecord.department} &bull; {editingRecord.date}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-dark mb-1">Corrected Check-In Time</label>
                <input
                  type="text"
                  required
                  value={overrideTime}
                  onChange={(e) => setOverrideTime(e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 text-xs font-mono focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-dark mb-1">Reason for Adjustment (Audit Logged) *</label>
                <textarea
                  rows={2}
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g., Biometric sensor failure / verified client offsite meeting"
                  className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 text-xs focus:border-brand-blue focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-xl text-slate-muted hover:bg-surface-bg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-hover shadow-sm"
                >
                  Confirm & Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHub;
