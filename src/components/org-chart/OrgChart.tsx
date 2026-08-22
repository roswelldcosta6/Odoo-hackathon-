import React, { useState } from 'react';
import {
  Network,
  ChevronDown,
  ChevronRight,
  Search,
  User,
  Mail,
  Building,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { OrgNode, Employee } from '../../types';
import { mockOrgChart } from '../../data/mockData';

interface TreeNodeProps {
  node: OrgNode;
  onSelect: (node: OrgNode) => void;
  searchTerm: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, onSelect, searchTerm }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const isMatched = searchTerm && (
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div
        onClick={() => onSelect(node)}
        className={`bg-white border rounded-2xl p-4 shadow-card hover:shadow-md cursor-pointer transition-all duration-200 w-60 z-10 flex flex-col items-center text-center relative group ${
          isMatched ? 'ring-2 ring-brand-blue border-brand-blue' : 'border-surface-border hover:border-brand-blue/60'
        }`}
      >
        {/* Status Dot */}
        <div className="relative mb-2">
          <img
            src={node.avatar}
            alt={node.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
          />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              node.status === 'ONLINE'
                ? 'bg-accent-mint'
                : node.status === 'ON_LEAVE'
                ? 'bg-accent-amber'
                : 'bg-slate-300'
            }`}
          />
        </div>

        <h4 className="font-extrabold text-slate-dark text-xs group-hover:text-brand-blue transition-colors">
          {node.name}
        </h4>
        <p className="text-[11px] text-slate-muted font-medium mt-0.5">{node.role}</p>
        
        <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-light text-brand-blue">
          {node.department}
        </span>

        {/* Expand / Collapse Button */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-surface-border shadow-sm flex items-center justify-center text-slate-muted hover:text-brand-blue hover:border-brand-blue transition-colors text-xs"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Children Tree Branch */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col items-center">
          {/* Vertical connector line */}
          <div className="w-0.5 h-6 bg-surface-border" />
          
          {/* Horizontal branch container */}
          <div className="flex items-start gap-8 relative pt-2">
            {/* Top horizontal branch bar across children */}
            {node.children!.length > 1 && (
              <div className="absolute top-0 left-32 right-32 h-0.5 bg-surface-border" />
            )}

            {node.children!.map((child) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Child connector line */}
                <div className="w-0.5 h-4 bg-surface-border -mt-2 mb-2" />
                <TreeNode node={child} onSelect={onSelect} searchTerm={searchTerm} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const OrgChart: React.FC = () => {
  const { employees, setSelectedEmployee, setIsEmployeeModalOpen } = useHRMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleSelectNode = (node: OrgNode) => {
    const matchedEmp = employees.find(e => e.firstName.toLowerCase() === node.name.split(' ')[0].toLowerCase());
    if (matchedEmp) {
      setSelectedEmployee(matchedEmp);
      setIsEmployeeModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-dark tracking-tight">
              Interactive Organizational Hierarchy
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-blue text-xs font-bold">
              Standout Feature
            </span>
          </div>
          <p className="text-xs text-slate-muted mt-0.5">
            Collapsible corporate reporting lines from Executive Board to Engineering pods
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Node */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leader or department..."
              className="w-full bg-surface-bg border border-surface-border text-xs rounded-xl pl-9 pr-3 py-2 text-slate-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-surface-bg p-1 rounded-xl border border-surface-border text-xs font-bold">
            <button
              onClick={() => setZoomLevel(prev => Math.max(60, prev - 10))}
              className="p-1.5 rounded-lg text-slate-muted hover:text-slate-dark"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-slate-dark">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
              className="p-1.5 rounded-lg text-slate-muted hover:text-slate-dark"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Org Tree Canvas Viewport */}
      <div className="bg-white border border-surface-border rounded-2xl shadow-card p-10 overflow-x-auto min-h-[550px] flex items-center justify-center">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200"
        >
          <TreeNode node={mockOrgChart} onSelect={handleSelectNode} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
};
