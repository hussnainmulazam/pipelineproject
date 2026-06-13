import React, { useState, useEffect } from 'react';
import { Incident, AgentInfo } from '../types';

interface DashboardViewProps {
  incidents: Incident[];
  agents: AgentInfo[];
  setTab: (tab: string) => void;
  setSelectedIncidentId: (id: string) => void;
}

export default function DashboardView({
  incidents,
  agents,
  setTab,
  setSelectedIncidentId
}: DashboardViewProps) {
  // Compute metrics based on live state
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const redCount = activeIncidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;
  const amberCount = activeIncidents.filter(i => i.severity === 'MEDIUM' || i.severity === 'LOW').length;

  const clusterHealth = Math.max(0, 100 - (activeIncidents.length * 6));

  // Find Investigator and Resolution Agents
  const investigatorAgent = agents.find(a => a.id === 'investigator');
  const resolutionAgent = agents.find(a => a.id === 'resolution');

  // Simulated live console log array for autonomous activity
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing root cause analysis for INC-842...',
    'Querying metrics: payment-service (last 15m)',
    'WARN: Memory spike detected at 10:40:15z',
    'Analyzing stack trace from pod payment-service-deployment-5b9c...',
    'ERROR: OutOfMemoryError in ReportGenerator.java:142',
    'Correlating with recent deployments... Match found (v2.4.1)',
    'Synthesizing mitigation strategy...',
    'Awaiting manual intervention confirmation...'
  ]);

  useEffect(() => {
    // SRE Terminal Simulator appends logs periodically
    const timer = setInterval(() => {
      const extraLogs = [
        'Checking container health indexes...',
        'Running synthetic load test on gateway node...',
        'Inspecting stripe-api fallback caching telemetry...',
        'Trace-lookup: found 0 network losses on redis master',
        'Investigating route rules for authentication microservice...',
        'Vanguard node reporting healthy CPU threshold.',
        'Analyzing latency anomalies in auth-service-v2...',
      ];
      const selected = extraLogs[Math.floor(Math.random() * extraLogs.length)];
      setTerminalLogs(prev => [...prev.slice(-15), selected]);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleIncidentClick = (id: string) => {
    setSelectedIncidentId(id);
    setTab('incidents');
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Top Row Metrics (4 Columns) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-lg">
        {/* Widget: Cluster Health */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex items-center gap-md relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary opacity-5 blur-2xl rounded-full"></div>
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-variant"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              ></path>
              <path
                className={`${clusterHealth > 80 ? 'text-secondary' : clusterHealth > 50 ? 'text-tertiary' : 'text-error'} transition-all duration-500`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${clusterHealth}, 100`}
                strokeLinecap="round"
                strokeWidth="3"
              ></path>
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center font-data-sm text-xs font-bold ${clusterHealth > 80 ? 'text-secondary' : clusterHealth > 50 ? 'text-tertiary' : 'text-error'}`}>
              {clusterHealth}%
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              Cluster Health
            </span>
            <span className="font-headline-md text-xl text-on-surface mt-xs font-bold leading-tight">
              {clusterHealth > 90 ? 'Optimal' : clusterHealth > 70 ? 'Degraded' : 'Critical'}
            </span>
          </div>
        </div>

        {/* Widget: Active Incidents */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-center relative overflow-hidden glow-red">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-error opacity-5 blur-2xl rounded-full"></div>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mb-xs flex items-center gap-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-error pulse-dot"></span>
            Active Incidents
          </span>
          <div className="flex items-baseline gap-md mt-1">
            <div className="flex items-baseline gap-xs">
              <span className="font-display-lg text-3xl font-black text-error font-mono">{redCount}</span>
              <span className="font-label-caps text-[9px] text-error">RED</span>
            </div>
            <div className="w-px h-8 bg-outline-variant"></div>
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-md text-xl text-tertiary font-bold font-mono">{amberCount}</span>
              <span className="font-label-caps text-[9px] text-tertiary">AMB</span>
            </div>
          </div>
        </div>

        {/* Widget: Pod Status */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-center">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-xs">
            Pod Status
          </span>
          <div className="flex flex-col gap-1 font-data-sm text-xs">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Active</span>
              <span className="text-secondary font-bold">142</span>
            </div>
            <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '95%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-on-surface-variant text-[11px]">Pending / Failed</span>
              <span className="text-tertiary font-bold">4 / <span className="text-error">{activeIncidents.length > 0 ? '2' : '0'}</span></span>
            </div>
          </div>
        </div>

        {/* Widget: Agent Status */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col justify-center">
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-xs">
            Agent Status
          </span>
          <div className="flex flex-col gap-1.5 pt-0.5">
            <div className="flex items-center justify-between border border-outline-variant rounded px-2 py-0.5 bg-surface-lowest">
              <div className="flex items-center gap-xs text-[11px]">
                <span className="material-symbols-outlined text-[13px] text-tertiary">search</span>
                <span className="text-on-surface">Investigator</span>
              </div>
              <span className={`font-label-caps text-[9px] px-1.5 py-0.2 rounded font-bold ${
                investigatorAgent?.status === 'BUSY' ? 'text-tertiary bg-tertiary/10 border border-tertiary/20' : 'text-secondary bg-secondary/10 border border-secondary/20'
              }`}>
                {investigatorAgent?.status || 'IDLE'}
              </span>
            </div>
            <div className="flex items-center justify-between border border-outline-variant rounded px-2 py-0.5 bg-surface-lowest">
              <div className="flex items-center gap-xs text-[11px]">
                <span className="material-symbols-outlined text-[13px] text-on-surface-variant">build</span>
                <span className="text-on-surface">Resolution</span>
              </div>
              <span className={`font-label-caps text-[9px] px-1.5 py-0.2 rounded font-bold ${
                resolutionAgent?.status === 'BUSY' ? 'text-tertiary bg-tertiary/10 border border-tertiary/20' : 'text-on-surface-variant bg-surface-variant border border-outline-variant'
              }`}>
                {resolutionAgent?.status || 'IDLE'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section (Split Layout) */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-lg flex-1">
        {/* Left: Live Incident Feed (Spans 8) */}
        <div className="xl:col-span-8 bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden">
          <div className="px-md py-sm border-b border-outline-variant bg-surface-container-highest flex items-center justify-between">
            <h2 className="font-body-lg text-sm font-semibold flex items-center gap-sm text-on-surface">
              <span className="material-symbols-outlined text-error pulse-dot">radio_button_checked</span>
              Live Incident Feed
            </h2>
            <button
              onClick={() => setTab('incidents')}
              className="font-label-caps text-[10px] text-primary hover:text-primary-fixed flex items-center gap-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">filter_list</span> VIEW ALL
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
                  <th className="px-md py-2.5 font-bold">ID</th>
                  <th className="px-md py-2.5 font-bold">Severity</th>
                  <th className="px-md py-2.5 font-bold">Description</th>
                  <th className="px-md py-2.5 font-bold">Affected Service</th>
                  <th className="px-md py-2.5 font-bold">Status</th>
                  <th className="px-md py-2.5 font-bold"></th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-xs divide-y divide-outline-variant">
                {incidents.slice(0, 5).map((inc) => {
                  const isCrucial = inc.severity === 'CRITICAL' || inc.severity === 'HIGH';
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => handleIncidentClick(inc.id)}
                      className={`hover:bg-surface-bright transition-colors cursor-pointer border-l-2 ${
                        inc.status === 'Resolved'
                          ? 'border-l-secondary bg-surface-lowest/40 opacity-70'
                          : inc.severity === 'CRITICAL'
                          ? 'border-l-error bg-error/5'
                          : inc.severity === 'HIGH'
                          ? 'border-l-tertiary bg-tertiary/5'
                          : 'border-l-primary bg-primary/5'
                      }`}
                    >
                      <td className={`px-md py-3 font-mono font-bold ${
                        inc.status === 'Resolved' ? 'text-on-surface-variant' : isCrucial ? 'text-error' : 'text-primary'
                      }`}>
                        {inc.id}
                      </td>
                      <td className="px-md py-3">
                        <span className={`inline-flex items-center gap-xs font-label-caps text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          inc.severity === 'CRITICAL'
                            ? 'text-error bg-error/10 border-error/20'
                            : inc.severity === 'HIGH'
                            ? 'text-tertiary bg-tertiary/10 border-tertiary/20'
                            : inc.severity === 'MEDIUM'
                            ? 'text-primary bg-primary/10 border-primary/20'
                            : 'text-on-surface-variant bg-surface-variant border-outline-variant'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-md py-3 text-on-surface font-semibold max-w-sm truncate" title={inc.description}>
                        {inc.title}
                      </td>
                      <td className="px-md py-3 text-on-surface-variant font-mono text-[11px]">
                        {inc.service}
                      </td>
                      <td className={`px-md py-3 font-medium ${
                        inc.status === 'Resolved'
                          ? 'text-secondary'
                          : inc.status === 'Investigating'
                          ? 'text-tertiary animate-pulse'
                          : 'text-error'
                      }`}>
                        {inc.status}
                      </td>
                      <td className="px-md py-3 text-right">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary">
                          chevron_right
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Autonomous Agent Activity Log (Spans 4) */}
        <div className="xl:col-span-4 border border-outline-variant rounded-lg flex flex-col overflow-hidden relative bg-black">
          {/* Decorative Tech Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #4d8eff 0%, transparent 60%)' }}></div>
          
          <div className="px-md py-sm border-b border-[#27272a] bg-[#09090b]/85 backdrop-blur-sm flex items-center justify-between relative z-10">
            <h2 className="font-body-sm text-xs font-semibold flex items-center gap-sm text-on-surface select-none">
              <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
              Agent Activity Log
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-dot"></span>
          </div>

          {/* Terminal Content */}
          <div className="p-md flex-1 overflow-y-auto font-mono text-[11px] text-on-surface-variant scanline crt-flicker relative z-10 space-y-1.5 max-h-[310px] min-h-[300px] terminal-scroll">
            {terminalLogs.map((log, index) => {
              // Extract timestamp simulation based on indices
              const hr = 10;
              const min = 42;
              const sec = String(index + 1).padStart(2, '0');
              const isError = log.includes('ERROR');
              const isWarn = log.includes('WARN');
              const isSuccess = log.includes('success') || log.includes('Match found') || log.includes('healthy');

              return (
                <div key={index} className="flex gap-sm leading-relaxed items-start">
                  <span className="text-tertiary opacity-70 flex-shrink-0">[{hr}:{min}:{sec}]</span>
                  <span className="text-primary flex-shrink-0">&gt;</span>
                  <span className={isError ? 'text-error font-medium' : isWarn ? 'text-tertiary' : isSuccess ? 'text-secondary' : 'text-on-surface-variant'}>
                    {log}
                  </span>
                </div>
              );
            })}
            <div className="flex gap-sm items-center">
              <span className="text-tertiary opacity-70">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
              <span className="text-primary">&gt;</span>
              <span className="text-secondary animate-pulse font-bold">_</span>
            </div>
          </div>

          {/* Terminal Actions */}
          <div className="p-md border-t border-[#27272a] bg-[#09090b] flex gap-sm relative z-10 mt-auto">
            <button
              onClick={() => setTab('agents')}
              className="flex-1 bg-primary-container hover:bg-primary text-on-primary-container hover:text-white font-label-caps text-[10px] font-bold py-2 rounded transition-colors flex items-center justify-center gap-xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">visibility</span> VIEW DETAILS
            </button>
            <button
              onClick={() => setTab('incidents')}
              className="flex-1 border border-error text-error hover:bg-error/10 font-label-caps text-[10px] font-bold py-2 rounded transition-colors flex items-center justify-center gap-xs glow-red cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">front_hand</span> MANUAL INTERVENE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
