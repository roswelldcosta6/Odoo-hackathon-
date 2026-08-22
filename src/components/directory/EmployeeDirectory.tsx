import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Grid,
  List,
  Mail,
  Phone,
  Building,
  Briefcase,
  Trash2,
  Edit3,
  Eye,
  Plus,
  X,
  Camera,
  AlertCircle,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Employee } from '../../types';
import { generateEmployeeLoginId, calcIndianPayroll } from '../../data/mockData';
import { EmployeeModal } from './EmployeeModal';

export const EmployeeDirectory: React.FC = () => {
  const {
    employees,
    setSelectedEmployee,
    setIsEmployeeModalOpen,
    addEmployee,
    deleteEmployee,
    currentRole,
    currentUser
  } = useHRMS();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Add Employee Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [newEmpData, setNewEmpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: 'Software Engineer',
    department: 'Engineering',
    basicSalary: 65000,
    joiningDate: new Date().toISOString().split('T')[0],
    password: 'Password@123'
  });

  const canManageEmployees = currentRole === 'ADMIN' || currentRole === 'HR_OFFICER';

  const departments = ['ALL', 'Engineering', 'Product', 'Design', 'Human Resources', 'Marketing', 'Finance'];

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.loginId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const previewLoginId = generateEmployeeLoginId(
    newEmpData.firstName || 'John',
    newEmpData.lastName || 'Doe',
    newEmpData.joiningDate,
    employees.length + 1,
    'DF'
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newEmpData.firstName.trim() || !newEmpData.lastName.trim()) {
      setFormError('First and last names are required.');
      return;
    }
    if (!newEmpData.email.trim() || !newEmpData.email.includes('@')) {
      setFormError('Valid corporate email is required.');
      return;
    }
    if (newEmpData.phone && newEmpData.phone.length < 10) {
      setFormError('Mobile number must be at least 10 digits.');
      return;
    }

    const salaryObj = calcIndianPayroll(Number(newEmpData.basicSalary) || 65000);

    const empPayload: Omit<Employee, 'id'> = {
      employeeCode: `EMP-${(employees.length + 1).toString().padStart(4, '0')}`,
      loginId: previewLoginId,
      firstName: newEmpData.firstName.trim(),
      lastName: newEmpData.lastName.trim(),
      email: newEmpData.email.trim().toLowerCase(),
      personalEmail: newEmpData.email.trim().toLowerCase(),
      phone: newEmpData.phone.trim() || '9876543210',
      address: 'Band-Kurla Complex, Mumbai',
      designation: newEmpData.designation,
      department: newEmpData.department,
      joiningDate: newEmpData.joiningDate,
      employmentStatus: 'ACTIVE',
      employmentType: 'Full-Time',
      avatarUrl: avatarPreview || 'https://images.unsplash.com/photo-1534528741775?w=150',
      reportingManager: 'Marcus Vance',
      location: 'Mumbai HQ',
      attendanceRate: 100,
      performanceRating: 'GOOD',
      salary: salaryObj,
      documents: []
    };

    addEmployee(empPayload, newEmpData.password || 'Password@123');

    setIsAddModalOpen(false);
    setNewEmpData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: 'Software Engineer',
      department: 'Engineering',
      basicSalary: 65000,
      joiningDate: new Date().toISOString().split('T')[0],
      password: 'Password@123'
    });
    setAvatarPreview(null);
  };

  const handleOpenEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${emp.firstName} ${emp.lastName} from the organization?`)) {
      deleteEmployee(emp.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-surface-border rounded-2xl p-5 shadow-card">
        <div>
          <h2 className="text-xl font-extrabold text-slate-dark tracking-tight">
            Employee Directory & Headcount
          </h2>
          <p className="text-xs text-slate-muted mt-0.5">
            Manage organization members, profile KYC, and statutory credentials.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View mode toggle */}
          <div className="flex items-center bg-surface-bg p-1 rounded-xl border border-surface-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-muted hover:text-slate-dark'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-muted hover:text-slate-dark'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, login ID, role..."
              className="bg-surface-bg border border-surface-border text-slate-dark text-xs font-medium rounded-xl pl-9 pr-3 py-2 focus:border-brand-blue focus:outline-none w-56"
            />
          </div>

          {canManageEmployees && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold text-xs shadow-md shadow-brand-blue/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDept === dept
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-white border border-surface-border text-slate-muted hover:text-slate-dark'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map(emp => {
            const isOwnProfile = emp.id === currentUser.employeeId;
            const canViewSalary = canManageEmployees || isOwnProfile;

            return (
              <div
                key={emp.id}
                onClick={() => handleOpenEmployee(emp)}
                className="bg-white border border-surface-border rounded-2xl p-5 shadow-card hover:shadow-md hover:border-brand-blue/50 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-brand-light text-brand-blue">
                      {emp.loginId || emp.employeeCode}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        emp.employmentStatus === 'ACTIVE'
                          ? 'bg-accent-mint-light text-accent-mint'
                          : emp.employmentStatus === 'PROBATION'
                          ? 'bg-accent-amber-light text-accent-amber'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {emp.employmentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775?w=150'}
                      alt={emp.firstName}
                      className="w-13 h-13 rounded-2xl object-cover border border-surface-border group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-dark text-sm group-hover:text-brand-blue transition-colors">
                        {emp.firstName} {emp.lastName}
                      </h3>
                      <p className="text-xs text-slate-muted font-medium">{emp.designation}</p>
                      <p className="text-[10px] text-slate-light font-mono mt-0.5">{emp.department} &bull; {emp.location}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-1.5 pt-3 border-t border-surface-border text-xs text-slate-muted">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-light flex-shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-light flex-shrink-0" />
                      <span>{emp.phone}</span>
                    </div>

                    {/* Salary only shown to Admin/HR or Self */}
                    {canViewSalary ? (
                      <div className="flex items-center justify-between pt-1 text-slate-dark font-mono font-bold text-xs">
                        <span>Net Take-Home:</span>
                        <span className="text-accent-mint font-black">
                          ₹{(emp.salary?.netSalary || 99850).toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    ) : (
                      <div className="pt-1 text-[10px] text-slate-light italic">
                        Compensation confidential
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-border">
                  <span className="text-[10px] font-bold text-slate-light">
                    Joined {emp.joiningDate}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleOpenEmployee(emp)}
                      className="px-3 py-1 rounded-xl bg-brand-light text-brand-blue font-bold text-xs hover:bg-brand-blue hover:text-white transition-all"
                    >
                      View Profile
                    </button>

                    {canManageEmployees && !isOwnProfile && (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, emp)}
                        className="p-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title="Remove Employee"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-surface-border rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-bg border-b border-surface-border text-slate-muted uppercase font-bold text-[10px]">
                  <th className="p-3.5">Employee</th>
                  <th className="p-3.5">Login ID</th>
                  <th className="p-3.5">Role & Department</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Joining Date</th>
                  {canManageEmployees && <th className="p-3.5">Net Pay (₹)</th>}
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredEmployees.map(emp => (
                  <tr
                    key={emp.id}
                    onClick={() => handleOpenEmployee(emp)}
                    className="hover:bg-surface-bg/60 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775?w=150'}
                          alt={emp.firstName}
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-extrabold text-slate-dark">{emp.firstName} {emp.lastName}</div>
                          <div className="text-[10px] text-slate-muted">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-brand-blue">
                      {emp.loginId || emp.employeeCode}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-dark">{emp.designation}</div>
                      <div className="text-[10px] text-slate-muted">{emp.department}</div>
                    </td>

                    <td className="p-3.5 font-mono">
                      {emp.phone}
                    </td>

                    <td className="p-3.5 font-mono text-slate-dark">
                      {emp.joiningDate}
                    </td>

                    {canManageEmployees && (
                      <td className="p-3.5 font-mono font-bold text-accent-mint">
                        ₹{(emp.salary?.netSalary || 99850).toLocaleString('en-IN')}
                      </td>
                    )}

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        emp.employmentStatus === 'ACTIVE'
                          ? 'bg-accent-mint-light text-accent-mint'
                          : 'bg-accent-amber-light text-accent-amber'
                      }`}>
                        {emp.employmentStatus}
                      </span>
                    </td>

                    <td className="p-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenEmployee(emp)}
                        className="p-1.5 rounded-lg bg-surface-bg hover:bg-brand-light text-brand-blue font-bold text-xs transition-all"
                      >
                        View
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
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-surface-border rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in my-8">
            <div className="bg-gradient-to-r from-slate-900 to-brand-blue flex items-center justify-between p-5 text-white">
              <div>
                <h3 className="font-extrabold text-lg">Onboard New Employee</h3>
                <p className="text-xs text-white/80">Auto-generate Login ID, provision Indian payroll (₹), and set up account password.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /><span>{formError}</span>
                </div>
              )}

              {/* Avatar Photo Upload */}
              <div className="p-4 bg-surface-bg border border-surface-border rounded-2xl flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775?w=150'}
                    alt="Preview"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-800"
                  />
                </div>
                <div>
                  <div className="font-bold text-slate-dark">Employee Profile Photo</div>
                  <p className="text-[10px] text-slate-muted mb-2">Upload a clear headshot (JPG, PNG up to 2MB)</p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-surface-border text-brand-blue font-bold cursor-pointer hover:bg-brand-light transition-all">
                    <Camera className="w-3.5 h-3.5" /><span>{avatarPreview ? 'Change Photo' : 'Choose Photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-dark mb-1">First Name *</label><input type="text" required value={newEmpData.firstName} onChange={(e) => setNewEmpData({ ...newEmpData, firstName: e.target.value })} placeholder="e.g. Roswell" className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
                <div><label className="block font-bold text-slate-dark mb-1">Last Name *</label><input type="text" required value={newEmpData.lastName} onChange={(e) => setNewEmpData({ ...newEmpData, lastName: e.target.value })} placeholder="e.g. D'Costa" className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-dark mb-1">Corporate Email *</label><input type="email" required value={newEmpData.email} onChange={(e) => setNewEmpData({ ...newEmpData, email: e.target.value })} placeholder="roswell.dcosta@dayflow.com" className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
                <div><label className="block font-bold text-slate-dark mb-1">Indian Mobile (Phone)</label><input type="tel" maxLength={10} value={newEmpData.phone} onChange={(e) => setNewEmpData({ ...newEmpData, phone: e.target.value.replace(/\D/g, '') })} placeholder="9876543210" className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
              </div>

              {/* Password for Employee Account */}
              <div>
                <label className="block font-bold text-slate-dark mb-1">Initial Login Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newEmpData.password}
                    onChange={(e) => setNewEmpData({ ...newEmpData, password: e.target.value })}
                    placeholder="Password@123"
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark font-mono rounded-xl pl-9 pr-3 py-2.5"
                  />
                </div>
                <p className="text-[10px] text-slate-light mt-0.5">Password used by employee to log into their self-service portal.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div><label className="block font-bold text-slate-dark mb-1">Designation</label><input type="text" value={newEmpData.designation} onChange={(e) => setNewEmpData({ ...newEmpData, designation: e.target.value })} className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
                <div><label className="block font-bold text-slate-dark mb-1">Department</label><select value={newEmpData.department} onChange={(e) => setNewEmpData({ ...newEmpData, department: e.target.value })} className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"><option value="Engineering">Engineering</option><option value="Product">Product</option><option value="Design">Design</option><option value="Human Resources">Human Resources</option><option value="Marketing">Marketing</option><option value="Finance">Finance</option></select></div>
                <div><label className="block font-bold text-slate-dark mb-1">Basic Salary (₹/mo)</label><input type="number" step="5000" value={newEmpData.basicSalary} onChange={(e) => setNewEmpData({ ...newEmpData, basicSalary: Number(e.target.value) })} className="w-full bg-surface-bg border border-surface-border text-slate-dark font-bold font-mono rounded-xl p-2.5" /></div>
              </div>

              <div className="p-3 bg-brand-light/50 border border-brand-subtle rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-brand-blue">Auto-Generated Login ID</div>
                  <div className="text-sm font-black font-mono text-slate-dark tracking-widest">{previewLoginId}</div>
                </div>
                <span className="text-[10px] text-slate-muted">[Company][First2Last2][Year][Serial]</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-muted hover:text-slate-dark font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold shadow-md shadow-brand-blue/30">Provision Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Profile & Vault Modal */}
      <EmployeeModal />
    </div>
  );
};

export default EmployeeDirectory;
