import React from 'react';
import { Users, UserCheck, CalendarOff, DollarSign, ArrowUpRight } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

interface MetricCardProps {
  title: string;
  value: string;
  subValue: string;
  growth: string;
  growthPositive: boolean;
  ringColor: string;
  ringPercent: number;
  icon: React.ElementType;
}

export const MetricsRow: React.FC = () => {
  const { liveAnalytics, employees, attendanceRecords, leaveRequests } = useHRMS();

  const totalEmps = liveAnalytics?.metrics?.totalEmployees ?? employees.length;
  const presentCount = liveAnalytics?.metrics?.presentToday ?? attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const presentPct = liveAnalytics?.metrics?.presentRate ?? (totalEmps > 0 ? +(presentCount / totalEmps * 100).toFixed(1) : 92.4);
  const onLeaveCount = liveAnalytics?.metrics?.onLeave ?? leaveRequests.filter(r => r.status === 'APPROVED' || r.status === 'PENDING').length;
  const avgSalaryVal = liveAnalytics?.metrics?.averageSalary ?? 84250;

  const metrics: MetricCardProps[] = [
    {
      title: 'Total Employees',
      value: totalEmps.toLocaleString(),
      subValue: '12 new this month',
      growth: '+13.2%',
      growthPositive: true,
      ringColor: '#007BFF', // Primary Brand Blue
      ringPercent: Math.min(100, Math.round((totalEmps / 1500) * 100) || 88),
      icon: Users,
    },
    {
      title: 'Present Today',
      value: presentCount.toLocaleString(),
      subValue: `${presentPct}% occupancy`,
      growth: '+2.8%',
      growthPositive: true,
      ringColor: '#00D2D3', // Cyan / Teal
      ringPercent: presentPct,
      icon: UserCheck,
    },
    {
      title: 'On Leave',
      value: onLeaveCount.toLocaleString(),
      subValue: 'Approved & Pending',
      growth: '-1.4%',
      growthPositive: true,
      ringColor: '#FF9F43', // Warm Amber
      ringPercent: Math.min(100, onLeaveCount * 10),
      icon: CalendarOff,
    },
    {
      title: 'Average Salary',
      value: `$${avgSalaryVal.toLocaleString()}`,
      subValue: 'Per annum / FTE',
      growth: '+4.2%',
      growthPositive: true,
      ringColor: '#A4B0F5', // Soft Lavender
      ringPercent: 74,
      icon: DollarSign,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((card, index) => {
        const Icon = card.icon;
        const radius = 22;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (card.ringPercent / 100) * circumference;

        return (
          <div
            key={index}
            className="bg-white border border-surface-border rounded-2xl p-5 shadow-card hover:shadow-md transition-all duration-300 relative overflow-hidden group"
          >
            {/* Top Row: Title and Mini Circular Ring */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-muted uppercase tracking-wider">
                {card.title}
              </span>
              
              {/* Circular Progress Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    className="text-surface-border stroke-current"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke={card.ringColor}
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-slate-dark" />
                </div>
              </div>
            </div>

            {/* Metric Value */}
            <div className="mb-2">
              <h3 className="text-2xl font-extrabold text-slate-dark tracking-tight">
                {card.value}
              </h3>
            </div>

            {/* Bottom Row: Micro-percentage chip & Sub-label */}
            <div className="flex items-center justify-between pt-1 border-t border-surface-border/60">
              <span className="text-xs text-slate-light truncate max-w-[130px]">
                {card.subValue}
              </span>

              {/* Mint Green growth chip */}
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-accent-mint-light text-accent-mint text-[11px] font-bold">
                <ArrowUpRight className="w-3 h-3" />
                <span>{card.growth}</span>
              </div>
            </div>

            {/* Subtle bottom highlight bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: card.ringColor }}
            />
          </div>
        );
      })}
    </div>
  );
};
