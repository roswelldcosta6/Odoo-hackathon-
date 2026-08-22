import React, { useState, useEffect } from 'react';
import {
  X, User, Briefcase, DollarSign, FileText, Upload, CheckCircle2,
  AlertCircle, Clock, Shield, Save, Trash2, Copy, Calendar,
  Phone, Mail, MapPin, Heart, CreditCard, Building, UserMinus,
  AlertTriangle, RefreshCw, Camera
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Employee, EmployeeDocument } from '../../types';

export const EmployeeModal: React.FC = () => {
  const {
    selectedEmployee,
    setSelectedEmployee,
    isEmployeeModalOpen,
    setIsEmployeeModalOpen,
    updateEmployee,
    deleteEmployee,
    currentRole
  } = useHRMS();

  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'job' | 'salary' | 'docs' | 'lifecycle'>('personal');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLoginId, setCopiedLoginId] = useState(false);
  const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);
  const [terminateReason, setTerminateReason] = useState('RESIGNATION');
  const [terminateRemarks, setTerminateRemarks] = useState('');
  const [lastWorkingDay, setLastWorkingDay] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    whatsapp: '',
    personalEmail: '',
    address: '',
    currentAddress: '',
    permanentAddress: '',
    designation: '',
    department: '',
    location: '',
    dateOfBirth: '1992-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 1234',
    pan: 'ABCDE1234F',
    emergencyContactName: 'Family Member',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '',
    bankName: 'HDFC Bank',
    bankAccountNo: '50200012345678',
    ifscCode: 'HDFC0001234',
    uanNumber: '100123456789',
    basic: 65000,
    hra: 26000,
    specialAllowance: 13000,
    conveyance: 1600,
    medicalAllowance: 1250,
    providentFund: 1800,
    professionalTax: 200,
    esi: 0,
    incomeTaxTDS: 3250,
    medicalInsurance: 500,
    avatarUrl: '',
    probationEndDate: '',
    contractRenewalDate: '2027-03-31'
  });

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        firstName: selectedEmployee.firstName || '',
        lastName: selectedEmployee.lastName || '',
        phone: selectedEmployee.phone || '',
        whatsapp: selectedEmployee.whatsapp || selectedEmployee.phone || '',
        personalEmail: selectedEmployee.personalEmail || '',
        address: selectedEmployee.address || '',
        currentAddress: selectedEmployee.currentAddress || selectedEmployee.address || '',
        permanentAddress: selectedEmployee.permanentAddress || selectedEmployee.address || '',
        designation: selectedEmployee.designation || '',
        department: selectedEmployee.department || '',
        location: selectedEmployee.location || '',
        dateOfBirth: selectedEmployee.dateOfBirth || '1992-05-15',
        gender: selectedEmployee.gender || 'Male',
        bloodGroup: selectedEmployee.bloodGroup || 'O+',
        nationality: selectedEmployee.nationality || 'Indian',
        aadhaar: selectedEmployee.aadhaar || 'XXXX XXXX 1234',
        pan: selectedEmployee.pan || 'ABCDE1234F',
        emergencyContactName: selectedEmployee.emergencyContactName || 'Family Member',
        emergencyContactRelation: selectedEmployee.emergencyContactRelation || 'Spouse',
        emergencyContactPhone: selectedEmployee.emergencyContactPhone || selectedEmployee.phone || '',
        bankName: selectedEmployee.bankName || 'HDFC Bank',
        bankAccountNo: selectedEmployee.bankAccountNo || '50200012345678',
        ifscCode: selectedEmployee.ifscCode || 'HDFC0001234',
        uanNumber: selectedEmployee.uanNumber || '100123456789',
        basic: selectedEmployee.salary?.basic || 65000,
        hra: selectedEmployee.salary?.hra || 26000,
        specialAllowance: selectedEmployee.salary?.specialAllowance || 13000,
        conveyance: selectedEmployee.salary?.conveyanceAllowance || 1600,
        medicalAllowance: selectedEmployee.salary?.medicalAllowance || 1250,
        providentFund: selectedEmployee.salary?.providentFund || 1800,
        professionalTax: selectedEmployee.salary?.professionalTax || 200,
        esi: selectedEmployee.salary?.esi || 0,
        incomeTaxTDS: selectedEmployee.salary?.incomeTaxTDS || 3250,
        medicalInsurance: selectedEmployee.salary?.medicalInsurance || 500,
        avatarUrl: selectedEmployee.avatarUrl || '',
        probationEndDate: selectedEmployee.probationEndDate || '',
        contractRenewalDate: selectedEmployee.contractRenewalDate || '2027-03-31'
      });
    }
  }, [selectedEmployee]);

  if (!isEmployeeModalOpen || !selectedEmployee) return null;
  const canEditAll = currentRole === 'ADMIN' || currentRole === 'HR_OFFICER';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
        updateEmployee(selectedEmployee.id, { avatarUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const basic = Number(formData.basic) || 0;
    const hra = Number(formData.hra) || Math.round(basic * 0.4);
    const special = Number(formData.specialAllowance) || Math.round(basic * 0.2);
    const conveyance = Number(formData.conveyance) || 1600;
    const medicalAllowance = Number(formData.medicalAllowance) || 1250;
    const gross = basic + hra + special + conveyance + medicalAllowance;

    const pf = Number(formData.providentFund) || Math.min(Math.round(basic * 0.12), 1800);
    const pt = Number(formData.professionalTax) || (gross > 10000 ? 200 : 0);
    const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
    const tds = Number(formData.incomeTaxTDS) || Math.round(basic * 0.05);
    const ins = Number(formData.medicalInsurance) || 500;
    const totDed = pf + pt + esi + tds + ins;
    const net = gross - totDed;
    const ctc = (gross + pf) * 12;

    updateEmployee(selectedEmployee.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      personalEmail: formData.personalEmail,
      address: formData.address,
      currentAddress: formData.currentAddress,
      permanentAddress: formData.permanentAddress,
      designation: formData.designation,
      department: formData.department,
      location: formData.location,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as any,
      bloodGroup: formData.bloodGroup,
      nationality: formData.nationality,
      aadhaar: formData.aadhaar,
      pan: formData.pan,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactRelation: formData.emergencyContactRelation,
      emergencyContactPhone: formData.emergencyContactPhone,
      bankName: formData.bankName,
      bankAccountNo: formData.bankAccountNo,
      ifscCode: formData.ifscCode,
      uanNumber: formData.uanNumber,
      contractRenewalDate: formData.contractRenewalDate,
      avatarUrl: formData.avatarUrl,
      salary: {
        basic,
        hra,
        specialAllowance: special,
        conveyanceAllowance: conveyance,
        medicalAllowance,
        providentFund: pf,
        employerPF: pf,
        professionalTax: pt,
        esi,
        incomeTaxTDS: tds,
        medicalInsurance: ins,
        grossSalary: gross,
        netSalary: net,
        ctc
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: EmployeeDocument = {
        id: 'doc-' + Date.now(),
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'PDF' : file.name.endsWith('.png') || file.name.endsWith('.jpg') ? 'IMAGE' : 'DOC',
        uploadDate: new Date().toISOString().split('T')[0],
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        status: 'VERIFIED'
      };

      updateEmployee(selectedEmployee.id, {
        documents: [newDoc, ...(selectedEmployee.documents || [])]
      });
    }
  };

  const handleRemoveDoc = (docId: string) => {
    updateEmployee(selectedEmployee.id, {
      documents: (selectedEmployee.documents || []).filter(d => d.id !== docId)
    });
  };

  const handleTerminateEmployee = () => {
    updateEmployee(selectedEmployee.id, {
      employmentStatus: 'TERMINATED',
      lastWorkingDay,
      terminationReason: terminateReason,
      terminationRemarks: terminateRemarks
    });
    setIsTerminateDialogOpen(false);
    setIsEmployeeModalOpen(false);
  };

  const handleDeleteEmployee = () => {
    if (window.confirm('Are you sure you want to remove ' + selectedEmployee.firstName + ' ' + selectedEmployee.lastName + '?')) {
      if (deleteEmployee) deleteEmployee(selectedEmployee.id);
      setIsEmployeeModalOpen(false);
    }
  };

  const copyLoginId = () => {
    navigator.clipboard?.writeText(selectedEmployee.loginId || selectedEmployee.employeeCode);
    setCopiedLoginId(true);
    setTimeout(() => setCopiedLoginId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-surface-border rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-in my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-blue/90 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img
                  src={formData.avatarUrl || selectedEmployee.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={selectedEmployee.firstName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md bg-slate-800"
                />
                {canEditAll && (
                  <label className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-extrabold text-white">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <button
                    type="button"
                    onClick={copyLoginId}
                    className="inline-flex items-center gap-1 font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-accent-cyan font-bold border border-white/30 hover:bg-white/30 transition-all"
                    title="Click to copy Login ID"
                  >
                    <span>{selectedEmployee.loginId || selectedEmployee.employeeCode}</span>
                    {copiedLoginId ? <CheckCircle2 className="w-3 h-3 text-accent-mint" /> : <Copy className="w-3 h-3" />}
                  </button>

                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                    selectedEmployee.employmentStatus === 'ACTIVE'
                      ? 'bg-accent-mint text-white'
                      : selectedEmployee.employmentStatus === 'PROBATION'
                      ? 'bg-accent-amber text-white'
                      : selectedEmployee.employmentStatus === 'TERMINATED'
                      ? 'bg-accent-rose text-white'
                      : 'bg-slate-500 text-white'
                  }`}>
                    {selectedEmployee.employmentStatus}
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-1">
                  {formData.designation} &bull; {formData.department} &bull; {formData.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canEditAll && (
                <button
                  type="button"
                  onClick={handleDeleteEmployee}
                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 transition-all text-xs font-bold flex items-center gap-1"
                  title="Remove Employee"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              )}
              <button
                onClick={() => setIsEmployeeModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-surface-border px-6 bg-surface-bg text-xs font-bold text-slate-muted overflow-x-auto">
          {[
            { id: 'personal', label: 'Personal Details', icon: User },
            { id: 'contact', label: 'Contact & Addresses', icon: Phone },
            { id: 'job', label: 'Job & Organization', icon: Briefcase },
            { id: 'salary', label: 'Salary Structure (₹)', icon: DollarSign },
            { id: 'docs', label: 'Documents Vault (' + (selectedEmployee.documents?.length || 0) + ')', icon: FileText },
            { id: 'lifecycle', label: 'Lifecycle Actions', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-blue text-brand-blue bg-white'
                    : 'border-transparent hover:text-slate-dark hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[58vh] overflow-y-auto text-xs space-y-4">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">First Name</label>
                  <input
                    type="text"
                    disabled={!canEditAll}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Last Name</label>
                  <input
                    type="text"
                    disabled={!canEditAll}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Date of Birth</label>
                  <input
                    type="date"
                    disabled={!canEditAll}
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Gender</label>
                  <select
                    disabled={!canEditAll}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Blood Group</label>
                  <input
                    type="text"
                    disabled={!canEditAll}
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    placeholder="e.g. O+, B+"
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Nationality</label>
                  <input
                    type="text"
                    disabled={!canEditAll}
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="p-4 bg-surface-bg border border-surface-border rounded-2xl space-y-3">
                <span className="font-bold text-slate-dark block">Statutory Identity & KYC</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-muted mb-1">PAN Card Number</label>
                    <input
                      type="text"
                      disabled={!canEditAll}
                      maxLength={10}
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      placeholder="ABCDE1234F"
                      className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-muted mb-1">Aadhaar (Masked / Verified)</label>
                    <input
                      type="text"
                      disabled={!canEditAll}
                      value={formData.aadhaar}
                      onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                      placeholder="XXXX XXXX 1234"
                      className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Primary Phone</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-muted mb-1">Work Corporate Email</label>
                  <input
                    type="email"
                    disabled
                    value={selectedEmployee.email}
                    className="w-full bg-slate-100 border border-surface-border text-slate-500 rounded-xl p-2.5 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Personal Email</label>
                  <input
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="p-4 bg-brand-light/40 border border-brand-subtle rounded-2xl space-y-3">
                <span className="font-bold text-brand-blue block">Emergency Contact Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-dark mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="w-full bg-white border border-surface-border text-slate-dark rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-dark mb-1">Relationship</label>
                    <input
                      type="text"
                      value={formData.emergencyContactRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                      placeholder="e.g. Spouse / Father"
                      className="w-full bg-white border border-surface-border text-slate-dark rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-dark mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="w-full bg-white border border-surface-border text-slate-dark rounded-xl p-2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Current Residential Address</label>
                  <textarea
                    rows={2}
                    value={formData.currentAddress}
                    onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Permanent Hometown Address</label>
                  <textarea
                    rows={2}
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'job' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Designation</label>
                  <input
                    type="text"
                    disabled={!canEditAll}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5 focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Department</label>
                  <select
                    disabled={!canEditAll}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Work Location</label>
                  <input
                    type="text"
                    disabled={!canEditAll}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-muted mb-1">Date of Joining</label>
                  <input
                    type="text"
                    disabled
                    value={selectedEmployee.joiningDate}
                    className="w-full bg-slate-100 border border-surface-border text-slate-500 rounded-xl p-2.5 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Contract Renewal Date</label>
                  <input
                    type="date"
                    disabled={!canEditAll}
                    value={formData.contractRenewalDate}
                    onChange={(e) => setFormData({ ...formData, contractRenewalDate: e.target.value })}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-dark mb-1">Reporting Manager</label>
                  <input
                    type="text"
                    disabled={!canEditAll}
                    value={selectedEmployee.reportingManager}
                    className="w-full bg-surface-bg border border-surface-border text-slate-dark rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-bg border border-surface-border rounded-2xl space-y-3">
                <span className="font-bold text-slate-dark block">Indian Banking Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-muted mb-1">Bank Name</label>
                    <input
                      type="text"
                      disabled={!canEditAll}
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full bg-white border border-surface-border text-slate-dark rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-muted mb-1">Account Number</label>
                    <input
                      type="text"
                      disabled={!canEditAll}
                      value={formData.bankAccountNo}
                      onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                      className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-muted mb-1">IFSC Code</label>
                    <input
                      type="text"
                      disabled={!canEditAll}
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                      className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-muted mb-1">UAN (EPFO)</label>
                    <input
                      type="text"
                      disabled={!canEditAll}
                      value={formData.uanNumber}
                      onChange={(e) => setFormData({ ...formData, uanNumber: e.target.value })}
                      className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-brand-light/30 border border-brand-subtle rounded-2xl space-y-3">
                  <span className="font-bold text-brand-blue block">Monthly Earnings (₹)</span>
                  <div className="space-y-2.5">
                    <div>
                      <label className="block font-bold text-slate-dark mb-1">Basic Salary (₹)</label>
                      <input
                        type="number"
                        disabled={!canEditAll}
                        value={formData.basic}
                        onChange={(e) => setFormData({ ...formData, basic: Number(e.target.value) })}
                        className="w-full bg-white border border-surface-border text-slate-dark font-bold font-mono rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-dark mb-1">HRA (40%)</label>
                      <input
                        type="number"
                        disabled={!canEditAll}
                        value={formData.hra}
                        onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
                        className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-dark mb-1">Special Allowance (₹)</label>
                      <input
                        type="number"
                        disabled={!canEditAll}
                        value={formData.specialAllowance}
                        onChange={(e) => setFormData({ ...formData, specialAllowance: Number(e.target.value) })}
                        className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-accent-amber-light/30 border border-accent-amber/30 rounded-2xl space-y-3">
                  <span className="font-bold text-accent-amber block">Statutory Deductions (₹)</span>
                  <div className="space-y-2.5">
                    <div>
                      <label className="block font-bold text-slate-dark mb-1">Employee PF (Max ₹1,800)</label>
                      <input
                        type="number"
                        disabled={!canEditAll}
                        value={formData.providentFund}
                        onChange={(e) => setFormData({ ...formData, providentFund: Number(e.target.value) })}
                        className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-dark mb-1">Professional Tax (PT - ₹200/mo)</label>
                      <input
                        type="number"
                        disabled={!canEditAll}
                        value={formData.professionalTax}
                        onChange={(e) => setFormData({ ...formData, professionalTax: Number(e.target.value) })}
                        className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-dark mb-1">Income Tax TDS (₹)</label>
                      <input
                        type="number"
                        disabled={!canEditAll}
                        value={formData.incomeTaxTDS}
                        onChange={(e) => setFormData({ ...formData, incomeTaxTDS: Number(e.target.value) })}
                        className="w-full bg-white border border-surface-border text-slate-dark font-mono rounded-xl p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Net Take-Home Salary</div>
                  <div className="text-xl font-black text-accent-mint font-mono">
                    ₹{(formData.basic + formData.hra + formData.specialAllowance + formData.conveyance + formData.medicalAllowance - (formData.providentFund + formData.professionalTax + formData.incomeTaxTDS + formData.medicalInsurance)).toLocaleString('en-IN')} / mo
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Annual CTC</div>
                  <div className="text-lg font-black text-accent-cyan font-mono">
                    ₹{((formData.basic + formData.hra + formData.specialAllowance + formData.conveyance + formData.medicalAllowance + formData.providentFund) * 12).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-dark">Employee Document Repository</span>
                {canEditAll && (
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue text-white font-bold text-xs cursor-pointer hover:bg-brand-hover shadow-sm transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                )}
              </div>

              {selectedEmployee.documents && selectedEmployee.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedEmployee.documents.map((doc) => (
                    <div key={doc.id} className="p-3.5 bg-surface-bg border border-surface-border rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-sm transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-blue flex items-center justify-center font-bold font-mono">
                          {doc.type}
                        </div>
                        <div>
                          <div className="font-bold text-slate-dark truncate max-w-[180px]">{doc.name}</div>
                          <div className="text-[10px] text-slate-muted">{doc.size} &bull; {doc.uploadDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-accent-mint-light text-accent-mint text-[10px] font-bold">
                          {doc.status}
                        </span>
                        {canEditAll && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            className="p-1 text-slate-400 hover:text-accent-rose transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-surface-bg rounded-2xl border-2 border-dashed border-surface-border text-slate-muted">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No documents uploaded in vault yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lifecycle' && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-bg border border-surface-border rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-dark">Contract Renewal Milestone</div>
                  <div className="text-xs text-slate-muted">Next renewal: <strong>{formData.contractRenewalDate || '2027-03-31'}</strong></div>
                </div>
                {canEditAll && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(p => ({ ...p, contractRenewalDate: '2028-03-31' }));
                      setSavedSuccess(true);
                      setTimeout(() => setSavedSuccess(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-surface-border text-brand-blue font-bold text-xs hover:bg-brand-light flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Extend 1 Year</span>
                  </button>
                )}
              </div>

              {selectedEmployee.employmentStatus === 'PROBATION' && (
                <div className="p-4 bg-accent-amber-light/40 border border-accent-amber/40 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-accent-amber">Probation Review</div>
                    <div className="text-xs text-slate-600">Employee is currently on trial probation.</div>
                  </div>
                  {canEditAll && (
                    <button
                      type="button"
                      onClick={() => {
                        updateEmployee(selectedEmployee.id, { employmentStatus: 'ACTIVE' });
                        setIsEmployeeModalOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-accent-mint text-white font-bold text-xs hover:bg-emerald-600 shadow-sm"
                    >
                      Confirm Permanent
                    </button>
                  )}
                </div>
              )}

              {canEditAll && selectedEmployee.employmentStatus !== 'TERMINATED' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Termination Formalities</span>
                  </div>
                  <p className="text-slate-600 text-xs">Mark exit, calculate last workingday, and deactivate account.</p>
                  <button
                    type="button"
                    onClick={() => setIsTerminateDialogOpen(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>Initiate Termination Process</span>
                  </button>
                </div>
              )}

              {isTerminateDialogOpen && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 border border-rose-500/50">
                  <span className="font-bold text-rose-400 block">Confirm Termination</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Exit Reason</label>
                      <select
                        value={terminateReason}
                        onChange={(e) => setTerminateReason(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                      >
                        <option value="RESIGNATION">Resignation</option>
                        <option value="CONTRACT_COMPLETED">Contract Completed</option>
                        <option value="PERFORMANCE">Performance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Last WorkingDay</label>
                      <input
                        type="date"
                        value={lastWorkingDay}
                        onChange={(e) => setLastWorkingDay(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Exit Remarks</label>
                    <textarea
                      rows={2}
                      value={terminateRemarks}
                      onChange={(e) => setTerminateRemarks(e.target.value)}
                      placeholder="Exit notes..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsTerminateDialogOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleTerminateEmployee}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Confirm Deactivation
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-surface-bg border-t border-surface-border p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-accent-mint font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes saved successfully!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEmployeeModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-muted hover:text-slate-dark text-xs font-bold"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
