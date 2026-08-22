export type UserRole = 'ADMIN' | 'HR_OFFICER' | 'EMPLOYEE';

export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'PROBATION' | 'RESIGNED';
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
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail: string;
  phone: string;
  address: string;
  designation: string;
  department: string;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
  avatarUrl: string;
  reportingManager: string;
  reportingManagerId?: string;
  location: string;
  attendanceRate: number; // e.g. 98.4
  performanceRating: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'ATTENTION';
  salary: {
    basic: number;
    hra: number;
    specialAllowance: number;
    providentFund: number;
    professionalTax: number;
    medicalInsurance: number;
    grossSalary: number;
    netSalary: number;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    size: string;
    status: 'VERIFIED' | 'PENDING';
  }[];
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
  designation: string;
  department: string;
  panNumber: string;
  bankAccount: string;
  uanNumber: string;
  month: string; // e.g., "August 2026"
  payDate: string;
  workingDays: number;
  daysWorked: number;
  earnings: {
    basic: number;
    hra: number;
    conveyance: number;
    specialAllowance: number;
    performanceBonus: number;
    grossTotal: number;
  };
  deductions: {
    providentFund: number;
    professionalTax: number;
    incomeTaxTDS: number;
    healthInsurance: number;
    totalDeductions: number;
  };
  netPayable: number;
  netPayableWords: string;
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
