import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  DollarSign,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Save,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Employee } from '../../types';

export const EmployeeModal: React.FC = () => {
  const {
    selectedEmployee,
    setSelectedEmployee,
    isEmployeeModalOpen,
    setIsEmployeeModalOpen,
    updateEmployee,
    currentRole
  } = useHRMS();

  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'salary' | 'docs'>('personal');
  
  if (!isEmployeeModalOpen || !selectedEmployee) return null;

  const [formData, setFormData] = useState({
    phone: selectedEmployee.phone,
    address: selectedEmployee.address,
    personalEmail: selectedEmployee.personalEmail,
    designation: selectedEmployee.designation,
    department: selectedEmployee.department,
    location: selectedEmployee.location,
    basic: selectedEmployee.salary.basic,
    hra: selectedEmployee.salary.hra,
    specialAllowance: selectedEmployee.salary.specialAllowance
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const canEditJobAndSalary = currentRole === 'ADMIN' || currentRole === 'HR_OFFICER';

  const handleSave = () => {
    const updatedSalary = {
      ...selectedEmployee.salary,
      basic: formData.basic,
      hra: formData.hra,
      specialAllowance: formData.specialAllowance,
      grossSalary: formData.basic + formData.hra + formData.specialAllowance,
      netSalary: Math.round(
        (formData.basic + formData.hra + formData.specialAllowance) -
        (selectedEmployee.salary.providentFund + selectedEmployee.salary.professionalTax + selectedEmployee.salary.medicalInsurance)
      )
    };

    updateEmployee(selectedEmployee.id, {
      phone: formData.phone,
      address: formData.address,
      personalEmail: formData.personalEmail,
      designation: formData.designation,
      department: formData.department,
      location: formData.location,
      salary: updatedSalary
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: 'PDF',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'PENDING' as const
      };

      updateEmployee(selectedEmployee.id, {
        documents: [...selectedEmployee.documents, newDoc]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-dark/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-surface-border rounded-2xl shadow-float w-full max-w-3xl overflow-hidden animate-scale-in">
        
        {/* Modal Top Header */}
        <div className="bg-surface-bg border-b border-surface-border p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={selectedEmployee.avatarUrl}
              alt={selectedEmployee.firstName}
              className="w-12 h-12 rounded-xl object-cover border border-surface-border shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-dark text-lg">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-light text-brand-blue font-bold">
                  {selectedEmployee.employeeCode}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    selectedEmployee.employmentStatus === 'ACTIVE'
                      ? 'bg-accent-mint-light text-accent-mint'
                      : 'bg-accent-amber-light text-accent-amber'
                  }`}
                >
                  {selectedEmployee.employmentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-muted">
                {selectedEmployee.designation} · {selectedEmployee.department}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEmployeeModalOpen(false)}
            className="p-2 rounded-xl text-slate-muted hover:text-slate-dark hover:bg-surface-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-surface-border px-5 bg-white text-xs font-bold text-slate-muted">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'personal'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent hover:text-slate-dark'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Details</span>
          </button>

          <button
            onClick={() => setActiveTab('job')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'job'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent hover:text-slate-dark'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Job & Organization</span>
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'salary'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent hover:text-slate-dark'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Salary Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`py-3.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'docs'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent hover:text-slate-dark'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Vault ({selectedEmployee.documents.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* Tab 1: Personal Details */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-muted mb-1">Corporate Email</label>
                  <input
                    type="text"
                    disabled
                    value={selectedEmployee.email}
                    className="w-full bg-slate-50 border border-surface-border text-slate-muted text-xs rounded-xl p-2.5 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1">Personal Email</label>
                  <input
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark text-xs rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark text-xs rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1">Work Location / Desk</label>
                  <input
                    type="text"
                    disabled={!canEditJobAndSalary}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full text-xs rounded-xl p-2.5 ${canEditJobAndSalary ? 'bg-surface-bg border border-surface-border text-slate-dark focus:border-brand-blue' : 'bg-slate-50 border border-surface-border text-slate-muted'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-dark mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-surface-bg border border-surface-border text-slate-dark text-xs rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Job Details */}
          {activeTab === 'job' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1">Designation</label>
                  <input
                    type="text"
                    disabled={!canEditJobAndSalary}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className={`w-full text-xs rounded-xl p-2.5 ${canEditJobAndSalary ? 'bg-surface-bg border border-surface-border text-slate-dark' : 'bg-slate-50 text-slate-muted'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-dark mb-1">Department</label>
                  <select
                    disabled={!canEditJobAndSalary}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={`w-full text-xs rounded-xl p-2.5 ${canEditJobAndSalary ? 'bg-surface-bg border border-surface-border text-slate-dark' : 'bg-slate-50 text-slate-muted'}`}
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
                  <label className="block text-xs font-bold text-slate-muted mb-1">Reporting Manager</label>
                  <input
                    type="text"
                    disabled
                    value={selectedEmployee.reportingManager}
                    className="w-full bg-slate-50 border border-surface-border text-slate-muted text-xs rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-muted mb-1">Date of Joining</label>
                  <input
                    type="text"
                    disabled
                    value={selectedEmployee.joiningDate}
                    className="w-full bg-slate-50 border border-surface-border text-slate-muted text-xs rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-light/50 border border-brand-subtle flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-dark">Attendance Health:</span>
                  <span className="text-brand-blue font-bold ml-1">{selectedEmployee.attendanceRate}%</span>
                </div>
                <div>
                  <span className="font-bold text-slate-dark">Performance:</span>
                  <span className="text-accent-mint font-bold ml-1">{selectedEmployee.performanceRating}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Salary Structure */}
          {activeTab === 'salary' && (
            <div className="space-y-4">
              {!canEditJobAndSalary && (
                <div className="p-3 rounded-xl bg-accent-amber-light border border-accent-amber/30 text-xs text-accent-amber font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>Read-only view. Only HR Officers and Admins can configure compensation structures.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
                  <span className="text-[11px] font-bold text-slate-muted">Basic Salary</span>
                  <div className="text-base font-extrabold text-slate-dark font-mono mt-1">
                    ${formData.basic.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
                  <span className="text-[11px] font-bold text-slate-muted">HRA (50% Basic)</span>
                  <div className="text-base font-extrabold text-slate-dark font-mono mt-1">
                    ${formData.hra.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-surface-bg border border-surface-border">
                  <span className="text-[11px] font-bold text-slate-muted">Special Allowance</span>
                  <div className="text-base font-extrabold text-slate-dark font-mono mt-1">
                    ${formData.specialAllowance.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div className="border border-surface-border rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
                <div className="font-bold text-slate-dark pb-1 border-b border-surface-border flex justify-between">
                  <span>Standard Deductions</span>
                  <span>Monthly Contribution</span>
                </div>
                <div className="flex justify-between text-slate-muted">
                  <span>Provident Fund (PF - 12%)</span>
                  <span className="font-mono text-slate-dark">${selectedEmployee.salary.providentFund}</span>
                </div>
                <div className="flex justify-between text-slate-muted">
                  <span>Professional Tax</span>
                  <span className="font-mono text-slate-dark">${selectedEmployee.salary.professionalTax}</span>
                </div>
                <div className="flex justify-between text-slate-muted">
                  <span>Group Health Insurance</span>
                  <span className="font-mono text-slate-dark">${selectedEmployee.salary.medicalInsurance}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-dark pt-2 border-t border-surface-border">
                  <span>Estimated Net Monthly CTC</span>
                  <span className="font-mono text-brand-blue text-sm">${selectedEmployee.salary.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Document Vault */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-muted">Verified Enterprise Documents</span>
                
                {/* Upload Trigger */}
                <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-brand-light text-brand-blue text-xs font-bold hover:bg-brand-blue hover:text-white transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />
                </label>
              </div>

              <div className="space-y-2">
                {selectedEmployee.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-surface-border bg-surface-bg flex items-center justify-between text-xs hover:border-brand-blue transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-rose-light text-accent-rose flex items-center justify-center font-bold text-[10px]">
                        PDF
                      </div>
                      <div>
                        <p className="font-bold text-slate-dark">{doc.name}</p>
                        <p className="text-[10px] text-slate-muted">Uploaded on {doc.uploadDate} · {doc.size}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.status === 'VERIFIED'
                            ? 'bg-accent-mint-light text-accent-mint'
                            : 'bg-accent-amber-light text-accent-amber'
                        }`}
                      >
                        {doc.status}
                      </span>
                      <button
                        onClick={() => alert(`Previewing ${doc.name} (Simulated Vault Access)`)}
                        className="p-1 text-slate-muted hover:text-brand-blue"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-surface-bg border-t border-surface-border p-4 px-6 flex items-center justify-between">
          <span className="text-xs text-slate-light">
            {savedSuccess ? (
              <span className="text-accent-mint font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Changes saved to database!
              </span>
            ) : (
              'Audit log recorded automatically upon update'
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEmployeeModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-muted hover:bg-surface-border transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-blue text-white hover:bg-brand-hover transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
