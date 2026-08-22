import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  CalendarCheck,
  CreditCard,
  Clock,
  Check
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { AppNotification } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab
  } = useHRMS();

  if (!isNotificationOpen) return null;

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
      setIsNotificationOpen(false);
    }
  };

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-accent-mint" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-accent-amber" />;
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-accent-rose" />;
      default:
        return <Info className="w-4 h-4 text-brand-blue" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-dark/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="bg-white w-full max-w-sm h-full shadow-float flex flex-col justify-between border-l border-surface-border animate-slide-left">
        
        {/* Header */}
        <div className="p-4 px-5 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-blue" />
            <h3 className="font-extrabold text-slate-dark text-sm">Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-bold text-brand-blue hover:underline"
            >
              Mark all as read
            </button>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 rounded-lg text-slate-muted hover:text-slate-dark"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-light">No new notifications.</div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-surface-bg/50 border-surface-border text-slate-muted'
                    : 'bg-brand-light/30 border-brand-subtle text-slate-dark shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">{getNotifIcon(notif.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{notif.title}</span>
                      <span className="text-[10px] text-slate-light">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-muted mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-surface-border bg-surface-bg text-center text-[11px] text-slate-light">
          Real-time notification engine connected
        </div>

      </div>
    </div>
  );
};
