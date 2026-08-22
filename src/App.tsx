import React from 'react';
import { useHRMS } from './context/HRMSContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EmployeeHome } from './components/employee-dashboard/EmployeeHome';
import { EmployeeDirectory } from './components/directory/EmployeeDirectory';
import { AttendanceHub } from './components/attendance/AttendanceHub';
import { LeaveManagement } from './components/leaves/LeaveManagement';
import { PayrollHub } from './components/payroll/PayrollHub';
import { OrgChart } from './components/org-chart/OrgChart';
import { AuditLogs } from './components/audit/AuditLogs';
import { SettingsView } from './components/settings/SettingsView';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthPage } from './components/auth/AuthPage';

export const App: React.FC = () => {
  const { currentRole, activeTab, isAuthenticated } = useHRMS();

  // If not authenticated, render the dedicated dynamic Full-Page Sign In / Sign Up
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentRole === 'EMPLOYEE' ? <EmployeeHome /> : <AdminDashboard />;
      case 'employees':
        return <EmployeeDirectory />;
      case 'attendance':
        return <AttendanceHub />;
      case 'leaves':
        return <LeaveManagement />;
      case 'payroll':
        return <PayrollHub />;
      case 'org-chart':
        return <OrgChart />;
      case 'audit':
        return <AuditLogs />;
      case 'settings':
        return <SettingsView />;
      default:
        return currentRole === 'EMPLOYEE' ? <EmployeeHome /> : <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col md:flex-row text-slate-dark antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Header */}
        <TopBar />

        {/* Dynamic Page View */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Global Notification Drawer */}
      <NotificationDrawer />
    </div>
  );
};

export default App;
