import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  User,
  Filter,
  ArrowRight,
  Search,
  Lock,
  Layers
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { AuditLogItem } from '../../types';

export const AuditLogs: React.FC = () => {
  const { auditLogs } = useHRMS();
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const modules = ['ALL', 'ATTENDANCE', 'LEAVE', 'PAYROLL', 'EMPLOYEE', 'SECURITY'];

  const filteredLogs = auditLogs.filter(log => {
    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;
    const matchesSearch =
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const getModuleBadgeColor = (mod: AuditLogItem['module']) => {
    switch (mod) {
      case 'SECURITY':
        return 'bg-accent-amber-light text-accent-amber border-accent-amber/30';
      case 'PAYROLL':
        return 'bg-accent-mint-light text-accent-mint border-accent-mint/30';
      case 'LEAVE':
        return 'bg-brand-light text-brand-blue border-brand-subtle';
      case 'ATTENDANCE':
        return 'bg-accent-cyan-light text-accent-cyan border-accent-cyan/30';
      case 'EMPLOYEE':
        return 'bg-accent-lavender-light text-slate-dark border-accent-lavender';
      default:
        return 'bg-surface-bg text-slate-muted border-surface-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-dark tracking-tight">
              Immutable Enterprise Audit Log
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-accent-mint-light text-accent-mint text-xs font-bold flex items-center gap-1 border border-accent-mint/30">
              <Lock className="w-3 h-3" />
              <span>SOC2 Compliant</span>
            </span>
          </div>
          <p className="text-xs text-slate-muted mt-0.5">
            Tamper-proof chronological trail of all HR actions, salary updates, and attendance overrides
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-light absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full bg-surface-bg border border-surface-border text-xs rounded-xl pl-9 pr-3 py-2 text-slate-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {modules.map(mod => (
          <button
            key={mod}
            onClick={() => setSelectedModule(mod)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedModule === mod
                ? 'bg-brand-blue text-white shadow-sm font-bold'
                : 'bg-white border border-surface-border text-slate-muted hover:text-slate-dark'
            }`}
          >
            {mod === 'ALL' ? 'All Events' : mod}
          </button>
        ))}
      </div>

      {/* Logs Feed Container */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-light">
            No audit records matching current query.
          </div>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-surface-border bg-surface-bg/60 hover:bg-surface-bg transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-surface-border flex items-center justify-center text-slate-muted flex-shrink-0 mt-0.5 shadow-xs">
                  <ShieldAlert className="w-4 h-4 text-brand-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-dark text-xs">{log.action}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getModuleBadgeColor(log.module)}`}>
                      {log.module}
                    </span>
                  </div>

                  <p className="text-xs text-slate-dark mt-1 font-medium">
                    {log.description}
                  </p>

                  {/* Diff Inspector if available */}
                  {log.diff && (
                    <div className="mt-2 p-2 rounded-lg bg-white border border-surface-border/80 inline-flex items-center gap-2 text-[11px] font-mono">
                      <span className="text-slate-muted">{log.diff.field}:</span>
                      <span className="px-1.5 py-0.2 rounded bg-accent-rose-light text-accent-rose font-bold">
                        {log.diff.oldValue}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-light" />
                      <span className="px-1.5 py-0.2 rounded bg-accent-mint-light text-accent-mint font-bold">
                        {log.diff.newValue}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actor & Timestamp */}
              <div className="text-right flex-shrink-0 self-end md:self-center">
                <div className="text-xs font-bold text-slate-dark">
                  {log.actorName} <span className="text-slate-muted font-normal">({log.actorRole})</span>
                </div>
                <div className="text-[10px] text-slate-light font-mono mt-0.5 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
