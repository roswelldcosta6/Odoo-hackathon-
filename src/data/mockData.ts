import { Employee, AttendanceRecord, LeaveRequest, Payslip, AuditLogItem, OrgNode, AppNotification, User } from '../types';

// Helper: generate employee Login ID strictly matching the format
// [Company Code (e.g. OI/DF)] + [First 2 letters of first name + First 2 letters of last name] + [Year of joining] + [Serial number 4 digits]
// Example: OIJODO20220001 / DFJODO20260001
export const generateEmployeeLoginId = (
  firstName: string,
  lastName: string,
  joiningDate: string,
  serial: number,
  companyCode: string = 'DF'
): string => {
  const cc = (companyCode || 'DF').toUpperCase().slice(0, 2).padEnd(2, 'X');
  const f2 = (firstName || 'EM').toUpperCase().slice(0, 2).padEnd(2, 'X');
  const l2 = (lastName || 'PL').toUpperCase().slice(0, 2).padEnd(2, 'X');
  const yr = (joiningDate ? new Date(joiningDate).getFullYear() : new Date().getFullYear()).toString();
  const seq = serial.toString().padStart(4, '0');
  return `${cc}${f2}${l2}${yr}${seq}`;
};

// Indian Payroll Calculator in Rupees (₹)
export const calcIndianPayroll = (basicSalary: number) => {
  const basic = basicSalary;
  const hra = Math.round(basic * 0.40); // 40% of basic
  const conveyance = 1600;
  const medicalAllowance = 1250;
  const specialAllowance = Math.round(basic * 0.20);
  const grossSalary = basic + hra + conveyance + medicalAllowance + specialAllowance;

  // Indian Deductions
  const employeePF = Math.min(Math.round(basic * 0.12), 1800); // 12% of basic (statutory cap)
  const employerPF = Math.min(Math.round(basic * 0.12), 1800);
  const professionalTax = grossSalary > 10000 ? 200 : 0; // Standard Indian PT: ₹200/mo
  const esi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0; // 0.75% of Gross if <= ₹21,000
  const incomeTaxTDS = Math.round(basic * 0.05); // Standard TDS slab estimate
  const medicalInsurance = 500;

  const totalDeductions = employeePF + professionalTax + esi + incomeTaxTDS + medicalInsurance;
  const netSalary = grossSalary - totalDeductions;
  const ctc = (grossSalary + employerPF) * 12;

  return {
    basic,
    hra,
    conveyanceAllowance: conveyance,
    medicalAllowance,
    specialAllowance,
    providentFund: employeePF,
    employerPF,
    professionalTax,
    esi,
    incomeTaxTDS,
    medicalInsurance,
    grossSalary,
    netSalary,
    ctc
  };
};

export const mockUsers: Record<string, User> = {
  ADMIN: {
    id: 'usr-admin-1',
    email: 'admin@dayflow.com',
    role: 'ADMIN',
    employeeId: 'emp-1',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    designation: 'VP of Human Resources',
    loginId: 'DFMAVA20210001',
  },
  HR_OFFICER: {
    id: 'usr-hr-1',
    email: 'hr@dayflow.com',
    role: 'HR_OFFICER',
    employeeId: 'emp-2',
    name: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Senior HR Generalist',
    loginId: 'DFSAJE20220001',
  },
  EMPLOYEE: {
    id: 'usr-emp-3',
    email: 'employee@dayflow.com',
    role: 'EMPLOYEE',
    employeeId: 'emp-3',
    name: 'John Doe',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    designation: 'Lead Full Stack Engineer',
    loginId: 'DFJODO20230001',
  }
};

const emp1Salary = calcIndianPayroll(95000);
const emp2Salary = calcIndianPayroll(72000);
const emp3Salary = calcIndianPayroll(85000);
const emp4Salary = calcIndianPayroll(78000);
const emp5Salary = calcIndianPayroll(82000);
const emp6Salary = calcIndianPayroll(88000);
const emp7Salary = calcIndianPayroll(98000);
const emp8Salary = calcIndianPayroll(65000);
const emp9Salary = calcIndianPayroll(74000);
const emp10Salary = calcIndianPayroll(52000);

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    employeeCode: 'DF-001',
    loginId: 'DFMAVA20210001',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@dayflow.com',
    personalEmail: 'marcus.vance.private@gmail.com',
    phone: '9876543210',
    whatsapp: '9876543210',
    address: '742, Evergreen Terrace, Andheri West, Mumbai - 400053',
    currentAddress: '742, Evergreen Terrace, Andheri West, Mumbai - 400053',
    permanentAddress: '12, Green Park Colony, Patna, Bihar - 800001',
    designation: 'VP of Human Resources',
    department: 'Human Resources',
    joiningDate: '2021-03-15',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Elena Rostova (CEO)',
    location: 'Mumbai HQ (Floor 4)',
    attendanceRate: 99.2,
    performanceRating: 'EXCELLENT',
    dateOfBirth: '1985-06-14',
    gender: 'Male',
    bloodGroup: 'O+',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 3456',
    pan: 'ABCMV1234F',
    emergencyContactName: 'Shalini Vance',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '9887654321',
    bankName: 'HDFC Bank',
    bankAccountNo: '50200012345678',
    ifscCode: 'HDFC0001234',
    uanNumber: '100987654321',
    contractRenewalDate: '2027-03-31',
    salary: emp1Salary,
    documents: [
      { id: 'doc-1', name: 'Executive_Employment_Agreement.pdf', type: 'PDF', uploadDate: '2021-03-15', size: '2.4 MB', status: 'VERIFIED' },
      { id: 'doc-2', name: 'PAN_Card_Verified.pdf', type: 'PDF', uploadDate: '2021-03-15', size: '512 KB', status: 'VERIFIED' },
      { id: 'doc-2b', name: 'Aadhaar_Card.pdf', type: 'PDF', uploadDate: '2021-03-15', size: '480 KB', status: 'VERIFIED' },
    ]
  },
  {
    id: 'emp-2',
    employeeCode: 'DF-002',
    loginId: 'DFSAJE20220001',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.jenkins@dayflow.com',
    personalEmail: 's.jenkins88@outlook.com',
    phone: '9823456781',
    whatsapp: '9823456781',
    address: '88, Marine Lines, Fort Area, Mumbai - 400001',
    currentAddress: '88, Marine Lines, Fort Area, Mumbai - 400001',
    permanentAddress: '22, Civil Lines, Lucknow, UP - 226001',
    designation: 'Senior HR Generalist',
    department: 'Human Resources',
    joiningDate: '2022-06-01',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'Mumbai HQ (Floor 4)',
    attendanceRate: 97.5,
    performanceRating: 'GOOD',
    dateOfBirth: '1990-02-22',
    gender: 'Female',
    bloodGroup: 'A+',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 7891',
    pan: 'BCDSE5678G',
    emergencyContactName: 'Rajan Jenkins',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '9712345678',
    bankName: 'ICICI Bank',
    bankAccountNo: '012301234567',
    ifscCode: 'ICIC0001023',
    uanNumber: '100876543219',
    contractRenewalDate: '2026-12-31',
    salary: emp2Salary,
    documents: [
      { id: 'doc-3', name: 'Offer_Letter_Signed.pdf', type: 'PDF', uploadDate: '2022-05-20', size: '1.8 MB', status: 'VERIFIED' },
      { id: 'doc-3b', name: 'Degree_Certificate.pdf', type: 'PDF', uploadDate: '2022-05-20', size: '1.2 MB', status: 'VERIFIED' },
    ]
  },
  {
    id: 'emp-3',
    employeeCode: 'DF-042',
    loginId: 'DFJODO20230001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@dayflow.com',
    personalEmail: 'john.doe.dev@gmail.com',
    phone: '9765432109',
    whatsapp: '9765432109',
    address: '520, Koramangala 4th Block, Bengaluru - 560034',
    currentAddress: '520, Koramangala 4th Block, Bengaluru - 560034',
    permanentAddress: '45, Shastri Nagar, Jaipur, Rajasthan - 302016',
    designation: 'Lead Full Stack Engineer',
    department: 'Engineering',
    joiningDate: '2023-01-10',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'Bengaluru Office / Hybrid',
    attendanceRate: 98.6,
    performanceRating: 'EXCELLENT',
    dateOfBirth: '1993-08-14',
    gender: 'Male',
    bloodGroup: 'B+',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 5678',
    pan: 'CDJOD9012H',
    emergencyContactName: 'Meera Doe',
    emergencyContactRelation: 'Mother',
    emergencyContactPhone: '9654321098',
    bankName: 'State Bank of India',
    bankAccountNo: '34567890123456',
    ifscCode: 'SBIN0012345',
    uanNumber: '100765432198',
    contractRenewalDate: '2027-01-10',
    salary: emp3Salary,
    documents: [
      { id: 'doc-4', name: 'Employment_Contract_2023.pdf', type: 'PDF', uploadDate: '2023-01-05', size: '3.1 MB', status: 'VERIFIED' },
      { id: 'doc-5', name: 'NDA_Agreement.pdf', type: 'PDF', uploadDate: '2023-01-05', size: '1.2 MB', status: 'VERIFIED' },
      { id: 'doc-6', name: 'PAN_Card.pdf', type: 'PDF', uploadDate: '2023-01-06', size: '890 KB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-4',
    employeeCode: 'DF-043',
    loginId: 'DFMALI20230002',
    firstName: 'Maya',
    lastName: 'Lin',
    email: 'maya.lin@dayflow.com',
    personalEmail: 'maya.lin.design@gmail.com',
    phone: '9654321098',
    whatsapp: '9654321098',
    address: '1200, Indiranagar 100ft Road, Bengaluru - 560038',
    currentAddress: '1200, Indiranagar 100ft Road, Bengaluru - 560038',
    permanentAddress: '34, Anna Nagar East, Chennai - 600102',
    designation: 'Principal UI/UX Designer',
    department: 'Design',
    joiningDate: '2023-04-12',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'Bengaluru Office (Floor 3)',
    attendanceRate: 96.8,
    performanceRating: 'GOOD',
    dateOfBirth: '1994-11-03',
    gender: 'Female',
    bloodGroup: 'AB+',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 2109',
    pan: 'DEFML3456I',
    emergencyContactName: 'Lin Wei',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '9543210987',
    bankName: 'Axis Bank',
    bankAccountNo: '919010234567890',
    ifscCode: 'UTIB0001234',
    uanNumber: '100654321987',
    contractRenewalDate: '2027-04-12',
    salary: emp4Salary,
    documents: [
      { id: 'doc-7', name: 'Design_Lead_Contract.pdf', type: 'PDF', uploadDate: '2023-04-10', size: '2.1 MB', status: 'VERIFIED' },
      { id: 'doc-7b', name: 'Portfolio_Agreement.pdf', type: 'PDF', uploadDate: '2023-04-10', size: '1.5 MB', status: 'PENDING' },
    ]
  },
  {
    id: 'emp-5',
    employeeCode: 'DF-044',
    loginId: 'DFJOKA20230003',
    firstName: 'Jordan',
    lastName: 'Kaye',
    email: 'jordan.kaye@dayflow.com',
    personalEmail: 'jordan.k@gmail.com',
    phone: '9543210987',
    address: '350, HSR Layout Sector 6, Bengaluru - 560102',
    currentAddress: '350, HSR Layout Sector 6, Bengaluru - 560102',
    permanentAddress: '78, Salt Lake City Sector 5, Kolkata - 700091',
    designation: 'Senior Backend Engineer',
    department: 'Engineering',
    joiningDate: '2023-08-01',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'John Doe',
    location: 'Remote (Kolkata)',
    attendanceRate: 94.2,
    performanceRating: 'GOOD',
    dateOfBirth: '1991-05-19',
    gender: 'Male',
    bloodGroup: 'O-',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 3456',
    pan: 'EFGJK7890J',
    emergencyContactName: 'Lisa Kaye',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '9432109876',
    bankName: 'Kotak Mahindra Bank',
    bankAccountNo: '123456789012',
    ifscCode: 'KKBK0001234',
    uanNumber: '100543210976',
    contractRenewalDate: '2027-08-01',
    salary: emp5Salary,
    documents: [
      { id: 'doc-8', name: 'Remote_Worker_Agreement.pdf', type: 'PDF', uploadDate: '2023-07-28', size: '1.4 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-6',
    employeeCode: 'DF-045',
    loginId: 'DFDEMI20220001',
    firstName: 'Devon',
    lastName: 'Miles',
    email: 'devon.miles@dayflow.com',
    personalEmail: 'devon.miles@gmail.com',
    phone: '9432109876',
    address: '100, Baner Road, Pune - 411045',
    currentAddress: '100, Baner Road, Pune - 411045',
    permanentAddress: '56, Civil Lines, Allahabad, UP - 211001',
    designation: 'DevOps & Cloud Architect',
    department: 'Engineering',
    joiningDate: '2022-11-15',
    employmentStatus: 'ON_LEAVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'John Doe',
    location: 'Pune Office (Floor 5)',
    attendanceRate: 92.0,
    performanceRating: 'AVERAGE',
    dateOfBirth: '1988-09-23',
    gender: 'Male',
    bloodGroup: 'A-',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 6543',
    pan: 'GHIDM2345K',
    emergencyContactName: 'Patel Dev',
    emergencyContactRelation: 'Brother',
    emergencyContactPhone: '9321098765',
    bankName: 'Punjab National Bank',
    bankAccountNo: '4567890123456789',
    ifscCode: 'PUNB0012345',
    uanNumber: '100432109865',
    contractRenewalDate: '2026-11-15',
    salary: emp6Salary,
    documents: [
      { id: 'doc-9', name: 'DevOps_Contract.pdf', type: 'PDF', uploadDate: '2022-11-10', size: '2.0 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-7',
    employeeCode: 'DF-078',
    loginId: 'DFPRSH20220002',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@dayflow.com',
    personalEmail: 'priya.s.product@gmail.com',
    phone: '9321098765',
    address: '225, Bandra West, Mumbai - 400050',
    currentAddress: '225, Bandra West, Mumbai - 400050',
    permanentAddress: '89, Rajpur Road, Dehradun - 248001',
    designation: 'Group Product Manager',
    department: 'Product',
    joiningDate: '2022-03-01',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'Mumbai HQ (Floor 3)',
    attendanceRate: 99.0,
    performanceRating: 'EXCELLENT',
    dateOfBirth: '1989-12-07',
    gender: 'Female',
    bloodGroup: 'B-',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 8901',
    pan: 'HIJPS6789L',
    emergencyContactName: 'Rajesh Sharma',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '9210987654',
    bankName: 'HDFC Bank',
    bankAccountNo: '50100023456789',
    ifscCode: 'HDFC0002345',
    uanNumber: '100321098754',
    contractRenewalDate: '2027-03-01',
    salary: emp7Salary,
    documents: [
      { id: 'doc-10', name: 'Product_Lead_Agreement.pdf', type: 'PDF', uploadDate: '2022-02-25', size: '2.8 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-8',
    employeeCode: 'DF-089',
    loginId: 'DFLUME20240001',
    firstName: 'Lucas',
    lastName: 'Mendoza',
    email: 'lucas.mendoza@dayflow.com',
    personalEmail: 'lucas.m@gmail.com',
    phone: '9210987654',
    address: '450, Karol Bagh, New Delhi - 110005',
    currentAddress: '450, Karol Bagh, New Delhi - 110005',
    permanentAddress: '23, Model Town, Ludhiana, Punjab - 141001',
    designation: 'Growth Marketing Lead',
    department: 'Marketing',
    joiningDate: '2024-01-15',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'Delhi Office (Floor 2)',
    attendanceRate: 91.5,
    performanceRating: 'AVERAGE',
    dateOfBirth: '1996-04-18',
    gender: 'Male',
    bloodGroup: 'AB-',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 4321',
    pan: 'IJKLM0123M',
    emergencyContactName: 'Anita Mendoza',
    emergencyContactRelation: 'Mother',
    emergencyContactPhone: '9109876543',
    bankName: 'Bank of Baroda',
    bankAccountNo: '05670100012345',
    ifscCode: 'BARB0KAROLB',
    uanNumber: '100210987643',
    contractRenewalDate: '2027-01-15',
    salary: emp8Salary,
    documents: [
      { id: 'doc-11', name: 'Marketing_Lead_Contract.pdf', type: 'PDF', uploadDate: '2024-01-10', size: '1.9 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-9',
    employeeCode: 'DF-092',
    loginId: 'DFAMOK20230004',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@dayflow.com',
    personalEmail: 'amara.o@outlook.com',
    phone: '9109876543',
    address: '600, Nungambakkam, Chennai - 600034',
    currentAddress: '600, Nungambakkam, Chennai - 600034',
    permanentAddress: '11, Richmond Town, Bengaluru - 560025',
    designation: 'Senior Financial Analyst',
    department: 'Finance',
    joiningDate: '2023-09-01',
    employmentStatus: 'ACTIVE',
    employmentType: 'Full-Time',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'Marcus Vance',
    location: 'Chennai Office (Floor 4)',
    attendanceRate: 99.5,
    performanceRating: 'EXCELLENT',
    dateOfBirth: '1990-07-25',
    gender: 'Female',
    bloodGroup: 'O+',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 9012',
    pan: 'JKLAO4567N',
    emergencyContactName: 'Chike Okafor',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '9009876543',
    bankName: 'ICICI Bank',
    bankAccountNo: '012301234568',
    ifscCode: 'ICIC0001024',
    uanNumber: '100109876532',
    contractRenewalDate: '2027-09-01',
    salary: emp9Salary,
    documents: [
      { id: 'doc-12', name: 'Finance_Offer_Letter.pdf', type: 'PDF', uploadDate: '2023-08-25', size: '1.7 MB', status: 'VERIFIED' }
    ]
  },
  {
    id: 'emp-10',
    employeeCode: 'DF-105',
    loginId: 'DFLINA20240002',
    firstName: 'Liam',
    lastName: 'Nakamura',
    email: 'liam.nakamura@dayflow.com',
    personalEmail: 'liam.n@gmail.com',
    phone: '9009876543',
    address: '150, Whitefield, Bengaluru - 560066',
    currentAddress: '150, Whitefield, Bengaluru - 560066',
    permanentAddress: '67, Connaught Place, New Delhi - 110001',
    designation: 'Frontend React Engineer',
    department: 'Engineering',
    joiningDate: '2024-05-01',
    probationEndDate: '2024-11-01',
    employmentStatus: 'PROBATION',
    employmentType: 'Probation',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    reportingManager: 'John Doe',
    location: 'Bengaluru Office (Floor 5)',
    attendanceRate: 88.0,
    performanceRating: 'ATTENTION',
    dateOfBirth: '1998-02-11',
    gender: 'Male',
    bloodGroup: 'B+',
    nationality: 'Indian',
    aadhaar: 'XXXX XXXX 1234',
    pan: 'KLMNA8901O',
    emergencyContactName: 'Hiroshi Nakamura',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '9998765432',
    bankName: 'Yes Bank',
    bankAccountNo: '023456789012345',
    ifscCode: 'YESB0000123',
    uanNumber: '100009876521',
    contractRenewalDate: '2026-11-01',
    salary: emp10Salary,
    documents: [
      { id: 'doc-13', name: 'Probation_Contract.pdf', type: 'PDF', uploadDate: '2024-04-28', size: '1.5 MB', status: 'PENDING' }
    ]
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-3',
    employeeName: 'John Doe',
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
    checkIn: '09:05 AM',
    totalHours: 6.9,
    status: 'PRESENT',
    isLate: false,
    networkType: 'OFFICE_WIFI',
    ipAddress: '192.168.1.34 (HQ-Floor-4)'
  },
  {
    id: 'att-4',
    employeeId: 'emp-4',
    employeeName: 'Maya Lin',
    employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Design',
    designation: 'Principal UI/UX Designer',
    date: '2026-08-22',
    checkIn: '09:45 AM',
    totalHours: 5.5,
    status: 'PRESENT',
    isLate: true,
    networkType: 'OFFICE_WIFI',
    ipAddress: '192.168.1.56 (Floor-3)',
    remarks: 'Late check-in flagged'
  },
  {
    id: 'att-5',
    employeeId: 'emp-5',
    employeeName: 'Jordan Kaye',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Senior Backend Engineer',
    date: '2026-08-22',
    checkIn: '10:15 AM',
    checkOut: '06:15 PM',
    totalHours: 8.0,
    status: 'PRESENT',
    isLate: true,
    networkType: 'REMOTE_IP',
    ipAddress: '103.56.77.14 (Remote WFH - Kolkata)',
    remarks: 'Remote working day'
  },
  {
    id: 'att-6',
    employeeId: 'emp-6',
    employeeName: 'Devon Miles',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'DevOps & Cloud Architect',
    date: '2026-08-22',
    checkIn: '',
    totalHours: 0,
    status: 'ON_LEAVE',
    isLate: false,
    networkType: 'OFFICE_WIFI',
    ipAddress: 'N/A (On Leave)',
    remarks: 'Approved casual leave'
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    employeeName: 'John Doe',
    employeeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Lead Full Stack Engineer',
    leaveType: 'PAID_ANNUAL',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    totalDays: 3,
    reason: 'Annual family vacation to Goa',
    status: 'PENDING',
    appliedDate: '2026-08-20',
    hasCollisionWarning: false,
  },
  {
    id: 'leave-2',
    employeeId: 'emp-6',
    employeeName: 'Devon Miles',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'DevOps & Cloud Architect',
    leaveType: 'CASUAL_LEAVE',
    startDate: '2026-08-22',
    endDate: '2026-08-22',
    totalDays: 1,
    reason: 'Medical checkup and personal errand',
    status: 'APPROVED',
    appliedDate: '2026-08-19',
    reviewedBy: 'Marcus Vance (ADMIN)',
    reviewerComment: 'Approved. Please ensure handover.',
    reviewedAt: '2026-08-20 11:30:00',
    hasCollisionWarning: false,
  },
  {
    id: 'leave-3',
    employeeId: 'emp-4',
    employeeName: 'Maya Lin',
    employeeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Design',
    designation: 'Principal UI/UX Designer',
    leaveType: 'SICK_LEAVE',
    startDate: '2026-08-15',
    endDate: '2026-08-16',
    totalDays: 2,
    reason: 'Fever and viral infection — doctor prescribed rest',
    status: 'APPROVED',
    appliedDate: '2026-08-14',
    reviewedBy: 'Sarah Jenkins (HR_OFFICER)',
    reviewerComment: 'Approved. Get well soon!',
    reviewedAt: '2026-08-15 09:00:00',
    hasCollisionWarning: false,
  },
  {
    id: 'leave-4',
    employeeId: 'emp-8',
    employeeName: 'Lucas Mendoza',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    designation: 'Growth Marketing Lead',
    leaveType: 'UNPAID_LOP',
    startDate: '2026-08-25',
    endDate: '2026-08-28',
    totalDays: 4,
    reason: 'Personal emergency — family commitment',
    status: 'PENDING',
    appliedDate: '2026-08-21',
    hasCollisionWarning: true,
    collisionDetails: '⚠️ No other marketing coverage during this period.',
  }
];

export const initialPayslips: Payslip[] = initialEmployees.map((emp, idx) => {
  const s = emp.salary;
  const pf = s.providentFund;
  const pt = s.professionalTax;
  const esi = s.esi || 0;
  const tds = s.incomeTaxTDS || Math.round(s.basic * 0.05);
  const ins = s.medicalInsurance;
  const totalDed = pf + pt + esi + tds + ins;
  const net = s.grossSalary - totalDed;

  return {
    id: `slip-aug-2026-${emp.employeeCode}`,
    slipNumber: `PAY-${emp.employeeCode}-AUG-2026`,
    employeeId: emp.id,
    employeeName: `${emp.firstName} ${emp.lastName}`,
    employeeCode: emp.employeeCode,
    loginId: emp.loginId,
    designation: emp.designation,
    department: emp.department,
    panNumber: emp.pan || 'ABCDE1234F',
    bankAccount: emp.bankName ? `${emp.bankName} •••• ${(emp.bankAccountNo || '0000').slice(-4)}` : 'HDFC Bank •••• 5678',
    ifscCode: emp.ifscCode || 'HDFC0001234',
    uanNumber: emp.uanNumber || '100123456789',
    month: 'August 2026',
    payDate: 'August 31, 2026',
    workingDays: 26,
    daysWorked: 26,
    earnings: {
      basic: s.basic,
      hra: s.hra,
      conveyance: s.conveyanceAllowance || 1600,
      specialAllowance: s.specialAllowance,
      medicalAllowance: s.medicalAllowance || 1250,
      performanceBonus: Math.round(s.basic * 0.05),
      grossTotal: s.grossSalary
    },
    deductions: {
      employeePF: pf,
      employerPF: s.employerPF || pf,
      professionalTax: pt,
      incomeTaxTDS: tds,
      esi: esi,
      healthInsurance: ins,
      totalDeductions: totalDed
    },
    netPayable: net,
    netPayableWords: `₹${net.toLocaleString('en-IN')} (Indian National Rupees)`,
    ctcAnnual: s.ctc || (s.grossSalary * 12),
    paymentStatus: idx < 8 ? 'PAID' : 'PENDING'
  };
});

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'aud-001',
    timestamp: '2026-08-22 09:14:22',
    actorName: 'Marcus Vance',
    actorRole: 'ADMIN',
    action: 'PUNCH_IN',
    module: 'ATTENDANCE',
    description: 'John Doe punched IN at 09:14 AM via Office Wi-Fi (HQ-Floor-5).'
  },
  {
    id: 'aud-002',
    timestamp: '2026-08-21 17:32:10',
    actorName: 'Sarah Jenkins',
    actorRole: 'HR_OFFICER',
    action: 'LEAVE_APPROVED',
    module: 'LEAVE',
    description: 'Approved Maya Lin sick leave request for 2 days (Aug 15-16).',
    diff: { field: 'status', oldValue: 'PENDING', newValue: 'APPROVED' }
  },
  {
    id: 'aud-003',
    timestamp: '2026-08-20 15:45:00',
    actorName: 'Marcus Vance',
    actorRole: 'ADMIN',
    action: 'PAYROLL_BATCH_EXECUTED',
    module: 'PAYROLL',
    description: 'Executed salary disbursement batch for 10 employees — August 2026. Total outflow: ₹8,52,400.'
  },
  {
    id: 'aud-004',
    timestamp: '2026-08-19 11:20:00',
    actorName: 'Sarah Jenkins',
    actorRole: 'HR_OFFICER',
    action: 'EMPLOYEE_PROVISIONED',
    module: 'EMPLOYEE',
    description: 'Provisioned new staff profile for Liam Nakamura (Engineering). Login ID: DFLINA20240002'
  },
  {
    id: 'aud-005',
    timestamp: '2026-08-18 10:05:00',
    actorName: 'Marcus Vance',
    actorRole: 'ADMIN',
    action: 'ATTENDANCE_OVERRIDE',
    module: 'ATTENDANCE',
    description: 'Adjusted check-in time for Jordan Kaye — approved WFH exception.',
    diff: { field: 'checkIn', oldValue: '10:15 AM', newValue: '09:30 AM' }
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: '📋 Leave Request Pending',
    message: 'John Doe applied for 3-day Paid Leave (Sep 10-12). Review required.',
    timestamp: '2 hours ago',
    type: 'INFO',
    read: false,
    linkTab: 'leaves'
  },
  {
    id: 'notif-2',
    title: '⚠️ Attendance Collision Detected',
    message: 'Lucas Mendoza leave overlaps with no backup in Marketing dept (Aug 25-28).',
    timestamp: '1 day ago',
    type: 'WARNING',
    read: false,
    linkTab: 'leaves'
  },
  {
    id: 'notif-3',
    title: '💰 Payroll August 2026 Processed',
    message: 'Salary disbursed to 10 employees. Total: ₹8,52,400. ESI & PF filed.',
    timestamp: '2 days ago',
    type: 'SUCCESS',
    read: false,
    linkTab: 'payroll'
  },
  {
    id: 'notif-4',
    title: '🔔 Probation Review Due',
    message: 'Liam Nakamura probation period ends Nov 1, 2026. Schedule review.',
    timestamp: '3 days ago',
    type: 'ALERT',
    read: true,
    linkTab: 'employees'
  }
];
export const mockOrgChart: OrgNode = {
  id: 'org-1',
  name: 'Marcus Vance',
  role: 'VP of Human Resources',
  department: 'Executive Leadership',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  email: 'marcus.vance@dayflow.com',
  status: 'ONLINE',
  children: [
    {
      id: 'org-2',
      name: 'Sarah Jenkins',
      role: 'Senior HR Generalist',
      department: 'Human Resources',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      email: 'sarah.jenkins@dayflow.com',
      status: 'ONLINE',
      children: [
        {
          id: 'org-5',
          name: 'Elena Rostova',
          role: 'HR Operations Lead',
          department: 'Human Resources',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
          email: 'elena.rostova@dayflow.com',
          status: 'ONLINE'
        }
      ]
    },
    {
      id: 'org-3',
      name: 'John Doe',
      role: 'Lead Full Stack Engineer',
      department: 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      email: 'john.doe@dayflow.com',
      status: 'ONLINE',
      children: [
        {
          id: 'org-4',
          name: 'Priya Sharma',
          role: 'Senior Frontend Architect',
          department: 'Engineering',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
          email: 'priya.sharma@dayflow.com',
          status: 'ONLINE'
        },
        {
          id: 'org-6',
          name: 'Liam Nakamura',
          role: 'DevOps & Cloud Engineer',
          department: 'Engineering',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          email: 'liam.nakamura@dayflow.com',
          status: 'ONLINE'
        }
      ]
    }
  ]
};

export const aiKnowledgeBase: { keywords: string[]; response: string }[] = [
  {
    keywords: ['sick leave', 'sick leaves', 'medical', 'fever', 'ill'],
    response: '**Dayflow Sick Leave Policy:**\nFull-time employees receive 12 Paid Sick Leaves per calendar year. No medical certificate is required for leaves up to 2 consecutive days. Beyond 2 days, a certified doctor note is required upon return.'
  },
  {
    keywords: ['annual leave', 'paid leave', 'vacation', 'holiday'],
    response: '**Annual Paid Leave Policy:**\nEmployees accrue 1.75 days per month (21 days annually). Leaves must be applied at least 3 business days in advance via the **Leaves** tab.'
  },
  {
    keywords: ['remote', 'wfh', 'work from home', 'stipend', 'allowance'],
    response: '**Remote Work & Internet Reimbursement:**\nEmployees can work remotely up to 2 days a week with team lead approval. A monthly WFH internet subsidy of â‚¹1,500 is disbursed automatically in payroll.'
  },
  {
    keywords: ['provident fund', 'epf', 'pf', 'pension', 'uan'],
    response: '**Employee Provident Fund (EPF):**\n12% of Basic salary is contributed by employee and matched by Dayflow (up to statutory limit â‚¹1,800/month). Your 12-digit UAN number is available under your **Employee Profile -> Salary & Banking** tab.'
  },
  {
    keywords: ['burnout', 'overtime', 'anomaly', 'fatigue'],
    response: '**AI Workload Health Check:**\nSystem analysis indicates team attendance rate is **96.2%**. No active burnout anomalies detected across Engineering and Product units this week.'
  }
];
