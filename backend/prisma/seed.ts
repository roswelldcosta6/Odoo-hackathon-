import {
  PrismaClient,
  Role,
  EmploymentStatus,
  PerformanceRating,
  AttendanceStatus,
  LeaveStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Dayflow HRMS Database...');

  // ─── Clean Existing Records (in reverse FK order) ────────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.employeeDocument.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.payrollStructure.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.leaveType.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  // ─── 1. Leave Types ───────────────────────────────────────────────────────
  console.log('Creating Leave Types...');
  const leaveTypes = await Promise.all([
    prisma.leaveType.create({ data: { name: 'Paid Leave',    code: 'PL', defaultDays: 15 } }),
    prisma.leaveType.create({ data: { name: 'Sick Leave',    code: 'SL', defaultDays: 10 } }),
    prisma.leaveType.create({ data: { name: 'Casual Leave',  code: 'CL', defaultDays: 7  } }),
    prisma.leaveType.create({ data: { name: 'Unpaid Leave',  code: 'UL', defaultDays: 0  } }),
  ]);

  // ─── 2. Departments ───────────────────────────────────────────────────────
  console.log('Creating Departments...');
  const deptEng = await prisma.department.create({
    data: { name: 'Core Engineering',   code: 'ENG', unitName: 'Engineering Unit',         budget: 850000 },
  });
  const deptDes = await prisma.department.create({
    data: { name: 'Product & Design',   code: 'DES', unitName: 'Design & Experience Unit', budget: 420000 },
  });
  const deptHr  = await prisma.department.create({
    data: { name: 'People & Culture',   code: 'HR',  unitName: 'Human Capital Unit',        budget: 280000 },
  });
  const deptMkt = await prisma.department.create({
    data: { name: 'Marketing & Growth', code: 'MKT', unitName: 'Growth & Strategy Unit',   budget: 390000 },
  });
  const deptFin = await prisma.department.create({
    data: { name: 'Finance & Ops',      code: 'FIN', unitName: 'Finance Operations Unit',  budget: 310000 },
  });

  // ─── 3. Users & Employees ─────────────────────────────────────────────────
  console.log('Creating Users & Employees...');

  const employeeData = [
    {
      email:        'admin@dayflow.com',
      role:         Role.ADMIN,
      code:         'EMP-1001',
      firstName:    'Alex',
      lastName:     'Morgan',
      designation:  'Head of People & Operations',
      departmentId: deptHr.id,
      basicSalary:  95000,
      rating:       PerformanceRating.EXCELLENT,
      avatar:       'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      email:        'hr@dayflow.com',
      role:         Role.HR_OFFICER,
      code:         'EMP-1002',
      firstName:    'Sarah',
      lastName:     'Jenkins',
      designation:  'Senior HR Business Partner',
      departmentId: deptHr.id,
      basicSalary:  72000,
      rating:       PerformanceRating.GOOD,
      avatar:       'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
    {
      email:        'david.chen@dayflow.com',
      role:         Role.EMPLOYEE,
      code:         'EMP-1003',
      firstName:    'David',
      lastName:     'Chen',
      designation:  'Lead Backend Architect',
      departmentId: deptEng.id,
      basicSalary:  110000,
      rating:       PerformanceRating.EXCELLENT,
      avatar:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      email:        'emily.watson@dayflow.com',
      role:         Role.EMPLOYEE,
      code:         'EMP-1004',
      firstName:    'Emily',
      lastName:     'Watson',
      designation:  'Senior UI/UX Engineer',
      departmentId: deptEng.id,
      basicSalary:  88000,
      rating:       PerformanceRating.GOOD,
      avatar:       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      email:        'marcus.vance@dayflow.com',
      role:         Role.EMPLOYEE,
      code:         'EMP-1005',
      firstName:    'Marcus',
      lastName:     'Vance',
      designation:  'Lead Product Designer',
      departmentId: deptDes.id,
      basicSalary:  82000,
      rating:       PerformanceRating.GOOD,
      avatar:       'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      email:        'clara.oswald@dayflow.com',
      role:         Role.EMPLOYEE,
      code:         'EMP-1006',
      firstName:    'Clara',
      lastName:     'Oswald',
      designation:  'Growth Marketing Lead',
      departmentId: deptMkt.id,
      basicSalary:  76000,
      rating:       PerformanceRating.AVERAGE,
      avatar:       'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
    {
      email:        'employee@dayflow.com',
      role:         Role.EMPLOYEE,
      code:         'EMP-1007',
      firstName:    'John',
      lastName:     'Doe',
      designation:  'Fullstack Software Engineer',
      departmentId: deptEng.id,
      basicSalary:  65000,
      rating:       PerformanceRating.GOOD,
      avatar:       'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    },
  ];

  const createdEmployees: any[] = [];

  for (const emp of employeeData) {
    const user = await prisma.user.create({
      data: {
        email:      emp.email,
        password:   defaultPasswordHash,
        role:       emp.role,
        isVerified: true,
      },
    });

    const employee = await prisma.employee.create({
      data: {
        userId:            user.id,
        employeeCode:      emp.code,
        firstName:         emp.firstName,
        lastName:          emp.lastName,
        phone:             `+1 (555) 019-${Math.floor(1000 + Math.random() * 9000)}`,
        personalEmail:     emp.email,
        address:           '100 Innovation Way, Suite 400, San Francisco, CA',
        designation:       emp.designation,
        departmentId:      emp.departmentId,
        joiningDate:       new Date('2024-01-15'),
        status:            EmploymentStatus.ACTIVE,
        performanceRating: emp.rating,
        avatarUrl:         emp.avatar,
      },
    });

    createdEmployees.push(employee);

    // Initialise Leave Balances
    for (const lt of leaveTypes) {
      const used = lt.code === 'PL' ? 2 : 0;
      await prisma.leaveBalance.create({
        data: {
          employeeId:     employee.id,
          leaveTypeId:    lt.id,
          totalAllocated: lt.defaultDays,
          used,
          remaining:      lt.defaultDays - used,
        },
      });
    }

    // Initialise Payroll Structure
    const basic      = emp.basicSalary;
    const hra        = basic * 0.4;
    const special    = basic * 0.2;
    const pf         = basic * 0.12;
    const pt         = 200;
    const med        = 1000;
    const gross      = basic + hra + special;
    const deductions = pf + pt + med;
    const net        = gross - deductions;

    await prisma.payrollStructure.create({
      data: {
        employeeId:      employee.id,
        basicSalary:     basic,
        hraAllowance:    hra,
        specialAllowance: special,
        providentFund:   pf,
        professionalTax: pt,
        medicalInsurance: med,
        grossSalary:     gross,
        totalDeductions: deductions,
        netSalary:       net,
      },
    });
  }

  // ─── 4. Attendance Records (past 7 weekdays + today) ──────────────────────
  console.log('Seeding Attendance Records...');
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayOfWeek  = targetDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

    for (const emp of createdEmployees) {
      const isLate       = Math.random() < 0.2;
      const checkInHour  = isLate ? 9 : 8;
      const checkInMin   = isLate ? 45 : 55;

      const checkIn = new Date(targetDate);
      checkIn.setHours(checkInHour, checkInMin, 0);

      const checkOut = new Date(targetDate);
      checkOut.setHours(17, 30, 0);

      const durationMs = checkOut.getTime() - checkIn.getTime();
      const totalHours = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          workDate:   new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
          checkIn,
          checkOut,
          totalHours,
          status:     AttendanceStatus.PRESENT,
          isLate,
          remarks:    isLate ? 'Late arrival' : 'Standard shift',
        },
      });
    }
  }

  // ─── 5. Sample Leave Request ──────────────────────────────────────────────
  console.log('Seeding Sample Leave Requests...');
  const leaveStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5);
  const leaveEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

  await prisma.leaveRequest.create({
    data: {
      employeeId:  createdEmployees[3].id, // Emily Watson
      leaveTypeId: leaveTypes[0].id,       // Paid Leave
      startDate:   leaveStart,
      endDate:     leaveEnd,
      totalDays:   3,
      reason:      'Family vacation and personal travel',
      status:      LeaveStatus.PENDING,
    },
  });

  // ─── Done ──────────────────────────────────────────────────────────────────
  console.log('✅ Seeding completed successfully!');
  console.log('---------------------------------------------------------');
  console.log('🔑 Test Accounts Ready:');
  console.log('👤 Admin:    admin@dayflow.com    / Password: Password@123');
  console.log('👤 HR:       hr@dayflow.com       / Password: Password@123');
  console.log('👤 Employee: employee@dayflow.com / Password: Password@123');
  console.log('---------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
