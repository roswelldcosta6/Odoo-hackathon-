import React, { useState } from 'react';
import {
  Settings,
  Building,
  ShieldCheck,
  Wifi,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

export const SettingsView: React.FC = () => {
  const { currentRole, addAuditLog } = useHRMS();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    companyName: 'Dayflow Technologies Inc.',
    domain: '@dayflow.io',
    officeIp: '192.168.1.0/24',
    workingHoursPerDay: 8,
    lateThreshold: '09:30 AM',
    bandwidthThreshold: 40,
    enableGeminiAI: true,
    enableGeoFencing: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    addAuditLog('SETTINGS_SAVED', 'SYSTEM', 'Updated system-wide HRMS configuration');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-dark tracking-tight">
            System & Organization Settings
          </h2>
          <p className="text-xs text-slate-muted mt-0.5">
            Configure enterprise parameters, biometric IP rules, and AI Copilot policies
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-brand-light text-brand-blue text-xs font-bold">
          Master Config
        </span>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        {/* Card 1: Enterprise Profile & Workweek */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Building className="w-4 h-4 text-brand-blue" />
            <h3 className="font-extrabold text-slate-dark text-sm">Company Parameters</h3>
          </div>

          <div>
            <label className="block font-bold text-slate-dark mb-1">Company Legal Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 text-slate-dark font-medium focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-dark mb-1">Corporate Domain</label>
            <input
              type="text"
              value={settings.domain}
              onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
              className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 font-mono text-slate-dark focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-dark mb-1">Daily Target Hours</label>
              <input
                type="number"
                value={settings.workingHoursPerDay}
                onChange={(e) => setSettings({ ...settings, workingHoursPerDay: Number(e.target.value) })}
                className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 font-mono text-slate-dark focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-dark mb-1">Late Check-In Cutoff</label>
              <input
                type="text"
                value={settings.lateThreshold}
                onChange={(e) => setSettings({ ...settings, lateThreshold: e.target.value })}
                className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 font-mono text-slate-dark focus:border-brand-blue focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Security & Geofence Policy */}
        <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
            <Wifi className="w-4 h-4 text-accent-cyan" />
            <h3 className="font-extrabold text-slate-dark text-sm">Geofencing & Network Tagging</h3>
          </div>

          <div>
            <label className="block font-bold text-slate-dark mb-1">Authorized Office IP Subnet</label>
            <input
              type="text"
              value={settings.officeIp}
              onChange={(e) => setSettings({ ...settings, officeIp: e.target.value })}
              className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 font-mono text-slate-dark focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-dark mb-1">
              Leave Collision Trigger Threshold (% of Dept on Leave)
            </label>
            <input
              type="number"
              value={settings.bandwidthThreshold}
              onChange={(e) => setSettings({ ...settings, bandwidthThreshold: Number(e.target.value) })}
              className="w-full bg-surface-bg border border-surface-border rounded-xl p-2.5 font-mono text-slate-dark focus:border-brand-blue focus:outline-none"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableGeminiAI}
                onChange={(e) => setSettings({ ...settings, enableGeminiAI: e.target.checked })}
                className="rounded text-brand-blue"
              />
              <span className="font-bold text-slate-dark">Enable Dayflow AI Copilot in employee self-service</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableGeoFencing}
                onChange={(e) => setSettings({ ...settings, enableGeoFencing: e.target.checked })}
                className="rounded text-brand-blue"
              />
              <span className="font-bold text-slate-dark">Enforce Network Geofence IP verification on punch-in</span>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="lg:col-span-2 bg-white border border-surface-border rounded-2xl p-4 px-6 flex items-center justify-between">
          <span className="text-xs text-slate-light">
            {saved ? (
              <span className="text-accent-mint font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
              </span>
            ) : (
              'Changes require Admin authorization'
            )}
          </span>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-hover text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
