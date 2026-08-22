import React, { useState } from 'react';
import {
  Users,
  LayoutGrid,
  List,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Eye,
  FileText,
  ChevronRight,
  Shield,
  Briefcase
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Employee, EmploymentType } from '../../types';
import { EmployeeModal } from './EmployeeModal';

export const EmployeeDirectory: React.FC = () => {
  const {
    employees,
    setSelectedEmployee,
    setIsEmployeeModalOpen,
    setSelectedPayslip,
    setIsPayslipModalOpen,
    payslips,
    addEmployee,
    currentRole
  } = useHRMS();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New employee form state
  const [newEmpData, setNewEmpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    department: 'Engineering',
    employmentType: 'Full-Time' as EmploymentType,
    location: 'San Francisco HQ',
    basicSalary: 6000
  });

  const departments = ['ALL', 'Engineering', 'Design', 'Product', 'Human Resources', 'Marketing', 'Finance'];

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchFilter.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleOpenProfile = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenPayslip = (emp: Employee) => {
    const slip = payslips.find(s => s.employeeId === emp.id) || payslips[0];
    setSelectedPayslip(slip);
    setIsPayslipModalOpen(true);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpData.firstName || !newEmpData.lastName || !newEmpData.email) return;

    const basic = Number(newEmpData.basicSalary) || 5000;
    const hra = Math.round(basic * 0.5);
    const special = Math.round(basic * 0.3);
    const pf = Math.round(basic * 0.12);
    const gross = basic + hra + special;
    const net = gross - pf - 200 - 250;

    const codeNum = employees.length + 10;

    addEmployee({
      employeeCode: `DF-${codeNum.toString().padStart(3, '0')}`,
      firstName: newEmpData.firstName,
      lastName: newEmpData.lastName,
      email: newEmpData.email,
      personalEmail: `${newEmpData.firstName.toLowerCase()}@example.com`,
      phone: newEmpData.phone || '+1 (555) 000-1122',
      address: '100 Market St, San Francisco, CA',
      designation: newEmpData.designation || 'Staff Associate',
      department: newEmpData.department,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'ACTIVE',
      employmentType: newEmpData.employmentType,
      avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + codeNum}?w=150&auto=format&fit=crop&q=80`,
      reportingManager: 'Marcus Vance',
      location: newEmpData.location,
      attendanceRate: 98.0,
      performanceRating: 'GOOD',
      salary: {
        basic,
        hra,
        specialAllowance: special,
        providentFund: pf,
        professionalTax: 200,
        medicalInsurance: 250,
        grossSalary: gross,
        netSalary: net
      },
      documents: [
        {
          id: `doc-new-${Date.now()}`,
          name: 'Offer_Letter_Signed.pdf',
          type: 'PDF',
          uploadDate: new Date().toISOString().split('T')[0],
          size: '1.2 MB',
          status: 'VERIFIED'
        }
      ]
    });

    setIsAddModalOpen(false);
    setNewEmpData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: '',
      department: 'Engineering',
      employmentType: 'Full-Time',
      location: 'San Francisco HQ',
      basicSalary: 6000
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-dark tracking-tight">
              Employee Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-blue text-xs font-bold font-mono">
              {employees.length} Profiles
            </span>
          </div>
          <p className="text-xs text-slate-muted mt-0.5">
            Enterprise staff records, department assignments, and document vaults
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-surface-bg p-1 rounded-xl border border-surface-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-slate-muted hover:text-slate-dark'
              }`}
              title="Kanban Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-slate-muted hover:text-slate-dark'
              }`}
              title="Dense Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Employee (Admin / HR) */}
          {(currentRole === 'ADMIN' || currentRole === 'HR_OFFICER') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand-blue/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Department Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-brand-blue text-white shadow-sm font-bold'
                  : 'bg-white border border-surface-border text-slate-muted hover:text-slate-dark hover:border-slate-300'
              }`}
            >
              {dept === 'ALL' ? 'All Departments' : dept}
            </button>
          ))}
        </div>

        {/* Directory Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter by name, code or title..."
            className="w-full bg-white border border-surface-border text-xs rounded-xl pl-9 pr-3 py-2 text-slate-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      {/* Grid View (Kanban Cards) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEmployees.map(emp => (
            <div
              key={emp.id}
              onClick={() => handleOpenProfile(emp)}
              className="bg-white border border-surface-border rounded-2xl p-5 shadow-card hover:shadow-md hover:border-brand-blue/60 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top Avatar & Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="relative">
                    <img
                      src={emp.avatarUrl}
                      alt={emp.firstName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        emp.employmentStatus === 'ACTIVE'
                          ? 'bg-accent-mint'
                          : emp.employmentStatus === 'ON_LEAVE'
                          ? 'bg-accent-amber'
                          : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-surface-bg border border-surface-border text-slate-muted">
                    {emp.employeeCode}
                  </span>
                </div>

                {/* Name & Designation */}
                <h3 className="font-extrabold text-slate-dark text-sm group-hover:text-brand-blue transition-colors">
                  {emp.firstName} {emp.lastName}
                </h3>
                <p className="text-xs text-slate-muted font-medium mt-0.5 line-clamp-1">
                  {emp.designation}
                </p>

                {/* Department Pill */}
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-light text-brand-blue">
                    {emp.department}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-bg text-slate-muted border border-surface-border">
                    {emp.employmentType}
                  </span>
                </div>

                {/* Attendance Rate Progress */}
                <div className="mt-4 pt-3 border-t border-surface-border/60">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-dark mb-1">
                    <span className="text-slate-muted font-normal">Attendance:</span>
                    <span className="font-mono text-accent-cyan">{emp.attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-surface-border rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-accent-cyan h-full rounded-full"
                      style={{ width: `${emp.attendanceRate}%` }}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-light">
                  <MapPin className="w-3 h-3 text-slate-light flex-shrink-0" />
                  <span className="truncate">{emp.location}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div
                className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleOpenProfile(emp)}
                  className="text-xs font-bold text-brand-blue hover:text-brand-hover flex items-center gap-1"
                >
                  <span>Profile Vault</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleOpenPayslip(emp)}
                  className="p-1.5 rounded-lg text-slate-muted hover:text-slate-dark hover:bg-surface-bg"
                  title="View Payslip"
                >
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View (Dense) */}
      {viewMode === 'table' && (
        <div className="bg-white border border-surface-border rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-bg border-b border-surface-border text-slate-muted uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Role & Dept</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4 text-center">Attendance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredEmployees.map(emp => (
                  <tr
                    key={emp.id}
                    onClick={() => handleOpenProfile(emp)}
                    className="hover:bg-surface-hover cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-muted">{emp.employeeCode}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={emp.avatarUrl} alt={emp.firstName} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-dark">{emp.firstName} {emp.lastName}</div>
                          <div className="text-[10px] text-slate-light">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-dark">{emp.designation}</div>
                      <div className="text-[10px] text-slate-muted">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-muted">{emp.employmentType}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-accent-cyan">{emp.attendanceRate}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${emp.employmentStatus === 'ACTIVE' ? 'bg-accent-mint-light text-accent-mint' : 'bg-accent-amber-light text-accent-amber'}`}>
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenProfile(emp)}
                        className="px-3 py-1 rounded-lg bg-brand-light text-brand-blue font-bold text-xs hover:bg-brand-blue hover:text-white transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-border rounded-2xl shadow-float w-full max-w-lg overflow-hidden p-6 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <h3 className="font-extrabold text-slate-dark text-base">Provision New Employee Profile</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-muted hover:text-slate-dark">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmpData.firstName}
                    onChange={(e) => setNewEmpData({ ...newEmpData, firstName: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                    placeholder="e.g. Rachel"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmpData.lastName}
                    onChange={(e) => setNewEmpData({ ...newEmpData, lastName: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                    placeholder="e.g. Green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmpData.email}
                    onChange={(e) => setNewEmpData({ ...newEmpData, email: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                    placeholder="rachel.green@dayflow.io"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Designation</label>
                  <input
                    type="text"
                    value={newEmpData.designation}
                    onChange={(e) => setNewEmpData({ ...newEmpData, designation: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                    placeholder="Senior QA Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Department</label>
                  <select
                    value={newEmpData.department}
                    onChange={(e) => setNewEmpData({ ...newEmpData, department: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Monthly Basic Salary ($)</label>
                  <input
                    type="number"
                    value={newEmpData.basicSalary}
                    onChange={(e) => setNewEmpData({ ...newEmpData, basicSalary: Number(e.target.value) })}
                    className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-muted hover:bg-surface-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-hover shadow-sm"
                >
                  Save & Provision Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Tab Employee Modal */}
      <EmployeeModal />
    </div>
  );
};
