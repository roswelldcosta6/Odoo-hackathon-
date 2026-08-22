import React from 'react';
import {
  Search,
  Bell,
  Wifi,
  Home,
  Flame,
  Play,
  Square,
  Coffee,
  LogOut
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

export const TopBar: React.FC = () => {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    isClockedIn,
    isBreakActive,
    secondsWorkedToday,
    togglePunchClock,
    toggleBreak,
    punchNetworkType,
    setPunchNetworkType,
    streakDays,
    unreadNotifsCount,
    setIsNotificationOpen,
    logout
  } = useHRMS();

  const formatSeconds = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-10 px-6 py-3.5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-light absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employees, departments, policies..."
              className="w-full bg-surface-bg border border-surface-border text-slate-dark text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-light hover:text-slate-dark"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions, Live Punch Widget, Notifications, Profile */}
        <div className="flex items-center gap-3 justify-between md:justify-end flex-wrap">
          
          {/* Network Aware Pill */}
          <button
            onClick={() => setPunchNetworkType(punchNetworkType === 'OFFICE_WIFI' ? 'REMOTE_IP' : 'OFFICE_WIFI')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              punchNetworkType === 'OFFICE_WIFI'
                ? 'bg-brand-light text-brand-blue border-brand-subtle'
                : 'bg-accent-lavender-light text-slate-dark border-accent-lavender'
            }`}
            title="Toggle Work Location Mode"
          >
            {punchNetworkType === 'OFFICE_WIFI' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-brand-blue" />
                <span className="hidden sm:inline">Office Wi-Fi</span>
              </>
            ) : (
              <>
                <Home className="w-3.5 h-3.5 text-accent-lavender" />
                <span className="hidden sm:inline">Remote WFH</span>
              </>
            )}
          </button>

          {/* Gamified Streak Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-accent-amber-light text-accent-amber border border-accent-amber/30 text-xs font-bold shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-accent-amber text-accent-amber animate-bounce" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Live Punch Clock Widget */}
          <div className="flex items-center gap-2 bg-surface-bg border border-surface-border rounded-xl p-1 px-2.5">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isClockedIn ? (isBreakActive ? 'bg-accent-amber animate-pulse' : 'bg-accent-mint animate-pulse') : 'bg-slate-light'}`} />
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-dark">
                  {formatSeconds(secondsWorkedToday)}
                </div>
                <div className="text-[9px] text-slate-light leading-none">
                  {isClockedIn ? (isBreakActive ? 'On Break' : 'Working') : 'Off Duty'}
                </div>
              </div>
            </div>

            {/* Punch In/Out Button */}
            <button
              onClick={togglePunchClock}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                isClockedIn
                  ? 'bg-accent-rose text-white hover:bg-red-600 shadow-sm'
                  : 'bg-brand-blue text-white hover:bg-brand-hover shadow-sm'
              }`}
            >
              {isClockedIn ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span className="hidden sm:inline">Punch Out</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span className="hidden sm:inline">Punch In</span>
                </>
              )}
            </button>

            {isClockedIn && (
              <button
                onClick={toggleBreak}
                className={`p-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isBreakActive
                    ? 'bg-accent-amber text-white border-accent-amber'
                    : 'bg-white text-slate-muted hover:text-slate-dark border-surface-border'
                }`}
                title={isBreakActive ? 'Resume Work' : 'Take a Break'}
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-full bg-surface-bg border border-surface-border text-slate-muted hover:text-brand-blue transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-amber text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Profile Pill & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
            <div className="relative">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-brand-subtle"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-accent-mint border border-white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-dark leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-slate-light leading-tight">{currentUser.designation}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-accent-rose hover:bg-rose-50 transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default TopBar;
