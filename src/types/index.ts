export type UserRole = 'ADMIN' | 'HR_OFFICER' | 'EMPLOYEE';

export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'PROBATION' | 'RESIGNED' | 'NOTICE_PERIOD' | 'TERMINATED';
export type EmploymentType = 'Full-Time' | 'Remote' | 'Contractor' | 'Probation';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveCategory = 'PAID_ANNUAL' | 'SICK_LEAVE' | 'CASUAL_LEAVE' | 'UNPAID_LOP';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  employeeId: string;
  name: string;
  avatarUrl: string;
  designation: string;
  loginId?: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  fileUrl?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  loginId: string; // Auto-generated e.g. OIJODO20220001 / DFJODO20260001
  firstName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  phone: string;
  whatsapp?: string;
  address: string;
  currentAddress?: string;
  permanentAddress?: string;
  designation: string;
  department: string;
  joiningDate: string;
  probationEndDate?: string;
  contractEndDate?: string;
  contractRenewalDate?: string;
  lastWorkingDay?: string;
  noticePeriodDays?: number;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
  avatarUrl: string;
  reportingManager: string;
  reportingManagerId?: string;
  location: string;
  attendanceRate: number; // e.g. 98.4
  performanceRating: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'ATTENTION';
  // Personal Details
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodGroup?: string;
  nationality?: string;
  aadhaar?: string; // Format: XXXX XXXX 1234
  pan?: string; // Format: ABCDE1234F
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  // Indian Banking Details
  bankName?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  uanNumber?: string;
  // Termination / Lifecycle Info
  terminationReason?: string;
  terminationRemarks?: string;
  salary: {
    basic: number;
    hra: number;
    specialAllowance: number;
    conveyanceAllowance?: number;
    medicalAllowance?: number;
    providentFund: number; // Employee PF: 12% of Basic
    employerPF?: number; // Employer PF: 12% of Basic
    professionalTax: number; // PT: ₹200/month
    esi?: number; // ESI: 0.75% of Gross if <= ₹21,000
    incomeTaxTDS?: number; // Estimated TDS
    medicalInsurance: number;
    grossSalary: number;
    netSalary: number;
    ctc?: number; // Annual Cost to Company
  };
  documents: EmployeeDocument[];
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  designation: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:MM AM/PM
  checkOut?: string; // HH:MM AM/PM
  totalHours: number; // e.g. 8.5
  status: AttendanceStatus;
  isLate: boolean;
  networkType: 'OFFICE_WIFI' | 'REMOTE_IP';
  ipAddress: string;
  remarks?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  designation: string;
  leaveType: LeaveCategory;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewerComment?: string;
  reviewedAt?: string;
  hasCollisionWarning?: boolean;
  collisionDetails?: string;
}

export interface LeaveBalance {
  paidAnnual: { total: number; used: number; remaining: number };
  sickLeave: { total: number; used: number; remaining: number };
  casualLeave: { total: number; used: number; remaining: number };
  unpaidLop: { used: number };
}

export interface Payslip {
  id: string;
  slipNumber: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  loginId?: string;
  designation: string;
  department: string;
  panNumber: string;
  bankAccount: string;
  ifscCode?: string;
  uanNumber: string;
  month: string; // e.g., 'August 2026'
  payDate: string;
  workingDays: number;
  daysWorked: number;
  earnings: {
    basic: number;
    hra: number;
    conveyance: number;
    specialAllowance: number;
    medicalAllowance?: number;
    performanceBonus: number;
    grossTotal: number;
  };
  deductions: {
    employeePF: number;
    employerPF?: number;
    professionalTax: number;
    incomeTaxTDS: number;
    esi?: number;
    healthInsurance: number;
    totalDeductions: number;
  };
  netPayable: number;
  netPayableWords: string;
  ctcAnnual?: number;
  paymentStatus: 'PAID' | 'PROCESSED' | 'PENDING';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  module: 'ATTENDANCE' | 'LEAVE' | 'PAYROLL' | 'EMPLOYEE' | 'SECURITY' | 'SYSTEM';
  description: string;
  diff?: {
    field: string;
    oldValue: string;
    newValue: string;
  };
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  status: 'ONLINE' | 'AWAY' | 'ON_LEAVE';
  children?: OrgNode[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  linkTab?: string;
}
