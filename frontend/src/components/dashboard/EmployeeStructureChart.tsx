import React from 'react';
import { Briefcase, Globe, FileText, UserCheck } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

interface StructureSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
  icon: React.ElementType;
}

export const EmployeeStructureChart: React.FC = () => {
  const { liveAnalytics, employees } = useHRMS();

  const totalEmployees = liveAnalytics?.metrics?.totalEmployees ?? (employees.length > 0 ? employees.length : 1284);

  const defaultSegments: StructureSegment[] = [
    { name: 'Full-Time In-Office', count: 745, percentage: 58, color: '#007BFF', icon: Briefcase },
    { name: 'Remote / Distributed', count: 321, percentage: 25, color: '#00D2D3', icon: Globe },
    { name: 'Contractors / Advisory', count: 141, percentage: 11, color: '#2ED573', icon: FileText },
    { name: 'On Probation', count: 77, percentage: 6, color: '#FF9F43', icon: UserCheck },
  ];

  const icons = [Briefcase, Globe, FileText, UserCheck];
  const segments: StructureSegment[] = (liveAnalytics?.employeeStructure && liveAnalytics.employeeStructure.length > 0)
    ? liveAnalytics.employeeStructure.map((s: any, idx: number) => ({
        name: s.name,
        count: s.count || Math.round((s.percentage / 100) * totalEmployees),
        percentage: s.percentage,
        color: s.color || defaultSegments[idx]?.color || '#007BFF',
        icon: icons[idx % icons.length]
      }))
    : defaultSegments;

  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const renderedArcs = segments.map(seg => {
    const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += seg.percentage;
    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-dark text-base tracking-tight">
              Employee Structure
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-blue text-[10px] font-bold">
              Org Breakdown
            </span>
          </div>
          <p className="text-xs text-slate-muted">Contract types & workplace distribution</p>
        </div>
      </div>

      {/* Donut & Legend Container */}
      <div className="flex flex-col sm:flex-row items-center gap-6 my-auto py-2">
        
        {/* SVG Donut Graphic */}
        <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
          <svg className="w-44 h-44 transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {renderedArcs.map((arc, index) => (
              <circle
                key={index}
                cx="88"
                cy="88"
                r={radius}
                stroke={arc.color}
                strokeWidth={strokeWidth}
                strokeDasharray={arc.strokeDasharray}
                strokeDashoffset={arc.strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out hover:opacity-90 cursor-pointer"
              />
            ))}
          </svg>

          {/* Center Callout Metric */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-slate-dark tracking-tight">
              100%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-muted tracking-wider">
              {totalEmployees.toLocaleString()} Total
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2">
          {segments.map((seg, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-xl bg-surface-bg/70 hover:bg-surface-bg border border-surface-border/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-xs font-semibold text-slate-dark truncate">
                  {seg.name}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-mono text-slate-muted">
                  {seg.count}
                </span>
                <span
                  className="text-xs font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${seg.color}15`,
                    color: seg.color,
                  }}
                >
                  {seg.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-slate-muted">
        <span>Global Talent Footprint</span>
        <span className="text-accent-cyan font-bold">14 Countries Active</span>
      </div>
    </div>
  );
};
