import React, { useState } from 'react';

interface SettingsViewProps {
  logsRate: number;
  setLogsRate: (rate: number) => void;
  systemAlias: string;
  setSystemAlias: (alias: string) => void;
}

export default function SettingsView({
  logsRate,
  setLogsRate,
  systemAlias,
  setSystemAlias
}: SettingsViewProps) {
  const [replicationFactor, setReplicationFactor] = useState(12);
  const [verbosity, setVerbosity] = useState('INFO');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessToast("SRE Vanguard-1 Node config synchronized with master registry!");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="max-w-2xl bg-surface-container border border-outline-variant rounded-lg p-lg space-y-lg animate-fade-in mx-auto select-none">
      {/* Toast Notifier */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-secondary text-background font-semibold text-xs px-md py-sm rounded border border-secondary shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">cloud_done</span>
          <span>{successToast}</span>
        </div>
      )}

      <div>
        <h2 className="font-headline-md text-sm font-bold text-primary uppercase tracking-wider border-b border-outline-variant pb-xs mb-sm">
          Vanguard Global Parameters
        </h2>
        <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
          Configure administrative telemetry intervals, node replicas, and model security constraints.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-md font-sans text-xs">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Operator Profile Alias</label>
            <input
              type="text"
              value={systemAlias}
              onChange={(e) => setSystemAlias(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded px-sm py-1.5 focus:outline-none focus:border-primary text-on-surface text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Log Stream Verbosity</label>
            <select
              value={verbosity}
              onChange={(e) => setVerbosity(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded px-sm py-1.5 focus:outline-none focus:border-primary text-on-surface text-xs"
            >
              <option value="INFO">INFO (Normal logging level)</option>
              <option value="DBUG">DBUG (Verbose telemetry diagnostic logs)</option>
              <option value="WARN">WARN (Only warn/error indices)</option>
              <option value="ERR">ERR (Exclusively critical exceptions)</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Cluster Partition Replicas</label>
            <input
              type="number"
              min="1"
              max="64"
              value={replicationFactor}
              onChange={(e) => setReplicationFactor(parseInt(e.target.value))}
              className="w-full bg-surface border border-outline-variant rounded px-sm py-1.5 focus:outline-none focus:border-primary text-on-surface text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Simulated Log Stream Interval</label>
            <select
              value={logsRate}
              onChange={(e) => setLogsRate(parseFloat(e.target.value))}
              className="w-full bg-surface border border-outline-variant rounded px-sm py-1.5 focus:outline-none focus:border-primary text-on-surface text-xs"
            >
              <option value="3000">3 Seconds (Fast simulation load)</option>
              <option value="4500">4.5 Seconds (Recommended standard rate)</option>
              <option value="8000">8 Seconds (Eco saver data consumption)</option>
              <option value="999999">Disable Simulation (Pause live tail feeds)</option>
            </select>
          </div>
        </div>

        {/* Credentials Security Warning card */}
        <div className="border border-outline border-opacity-35 p-sm bg-surface-lowest rounded-lg flex gap-md select-none">
          <span className="material-symbols-outlined text-tertiary text-lg shrink-0 mt-0.5">shield_lock</span>
          <div className="text-[11px]">
            <h4 className="font-bold text-on-surface mb-0.5 uppercase tracking-wide">Developer Secrets Infrastructure</h4>
            <p className="text-on-surface-variant leading-relaxed">
              If integrating real-time LLM remediation summarizers, define <code className="text-tertiary bg-surface-dim font-mono px-1 rounded">GEMINI_API_KEY</code> within the AI Studio Secrets Panel. This workspace runs on server-side sandboxes, completely masking keys from the client iframe viewport.
            </p>
          </div>
        </div>

        {/* Form buttons */}
        <div className="flex gap-sm pt-sm border-t border-outline-variant select-none">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-container text-on-primary-container hover:text-white font-bold py-2 rounded transition-all cursor-pointer text-xs"
          >
            Save Operator Configurations
          </button>
        </div>
      </form>
    </div>
  );
}
