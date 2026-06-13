import React, { useState } from 'react';
import { TopologyNode } from '../types';

interface InfrastructureViewProps {
  nodes: TopologyNode[];
  setNodes: React.Dispatch<React.SetStateAction<TopologyNode[]>>;
}

export default function InfrastructureView({ nodes, setNodes }: InfrastructureViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('worker-01');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Manage custom temporary node popover details
  const activeNode = nodes.find(n => n.id === selectedNodeId);

  // Unprocessed events simulation for SRE list
  const [infraEvents] = useState([
    { time: '10:42:01', level: 'WARN', text: 'Node worker-03 memory pressure high.' },
    { time: '10:45:12', level: 'INFO', text: 'Scaled up replica set auth-service-v2' },
    { time: '10:48:33', level: 'ERR', text: 'Pod payment-db-0 failed readiness probe. Connection refused.' },
    { time: '10:49:05', level: 'ERR', text: 'Restarting container payment-db in pod payment-db-0.' },
    { time: '10:52:10', level: 'INFO', text: 'Successfully pulled image redis:alpine.' }
  ]);

  const toggleNodeSelection = (id: string) => {
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    } else {
      setSelectedNodeId(id);
    }
  };

  const handleTriggerRebalance = (nodeId: string) => {
    // Dynamically adjust CPU / memory load simulate re-allocating
    setNodes(prev =>
      prev.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            cpuLoad: Math.max(10, node.cpuLoad - 25),
            status: 'Healthy'
          };
        }
        return node;
      })
    );
    setSuccessNotice(`SRE Node Load Re-balancer active on ${nodeId}. Spreading workloads...`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="flex-grow flex flex-col xl:flex-row gap-lg h-full animate-fade-in relative max-h-[540px]">
      {/* Dynamic Action Alerts */}
      {successNotice && (
        <div className="fixed bottom-6 right-6 bg-secondary text-background font-bold text-xs px-md py-sm rounded-lg border border-secondary shadow-xl z-50 flex items-center gap-sm">
          <span className="material-symbols-outlined text-[16px] animate-bounce">settings_backup_restore</span>
          <span>{successNotice}</span>
        </div>
      )}

      {/* Topology Graph Canvas Section */}
      <section className="flex-1 flex flex-col bg-[#10131a] rounded-lg border border-outline-variant relative overflow-hidden h-[480px]">
        
        {/* Graph Header */}
        <div className="p-md border-b border-outline-variant bg-surface-container flex justify-between items-center z-10 absolute top-0 w-full select-none">
          <h2 className="font-headline-md text-sm font-semibold text-on-surface">Kubernetes Cluster Topography</h2>
          <div className="flex gap-sm font-label-caps text-[10px] font-bold uppercase select-none">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1"></span> Healthy</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1"></span> Warning</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-error mr-1"></span> Critical</span>
          </div>
        </div>

        {/* Graph Canvas Area Mapping */}
        <div className="flex-1 relative bg-[#09090b] mt-[50px] overflow-hidden select-none">
          {/* Continuous Grid Overlay */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)', backgroundSize: '35px 35px', opacity: 0.15 }}></div>
          
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {/* worker-01 to auth-service */}
            <path d="M 120 200 L 250 110" fill="none" stroke="#424754" strokeWidth="1" />
            {/* worker-01 to payment-db */}
            <path d="M 120 200 L 250 290" fill="none" stroke="#424754" strokeWidth="1" />
            {/* auth-service to gateway-api */}
            <path className="opacity-60" d="M 290 110 L 410 200" fill="none" stroke="#4edea3" strokeDasharray="3" strokeWidth="1.2" />
            {/* payment-db to gateway-api */}
            <p className="opacity-80" />
            <path className="opacity-75" d="M 290 290 L 410 200" fill="none" stroke="#ffb4ab" strokeWidth="1.5" />
          </svg>

          {/* Dynamic Kubernetes Namespace Group label */}
          <div className="absolute top-[50px] left-[190px] w-[310px] h-[280px] border border-outline-variant border-dashed rounded-lg bg-surface-container-highest/5 z-0 p-2 pointer-events-none">
            <span className="font-data-sm text-[9px] text-on-surface-variant bg-surface-lowest px-1.5 py-0.5 rounded border border-outline-variant font-mono">
              ns/production
            </span>
          </div>

          {/* Central vm Node: worker-01 */}
          <div 
            onClick={() => toggleNodeSelection('worker-01')}
            className="absolute top-[160px] left-[70px] w-20 h-20 hex-border-glow-success z-10 cursor-pointer hover:scale-105 transition-all"
          >
            <div className={`w-full h-full hex flex flex-col items-center justify-center border relative ${
              selectedNodeId === 'worker-01' ? 'border-primary bg-primary/20' : 'border-secondary/40 bg-[#181c24]'
            }`}>
              <div className="absolute inset-0 hex bg-secondary opacity-5"></div>
              <span className="material-symbols-outlined text-secondary text-sm mb-xs" style={{ fontVariationSettings: "'FILL' 0" }}>dns</span>
              <span className="font-mono text-[9px] text-on-surface font-semibold">worker-01</span>
            </div>
          </div>

          {/* Option Pod 1: auth-service */}
          <div 
            onClick={() => toggleNodeSelection('auth-service')}
            className="absolute top-[70px] left-[240px] w-14 h-14 hex-border-glow-success z-10 cursor-pointer hover:scale-105 transition-all"
          >
            <div className={`w-full h-full hex flex flex-col items-center justify-center border relative ${
              selectedNodeId === 'auth-service' ? 'border-primary bg-primary/20' : 'border-secondary/40 bg-[#181c24]'
            }`}>
              <div className="absolute inset-0 hex bg-secondary opacity-5"></div>
              <span className="font-mono text-[9px] text-on-surface text-[8.5px] truncate w-10 text-center">auth-srv</span>
            </div>
          </div>

          {/* Option Pod 2: payment-db (Critical alert) */}
          <div 
            onClick={() => toggleNodeSelection('payment-db')}
            className="absolute top-[250px] left-[240px] w-14 h-14 hex-border-glow-error z-10 cursor-pointer hover:scale-105 transition-all animate-pulse"
          >
            <div className={`w-full h-full hex flex flex-col items-center justify-center border relative ${
              selectedNodeId === 'payment-db' ? 'border-primary bg-primary/20 bg-error/30' : 'border-error bg-[#1b1214]'
            }`}>
              <div className="absolute inset-0 hex bg-error opacity-10"></div>
              <span className="font-mono text-[9px] text-error text-[8.5px] font-bold">payment-db</span>
              {/* Pulsing alert indicator on the hex edge */}
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full pulse-dot z-20 translate-x-1 -translate-y-1"></span>
            </div>
          </div>

          {/* Option Pod 3: gateway-api */}
          <div 
            onClick={() => toggleNodeSelection('gateway-api')}
            className="absolute top-[160px] left-[400px] w-14 h-14 hex-border-glow-success z-10 cursor-pointer hover:scale-105 transition-all"
          >
            <div className={`w-full h-full hex flex flex-col items-center justify-center border relative ${
              selectedNodeId === 'gateway-api' ? 'border-primary bg-primary/20' : 'border-secondary/40 bg-[#181c24]'
            }`}>
              <div className="absolute inset-0 hex bg-secondary opacity-5"></div>
              <span className="font-mono text-[9px] text-on-surface text-[8.5px] truncate w-10 text-center">gateway</span>
            </div>
          </div>

          {/* Tonal Node Popover (Dynamically positioned relative to selected state) */}
          {activeNode && (
            <div className="absolute top-[110px] left-[150px] w-60 bg-surface-container-high border border-outline-variant rounded-lg p-sm shadow-2xl z-50 animate-scale-up">
              <div className="flex justify-between items-center border-b border-outline-variant pb-1.5 mb-1.5">
                <span className="font-mono text-xs text-on-surface font-bold">{activeNode.label}</span>
                <span className={`font-label-caps text-[9px] font-bold flex items-center pr-1 ${
                  activeNode.status === 'Critical' ? 'text-error' : 'text-secondary'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1 ${activeNode.status === 'Critical' ? 'bg-error pulse-dot' : 'bg-secondary'}`}></span>
                  {activeNode.status === 'Critical' ? 'CRITICAL ALERT' : 'ONLINE'}
                </span>
              </div>
              
              <div className="space-y-1 text-xs">
                <div>
                  <div className="flex justify-between font-mono text-[10px] mb-0.5">
                    <span className="text-on-surface-variant">CPU Load factor</span>
                    <span className="text-on-surface">{activeNode.cpuLoad}%</span>
                  </div>
                  <div className="w-full bg-black h-1 rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${activeNode.cpuLoad > 80 ? 'bg-error' : 'bg-primary'}`} 
                      style={{ width: `${activeNode.cpuLoad}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[10px] mb-0.5">
                    <span className="text-on-surface-variant">Allocated Memory</span>
                    <span className="text-on-surface">{activeNode.memoryUsed} / {activeNode.memoryTotal} GB</span>
                  </div>
                  <div className="w-full bg-black h-1 rounded overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all duration-500" 
                      style={{ width: `${(activeNode.memoryUsed / activeNode.memoryTotal) * 100}%` }}
                    />
                  </div>
                </div>

                {activeNode.status === 'Critical' && (
                  <button
                    onClick={() => handleTriggerRebalance(activeNode.id)}
                    className="mt-2.5 w-full bg-error/15 border border-error/30 text-error hover:bg-error/25 font-label-caps text-[9px] font-bold py-1 rounded transition-colors text-center cursor-pointer active:scale-95"
                  >
                    TRIGGER RE-BALANCE LOAD
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Side Panel: Topology Summary & Issue Feeds */}
      <aside className="w-full xl:w-80 flex flex-col gap-md select-none shrink-0 h-[480px]">
        {/* Quick Health Summary */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-md">
          <h3 className="font-headline-md text-xs font-bold text-on-surface border-b border-outline-variant pb-sm mb-sm uppercase tracking-wide">
            Quick Summary
          </h3>
          <div className="grid grid-cols-2 gap-sm">
            <div className="bg-black p-sm rounded border border-outline-variant text-center">
              <span className="font-label-caps text-[9px] text-on-surface-variant block mb-1">Total Cluster Nodes</span>
              <span className="font-mono text-sm font-semibold text-on-surface">12</span>
            </div>
            <div className="bg-black p-sm rounded border border-outline-variant text-center">
              <span className="font-label-caps text-[9px] text-on-surface-variant block mb-1">Total Running Pods</span>
              <span className="font-mono text-sm font-semibold text-on-surface">148</span>
            </div>
          </div>
        </div>

        {/* Unhealthy Deployments & Timeline snippet */}
        <div className="bg-surface-container border border-error/20 rounded-lg flex-1 flex flex-col overflow-hidden">
          <div className="p-md border-b border-error/20 bg-error-container/10">
            <h3 className="font-headline-lg-mobile text-xs font-bold text-error flex items-center gap-xs uppercase tracking-wide">
              <span className="material-symbols-outlined text-sm">error</span>
              Critical Cluster Issues
            </h3>
          </div>
          
          <div className="p-sm flex-1 overflow-y-auto space-y-sm terminal-scroll bg-[#151213]">
            {/* Issue Alert Item */}
            <div className="bg-black border border-error/35 p-sm rounded-lg relative overflow-hidden group hover:border-error transition-colors">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-error"></div>
              <div className="pl-xs text-xs">
                <span className="font-label-caps text-[9px] text-error bg-error/15 px-1.5 rounded py-0.5 inline-block mb-1 border border-error/20 font-bold uppercase">
                  deployment.apps
                </span>
                <h4 className="font-mono text-[11px] text-on-surface font-bold truncate">payment-statefulset</h4>
                <p className="font-serif text-[10px] text-on-surface-variant mt-1 leading-normal font-mono">
                  CrashLoopBackOff: back-off 5m0s restarting failed container=payment-db
                </p>
              </div>
            </div>

            {/* Event Terminals list */}
            <div className="bg-black border border-outline-variant p-sm rounded-lg">
              <span className="font-label-caps text-[9px] text-on-surface-variant block font-bold border-b border-outline-variant pb-1 mb-1 shadow-sm select-none">
                RECENT TOPOLOGY EVENTS
              </span>
              <div className="font-mono text-[9px] leading-relaxed text-on-surface-variant space-y-1 h-32 overflow-y-auto terminal-scroll py-1 select-none">
                {infraEvents.map((evt, idx) => {
                  const isErr = evt.level === 'ERR';
                  const isWarn = evt.level === 'WARN';
                  return (
                    <div key={idx} className="flex gap-1 items-start leading-tight">
                      <span className="text-[#3b5272] shrink-0">[{evt.time}]</span>
                      <span className={isErr ? 'text-error font-semibold' : isWarn ? 'text-tertiary font-semibold' : 'text-secondary'}>
                        {evt.level}
                      </span>
                      <span className="text-[#a1a1aa]">{evt.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </aside>
    </div>
  );
}
