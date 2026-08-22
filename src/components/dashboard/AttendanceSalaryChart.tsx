import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';

interface UnitData {
  unit: string;
  attendanceRate: number;
  salaryExpK: number;
  headcount: number;
}

export const AttendanceSalaryChart: React.FC = () => {
  const { liveAnalytics } = useHRMS();
  const [activeMetric, setActiveMetric] = useState<'both' | 'attendance' | 'salary'>('both');
  const [hoveredUnit, setHoveredUnit] = useState<UnitData | null>(null);

  const defaultUnitsData: UnitData[] = [
    { unit: 'Core Engineering', attendanceRate: 96, salaryExpK: 340, headcount: 48 },
    { unit: 'Product & Design', attendanceRate: 94, salaryExpK: 210, headcount: 24 },
    { unit: 'Marketing & Growth', attendanceRate: 89, salaryExpK: 165, headcount: 18 },
    { unit: 'People & Culture', attendanceRate: 98, salaryExpK: 120, headcount: 12 },
    { unit: 'Finance & Ops', attendanceRate: 99, salaryExpK: 145, headcount: 14 },
    { unit: 'Sales & Client Ops', attendanceRate: 91, salaryExpK: 280, headcount: 35 },
  ];

  const unitsData: UnitData[] = (liveAnalytics?.attendanceSalaryByUnit && liveAnalytics.attendanceSalaryByUnit.length > 0)
    ? liveAnalytics.attendanceSalaryByUnit
    : defaultUnitsData;

  const maxSalary = 380;

  return (
    <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-dark text-base tracking-tight">
              Total Attendance & Salary by Unit
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-blue text-[10px] font-bold">
              Q3 2026
            </span>
          </div>
          <p className="text-xs text-slate-muted">
            Cross-department muster rate vs monthly compensation allocation
          </p>
        </div>

        {/* Legend / Filter controls */}
        <div className="flex items-center gap-2 bg-surface-bg p-1 rounded-xl border border-surface-border text-xs">
          <button
            onClick={() => setActiveMetric('both')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              activeMetric === 'both'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-slate-muted hover:text-slate-dark'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveMetric('attendance')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeMetric === 'attendance'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-slate-muted hover:text-slate-dark'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue" />
            <span>Attendance</span>
          </button>
          <button
            onClick={() => setActiveMetric('salary')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeMetric === 'salary'
                ? 'bg-white text-slate-dark shadow-sm'
                : 'text-slate-muted hover:text-slate-dark'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent-lavender" />
            <span>Salary</span>
          </button>
        </div>
      </div>

      {/* Chart Graphic - Pill Bars Container */}
      <div className="relative pt-6 pb-2">
        {/* Hover Tooltip Overlay */}
        {hoveredUnit && (
          <div className="absolute top-0 right-4 bg-slate-dark text-white px-3 py-1.5 rounded-xl shadow-float text-xs z-10 animate-fade-in flex items-center gap-3">
            <span className="font-bold">{hoveredUnit.unit}</span>
            <span className="text-accent-cyan font-mono">Att: {hoveredUnit.attendanceRate}%</span>
            <span className="text-accent-lavender font-mono">Payroll: ${hoveredUnit.salaryExpK}k</span>
            <span className="text-slate-light text-[10px] font-mono">({hoveredUnit.headcount} staff)</span>
          </div>
        )}

        {/* Grid lines */}
        <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-dashed border-slate-200 w-full" />
          <div className="border-b border-slate-200 w-full" />
        </div>

        {/* Bars Container */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 h-52 items-end pt-4 pb-1 relative z-0">
          {unitsData.slice(0, 6).map((item, index) => {
            const attHeight = `${item.attendanceRate * 0.9}%`;
            const salHeight = `${(item.salaryExpK / maxSalary) * 100}%`;

            return (
              <div
                key={index}
                className="flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredUnit(item)}
                onMouseLeave={() => setHoveredUnit(null)}
              >
                {/* Paired Pill Bars */}
                <div className="flex items-end gap-1.5 sm:gap-2 h-full w-full justify-center">
                  
                  {/* Attendance Bar: Vibrant Blue #007BFF */}
                  {(activeMetric === 'both' || activeMetric === 'attendance') && (
                    <div className="w-3.5 sm:w-5 flex flex-col justify-end h-full">
                      <div
                        style={{ height: attHeight }}
                        className="w-full bg-brand-blue rounded-t-full rounded-b-lg shadow-sm group-hover:bg-brand-hover transition-all duration-500 ease-out group-hover:scale-y-105 origin-bottom relative"
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-brand-blue bg-brand-light px-1 rounded transition-opacity pointer-events-none">
                          {item.attendanceRate}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Salary Bar: Soft Lavender #A4B0F5 */}
                  {(activeMetric === 'both' || activeMetric === 'salary') && (
                    <div className="w-3.5 sm:w-5 flex flex-col justify-end h-full">
                      <div
                        style={{ height: salHeight }}
                        className="w-full bg-accent-lavender rounded-t-full rounded-b-lg shadow-sm group-hover:brightness-95 transition-all duration-500 ease-out group-hover:scale-y-105 origin-bottom relative"
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-slate-dark bg-accent-lavender-light px-1 rounded transition-opacity pointer-events-none">
                          ${item.salaryExpK}k
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* X-Axis Label */}
                <span className="text-[11px] font-bold text-slate-muted mt-3 text-center truncate w-full group-hover:text-brand-blue transition-colors">
                  {item.unit.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Indicator summary */}
      <div className="pt-3 mt-1 border-t border-surface-border flex items-center justify-between text-xs text-slate-muted">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
            <span className="font-medium text-slate-dark">Attendance %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-lavender" />
            <span className="font-medium text-slate-dark">Monthly Payroll ($k)</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-accent-mint font-bold">
          <span>+94.8% Org Average</span>
        </div>
      </div>
    </div>
  );
};
