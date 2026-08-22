import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

interface BubbleMetric {
  id: string;
  name: string;
  share: number;
  budget: string;
  headcount: number;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  x: number;
  y: number;
  size: number;
}

export const DepartmentAnalysisChart: React.FC = () => {
  const { liveAnalytics } = useHRMS();
  const [selectedBubble, setSelectedBubble] = useState<string>('eng');

  const defaultBubbles: BubbleMetric[] = [
    {
      id: 'eng',
      name: 'Engineering & Tech',
      share: 45,
      budget: '$480,000 / mo',
      headcount: 580,
      color: '#007BFF',
      bgColor: 'rgba(0, 123, 255, 0.12)',
      borderColor: '#007BFF',
      textColor: '#007BFF',
      x: 38,
      y: 46,
      size: 155,
    },
    {
      id: 'prod',
      name: 'Product & Design',
      share: 32,
      budget: '$290,000 / mo',
      headcount: 340,
      color: '#00D2D3',
      bgColor: 'rgba(0, 210, 211, 0.15)',
      borderColor: '#00D2D3',
      textColor: '#00B0B1',
      x: 68,
      y: 42,
      size: 135,
    },
    {
      id: 'growth',
      name: 'Operations & Mktg',
      share: 23,
      budget: '$220,000 / mo',
      headcount: 364,
      color: '#2ED573',
      bgColor: 'rgba(46, 213, 115, 0.15)',
      borderColor: '#2ED573',
      textColor: '#20A456',
      x: 54,
      y: 72,
      size: 115,
    }
  ];

  const bubbles: BubbleMetric[] = (liveAnalytics?.departmentAnalysis && liveAnalytics.departmentAnalysis.length >= 3)
    ? liveAnalytics.departmentAnalysis.map((b: any, idx: number) => ({
        ...defaultBubbles[idx],
        ...b,
        bgColor: `${b.color || defaultBubbles[idx].color}1F`,
        borderColor: b.color || defaultBubbles[idx].borderColor,
        textColor: b.textColor || defaultBubbles[idx].textColor,
      }))
    : defaultBubbles;

  const current = bubbles.find(b => b.id === selectedBubble) || bubbles[0];

  return (
    <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-dark text-base tracking-tight">
              Department & Income Analysis
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-accent-cyan-light text-accent-cyan text-[10px] font-bold">
              Venn Metrics
            </span>
          </div>
          <p className="text-xs text-slate-muted">
            Overlapping talent pool distribution & compensation parity
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-muted">
          <Layers className="w-3.5 h-3.5 text-brand-blue" />
          <span>3 Main Pillars</span>
        </div>
      </div>

      {/* Interactive Overlapping Circular Bubble Graphic */}
      <div className="relative h-56 w-full flex items-center justify-center my-2 bg-surface-bg/60 rounded-xl border border-surface-border/50 overflow-hidden">
        
        {/* Venn Bubbles Canvas */}
        <div className="relative w-full h-full">
          {bubbles.map(bubble => {
            const isSelected = selectedBubble === bubble.id;
            return (
              <div
                key={bubble.id}
                onClick={() => setSelectedBubble(bubble.id)}
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: isSelected ? bubble.bgColor : 'rgba(255, 255, 255, 0.75)',
                  borderColor: bubble.borderColor,
                  boxShadow: isSelected ? `0 8px 24px ${bubble.bgColor}` : 'none'
                }}
                className={`absolute rounded-full border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-3 text-center backdrop-blur-sm hover:scale-105 select-none ${
                  isSelected ? 'z-10 ring-4 ring-white' : 'z-0 opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full mb-1"
                  style={{ backgroundColor: bubble.color }}
                />
                <span
                  className="text-xs font-bold leading-tight line-clamp-1"
                  style={{ color: bubble.textColor }}
                >
                  {bubble.name.split(' ')[0]}
                </span>
                <span className="text-base font-extrabold text-slate-dark leading-tight mt-0.5">
                  {bubble.share}%
                </span>
                <span className="text-[10px] text-slate-muted font-medium">
                  {bubble.headcount} staff
                </span>
              </div>
            );
          })}
        </div>

        {/* Center Intersection Tag */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-surface-border text-[10px] font-bold text-slate-dark shadow-sm pointer-events-none">
          Click circle to inspect
        </div>
      </div>

      {/* Selected Bubble Deep Details */}
      <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: current.color }}
          />
          <div>
            <span className="font-extrabold text-slate-dark">{current.name}</span>
            <span className="text-slate-muted ml-2">Payroll: <strong className="text-slate-dark">{current.budget}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-1 font-bold" style={{ color: current.textColor }}>
          <span>{current.share}% of Total Budget</span>
        </div>
      </div>
    </div>
  );
};
