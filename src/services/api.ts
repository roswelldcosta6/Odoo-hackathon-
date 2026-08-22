/**
 * Dayflow HRMS - Backend API Service Client
 * Connects frontend React components to http://localhost:5000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('dayflow_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('dayflow_token', token);
    } else {
      localStorage.removeItem('dayflow_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('dayflow_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          error: json.message || json.error || `HTTP error ${response.status}`,
          message: json.message,
        };
      }

      return {
        success: true,
        data: json.data !== undefined ? json.data : json,
        message: json.message,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error or backend offline',
      };
    }
  }

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Authentication
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request<{ user: any; employee?: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: any) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    getMe: () =>
      this.request<{ user: any; employee?: any }>('/auth/me', {
        method: 'GET',
      }),
  };

  // Analytics & Dashboard
  analytics = {
    getDashboard: () =>
      this.request<{
        metrics: {
          totalEmployees: number;
          presentToday: number;
          presentRate: number;
          onLeave: number;
          averageSalary: number;
        };
        attendanceSalaryByUnit: Array<{
          unit: string;
          attendanceRate: number;
          salaryExpK: number;
          headcount: number;
        }>;
        departmentAnalysis: Array<{
          id: string;
          name: string;
          share: number;
          budget: string;
          headcount: number;
          color: string;
          textColor: string;
        }>;
        employeeStructure: Array<{
          name: string;
          count: number;
          percentage: number;
          color: string;
        }>;
        musterRoll: any[];
      }>('/analytics/dashboard', {
        method: 'GET',
      }),
  };

  // Employees
  employees = {
    getAll: (params?: { search?: string; departmentId?: string; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.departmentId) query.append('departmentId', params.departmentId);
      if (params?.status) query.append('status', params.status);
      const qs = query.toString() ? `?${query.toString()}` : '';
      return this.request<any[]>(`/employees${qs}`, { method: 'GET' });
    },

    getById: (id: string) =>
      this.request<any>(`/employees/${id}`, { method: 'GET' }),

    create: (data: any) =>
      this.request<any>('/employees', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      this.request<any>(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // Attendance
  attendance = {
    punch: (data: { networkType?: string; remarks?: string }) =>
      this.request<any>('/attendance/punch', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getMyRecords: () =>
      this.request<any[]>('/attendance/my-records', { method: 'GET' }),

    getCompany: (date?: string) => {
      const qs = date ? `?date=${date}` : '';
      return this.request<any[]>(`/attendance/company${qs}`, { method: 'GET' });
    },

    override: (id: string, data: { checkIn?: string; checkOut?: string; status?: string; remarks: string }) =>
      this.request<any>(`/attendance/${id}/override`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  };

  // Leaves
  leaves = {
    getBalances: () =>
      this.request<any>('/leaves/balances', { method: 'GET' }),

    apply: (data: { leaveTypeId?: string; startDate: string; endDate: string; reason: string; totalDays?: number }) =>
      this.request<any>('/leaves/apply', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    getMyRequests: () =>
      this.request<any[]>('/leaves/my-requests', { method: 'GET' }),

    getAllRequests: (status?: string) => {
      const qs = status && status !== 'ALL' ? `?status=${status}` : '';
      return this.request<any[]>(`/leaves/all-requests${qs}`, { method: 'GET' });
    },

    review: (id: string, data: { status: 'APPROVED' | 'REJECTED'; reviewerComment?: string }) =>
      this.request<any>(`/leaves/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  };

  // Payroll
  payroll = {
    getStructures: () =>
      this.request<any[]>('/payroll/structures', { method: 'GET' }),

    updateStructure: (employeeId: string, data: any) =>
      this.request<any>(`/payroll/structures/${employeeId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };
}

export const api = new ApiClient();
export default api;
