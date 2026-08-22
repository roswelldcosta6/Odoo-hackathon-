import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  User,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  Payslip,
  AuditLogItem,
  AppNotification
} from '../types';
import {
  mockUsers,
  initialEmployees,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialPayslips,
  initialAuditLogs,
  initialNotifications
} from '../data/mockData';

interface HRMSContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Employees
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  isEmployeeModalOpen: boolean;
  setIsEmployeeModalOpen: (open: boolean) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  
  // Attendance & Punch Clock
  attendanceRecords: AttendanceRecord[];
  isClockedIn: boolean;
  isBreakActive: boolean;
  punchInTime: string;
  secondsWorkedToday: number;
  punchNetworkType: 'OFFICE_WIFI' | 'REMOTE_IP';
  setPunchNetworkType: (type: 'OFFICE_WIFI' | 'REMOTE_IP') => void;
  streakDays: number;
  togglePunchClock: () => void;
  toggleBreak: () => void;
  overrideAttendance: (recordId: string, newCheckIn: string, reason: string) => void;

  // Leave Management
  leaveRequests: LeaveRequest[];
  userLeaveBalance: LeaveBalance;
  applyLeave: (leave: {
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: number;
  }) => { success: boolean; hasCollision: boolean; collisionMessage?: string };
  reviewLeaveRequest: (id: string, status: 'APPROVED' | 'REJECTED', comment: string) => void;

  // Payroll
  payslips: Payslip[];
  selectedPayslip: Payslip | null;
  setSelectedPayslip: (slip: Payslip | null) => void;
  isPayslipModalOpen: boolean;
  setIsPayslipModalOpen: (open: boolean) => void;
  processPayrollBatch: (month: string) => void;

  // Audit Logs
  auditLogs: AuditLogItem[];
  addAuditLog: (
    action: string,
    module: AuditLogItem['module'],
    description: string,
    diff?: AuditLogItem['diff']
  ) => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotifsCount: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // AI Copilot
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

export const HRMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('ADMIN');
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.ADMIN);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  // Attendance
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [punchInTime, setPunchInTime] = useState('09:14 AM');
  const [secondsWorkedToday, setSecondsWorkedToday] = useState(6 * 3600 + 45 * 60 + 20); // 6h 45m
  const [punchNetworkType, setPunchNetworkType] = useState<'OFFICE_WIFI' | 'REMOTE_IP'>('OFFICE_WIFI');
  const [streakDays, setStreakDays] = useState(5);

  // Leaves
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [userLeaveBalance, setUserLeaveBalance] = useState<LeaveBalance>({
    paidAnnual: { total: 20, used: 6, remaining: 14 },
    sickLeave: { total: 10, used: 3, remaining: 7 },
    casualLeave: { total: 6, used: 2, remaining: 4 },
    unpaidLop: { used: 0 }
  });

  // Payroll
  const [payslips, setPayslips] = useState<Payslip[]>(initialPayslips);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // AI Copilot
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Switch role handler
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setCurrentUser(mockUsers[role]);
    // Notify audit
    addAuditLog(
      'ROLE_SWITCH',
      'SECURITY',
      `Active context switched to ${role} (${mockUsers[role].name})`
    );
  };

  // Timer ticker for real-time punch clock
  useEffect(() => {
    let interval: any;
    if (isClockedIn && !isBreakActive) {
      interval = setInterval(() => {
        setSecondsWorkedToday(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isBreakActive]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#007BFF', '#00D2D3', '#2ED573', '#FF9F43', '#A4B0F5']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Punch Clock toggle
  const togglePunchClock = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isClockedIn) {
      // Clocking out
      setIsClockedIn(false);
      setIsBreakActive(false);
      
      // Update record in muster roll
      setAttendanceRecords(prev =>
        prev.map(rec =>
          rec.employeeId === currentUser.employeeId
            ? {
                ...rec,
                checkOut: timeString,
                totalHours: +(secondsWorkedToday / 3600).toFixed(1),
                status: secondsWorkedToday >= 8 * 3600 ? 'PRESENT' : 'HALF_DAY'
              }
            : rec
        )
      );

      addAuditLog(
        'PUNCH_OUT',
        'ATTENDANCE',
        `${currentUser.name} punched OUT at ${timeString}. Total ${(secondsWorkedToday / 3600).toFixed(1)} hrs logged.`
      );
    } else {
      // Clocking in
      setIsClockedIn(true);
      setPunchInTime(timeString);
      setStreakDays(prev => prev + 1);
      triggerConfetti();

      // Add to attendance
      const isLateCheck = now.getHours() >= 9 && now.getMinutes() > 30;
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        employeeAvatar: currentUser.avatarUrl,
        department: 'Engineering',
        designation: currentUser.designation,
        date: now.toISOString().split('T')[0],
        checkIn: timeString,
        totalHours: 0.1,
        status: 'PRESENT',
        isLate: isLateCheck,
        networkType: punchNetworkType,
        ipAddress: punchNetworkType === 'OFFICE_WIFI' ? '192.168.1.104 (HQ-Floor-5)' : '73.142.99.18 (Remote WFH)',
        remarks: isLateCheck ? 'Late check-in auto-flagged' : 'On-time check-in'
      };

      setAttendanceRecords(prev => [newRec, ...prev.filter(r => r.employeeId !== currentUser.employeeId)]);

      addAuditLog(
        'PUNCH_IN',
        'ATTENDANCE',
        `${currentUser.name} punched IN at ${timeString} via ${punchNetworkType === 'OFFICE_WIFI' ? 'Office Wi-Fi (HQ)' : 'Remote Network'}.`
      );

      // Notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: '⚡ Punch-In Registered',
          message: `Checked in at ${timeString}. Punctuality streak: ${streakDays + 1} Days!`,
          timestamp: 'Just now',
          type: 'SUCCESS',
          read: false,
          linkTab: 'attendance'
        },
        ...prev
      ]);
    }
  };

  const toggleBreak = () => {
    setIsBreakActive(prev => {
      const next = !prev;
      addAuditLog(
        next ? 'BREAK_START' : 'BREAK_END',
        'ATTENDANCE',
        `${currentUser.name} ${next ? 'started coffee/lunch break' : 'resumed work from break'}.`
      );
      return next;
    });
  };

  const overrideAttendance = (recordId: string, newCheckIn: string, reason: string) => {
    setAttendanceRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const oldTime = r.checkIn;
          addAuditLog(
            'ATTENDANCE_OVERRIDE',
            'ATTENDANCE',
            `Adjusted check-in time for ${r.employeeName}: "${reason}"`,
            { field: 'checkIn', oldValue: oldTime, newValue: newCheckIn }
          );
          return { ...r, checkIn: newCheckIn, remarks: `Override: ${reason}` };
        }
        return r;
      })
    );
  };

  // Add Employee
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [newEmp, ...prev]);
    addAuditLog(
      'EMPLOYEE_PROVISIONED',
      'EMPLOYEE',
      `Provisioned new staff profile for ${newEmp.firstName} ${newEmp.lastName} (${newEmp.department})`
    );
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '👤 New Staff Onboarded',
        message: `${newEmp.firstName} ${newEmp.lastName} added to ${newEmp.department}.`,
        timestamp: 'Just now',
        type: 'INFO',
        read: false,
        linkTab: 'employees'
      },
      ...prev
    ]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev =>
      prev.map(emp => {
        if (emp.id === id) {
          const updated = { ...emp, ...updates };
          addAuditLog(
            'PROFILE_UPDATED',
            'EMPLOYEE',
            `Updated profile attributes for ${updated.firstName} ${updated.lastName}`
          );
          return updated;
        }
        return emp;
      })
    );
  };

  // Apply Leave with Smart Collision Detection Engine!
  const applyLeave = (leave: {
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: number;
  }) => {
    // Collision Detection Logic: Check if other employees in the same department are on leave on overlapping dates
    const userEmp = employees.find(e => e.id === currentUser.employeeId) || employees[2];
    const dept = userEmp.department;
    
    // Check existing approved or pending leaves in same department
    const deptOverlaps = leaveRequests.filter(
      req =>
        req.department === dept &&
        req.status !== 'REJECTED' &&
        req.employeeId !== currentUser.employeeId &&
        // date overlap check
        ((leave.startDate >= req.startDate && leave.startDate <= req.endDate) ||
          (leave.endDate >= req.startDate && leave.endDate <= req.endDate))
    );

    const totalDeptEmployees = employees.filter(e => e.department === dept).length;
    const isHighCollision = deptOverlaps.length > 0 || totalDeptEmployees <= 3;
    let collisionMessage = '';

    if (deptOverlaps.length > 0) {
      const names = deptOverlaps.map(d => d.employeeName).join(', ');
      collisionMessage = `⚠️ Bandwidth Alert: ${names} (${dept}) is already off during this period. Department capacity will drop below 60%.`;
    }

    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatarUrl,
      department: dept,
      designation: currentUser.designation,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0],
      hasCollisionWarning: isHighCollision,
      collisionDetails: collisionMessage
    };

    setLeaveRequests(prev => [newRequest, ...prev]);

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: isHighCollision ? '⚠️ Time-Off Request with Collision' : '🗓️ Leave Request Submitted',
        message: `${currentUser.name} applied for ${leave.totalDays} day(s) (${leave.leaveType.replace('_', ' ')}).`,
        timestamp: 'Just now',
        type: isHighCollision ? 'WARNING' : 'INFO',
        read: false,
        linkTab: 'leaves'
      },
      ...prev
    ]);

    addAuditLog(
      'LEAVE_APPLICATION',
      'LEAVE',
      `${currentUser.name} submitted ${leave.totalDays}d leave application (${leave.startDate} to ${leave.endDate})`
    );

    return {
      success: true,
      hasCollision: isHighCollision,
      collisionMessage
    };
  };

  // Review Leave
  const reviewLeaveRequest = (id: string, status: 'APPROVED' | 'REJECTED', comment: string) => {
    const now = new Date().toLocaleString();
    setLeaveRequests(prev =>
      prev.map(req => {
        if (req.id === id) {
          // If approved, deduct quota for Alex Rivera if it matches
          if (status === 'APPROVED' && req.employeeId === 'emp-3') {
            setUserLeaveBalance(oldBal => {
              if (req.leaveType === 'PAID_ANNUAL') {
                return {
                  ...oldBal,
                  paidAnnual: {
                    ...oldBal.paidAnnual,
                    used: oldBal.paidAnnual.used + req.totalDays,
                    remaining: Math.max(0, oldBal.paidAnnual.remaining - req.totalDays)
                  }
                };
              }
              if (req.leaveType === 'SICK_LEAVE') {
                return {
                  ...oldBal,
                  sickLeave: {
                    ...oldBal.sickLeave,
                    used: oldBal.sickLeave.used + req.totalDays,
                    remaining: Math.max(0, oldBal.sickLeave.remaining - req.totalDays)
                  }
                };
              }
              return oldBal;
            });
          }

          addAuditLog(
            status === 'APPROVED' ? 'LEAVE_APPROVED' : 'LEAVE_REJECTED',
            'LEAVE',
            `${currentUser.name} reviewed request for ${req.employeeName}: ${status} - "${comment}"`,
            { field: 'status', oldValue: 'PENDING', newValue: status }
          );

          return {
            ...req,
            status,
            reviewedBy: `${currentUser.name} (${currentUser.role})`,
            reviewerComment: comment,
            reviewedAt: now
          };
        }
        return req;
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: status === 'APPROVED' ? '✅ Leave Approved' : '❌ Leave Rejected',
        message: `Decision registered for time-off request. Note: ${comment}`,
        timestamp: 'Just now',
        type: status === 'APPROVED' ? 'SUCCESS' : 'ALERT',
        read: false,
        linkTab: 'leaves'
      },
      ...prev
    ]);
  };

  // Process Payroll Batch
  const processPayrollBatch = (month: string) => {
    const generatedSlips: Payslip[] = employees.map(emp => {
      const basic = emp.salary.basic;
      const hra = emp.salary.hra;
      const conveyance = 600;
      const special = emp.salary.specialAllowance;
      const bonus = 1000;
      const gross = basic + hra + conveyance + special + bonus;
      
      const pf = emp.salary.providentFund;
      const pt = emp.salary.professionalTax;
      const tds = Math.round(basic * 0.15);
      const ins = emp.salary.medicalInsurance;
      const totDed = pf + pt + tds + ins;
      const net = gross - totDed;

      return {
        id: `slip-${month.toLowerCase().replace(' ', '-')}-${emp.employeeCode}`,
        slipNumber: `PAY-${emp.employeeCode}-${month.replace(' ', '-').toUpperCase()}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        employeeCode: emp.employeeCode,
        designation: emp.designation,
        department: emp.department,
        panNumber: 'DFX' + Math.floor(100000 + Math.random() * 900000) + 'K',
        bankAccount: 'Direct Deposit •••• ' + (3000 + parseInt(emp.employeeCode.replace(/\D/g, '') || '42')),
        uanNumber: '100' + Math.floor(100000000 + Math.random() * 900000000),
        month,
        payDate: `${month} 31, 2026`,
        workingDays: 22,
        daysWorked: 22,
        earnings: {
          basic,
          hra,
          conveyance,
          specialAllowance: special,
          performanceBonus: bonus,
          grossTotal: gross
        },
        deductions: {
          providentFund: pf,
          professionalTax: pt,
          incomeTaxTDS: tds,
          healthInsurance: ins,
          totalDeductions: totDed
        },
        netPayable: net,
        netPayableWords: `$${net.toLocaleString()} USD (Electronic Transfer)`,
        paymentStatus: 'PAID'
      };
    });

    setPayslips(generatedSlips);
    addAuditLog(
      'PAYROLL_BATCH_EXECUTED',
      'PAYROLL',
      `Executed electronic salary disbursement batch for ${employees.length} employees for ${month}.`
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '💰 Payroll Batch Completed',
        message: `Successfully processed and disbursed payslips for ${month}.`,
        timestamp: 'Just now',
        type: 'SUCCESS',
        read: false,
        linkTab: 'payroll'
      },
      ...prev
    ]);
  };

  // Add Audit Log helper
  const addAuditLog = (
    action: string,
    module: AuditLogItem['module'],
    description: string,
    diff?: AuditLogItem['diff']
  ) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: currentUser.name,
      actorRole: currentRole,
      action,
      module,
      description,
      diff
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Notifications Helpers
  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <HRMSContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        activeTab,
        setActiveTab,
        employees,
        selectedEmployee,
        setSelectedEmployee,
        isEmployeeModalOpen,
        setIsEmployeeModalOpen,
        addEmployee,
        updateEmployee,
        attendanceRecords,
        isClockedIn,
        isBreakActive,
        punchInTime,
        secondsWorkedToday,
        punchNetworkType,
        setPunchNetworkType,
        streakDays,
        togglePunchClock,
        toggleBreak,
        overrideAttendance,
        leaveRequests,
        userLeaveBalance,
        applyLeave,
        reviewLeaveRequest,
        payslips,
        selectedPayslip,
        setSelectedPayslip,
        isPayslipModalOpen,
        setIsPayslipModalOpen,
        processPayrollBatch,
        auditLogs,
        addAuditLog,
        notifications,
        unreadNotifsCount,
        isNotificationOpen,
        setIsNotificationOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isCopilotOpen,
        setIsCopilotOpen,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};
