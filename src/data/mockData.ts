import { Employee, AttendanceRecord, LeaveRequest, Payslip, AuditLogItem, OrgNode, AppNotification, User } from '../types';

export const mockUsers: Record<string, User> = {
  ADMIN: {
    id: 'usr-admin-1',
    email: 'marcus.vance@dayflow.io',
    role: 'ADMIN',
    employeeId: 'emp-1',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    designation: 'VP of Human Resources',
  },
  HR_OFFICER: {
    id: 'usr-hr-1',
    email: 'sarah.jenkins@dayflow.io',
    role: 'HR_OFFICER',
    employeeId: 'emp-2',
    name: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Senior HR Generalist',
  },
  EMPLOYEE: {
    id: 'usr-emp-3',
    email: 'alex.rivera@dayflow.io',
    role: 'EMPLOYEE',
    employeeId: 'emp-3',
    name: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    designation: 'Lead Full Stack Engineer',
  }
};

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeCode: 'DF-001',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@dayflow.io',
    personalEmail: 'marcus.vance.private@gmail.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, San Francisco, CA 94107',
    designation: 'VP of Human Resources',
    department: 'Human Resources',
    joiningDate: '2021-03-15',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Elena Rostova (CEO)',
    location: 'San Francisco HQ (Floor 4)',
    attendanceRate: 99.2,
    performanceRating: 'EXCELLENT',
    salary: {
      basic: 7000,
      hra: 3500,
      specialAllowance: 2500,
      providentFund: 840,
      professionalTax: 200,
      medicalInsurance: 300,
      grossSalary: 13000,
      netSalary: 11660,
    },
    documents: [
      { id: 'doc-1', name: 'Executive_Employment_Agreement.pdf', type: 'PDF', uploadDate: '2021-03-15', size: '2.4 MB', status: 'VERIFIED' },
      { id: 'doc-2', name: 'Tax_Exemption_Form_W4.pdf', type: 'PDF', uploadDate: '2026-01-10', size: '512 KB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-2',
    employeeCode: 'DF-002',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.jenkins@dayflow.io',
    personalEmail: 's.jenkins88@outlook.com',
    phone: '+1 (555) 345-6789',
    address: '88 Market St, Suite 400, San Francisco, CA 94105',
    designation: 'Senior HR Generalist',
    department: 'Human Resources',
    joiningDate: '2022-06-01',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'San Francisco HQ (Floor 4)',
    attendanceRate: 97.5,
    performanceRating: 'GOOD',
    salary: {
      basic: 4500,
      hra: 2250,
      specialAllowance: 1500,
      providentFund: 540,
      professionalTax: 200,
      medicalInsurance: 250,
      grossSalary: 8250,
      netSalary: 7260,
    },
    documents: [
      { id: 'doc-3', name: 'Offer_Letter_Signed.pdf', type: 'PDF', uploadDate: '2022-05-20', size: '1.8 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-3',
    employeeCode: 'DF-042',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@dayflow.io',
    personalEmail: 'alex.rivera.dev@gmail.com',
    phone: '+1 (555) 890-1234',
    address: '520 Folsom Street, Apt 14B, San Francisco, CA 94105',
    designation: 'Lead Full Stack Engineer',
    department: 'Engineering',
    joiningDate: '2023-01-10',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'David Sterling (VP of Eng)',
    location: 'San Francisco HQ / Hybrid',
    attendanceRate: 98.6,
    performanceRating: 'EXCELLENT',
    salary: {
      basic: 6500,
      hra: 3250,
      specialAllowance: 2200,
      providentFund: 780,
      professionalTax: 200,
      medicalInsurance: 280,
      grossSalary: 11950,
      netSalary: 10690,
    },
    documents: [
      { id: 'doc-4', name: 'Employment_Contract_2023.pdf', type: 'PDF', uploadDate: '2023-01-05', size: '3.1 MB', status: 'VERIFIED' },
      { id: 'doc-5', name: 'IP_Assignment_NDA.pdf', type: 'PDF', uploadDate: '2023-01-05', size: '1.2 MB', status: 'VERIFIED' },
      { id: 'doc-6', name: 'Passport_Scan_Verified.pdf', type: 'PDF', uploadDate: '2023-01-06', size: '890 KB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-4',
    employeeCode: 'DF-043',
    firstName: 'Maya',
    lastName: 'Lin',
    email: 'maya.lin@dayflow.io',
    personalEmail: 'maya.lin.design@gmail.com',
    phone: '+1 (555) 456-7890',
    address: '1200 Grand Ave, Oakland, CA 94610',
    designation: 'Principal UI/UX Designer',
    department: 'Design',
    joiningDate: '2023-04-12',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Chloe Bennet (VP of Design)',
    location: 'San Francisco HQ (Floor 3)',
    attendanceRate: 96.8,
    performanceRating: 'GOOD',
    salary: {
      basic: 5800,
      hra: 2900,
      specialAllowance: 1800,
      providentFund: 696,
      professionalTax: 200,
      medicalInsurance: 250,
      grossSalary: 10500,
      netSalary: 9354,
    },
    documents: [
      { id: 'doc-7', name: 'Design_Lead_Contract.pdf', type: 'PDF', uploadDate: '2023-04-10', size: '2.1 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-5',
    employeeCode: 'DF-044',
    firstName: 'Jordan',
    lastName: 'Kaye',
    email: 'jordan.kaye@dayflow.io',
    personalEmail: 'jordan.k@gmail.com',
    phone: '+1 (555) 567-8901',
    address: '350 Mission St, San Francisco, CA 94105',
    designation: 'Senior Backend Engineer',
    department: 'Engineering',
    joiningDate: '2023-08-01',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'David Sterling (VP of Eng)',
    location: 'Remote (Seattle, WA)',
    attendanceRate: 94.2,
    performanceRating: 'GOOD',
    salary: {
      basic: 5900,
      hra: 2950,
      specialAllowance: 1900,
      providentFund: 708,
      professionalTax: 200,
      medicalInsurance: 260,
      grossSalary: 10750,
      netSalary: 9582,
    },
    documents: [
      { id: 'doc-8', name: 'Remote_Worker_Agreement.pdf', type: 'PDF', uploadDate: '2023-07-28', size: '1.4 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-6',
    employeeCode: 'DF-045',
    firstName: 'Devon',
    lastName: 'Miles',
    email: 'devon.miles@dayflow.io',
    personalEmail: 'devon.miles@gmail.com',
    phone: '+1 (555) 678-9012',
    address: '100 Bush St, San Francisco, CA 94104',
    designation: 'DevOps & Cloud Architect',
    department: 'Engineering',
    joiningDate: '2022-11-15',
    employmentStatus: 'ON_LEAVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'David Sterling (VP of Eng)',
    location: 'San Francisco HQ (Floor 5)',
    attendanceRate: 92.0,
    performanceRating: 'AVERAGE',
    salary: {
      basic: 6200,
      hra: 3100,
      specialAllowance: 2000,
      providentFund: 744,
      professionalTax: 200,
      medicalInsurance: 270,
      grossSalary: 11300,
      netSalary: 10086,
    },
    documents: [
      { id: 'doc-9', name: 'DevOps_Contract.pdf', type: 'PDF', uploadDate: '2022-11-10', size: '2.0 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-7',
    employeeCode: 'DF-078',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@dayflow.io',
    personalEmail: 'priya.s.product@gmail.com',
    phone: '+1 (555) 789-0123',
    address: '225 Bush St, San Francisco, CA 94104',
    designation: 'Group Product Manager',
    department: 'Product',
    joiningDate: '2022-03-01',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Elena Rostova (CEO)',
    location: 'San Francisco HQ (Floor 3)',
    attendanceRate: 99.0,
    performanceRating: 'EXCELLENT',
    salary: {
      basic: 6800,
      hra: 3400,
      specialAllowance: 2300,
      providentFund: 816,
      professionalTax: 200,
      medicalInsurance: 290,
      grossSalary: 12500,
      netSalary: 11194,
    },
    documents: [
      { id: 'doc-10', name: 'Product_Lead_Agreement.pdf', type: 'PDF', uploadDate: '2022-02-25', size: '2.8 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-8',
    employeeCode: 'DF-089',
    firstName: 'Lucas',
    lastName: 'Mendoza',
    email: 'lucas.mendoza@dayflow.io',
    personalEmail: 'lucas.m@gmail.com',
    phone: '+1 (555) 890-2345',
    address: '450 Sutter St, San Francisco, CA 94108',
    designation: 'Growth Marketing Lead',
    department: 'Marketing',
    joiningDate: '2024-01-15',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'San Francisco HQ (Floor 2)',
    attendanceRate: 91.5,
    performanceRating: 'AVERAGE',
    salary: {
      basic: 4800,
      hra: 2400,
      specialAllowance: 1600,
      providentFund: 576,
      professionalTax: 200,
      medicalInsurance: 240,
      grossSalary: 8800,
      netSalary: 7784,
    },
    documents: [
      { id: 'doc-11', name: 'Marketing_Lead_Contract.pdf', type: 'PDF', uploadDate: '2024-01-10', size: '1.9 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-9',
    employeeCode: 'DF-092',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@dayflow.io',
    personalEmail: 'amara.o@outlook.com',
    phone: '+1 (555) 901-3456',
    address: '600 California St, San Francisco, CA 94108',
    designation: 'Senior Financial Analyst',
    department: 'Finance',
    joiningDate: '2023-09-01',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'San Francisco HQ (Floor 4)',
    attendanceRate: 99.5,
    performanceRating: 'EXCELLENT',
    salary: {
      basic: 5400,
      hra: 2700,
      specialAllowance: 1750,
      providentFund: 648,
      professionalTax: 200,
      medicalInsurance: 260,
      grossSalary: 9850,
      netSalary: 8742,
    },
    documents: [
      { id: 'doc-12', name: 'Finance_Offer_Letter.pdf', type: 'PDF', uploadDate: '2023-08-25', size: '1.7 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-10',
    employeeCode: 'DF-105',
    firstName: 'Liam',
    lastName: 'Nakamura',
    email: 'liam.nakamura@dayflow.io',
    personalEmail: 'liam.n@gmail.com',
    phone: '+1 (555) 012-4567',
    address: '150 4th St, San Francisco, CA 94103',
    designation: 'Frontend React Engineer',
    department: 'Engineering',
    joiningDate: '2024-05-01',
    employmentStatus: 'PROBATION',
    employmentType: 'Probation',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Alex Rivera',
    location: 'San Francisco HQ (Floor 5)',
    attendanceRate: 88.0,
    performanceRating: 'ATTENTION',
    salary: {
      basic: 4200,
      hra: 2100,
      specialAllowance: 1300,
      providentFund: 504,
      professionalTax: 200,
      medicalInsurance: 220,
      grossSalary: 7600,
      netSalary: 6676,
    },
    documents: [
      { id: 'doc-13', name: 'Probation_Contract.pdf', type: 'PDF', uploadDate: '2024-04-28', size: '1.5 MB', status: 'PENDING' }
    ]
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-3',
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Lead Full Stack Engineer',
    date: '2026-08-22',
    checkIn: '09:14 AM',
    totalHours: 6.8,
    status: 'PRESENT',
    isLate: false,
    networkType: 'OFFICE_WIFI',
    ipAddress: '192.168.1.104 (HQ-Floor-5)',
    remarks: 'Active in Sprint 42 Planning'
  },
  {
    id: 'att-2',
    employeeId: 'emp-1',
    employeeName: 'Marcus Vance',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    designation: 'VP of Human Resources',
    date: '2026-08-22',
    checkIn: '08:45 AM',
    totalHours: 7.2,
    status: 'PRESENT',
    isLate: false,
    networkType: 'OFFICE_WIFI',
    ipAddress: '192.168.1.12 (HQ-Floor-4)'
  },
  {
    id: 'att-3',
    employeeId: 'emp-2',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    designation: 'Senior HR Generalist',
    date: '2026-08-22',
    checkIn: '09:02 AM',
    totalHours: 6.9,
    status: 'PRESENT',
    isLate: false,
    networkType: 'OFFICE_WIFI',
    ipAddress: '192.168.1.15 (HQ-Floor-4)'
  },
  {
    id: 'att-4',
    employeeId: 'emp-4',
    employeeName: 'Maya Lin',
    employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Design',
    designation: 'Principal UI/UX Designer',
    date: '2026-08-22',
    checkIn: '09:35 AM',
    totalHours: 6.4,
    status: 'PRESENT',
    isLate: true,
    networkType: 'OFFICE_WIFI',
    ipAddress: '192.168.1.72 (HQ-Floor-3)',
    remarks: 'Flagged 5m late by auto-clock rule'
  },
  {
    id: 'att-5',
    employeeId: 'emp-5',
    employeeName: 'Jordan Kaye',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Senior Backend Engineer',
    date: '2026-08-22',
    checkIn: '09:00 AM',
    totalHours: 7.0,
    status: 'PRESENT',
    isLate: false,
    networkType: 'REMOTE_IP',
    ipAddress: '73.142.99.18 (Seattle, WA)'
  },
  {
    id: 'att-6',
    employeeId: 'emp-6',
    employeeName: 'Devon Miles',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'DevOps & Cloud Architect',
    date: '2026-08-22',
    checkIn: '-',
    totalHours: 0,
    status: 'ON_LEAVE',
    isLate: false,
    networkType: 'REMOTE_IP',
    ipAddress: '-',
    remarks: 'Approved Sick Leave'
  },
  {
    id: 'att-7',
    employeeId: 'emp-7',
    employeeName: 'Priya Sharma',
    employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'Product',
    designation: 'Group Product Manager',
    date: '2026-08-22',
    checkIn: '08:50 AM',
    totalHours: 7.1,
    status: 'PRESENT',
    isLate: false,
    networkType: 'OFFICE_WIFI',
    ipAddress: '192.168.1.88 (HQ-Floor-3)'
  },
  {
    id: 'att-8',
    employeeId: 'emp-10',
    employeeName: 'Liam Nakamura',
    employeeAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Frontend React Engineer',
    date: '2026-08-22',
    checkIn: '10:15 AM',
    totalHours: 4.8,
    status: 'HALF_DAY',
    isLate: true,
    networkType: 'OFFICE_WIFI',
    ipAddress: '192.168.1.91 (HQ-Floor-5)',
    remarks: 'Doctor appointment morning'
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-3', // Alex Rivera
    employeeName: 'Alex Rivera',
    employeeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Lead Full Stack Engineer',
    leaveType: 'PAID_ANNUAL',
    startDate: '2026-08-24',
    endDate: '2026-08-26',
    totalDays: 3,
    reason: 'Annual family vacation and family gathering.',
    status: 'PENDING',
    appliedDate: '2026-08-20',
    hasCollisionWarning: true,
    collisionDetails: '⚠️ Team Bandwidth Warning: Devon Miles is on sick leave & Jordan Kaye is remote on Aug 24-26. Engineering sprint bandwidth will drop below 60%.'
  },
  {
    id: 'leave-2',
    employeeId: 'emp-4', // Maya Lin
    employeeName: 'Maya Lin',
    employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Design',
    designation: 'Principal UI/UX Designer',
    leaveType: 'CASUAL_LEAVE',
    startDate: '2026-08-28',
    endDate: '2026-08-28',
    totalDays: 1,
    reason: 'Home utility maintenance & deliveries.',
    status: 'PENDING',
    appliedDate: '2026-08-21',
    hasCollisionWarning: false
  },
  {
    id: 'leave-3',
    employeeId: 'emp-6', // Devon Miles
    employeeName: 'Devon Miles',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'DevOps & Cloud Architect',
    leaveType: 'SICK_LEAVE',
    startDate: '2026-08-21',
    endDate: '2026-08-24',
    totalDays: 2,
    reason: 'Severe viral fever and flu recovery.',
    status: 'APPROVED',
    appliedDate: '2026-08-20',
    reviewedBy: 'Sarah Jenkins (HR)',
    reviewerComment: 'Approved. Medical certificate submitted and verified.',
    reviewedAt: '2026-08-20 04:30 PM'
  },
  {
    id: 'leave-4',
    employeeId: 'emp-8', // Lucas Mendoza
    employeeName: 'Lucas Mendoza',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    designation: 'Growth Marketing Lead',
    leaveType: 'PAID_ANNUAL',
    startDate: '2026-09-02',
    endDate: '2026-09-08',
    totalDays: 5,
    reason: 'Attending SaaS Growth Summit in London followed by personal days.',
    status: 'APPROVED',
    appliedDate: '2026-08-15',
    reviewedBy: 'Marcus Vance (VP HR)',
    reviewerComment: 'Approved. Marketing Q3 handover completed.',
    reviewedAt: '2026-08-16 11:15 AM'
  }
];

export const initialPayslips: Payslip[] = [
  {
    id: 'slip-2026-08-042',
    slipNumber: 'PAY-DF-2026-08-042',
    employeeId: 'emp-3',
    employeeName: 'Alex Rivera',
    employeeCode: 'DF-042',
    designation: 'Lead Full Stack Engineer',
    department: 'Engineering',
    panNumber: 'ABCDE1234F',
    bankAccount: 'Silicon Valley Bank •••• 9842',
    uanNumber: '100982736412',
    month: 'August 2026',
    payDate: '2026-08-31',
    workingDays: 22,
    daysWorked: 22,
    earnings: {
      basic: 6500,
      hra: 3250,
      conveyance: 600,
      specialAllowance: 1600,
      performanceBonus: 1200,
      grossTotal: 13150,
    },
    deductions: {
      providentFund: 780,
      professionalTax: 200,
      incomeTaxTDS: 1100,
      healthInsurance: 280,
      totalDeductions: 2360,
    },
    netPayable: 10790,
    netPayableWords: 'Ten Thousand Seven Hundred Ninety Dollars Only',
    paymentStatus: 'PROCESSED'
  },
  {
    id: 'slip-2026-08-001',
    slipNumber: 'PAY-DF-2026-08-001',
    employeeId: 'emp-1',
    employeeName: 'Marcus Vance',
    employeeCode: 'DF-001',
    designation: 'VP of Human Resources',
    department: 'Human Resources',
    panNumber: 'VANCE9876H',
    bankAccount: 'Chase Private Client •••• 4421',
    uanNumber: '100112233445',
    month: 'August 2026',
    payDate: '2026-08-31',
    workingDays: 22,
    daysWorked: 22,
    earnings: {
      basic: 7000,
      hra: 3500,
      conveyance: 800,
      specialAllowance: 1700,
      performanceBonus: 2000,
      grossTotal: 15000,
    },
    deductions: {
      providentFund: 840,
      professionalTax: 200,
      incomeTaxTDS: 1800,
      healthInsurance: 300,
      totalDeductions: 3140,
    },
    netPayable: 11860,
    netPayableWords: 'Eleven Thousand Eight Hundred Sixty Dollars Only',
    paymentStatus: 'PROCESSED'
  }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-22 09:30:14',
    actorName: 'Marcus Vance',
    actorRole: 'ADMIN',
    action: 'SALARY_REVISION_APPROVED',
    module: 'PAYROLL',
    description: 'Updated baseline compensation for Maya Lin (Design Lead) to $10,500/mo',
    diff: {
      field: 'grossSalary',
      oldValue: '$9,800',
      newValue: '$10,500'
    }
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-21 16:45:00',
    actorName: 'Sarah Jenkins',
    actorRole: 'HR_OFFICER',
    action: 'LEAVE_STATUS_CHANGED',
    module: 'LEAVE',
    description: 'Approved 2-day Sick Leave for Devon Miles (DevOps)',
    diff: {
      field: 'status',
      oldValue: 'PENDING',
      newValue: 'APPROVED'
    }
  },
  {
    id: 'aud-3',
    timestamp: '2026-08-21 10:15:32',
    actorName: 'Sarah Jenkins',
    actorRole: 'HR_OFFICER',
    action: 'ATTENDANCE_OVERRIDE',
    module: 'ATTENDANCE',
    description: 'Adjusted check-in time for Priya Sharma due to client site visit',
    diff: {
      field: 'checkIn',
      oldValue: '10:45 AM',
      newValue: '08:50 AM'
    }
  },
  {
    id: 'aud-4',
    timestamp: '2026-08-20 14:02:11',
    actorName: 'Marcus Vance',
    actorRole: 'ADMIN',
    action: 'EMPLOYEE_ROLE_PROMOTED',
    module: 'EMPLOYEE',
    description: 'Promoted Alex Rivera to Lead Full Stack Engineer',
    diff: {
      field: 'designation',
      oldValue: 'Senior Full Stack Engineer',
      newValue: 'Lead Full Stack Engineer'
    }
  }
];

export const mockOrgChart: OrgNode = {
  id: 'org-1',
  name: 'Elena Rostova',
  role: 'Chief Executive Officer',
  department: 'Executive Board',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  email: 'elena.rostova@dayflow.io',
  status: 'ONLINE',
  children: [
    {
      id: 'org-2',
      name: 'Marcus Vance',
      role: 'VP of Human Resources',
      department: 'Human Resources',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: 'marcus.vance@dayflow.io',
      status: 'ONLINE',
      children: [
        {
          id: 'org-3',
          name: 'Sarah Jenkins',
          role: 'Senior HR Generalist',
          department: 'Human Resources',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          email: 'sarah.jenkins@dayflow.io',
          status: 'ONLINE',
        },
        {
          id: 'org-4',
          name: 'Lucas Mendoza',
          role: 'Growth Marketing Lead',
          department: 'Marketing',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
          email: 'lucas.mendoza@dayflow.io',
          status: 'ONLINE',
        },
        {
          id: 'org-5',
          name: 'Amara Okafor',
          role: 'Senior Financial Analyst',
          department: 'Finance',
          avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
          email: 'amara.okafor@dayflow.io',
          status: 'ONLINE',
        }
      ]
    },
    {
      id: 'org-6',
      name: 'David Sterling',
      role: 'VP of Engineering',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      email: 'david.sterling@dayflow.io',
      status: 'ONLINE',
      children: [
        {
          id: 'org-7',
          name: 'Alex Rivera',
          role: 'Lead Full Stack Engineer',
          department: 'Engineering',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          email: 'alex.rivera@dayflow.io',
          status: 'ONLINE',
          children: [
            {
              id: 'org-8',
              name: 'Liam Nakamura',
              role: 'Frontend React Engineer',
              department: 'Engineering',
              avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
              email: 'liam.nakamura@dayflow.io',
              status: 'ONLINE',
            },
            {
              id: 'org-9',
              name: 'Jordan Kaye',
              role: 'Senior Backend Engineer',
              department: 'Engineering',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              email: 'jordan.kaye@dayflow.io',
              status: 'ONLINE',
            }
          ]
        },
        {
          id: 'org-10',
          name: 'Devon Miles',
          role: 'DevOps & Cloud Architect',
          department: 'Engineering',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          email: 'devon.miles@dayflow.io',
          status: 'ON_LEAVE',
        }
      ]
    },
    {
      id: 'org-11',
      name: 'Chloe Bennet',
      role: 'VP of Product & Design',
      department: 'Product',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: 'chloe.bennet@dayflow.io',
      status: 'ONLINE',
      children: [
        {
          id: 'org-12',
          name: 'Maya Lin',
          role: 'Principal UI/UX Designer',
          department: 'Design',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
          email: 'maya.lin@dayflow.io',
          status: 'ONLINE',
        },
        {
          id: 'org-13',
          name: 'Priya Sharma',
          role: 'Group Product Manager',
          department: 'Product',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          email: 'priya.sharma@dayflow.io',
          status: 'ONLINE',
        }
      ]
    }
  ]
};

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: '⚠️ Leave Collision Warning',
    message: 'Alex Rivera requested leave for Aug 24-26. Engineering capacity will drop below 60%.',
    timestamp: '10 mins ago',
    type: 'WARNING',
    read: false,
    linkTab: 'leaves'
  },
  {
    id: 'notif-2',
    title: '🎉 5-Day On-Time Streak Achieved!',
    message: 'Congratulations Alex! You have achieved a 5-day on-time attendance streak.',
    timestamp: '1 hour ago',
    type: 'SUCCESS',
    read: false,
    linkTab: 'attendance'
  },
  {
    id: 'notif-3',
    title: '💼 August 2026 Payroll Processed',
    message: 'Your payslip for August 2026 is ready for download with verified digital signature.',
    timestamp: '2 hours ago',
    type: 'INFO',
    read: true,
    linkTab: 'payroll'
  }
];

export const aiKnowledgeBase = [
  {
    keywords: ['sick leave', 'quota', 'balance', 'how many'],
    response: `**Alex, here is your current Leave Balance breakdown:**\n- **Sick Leave:** **7 Days Remaining** (out of 10 annual quota)\n- **Paid Annual Leave:** **14 Days Remaining** (out of 20 annual quota)\n- **Casual Leave:** **4 Days Remaining** (out of 6 annual quota)\n\n*Note:* Sick leave exceeding 2 consecutive days requires a registered medical certificate submission in the document vault.`
  },
  {
    keywords: ['policy', 'remote work', 'wfh', 'reimbursement'],
    response: `**Dayflow Remote & Hybrid Work Policy Summary:**\n- **Hybrid Cadence:** 3 days in-office (HQ Floor 5), up to 2 days Remote WFH per week.\n- **Home Office Stipend:** **$1,000 USD** one-time hardware allowance + **$75/month** high-speed Internet reimbursement.\n- **Core Working Hours:** 10:00 AM – 4:00 PM Pacific Time for team standups and sprint reviews.`
  },
  {
    keywords: ['draft', 'reason', 'medical', 'doctor', 'leave application'],
    response: `**Here is a drafted formal leave request for you:**\n\n> *"Dear HR Team and Engineering Lead,*\n> \n> *I am writing to formally request medical leave on [Date] to attend a scheduled specialist health consultation and follow-up medical procedure. I have coordinated my ongoing sprint pull requests with Jordan Kaye, and I will be reachable via Slack for critical blockers.*\n> \n> *Thank you for your understanding.*\n> *Best regards, Alex Rivera"*`
  },
  {
    keywords: ['burnout', 'overtime', 'anomaly', 'analysis', 'fatigue'],
    response: `**🤖 Dayflow AI Anomaly & Burnout Health Radar:**\n\n- **Engineering Department:** Average weekly hours: **43.8h**. *Warning:* Devon Miles and Liam Nakamura logged >48h last week during deployment.\n- **Punctuality Health:** Company-wide on-time rate is **92.4%** (Mint Green - Optimal).\n- **Recommendation:** Encourage a Friday "No-Meeting Focus Afternoon" to prevent pre-release fatigue.`
  }
];
