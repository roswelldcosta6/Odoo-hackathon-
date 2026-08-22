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
import api from '../services/api';

interface HRMSContextType {
  // Auth & Backend connectivity
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  isAuthenticated: boolean;
  isBackendLive: boolean;
  authError: string | null;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginWithCredentials: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Employees
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  isEmployeeModalOpen: boolean;
  setIsEmployeeModalOpen: (open: boolean) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>;
  
  // Attendance & Punch Clock
  attendanceRecords: AttendanceRecord[];
  isClockedIn: boolean;
  isBreakActive: boolean;
  punchInTime: string;
  secondsWorkedToday: number;
  punchNetworkType: 'OFFICE_WIFI' | 'REMOTE_IP';
  setPunchNetworkType: (type: 'OFFICE_WIFI' | 'REMOTE_IP') => void;
  streakDays: number;
  togglePunchClock: () => Promise<void>;
  toggleBreak: () => void;
  overrideAttendance: (recordId: string, newCheckIn: string, reason: string) => Promise<void>;

  // Leave Management
  leaveRequests: LeaveRequest[];
  userLeaveBalance: LeaveBalance;
  applyLeave: (leave: {
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: number;
  }) => Promise<{ success: boolean; hasCollision: boolean; collisionMessage?: string }>;
  reviewLeaveRequest: (id: string, status: 'APPROVED' | 'REJECTED', comment: string) => Promise<void>;

  // Payroll
  payslips: Payslip[];
  selectedPayslip: Payslip | null;
  setSelectedPayslip: (slip: Payslip | null) => void;
  isPayslipModalOpen: boolean;
  setIsPayslipModalOpen: (open: boolean) => void;
  processPayrollBatch: (month: string) => void;

  // Live Backend Analytics State
  liveAnalytics: {
    metrics?: {
      totalEmployees: number;
      presentToday: number;
      presentRate: number;
      onLeave: number;
      averageSalary: number;
    };
    attendanceSalaryByUnit?: any[];
    departmentAnalysis?: any[];
    employeeStructure?: any[];
  } | null;

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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  // Attendance
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [punchInTime, setPunchInTime] = useState('09:14 AM');
  const [secondsWorkedToday, setSecondsWorkedToday] = useState(6 * 3600 + 45 * 60 + 20);
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

  // Live backend analytics
  const [liveAnalytics, setLiveAnalytics] = useState<any | null>(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // AI Copilot
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Check Backend Health on load and attempt session hydration
  const checkAndHydrateBackend = async () => {
    const online = await api.checkHealth();
    setIsBackendLive(online);

    if (online) {
      // Fetch live analytics
      const analyticsRes = await api.analytics.getDashboard();
      if (analyticsRes.success && analyticsRes.data) {
        setLiveAnalytics(analyticsRes.data);
      }

      // Fetch live employees
      const empRes = await api.employees.getAll();
      if (empRes.success && Array.isArray(empRes.data) && empRes.data.length > 0) {
        // Map backend employees to frontend format
        const mappedEmps: Employee[] = empRes.data.map((e: any) => ({
          id: e.id,
          employeeCode: e.employeeCode || `EMP-${e.id.slice(0, 4)}`,
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.personalEmail || e.user?.email || `${e.firstName.toLowerCase()}@dayflow.com`,
          personalEmail: e.personalEmail || `${e.firstName.toLowerCase()}@example.com`,
          phone: e.phone || '+1 (555) 019-2834',
          address: e.address || 'San Francisco HQ',
          designation: e.designation || 'Staff Member',
          department: e.department?.name || 'Core Engineering',
          joiningDate: e.joiningDate ? e.joiningDate.split('T')[0] : '2024-01-15',
          employmentStatus: e.status || 'ACTIVE',
          employmentType: 'Full-Time',
          avatarUrl: e.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          reportingManager: 'Alex Morgan (VP HR)',
          location: 'San Francisco HQ',
          attendanceRate: 98.4,
          performanceRating: e.performanceRating || 'GOOD',
          salary: {
            basic: e.payrollStructure?.basicSalary || 65000,
            hra: e.payrollStructure?.hraAllowance || 26000,
            specialAllowance: e.payrollStructure?.specialAllowance || 13000,
            providentFund: e.payrollStructure?.providentFund || 7800,
            professionalTax: e.payrollStructure?.professionalTax || 200,
            medicalInsurance: e.payrollStructure?.medicalInsurance || 1000,
            grossSalary: e.payrollStructure?.grossSalary || 104000,
            netSalary: e.payrollStructure?.netSalary || 95000
          },
          documents: [
            { id: 'doc-1', name: 'Employment_Agreement.pdf', type: 'PDF', uploadDate: '2024-01-15', size: '2.1 MB', status: 'VERIFIED' }
          ]
        }));

        setEmployees(mappedEmps);
      }

      // Check current token if present
      const token = api.getToken();
      if (token) {
        const meRes = await api.auth.getMe();
        if (meRes.success && meRes.data?.user) {
          const u = meRes.data.user;
          const roleKey = (u.role === 'ADMIN' ? 'ADMIN' : u.role === 'HR_OFFICER' ? 'HR_OFFICER' : 'EMPLOYEE') as UserRole;
          setCurrentRoleState(roleKey);
          setCurrentUser({
            id: u.id,
            email: u.email,
            role: roleKey,
            employeeId: u.employee?.id || 'emp-1',
            name: `${u.employee?.firstName || 'User'} ${u.employee?.lastName || ''}`.trim() || u.email.split('@')[0],
            avatarUrl: u.employee?.avatarUrl || mockUsers[roleKey].avatarUrl,
            designation: u.employee?.designation || mockUsers[roleKey].designation
          });
        }
      }
    }
  };

  useEffect(() => {
    checkAndHydrateBackend();
    const interval = setInterval(() => {
      api.checkHealth().then(setIsBackendLive);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Login with Credentials via API (with fallback)
  const loginWithCredentials = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    if (isBackendLive) {
      const res = await api.auth.login({ email, password: pass });
      if (res.success && res.data) {
        api.setToken(res.data.token);
        const u = res.data.user;
        const roleKey = (u.role === 'ADMIN' ? 'ADMIN' : u.role === 'HR_OFFICER' ? 'HR_OFFICER' : 'EMPLOYEE') as UserRole;
        setCurrentRoleState(roleKey);
        setCurrentUser({
          id: u.id,
          email: u.email,
          role: roleKey,
          employeeId: u.employee?.id || 'emp-1',
          name: `${u.employee?.firstName || 'User'} ${u.employee?.lastName || ''}`.trim() || u.email.split('@')[0],
          avatarUrl: u.employee?.avatarUrl || mockUsers[roleKey].avatarUrl,
          designation: u.employee?.designation || mockUsers[roleKey].designation
        });
        setIsAuthenticated(true);
        addAuditLog('AUTH_LOGIN_LIVE', 'SECURITY', `Authenticated via Backend API as ${email}`);
        return { success: true };
      } else {
        setAuthError(res.error || 'Invalid credentials');
        return { success: false, error: res.error || 'Invalid credentials' };
      }
    } else {
      // Local fallback
      let roleKey: UserRole = 'EMPLOYEE';
      if (email.includes('admin')) roleKey = 'ADMIN';
      else if (email.includes('hr')) roleKey = 'HR_OFFICER';

      setCurrentRoleState(roleKey);
      setCurrentUser(mockUsers[roleKey]);
      setIsAuthenticated(true);
      addAuditLog('AUTH_LOGIN_DEMO', 'SECURITY', `Authenticated demo session as ${roleKey}`);
      return { success: true };
    }
  };

  const logout = () => {
    api.setToken(null);
    setIsAuthenticated(false);
    setIsLoginModalOpen(true);
    addAuditLog('AUTH_LOGOUT', 'SECURITY', `Session ended for ${currentUser.name}`);
  };

  // Switch role handler (Demo Switcher)
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setCurrentUser(mockUsers[role]);
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
    } catch {
      // fallback
    }
  };

  // Punch Clock toggle
  const togglePunchClock = async () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Call backend API if live
    if (isBackendLive) {
      await api.attendance.punch({
        networkType: punchNetworkType,
        remarks: isClockedIn ? 'Punch Out via Web App' : 'Punch In via Web App'
      });
    }

    if (isClockedIn) {
      setIsClockedIn(false);
      setIsBreakActive(false);
      
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
      setIsClockedIn(true);
      setPunchInTime(timeString);
      setStreakDays(prev => prev + 1);
      triggerConfetti();

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

  const overrideAttendance = async (recordId: string, newCheckIn: string, reason: string) => {
    if (isBackendLive) {
      await api.attendance.override(recordId, { checkIn: newCheckIn, remarks: reason });
    }

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
  const addEmployee = async (empData: Omit<Employee, 'id'>) => {
    if (isBackendLive) {
      await api.employees.create({
        email: empData.email,
        employeeCode: empData.employeeCode,
        firstName: empData.firstName,
        lastName: empData.lastName,
        designation: empData.designation,
        phone: empData.phone,
        address: empData.address,
        basicSalary: empData.salary.basic
      });
    }

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
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    if (isBackendLive) {
      await api.employees.update(id, updates);
    }

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

  // Apply Leave with Collision Engine
  const applyLeave = async (leave: {
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    reason: string;
    totalDays: number;
  }) => {
    const userEmp = employees.find(e => e.id === currentUser.employeeId) || employees[2];
    const dept = userEmp.department;
    
    const deptOverlaps = leaveRequests.filter(
      req =>
        req.department === dept &&
        req.status !== 'REJECTED' &&
        req.employeeId !== currentUser.employeeId &&
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

    if (isBackendLive) {
      await api.leaves.apply({
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        totalDays: leave.totalDays
      });
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
  const reviewLeaveRequest = async (id: string, status: 'APPROVED' | 'REJECTED', comment: string) => {
    if (isBackendLive) {
      await api.leaves.review(id, { status, reviewerComment: comment });
    }

    const now = new Date().toLocaleString();
    setLeaveRequests(prev =>
      prev.map(req => {
        if (req.id === id) {
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
        isAuthenticated,
        isBackendLive,
        authError,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginWithCredentials,
        logout,
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
        liveAnalytics,
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
