import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
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
  initialNotifications,
  calcIndianPayroll,
  generateEmployeeLoginId
} from '../data/mockData';
import { api } from '../services/api';

interface HRMSContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  isBackendLive: boolean;
  authError: string | null;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginWithCredentials: (loginIdOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  isEmployeeModalOpen: boolean;
  setIsEmployeeModalOpen: (open: boolean) => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  attendanceRecords: AttendanceRecord[];
  isClockedIn: boolean;
  isBreakActive: boolean;
  punchInTime: string | null;
  secondsWorkedToday: number;
  punchNetworkType: 'OFFICE_WIFI' | 'REMOTE_IP';
  setPunchNetworkType: (net: 'OFFICE_WIFI' | 'REMOTE_IP') => void;
  streakDays: number;
  togglePunchClock: () => void;
  toggleBreak: () => void;
  overrideAttendance: (id: string, timeOrStatus: any, reason?: string) => void;
  leaveRequests: LeaveRequest[];
  userLeaveBalance: LeaveBalance;
  applyLeave: (leave: { startDate: string; endDate: string; totalDays: number; leaveType: LeaveRequest['leaveType']; reason: string }) => Promise<{ success: boolean; hasCollision: boolean; collisionMessage: string | null }>;
  reviewLeaveRequest: (id: string, status: 'APPROVED' | 'REJECTED', comment?: string) => Promise<void>;
  payslips: Payslip[];
  selectedPayslip: Payslip | null;
  setSelectedPayslip: (slip: Payslip | null) => void;
  isPayslipModalOpen: boolean;
  setIsPayslipModalOpen: (open: boolean) => void;
  processPayrollBatch: (month: string) => void;
  liveAnalytics: any;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, module: AuditLogItem['module'], description: string, diff?: AuditLogItem['diff']) => void;
  notifications: AppNotification[];
  unreadNotifsCount: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

const getStored = <T,>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => getStored('df_user', mockUsers.ADMIN));
  const [currentRole, setCurrentRole] = useState<UserRole>(() => getStored('df_role', 'ADMIN'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getStored('df_auth', false));
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [liveAnalytics, setLiveAnalytics] = useState<any>(null);

  // Persistent Collections
  const [employees, setEmployees] = useState<Employee[]>(() => getStored('df_employees', initialEmployees));
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => getStored('df_attendance', initialAttendanceRecords));
  const [isClockedIn, setIsClockedIn] = useState<boolean>(() => getStored('df_clocked_in', false));
  const [isBreakActive, setIsBreakActive] = useState<boolean>(() => getStored('df_break', false));
  const [punchInTime, setPunchInTime] = useState<string | null>(() => getStored('df_punch_time', null));
  const [secondsWorkedToday, setSecondsWorkedToday] = useState<number>(() => getStored('df_worked_secs', 16200));
  const [punchNetworkType, setPunchNetworkType] = useState<'OFFICE_WIFI' | 'REMOTE_IP'>('OFFICE_WIFI');
  const [streakDays, setStreakDays] = useState<number>(() => getStored('df_streak', 14));

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => getStored('df_leaves', initialLeaveRequests));
  const [userLeaveBalance, setUserLeaveBalance] = useState<LeaveBalance>(() => getStored('df_leave_bal', {
    paidAnnual: { total: 21, used: 6, remaining: 15 },
    sickLeave: { total: 12, used: 3, remaining: 9 },
    casualLeave: { total: 7, used: 2, remaining: 5 },
    unpaidLop: { used: 0 }
  }));

  const [payslips, setPayslips] = useState<Payslip[]>(() => getStored('df_payslips', initialPayslips));
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => getStored('df_audit', initialAuditLogs));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStored('df_notifs', initialNotifications));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => { localStorage.setItem('df_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('df_role', JSON.stringify(currentRole)); }, [currentRole]);
  useEffect(() => { localStorage.setItem('df_auth', JSON.stringify(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('df_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('df_attendance', JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { localStorage.setItem('df_leaves', JSON.stringify(leaveRequests)); }, [leaveRequests]);
  useEffect(() => { localStorage.setItem('df_payslips', JSON.stringify(payslips)); }, [payslips]);
  useEffect(() => { localStorage.setItem('df_audit', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('df_notifs', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('df_clocked_in', JSON.stringify(isClockedIn)); }, [isClockedIn]);
  useEffect(() => { localStorage.setItem('df_break', JSON.stringify(isBreakActive)); }, [isBreakActive]);
  useEffect(() => { localStorage.setItem('df_punch_time', JSON.stringify(punchInTime)); }, [punchInTime]);
  useEffect(() => { localStorage.setItem('df_worked_secs', JSON.stringify(secondsWorkedToday)); }, [secondsWorkedToday]);

  // Check backend connectivity on mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        const isHealthy = await api.checkHealth();
        if (isHealthy) {
          setIsBackendLive(true);
          const analyticsRes = await api.analytics.getDashboard();
          if (analyticsRes && analyticsRes.data) setLiveAnalytics(analyticsRes.data);
        }
      } catch {
        setIsBackendLive(false);
      }
    };
    checkApi();
  }, []);

  // Timer loop for clocked in time
  useEffect(() => {
    let interval: any = null;
    if (isClockedIn && !isBreakActive) {
      interval = setInterval(() => {
        setSecondsWorkedToday(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isBreakActive]);

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

  // Robust Login matching credentials or employee Login ID / email
  const loginWithCredentials = async (loginIdOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = loginIdOrEmail.trim();

    if (!cleanId) return { success: false, error: 'Please enter your Login ID or Email.' };
    if (!pass || pass.length < 4) return { success: false, error: 'Please enter a valid password.' };

    try {
      const emailToSubmit = cleanId.includes('@') ? cleanId :
        cleanId.startsWith('DFMAVA') ? 'admin@dayflow.com' :
        cleanId.startsWith('DFSAJE') ? 'hr@dayflow.com' : 'employee@dayflow.com';

      const res = await api.auth.login({ email: emailToSubmit, password: pass });
      if (res && res.success && res.data?.token && res.data?.user) {
        setCurrentUser(res.data.user);
        setCurrentRole(res.data.user.role);
        setIsAuthenticated(true);
        setIsBackendLive(true);
        return { success: true };
      }
    } catch {
      // fallback
    }

    const matchedEmployee = employees.find(e =>
      e.email.toLowerCase() === cleanId.toLowerCase() ||
      (e.loginId && e.loginId.toUpperCase() === cleanId.toUpperCase()) ||
      e.employeeCode.toUpperCase() === cleanId.toUpperCase()
    );

    if (matchedEmployee) {
      const userRole: UserRole = matchedEmployee.designation.includes('VP') || matchedEmployee.designation.includes('Director') ? 'ADMIN' :
        matchedEmployee.department === 'Human Resources' ? 'HR_OFFICER' : 'EMPLOYEE';

      const userObj: User = {
        id: `usr-${matchedEmployee.id}`,
        email: matchedEmployee.email,
        name: `${matchedEmployee.firstName} ${matchedEmployee.lastName}`,
        role: userRole,
        employeeId: matchedEmployee.id,
        avatarUrl: matchedEmployee.avatarUrl,
        designation: matchedEmployee.designation,
        loginId: matchedEmployee.loginId
      };

      setCurrentUser(userObj);
      setCurrentRole(userRole);
      setIsAuthenticated(true);
      return { success: true };
    }

    if (cleanId.toLowerCase().includes('admin') || cleanId.toUpperCase().startsWith('DFMAVA')) {
      setCurrentUser(mockUsers.ADMIN);
      setCurrentRole('ADMIN');
      setIsAuthenticated(true);
      return { success: true };
    }

    if (cleanId.toLowerCase().includes('hr') || cleanId.toUpperCase().startsWith('DFSAJE')) {
      setCurrentUser(mockUsers.HR_OFFICER);
      setCurrentRole('HR_OFFICER');
      setIsAuthenticated(true);
      return { success: true };
    }

    const empUser = {
      ...mockUsers.EMPLOYEE,
      email: cleanId.includes('@') ? cleanId : `${cleanId.toLowerCase()}@dayflow.com`,
      loginId: cleanId
    };
    setCurrentUser(empUser);
    setCurrentRole('EMPLOYEE');
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('df_auth');
    setActiveTab('dashboard');
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now()}`;
    const autoLoginId = empData.loginId || generateEmployeeLoginId(
      empData.firstName,
      empData.lastName,
      empData.joiningDate,
      employees.length + 1,
      'DF'
    );

    const newEmp: Employee = {
      ...empData,
      id: newId,
      loginId: autoLoginId
    };

    setEmployees(prev => [newEmp, ...prev]);

    const newSlip: Payslip = {
      id: `ps-${Date.now()}`,
      slipNumber: `PAY-2026-${(payslips.length + 1).toString().padStart(4, '0')}`,
      employeeId: newId,
      employeeName: `${empData.firstName} ${empData.lastName}`,
      employeeCode: empData.employeeCode,
      loginId: autoLoginId,
      designation: empData.designation,
      department: empData.department,
      panNumber: empData.pan || 'ABCDE1234F',
      bankAccount: empData.bankAccountNo || '50200012345678',
      ifscCode: empData.ifscCode || 'HDFC0001234',
      uanNumber: empData.uanNumber || '100123456789',
      month: 'August 2026',
      payDate: '2026-08-31',
      workingDays: 22,
      daysWorked: 22,
      earnings: {
        basic: empData.salary?.basic || 65000,
        hra: empData.salary?.hra || 26000,
        conveyance: empData.salary?.conveyanceAllowance || 1600,
        specialAllowance: empData.salary?.specialAllowance || 13000,
        performanceBonus: 0,
        grossTotal: empData.salary?.grossSalary || 105600
      },
      deductions: {
        employeePF: empData.salary?.providentFund || 1800,
        professionalTax: empData.salary?.professionalTax || 200,
        incomeTaxTDS: empData.salary?.incomeTaxTDS || 3250,
        healthInsurance: empData.salary?.medicalInsurance || 500,
        totalDeductions: (empData.salary?.providentFund || 1800) + (empData.salary?.professionalTax || 200) + (empData.salary?.incomeTaxTDS || 3250) + 500
      },
      netPayable: empData.salary?.netSalary || 99850,
      netPayableWords: 'Rupees Ninety Nine Thousand Eight Hundred Fifty Only',
      paymentStatus: 'PAID'
    };

    setPayslips(prev => [newSlip, ...prev]);

    addAuditLog(
      'EMPLOYEE_PROVISIONED',
      'EMPLOYEE',
      `Onboarded ${empData.firstName} ${empData.lastName} (${empData.designation}). Login ID: ${autoLoginId}`
    );
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    if (selectedEmployee && selectedEmployee.id === id) {
      setSelectedEmployee(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const deleteEmployee = (id: string) => {
    const toRemove = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    setPayslips(prev => prev.filter(p => p.employeeId !== id));

    if (toRemove) {
      addAuditLog(
        'EMPLOYEE_REMOVED',
        'EMPLOYEE',
        `Removed ${toRemove.firstName} ${toRemove.lastName} (${toRemove.loginId || toRemove.employeeCode}) from payroll records.`
      );
    }
  };

  const togglePunchClock = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchInTime(timeStr);
      setStreakDays(prev => prev + 1);

      const record: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        employeeAvatar: currentUser.avatarUrl,
        department: 'Engineering',
        designation: currentUser.designation,
        date: new Date().toISOString().split('T')[0],
        checkIn: timeStr,
        totalHours: 0,
        status: 'PRESENT',
        isLate: false,
        networkType: punchNetworkType,
        ipAddress: '192.168.1.104'
      };
      setAttendanceRecords(prev => [record, ...prev]);
    } else {
      setIsClockedIn(false);
      setIsBreakActive(false);
      setPunchInTime(null);
    }
  };

  const toggleBreak = () => {
    setIsBreakActive(prev => !prev);
  };

  const overrideAttendance = (id: string, timeOrStatus: any, reason?: string) => {
    setAttendanceRecords(prev =>
      prev.map(rec => {
        if (rec.id === id) {
          const updated = {
            ...rec,
            checkIn: typeof timeOrStatus === 'string' && timeOrStatus.includes(':') ? timeOrStatus : rec.checkIn,
            status: typeof timeOrStatus === 'string' && !timeOrStatus.includes(':') ? (timeOrStatus as any) : rec.status,
            remarks: reason || `Manually corrected by ${currentUser.name}`
          };
          return updated;
        }
        return rec;
      })
    );
  };

  const applyLeave = async (leave: { startDate: string; endDate: string; totalDays: number; leaveType: LeaveRequest['leaveType']; reason: string }) => {
    const isHighCollision = false;

    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatarUrl,
      department: 'Engineering',
      designation: currentUser.designation,
      leaveType: leave.leaveType,
      startDate: leave.startDate,
      endDate: leave.endDate,
      totalDays: leave.totalDays,
      reason: leave.reason,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0],
      hasCollisionWarning: isHighCollision,
      collisionDetails: undefined
    };

    setLeaveRequests(prev => [newRequest, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '🗓️ Leave Request Submitted',
        message: `${currentUser.name} applied for ${leave.totalDays} day(s) (${leave.leaveType.replace('_', ' ')}).`,
        timestamp: 'Just now',
        type: 'INFO',
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
      collisionMessage: null
    };
  };

  const reviewLeaveRequest = async (id: string, status: 'APPROVED' | 'REJECTED', comment: string = '') => {
    const now = new Date().toLocaleString();
    setLeaveRequests(prev =>
      prev.map(req => {
        if (req.id === id) {
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

  const processPayrollBatch = (month: string) => {
    const refreshedSlips: Payslip[] = employees.map((emp, i) => {
      const calc = emp.salary || calcIndianPayroll(65000);
      return {
        id: `ps-${month}-${emp.id}`,
        slipNumber: `PAY-2026-${(i + 1).toString().padStart(4, '0')}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        employeeCode: emp.employeeCode,
        loginId: emp.loginId,
        designation: emp.designation,
        department: emp.department,
        panNumber: emp.pan || 'ABCDE1234F',
        bankAccount: emp.bankAccountNo || '50200012345678',
        ifscCode: emp.ifscCode || 'HDFC0001234',
        uanNumber: emp.uanNumber || '100123456789',
        month,
        payDate: '2026-08-31',
        workingDays: 22,
        daysWorked: 22,
        earnings: {
          basic: calc.basic,
          hra: calc.hra,
          conveyance: calc.conveyanceAllowance || 1600,
          specialAllowance: calc.specialAllowance,
          performanceBonus: 2500,
          grossTotal: calc.grossSalary + 2500
        },
        deductions: {
          employeePF: calc.providentFund,
          professionalTax: calc.professionalTax,
          incomeTaxTDS: calc.incomeTaxTDS || 3250,
          healthInsurance: calc.medicalInsurance || 500,
          totalDeductions: calc.providentFund + calc.professionalTax + (calc.incomeTaxTDS || 3250) + 500
        },
        netPayable: calc.netSalary + 2500,
        netPayableWords: 'Salary processed for direct bank transfer',
        paymentStatus: 'PAID'
      };
    });

    setPayslips(refreshedSlips);
    addAuditLog(
      'PAYROLL_BATCH_EXECUTED',
      'PAYROLL',
      `Executed electronic salary disbursement batch for ${employees.length} employees for ${month}.`
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <HRMSContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
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
        deleteEmployee,
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
  if (!context) throw new Error('useHRMS must be used within HRMSProvider');
  return context;
};
export default HRMSContext;
