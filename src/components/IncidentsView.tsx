import React, { useState } from 'react';
import { Incident, Severity, IncidentStatus, TimelineStep } from '../types';
import { TIMELINE_INC_4092 } from '../data/mockData';

interface IncidentsViewProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
}

export default function IncidentsView({
  incidents,
  setIncidents,
  selectedIncidentId,
  setSelectedIncidentId
}: IncidentsViewProps) {
  // Filters State
  const [filterSeverity, setFilterSeverity] = useState<string>('Severity: All');
  const [filterStatus, setFilterStatus] = useState<string>('Status: Active');
  const [filterService, setFilterService] = useState<string>('Service: All');

  // Modal State for New Incident Creator
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newService, setNewService] = useState('payment-gateway');
  const [newSeverity, setNewSeverity] = useState<Severity>('CRITICAL');
  const [newTrigger, setNewTrigger] = useState('p99 > 2.5s');
  const [newDesc, setNewDesc] = useState('');

  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Remediation complete state for current incident
  const [completedRemediations, setCompletedRemediations] = useState<Record<string, boolean>>({});

  // Dynamic lists of unique options for Filters
  const servicesList = ['Service: All', ...Array.from(new Set(incidents.map(i => i.service)))];

  // Apply filters
  const filteredIncidents = incidents.filter((inc) => {
    // Severity Filter
    if (filterSeverity !== 'Severity: All') {
      const targetSev = filterSeverity.toUpperCase();
      if (inc.severity !== targetSev) return false;
    }
    // Status Filter
    if (filterStatus !== 'Status: All') {
      if (filterStatus === 'Status: Active' && inc.status === 'Resolved') return false;
      if (filterStatus === 'Status: Resolved' && inc.status !== 'Resolved') return false;
      if (filterStatus === 'Status: Investigating' && inc.status !== 'Investigating') return false;
    }
    // Service Filter
    if (filterService !== 'Service: All') {
      if (inc.service !== filterService) return false;
    }
    return true;
  });

  // Select incident
  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || filteredIncidents[0] || incidents[0];

  const handleExecuteRemediation = (incidentId: string) => {
    // Update incident list to Resolved
    setIncidents(prev =>
      prev.map(i => (i.id === incidentId ? { ...i, status: 'Resolved' } : i))
    );
    // Mark as remediated locally to update timeline visual details
    setCompletedRemediations(prev => ({ ...prev, [incidentId]: true }));
    
    // Trigger SRE notification
    setToastMessage(`Remediation successfully deployed for ${incidentId}! Systems reverting to nominal status.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const submitNewIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const mockId = `INC-${Math.floor(1000 + Math.random() * 8999)}`;
    const createdIncident: Incident = {
      id: mockId,
      severity: newSeverity,
      service: newService,
      title: newTitle,
      trigger: newTrigger,
      age: 'Just now',
      status: 'Active',
      description: newDesc || `${newTitle} anomaly reported via dynamic SRE telemetry trigger.`
    };

    setIncidents(prev => [createdIncident, ...prev]);
    setSelectedIncidentId(mockId);
    setIsCreatorOpen(false);

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewTrigger('p99 > 2.5s');

    setToastMessage(`Incident ${mockId} spawned successfully. Investigative agents dispatched.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Timeline template generator for chosen incident
  const getTimelineSteps = (inc: Incident): TimelineStep[] => {
    const isCompleted = completedRemediations[inc.id] || inc.status === 'Resolved';
    
    // Custom trace logs based on service
    let clusterLogs = `Analyzing log stream: ${inc.service}...
[ERROR] ThreadPool timeout on remote call to dependency layer.
[WARN]  Socket throughput dropped below critical 10KB/s threshold.
>> Analysis: Resource starvation. Consider connection enlargement.`;

    if (inc.service === 'payment-gateway') {
      clusterLogs = `Analyzing log stream: payment-gateway...
[ERROR] 10:42:10 Connection timeout to external service: api.stripe.com/v1/charges
[WARN]  10:42:11 Circuit breaker 'stripe-cb' opened.
>> Analysis: External dependency timeout causing thread exhaustion.`;
    } else if (inc.service === 'payment-service') {
      clusterLogs = `Analyzing logs of postgres-replica-01...
[FATAL] OutOfMemoryError: Java heap space.
[WARN]  Query caching allocation spiked to 98% heap.
>> Analysis: Primary database node crashed under heap exhaustion.`;
    }

    return [
      {
        id: '1',
        title: `Alert Fired: ${inc.trigger}`,
        timestamp: '10:42:01 UTC',
        status: 'fired'
      },
      {
        id: '2',
        title: 'AIOps Agent Alpha Assigned',
        timestamp: '10:42:05 UTC',
        status: 'assigned',
        icon: 'smart_toy'
      },
      {
        id: '3',
        title: 'Root Cause Identified',
        timestamp: '10:42:15 UTC',
        status: 'identified',
        icon: 'search',
        logsTerminal: clusterLogs
      },
      {
        id: '4',
        title: isCompleted 
          ? 'Remediation Succeeded: Pool size escalated, fallback cache enabled'
          : 'Fix Proposed: Increase connection pool / Enable fallback cache',
        timestamp: '10:42:18 UTC',
        status: 'proposed',
        codeDiff: {
          file: 'config/gateway.yaml',
          original: ['- pool_size: 50'],
          modified: ['+ pool_size: 200', '+ fallback_cache: true']
        }
      },
      {
        id: '5',
        title: isCompleted ? 'Verification: SYSTEM SAFE' : 'Verification',
        timestamp: isCompleted ? 'Completed just now' : 'Awaiting Remediation',
        status: isCompleted ? 'fired' : 'pending'
      }
    ];
  };

  return (
    <div className="flex flex-col gap-lg h-full animate-fade-in relative">
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-secondary text-on-secondary-container px-md py-sm rounded-lg border border-secondary-container shadow-[0_0_15px_rgba(78,222,163,0.3)] z-50 flex items-center gap-sm font-semibold max-w-sm">
          <span className="material-symbols-outlined text-[18px] animate-bounce">check_circle</span>
          <span className="text-xs leading-tight">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-2xl font-black text-on-surface">Incident Management</h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-none">
            Monitor, triage, and execute automated remediations on cluster anomalies.
          </p>
        </div>
        <div className="flex gap-sm">
          <button 
            onClick={() => setToastMessage("Incident manifest metadata exported securely to clipboard.")}
            className="bg-surface-variant text-on-surface font-body-sm text-xs px-md py-sm rounded border border-outline-variant hover:bg-surface-bright transition-colors flex items-center gap-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-xs">download</span> Export
          </button>
          <button 
            onClick={() => setIsCreatorOpen(true)}
            className="bg-primary text-on-primary font-body-sm text-xs font-semibold px-md py-sm rounded hover:bg-primary-container transition-colors flex items-center gap-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-xs">add</span> New Incident
          </button>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-12 gap-gutter flex-1 min-h-[500px]">
        {/* Left Side: Table View (Spans 7 cols) */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-sm bg-surface-container border border-outline-variant rounded-lg overflow-hidden h-[540px]">
          {/* Table Filters */}
          <div className="p-sm bg-surface-container-highest border-b border-outline-variant flex flex-wrap gap-sm items-center justify-between select-none">
            <div className="flex gap-sm flex-wrap">
              {/* Severity Filter */}
              <select 
                value={filterSeverity} 
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-surface-dim border border-outline-variant text-on-surface font-body-sm text-xs rounded py-1 px-2 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option>Severity: All</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              {/* Status Filter */}
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-surface-dim border border-outline-variant text-on-surface font-body-sm text-xs rounded py-1 px-2 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option>Status: All</option>
                <option>Status: Active</option>
                <option>Status: Investigating</option>
                <option>Status: Resolved</option>
              </select>

              {/* Service Filter */}
              <select 
                value={filterService} 
                onChange={(e) => setFilterService(e.target.value)}
                className="bg-surface-dim border border-outline-variant text-on-surface font-body-sm text-xs rounded py-1 px-2 focus:ring-primary focus:border-primary cursor-pointer maxLength-[120px]"
              >
                {servicesList.map((svc, sIdx) => (
                  <option key={sIdx} value={svc}>{svc}</option>
                ))}
              </select>
            </div>
            
            <div className="text-on-surface-variant font-mono text-[11px]">
              Showing {filteredIncidents.length} of {incidents.length} anomalies
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-y-auto flex-1 terminal-scroll">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-24">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-pulse mb-3">
                  check_circle_outline
                </span>
                <p className="font-body-lg text-sm text-on-surface-variant">
                  Zero incidents match current filters. Systems nominal!
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-15 select-none">
                  <tr className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">
                    <th className="py-2.5 px-md">ID</th>
                    <th className="py-2.5 px-md">Severity</th>
                    <th className="py-2.5 px-md">Service</th>
                    <th className="py-2.5 px-md">Anomaly</th>
                    <th className="py-2.5 px-md">Trigger</th>
                    <th className="py-2.5 px-md text-right">Age</th>
                  </tr>
                </thead>
                <tbody className="font-data-sm text-[11px] divide-y divide-outline-variant select-none">
                  {filteredIncidents.map((inc) => {
                    const isSelected = selectedIncident?.id === inc.id;
                    const isCompleted = inc.status === 'Resolved';
                    return (
                      <tr 
                        key={inc.id}
                        onClick={() => setSelectedIncidentId(inc.id)}
                        className={`cursor-pointer hover:bg-surface-bright transition-all ${
                          isSelected 
                            ? 'bg-surface-container-high border-l-2 border-primary' 
                            : 'border-l-2 border-l-transparent'
                        }`}
                      >
                        <td className={`py-3 px-md font-bold font-mono ${isCompleted ? 'text-on-surface-variant' : 'text-primary'}`}>
                          #{inc.id}
                        </td>
                        <td className="py-3 px-md">
                          <div className="flex items-center gap-xs">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isCompleted 
                                ? 'bg-secondary' 
                                : inc.severity === 'CRITICAL'
                                ? 'bg-error pulse-dot'
                                : inc.severity === 'HIGH'
                                ? 'bg-tertiary pulse-dot'
                                : 'bg-primary'
                            }`}></span>
                            <span className={`${
                              isCompleted ? 'text-secondary' : inc.severity === 'CRITICAL' ? 'text-error' : inc.severity === 'HIGH' ? 'text-tertiary' : 'text-primary'
                            } font-semibold font-sans capitalize text-xs`}>
                              {isCompleted ? 'Resolved' : inc.severity.toLowerCase()}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-md text-on-surface-variant font-mono text-[10px] truncate max-w-[120px]" title={inc.service}>
                          {inc.service}
                        </td>
                        <td className="py-3 px-md text-on-surface font-semibold max-w-[180px] truncate" title={inc.title}>
                          {inc.title}
                        </td>
                        <td className="py-3 px-md text-on-surface-variant font-mono">
                          {inc.trigger}
                        </td>
                        <td className="py-3 px-md text-right text-on-surface-variant">
                          {inc.age}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Side: Drill-Down Panel (Spans 5 cols) */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-sm h-[540px]">
          {selectedIncident ? (
            <>
              {/* Drilldown Header Card */}
              <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex flex-col gap-sm relative overflow-hidden shrink-0">
                {selectedIncident.status !== 'Resolved' && selectedIncident.severity === 'CRITICAL' && (
                  <div className="absolute inset-0 bg-error/5 pointer-events-none"></div>
                )}
                
                <div className="flex justify-between items-start relative z-10 w-full">
                  <div>
                    <div className="flex items-center gap-sm mb-1">
                      <span className={`font-label-caps text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        selectedIncident.status === 'Resolved'
                          ? 'bg-secondary/10 border-secondary/20 text-secondary'
                          : selectedIncident.severity === 'CRITICAL'
                          ? 'bg-error/10 border-error/20 text-error'
                          : 'bg-tertiary/10 border-tertiary/20 text-tertiary'
                      }`}>
                        {selectedIncident.status === 'Resolved' ? 'Resolved' : selectedIncident.severity}
                      </span>
                      <span className="font-mono text-xs text-on-surface-variant">#{selectedIncident.id}</span>
                    </div>
                    <h3 className="font-display-lg text-sm font-semibold text-on-surface tracking-tight leading-tight select-none">
                      {selectedIncident.title}
                    </h3>
                    <div className="font-mono text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-1">
                      <span className="material-symbols-outlined text-[12px]">hub</span>
                      {selectedIncident.service}
                    </div>
                  </div>
                  <button 
                    onClick={() => setToastMessage(`External trace report dispatched for ${selectedIncident.id}`)}
                    className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-variant"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-sm border-t border-outline-variant pt-sm relative z-10">
                  <div className="flex items-center gap-2 select-none">
                    <img
                      alt="Agent AI Face"
                      className="w-6 h-6 rounded-full border border-secondary"
                      referrerPolicy="no-referrer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfzBRAkPTDn3hVly8o-SI_ui6ud29WNGQa8m4aeH1pccohOt8ujUuSqL3rWk85TOrJsBuUTW0Ar5CmSRRYybFRek4fjH-cu6T5dwdcZApoZnUnNt6RXlqqUWeIKwRZAhqcBqwFKqr9kckyUFlyeVD2NtehLv9kHj8rHAQtNZVc6kEADrUzYVXLR8ARSpJHL-P7hpCHMugkN9mWsvOJN2Mod46c5u68ot2lL5oG-jcrqyHtA19GjC6whswP74iA25CLd8biUQSsgg"
                    />
                    <span className="font-body-sm text-xs text-on-surface">
                      Assigned: <span className="text-secondary font-medium">Agent Alpha (Auto)</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setToastMessage(`Acknowledge signature registered: ${selectedIncident.id}`)}
                    className="bg-surface-variant text-on-surface text-xs font-bold border border-outline-variant px-3 py-1 rounded hover:bg-surface-bright active:scale-95 transition-all cursor-pointer"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>

              {/* Status Timeline Container */}
              <div className="bg-surface-container border border-outline-variant rounded-lg p-md flex-1 overflow-y-auto terminal-scroll shadow-inner">
                <h4 className="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-md flex items-center gap-2 select-none">
                  <span className="material-symbols-outlined text-[14px]">timeline</span> RESOLUTION TIMELINE
                </h4>
                
                <div className="relative pl-4 space-y-4 before:absolute before:inset-y-0 before:left-[7px] before:w-px before:bg-outline-variant">
                  {getTimelineSteps(selectedIncident).map((step) => {
                    const isFired = step.status === 'fired';
                    const isAssigned = step.status === 'assigned';
                    const isIdentified = step.status === 'identified';
                    const isProposed = step.status === 'proposed';
                    const isPending = step.status === 'pending';

                    return (
                      <div key={step.id} className="relative">
                        {/* Timeline Circle Node Icon */}
                        <div className={`absolute -left-[20px] w-4 h-4 rounded-full border-2 border-[#10131a] flex items-center justify-center z-10 ${
                          isFired 
                            ? 'bg-error'
                            : isAssigned
                            ? 'bg-secondary'
                            : isIdentified
                            ? 'bg-primary'
                            : isProposed
                            ? 'bg-tertiary'
                            : 'bg-surface-variant'
                        }`}>
                          {isAssigned && (
                            <span className="material-symbols-outlined text-[10px] text-background font-bold">smart_toy</span>
                          )}
                          {isIdentified && (
                            <span className="material-symbols-outlined text-[10px] text-background font-bold">search</span>
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="font-body-sm text-xs text-on-surface font-semibold select-none leading-none">
                          {step.title}
                        </div>
                        <div className="font-data-sm text-[10px] text-on-surface-variant mt-0.5 leading-none">
                          {step.timestamp}
                        </div>

                        {/* Inner context payload log preview */}
                        {isIdentified && step.logsTerminal && (
                          <div className="bg-black rounded border border-outline-variant p-2 font-mono text-[10px] overflow-x-auto mt-2 text-on-surface">
                            {step.logsTerminal.split('\n').map((line, lIdx) => {
                              const isErrLine = line.includes('[ERROR]');
                              const isWarnLine = line.includes('[WARN]');
                              const isAnalyzeLine = line.includes('>>');
                              return (
                                <div 
                                  key={lIdx} 
                                  className={isErrLine ? 'text-error' : isWarnLine ? 'text-tertiary' : isAnalyzeLine ? 'text-primary font-bold' : 'text-on-surface-variant'}
                                >
                                  {line}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Configuration diff and execute option */}
                        {isProposed && step.codeDiff && (
                          <div className="mt-2 space-y-2">
                            <div className="bg-black rounded border border-outline-variant overflow-hidden font-mono text-[10px]">
                              <div className="bg-surface-container-high px-2 py-1 border-b border-outline-variant text-[9px] text-on-surface-variant font-bold uppercase select-none">
                                {step.codeDiff.file}
                              </div>
                              <div className="p-2 space-y-0.5 whitespace-pre">
                                {step.codeDiff.original.map((orig, oIdx) => (
                                  <div key={oIdx} className="text-error bg-error/10 px-1 select-none">{orig}</div>
                                ))}
                                {step.codeDiff.modified.map((mod, mIdx) => (
                                  <div key={mIdx} className="text-secondary bg-secondary/10 px-1 select-none">{mod}</div>
                                ))}
                              </div>
                            </div>
                            
                            {selectedIncident.status !== 'Resolved' ? (
                              <button
                                onClick={() => handleExecuteRemediation(selectedIncident.id)}
                                className="bg-primary/10 text-primary border border-primary/30 font-label-caps text-[10px] py-1.5 rounded hover:bg-primary/20 transition-all w-full text-center cursor-pointer font-bold select-none active:scale-98"
                              >
                                EXECUTE REMEDIATION
                              </button>
                            ) : (
                              <div className="bg-secondary/10 text-secondary border border-secondary/20 font-label-caps text-[9px] py-1 rounded w-full text-center font-bold uppercase select-none">
                                Remediation Applied Successfully
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-surface-container border border-outline-variant rounded-lg p-md text-center py-20 flex-1 flex flex-col justify-center items-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant animate-pulse mb-2">dashboard</span>
              <p className="font-body-sm text-xs text-on-surface-variant">Select an anomaly to inspect timeline root causes</p>
            </div>
          )}
        </div>
      </div>

      {/* New Incident Creator Modal Popup */}
      {isCreatorOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container border border-outline-variant rounded-lg w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="px-md py-sm bg-surface-container-highest border-b border-outline-variant flex justify-between items-center select-none">
              <span className="font-body-lg text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">add_alert</span>
                Declare Core System Anomaly
              </span>
              <button 
                onClick={() => setIsCreatorOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <form onSubmit={submitNewIncident} className="p-md space-y-md font-sans">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Anomaly Headline</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant rounded px-sm py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  placeholder="e.g. Memory Spike or Database Dropout"
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as Severity)}
                    className="w-full bg-surface-dim border border-outline-variant rounded px-sm py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Affected Gateway</label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full bg-surface-dim border border-outline-variant rounded px-sm py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="payment-gateway">payment-gateway</option>
                    <option value="auth-service-v2">auth-service-v2</option>
                    <option value="ingress-controller">ingress-controller</option>
                    <option value="database-cluster-0">database-cluster-0</option>
                    <option value="metrics-scraper">metrics-scraper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Trigger Conditional Expression</label>
                <input
                  type="text"
                  required
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant rounded px-sm py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary font-mono text-[11px]"
                  placeholder="e.g. rate > 5% or latency > 1.5s"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Telemetry Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant rounded px-sm py-1.5 text-xs text-on-surface h-16 focus:outline-none focus:border-primary"
                  placeholder="Detail the anomalous thread context or stack trace failures..."
                />
              </div>

              <div className="flex gap-sm pt-sm border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsCreatorOpen(false)}
                  className="flex-1 border border-outline-variant text-on-surface py-2 rounded text-xs hover:bg-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-on-primary font-semibold py-2 rounded text-xs hover:bg-primary-container transition-all"
                >
                  Declare Critical Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
