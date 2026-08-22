import React, { useState } from 'react';
import {
  Users,
  LayoutGrid,
  List,
  Search,
  Plus,
  Mail,
  MapPin,
  Eye,
  FileText,
  Camera,
  AlertCircle,
  X
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Employee, EmploymentType } from '../../types';
import { EmployeeModal } from './EmployeeModal';
import { generateEmployeeLoginId, calcIndianPayroll } from '../../data/mockData';

export const EmployeeDirectory: React.FC = () => {
  const {
    employees,
    setSelectedEmployee,
    setIsEmployeeModalOpen,
    setSelectedPayslip,
    setIsPayslipModalOpen,
    payslips,
    addEmployee,
    currentRole,
    currentUser
  } = useHRMS();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const canManageEmployees = currentRole === 'ADMIN' || currentRole === 'HR_OFFICER';

  // New employee form state
  const [newEmpData, setNewEmpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: 'Software Engineer',
    department: 'Engineering',
    employmentType: 'Full-Time' as EmploymentType,
    location: 'Mumbai HQ (Floor 4)',
    basicSalary: 65000
  });

  const departments = ['ALL', 'Engineering', 'Design', 'Product', 'Human Resources', 'Marketing', 'Finance'];

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.loginId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleOpenProfile = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenPayslip = (emp: Employee) => {
    // Only allow if admin/HR or if viewing own payslip
    if (!canManageEmployees && emp.id !== currentUser.employeeId) return;
    const slip = payslips.find(s => s.employeeId === emp.id) || payslips[0];
    setSelectedPayslip(slip);
    setIsPayslipModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic Login ID preview for add form
  const previewLoginId = generateEmployeeLoginId(
    newEmpData.firstName || 'John',
    newEmpData.lastName || 'Doe',
    new Date().toISOString().split('T')[0],
    employees.length + 1,
    'DF'
  );

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newEmpData.firstName.trim() || !newEmpData.lastName.trim() || !newEmpData.email.trim()) {
      setFormError('First Name, Last Name, and Corporate Email are required.');
      return;
    }

    if (newEmpData.phone && newEmpData.phone.length < 10) {
      setFormError('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    const basic = Number(newEmpData.basicSalary) || 65000;
    const indianSal = calcIndianPayroll(basic);

    const codeNum = employees.length + 10;
    const empCode = `DF-${codeNum.toString().padStart(3, '0')}`;
    const autoLoginId = generateEmployeeLoginId(
      newEmpData.firstName,
      newEmpData.lastName,
      new Date().toISOString().split('T')[0],
      employees.length + 1,
      'DF'
    );

    addEmployee({
      employeeCode: empCode,
      loginId: autoLoginId,
      firstName: newEmpData.firstName.trim(),
      lastName: newEmpData.lastName.trim(),
      email: newEmpData.email.trim(),
      personalEmail: `${newEmpData.firstName.toLowerCase()}@gmail.com`,
      phone: newEmpData.phone || '9876543210',
      whatsapp: newEmpData.phone || '9876543210',
      address: 'MUMBAI, Maharashtra',
      currentAddress: 'MUMBAI, Maharashtra',
      permanentAddress: 'MUMBAI, Maharashtra',
      designation: newEmpData.designation || 'Software Engineer',
      department: newEmpData.department,
      joiningDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'ACTIVE',
      employmentType: newEmpData.employmentType,
      avatarUrl: avatarPreview || `https://images.unsplash.com/photo-1534528741775?w=150`,
      reportingManager: 'Marcus Vance',
      location: newEmpData.location,
      attendanceRate: 98.0,
      performanceRating: 'GOOD',
      dateOfBirth: '1995-04-20',
      gender: 'Male',
      bloodGroup: 'O+',
      nationality: 'Indian',
      aadhaar: 'XXXX XXXX 1234',
      pan: 'ABCDE1234F',
      emergencyContactName: 'Family Member',
      emergencyContactRelation: 'Parent',
      emergencyContactPhone: newEmpData.phone || '9876543210',
      bankName: 'HDFC Bank',
      bankAccountNo: '50200012345678',
      ifscCode: 'HDFC0001234',
      uanNumber: '100123456789',
      contractRenewalDate: '2027-03-31',
      salary: indianSal,
      documents: [
        {
          id: `doc-new-${Date.now()}`,
          name: 'Offer_Letter_Signed.pdf',
          type: 'PDF',
          uploadDate: new Date().toISOString().split('T')[0],
          size: '1.2 MB',
          status: 'VERIFIED'
        },
        {
          id: `doc-pan-${Date.now()}`,
          name: 'PAN_Card_Copy.pdf',
          type: 'PDF',
          uploadDate: new Date().toISOString().split('T')[0],
          size: '480 KB',
          status: 'VERIFIED'
        }
      ]
    });

    setIsAddModalOpen(false);
    setAvatarPreview(null);
    setNewEmpData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: 'Software Engineer',
      department: 'Engineering',
      employmentType: 'Full-Time',
      location: 'Mumbai HQ (Floor 4)',
      basicSalary: 65000
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-dark tracking-tight">
              Employee Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-blue text-xs font-bold font-mono">
              {filteredEmployees.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-muted mt-0.5">
            {canManageEmployees
              ? 'Manage organization staff, view profiles, and inspect payroll structures.'
              : 'Browse organization staff and departmental contact information.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-bg border border-surface-border rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-muted hover:text-slate-dark'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-muted hover:text-slate-dark'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, role..."
              className="bg-surface-bg border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs focus:border-brand-blue focus:outline-none w-64"
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
                className="bg-white border border-surface-border rounded-2xl p-5 shadow-card hover:shadow-md hover:border-brand-blue/50 transition-all flex flex-col justify-between group"
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
                      <span className="text-[10px] font-bold text-brand-blue uppercase">{emp.department}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-surface-border/soft text-xs text-slate-dark">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-light" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-light" />
                      <span className="truncate">{emp.location}</span>
                    </div>
                    {canViewSalary && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-muted">Monthly Salary:</span>
                        <span className="font-extrabold text-slate-dark font-mono">
                          ₹{emp.salary?.grossSalary?.toLocaleString('en-IN') || '65,000'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-border">
                  <button
                    onClick={() => handleOpenProfile(emp)}
                    className="flex-1 py-2 rounded-xl bg-surface-bg hover:bg-brand-light text-slate-dark hover:text-brand-blue font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Profile</span>
                  </button>
                  {canViewSalary && (
                    <button
                      onClick={() => handleOpenPayslip(emp)}
                      className="p-2 rounded-xl bg-surface-bg hover:bg-brand-light text-slate-dark hover:text-brand-blue transition-all"
                      title="View Indian Payslip"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-surface-border rounded-2xl shadow-card overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-surface-bg border-b border-surface-border text-slate-muted font-bold uppercase">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Login ID</th>
                <th className="p-4">Department</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                {canManageEmployees && <th className="p-4">Gross (₹)</th>}
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-surface-bg/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775?w=150'} alt={emp.firstName} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <div className="font-extrabold text-slate-dark">{emp.firstName} {emp.lastName}</div>
                        <div className="text-[10px] text-slate-muted">{emp.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-brand-blue">{emp.loginId || emp.employeeCode}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-bg border border-surface-border font-bold text-[10px]">{emp.department}</span>
                  </td>
                  <td className="p-4 text-slate-dark">{emp.location}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${emp.employmentStatus === 'ACTIVE' ? 'bg-accent-mint-light text-accent-mint' : 'bg-accent-amber-light text-accent-amber'}`}>{emp.employmentStatus}</span>
                  </td>
                  {canManageEmployees && (
                    <td className="p-4 font-mono font-bold text-slate-dark">₹{emp.salary?.grossSalary?.toLocaleString('en-IN') || '65,000'}</td>
                  )}
                  <td className="p-4 text-right">
                    <button onClick={() => handleOpenProfile(emp)} className="px-3 py-1 rounded-lg text-brand-blue bg-brand-light hover:bg-brand-blue hover:text-white font-bold transition-all">Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-surface-border rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in my-8">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-blue flex items-center justify-between p-5 text-white">
              <div>
                <h3 className="font-extrabold text-lg">Onboard New Employee</h3>
                <p className="text-xs text-white/80">Auto-generate Login ID, provision Indian payroll (₹), and set up profile.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"><X className="w-5 h-5" /></button>
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
                <div><label className="block font-bold text-slate-dark mb-1">First Name *</label><input type="text" required value={newEmpData.firstName} onChange={(e) => setNewEmpData({ ...newEmpData, firstName: e.target.value })} placeholder="e.g. John" className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
                <div><label className="block font-bold text-slate-dark mb-1">Last Name *</label><input type="text" required value={newEmpData.lastName} onChange={(e) => setNewEmpData({ ...newEmpData, lastName: e.target.value })} placeholder="e.g. Doe" className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block font-bold text-slate-dark mb-1">Corporate Email *</label><input type="email" required value={newEmpData.email} onChange={(e) => setNewEmpData({ ...newEmpData, email: e.target.value })} placeholder="first.last@dayflow.com" className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
                <div><label className="block font-bold text-slate-dark mb-1">Indian Mobile (Phone)</label><input type="tel" maxLength={10} value={newEmpData.phone} onChange={(e) => setNewEmpData({ ...newEmpData, phone: e.target.value.replace(/\D/g, '') })} placeholder="9876543210" className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5" /></div>
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
