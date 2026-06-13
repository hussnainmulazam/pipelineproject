import React, { useState } from 'react';
import { AgentInfo, AgentStatus } from '../types';

interface AgentsViewProps {
  agents: AgentInfo[];
  setAgents: React.Dispatch<React.SetStateAction<AgentInfo[]>>;
}

export default function AgentsView({ agents, setAgents }: AgentsViewProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('investigator');
  const [editorText, setEditorText] = useState<string>('');
  const [notifyCommit, setNotifyCommit] = useState<string | null>(null);

  // Active agent object
  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Sync editor text state on change of selected agent
  React.useEffect(() => {
    if (activeAgent) {
      setEditorText(activeAgent.systemDirective);
    }
  }, [selectedAgentId, activeAgent]);

  const handleParamChange = (param: 'temperature' | 'maxTokens', value: number) => {
    setAgents(prev =>
      prev.map(a => (a.id === selectedAgentId ? { ...a, [param]: value } : a))
    );
  };

  const handleDirectiveChange = (newVal: string) => {
    setEditorText(newVal);
    setAgents(prev =>
      prev.map(a => (a.id === selectedAgentId ? { ...a, systemDirective: newVal } : a))
    );
  };

  const handleCommit = () => {
    setNotifyCommit(`Pushing SRE system directives for ${activeAgent.name} (Model: ${activeAgent.model})...`);
    
    // Simulate compilation
    setTimeout(() => {
      setNotifyCommit(`SUCCESS: Configuration deployed and active on Vanguard-1 Node. Uptime: ${activeAgent.uptime}`);
    }, 1500);

    setTimeout(() => {
      setNotifyCommit(null);
    }, 6000);
  };

  const handleAgentCardClick = (id: string) => {
    setSelectedAgentId(id);
  };

  return (
    <div className="flex flex-col gap-lg h-full animate-fade-in pb-4">
      {/* Page Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-2xl font-black text-on-background">Agent Operations &amp; Configuration</h1>
          <p className="font-body-sm text-xs text-on-surface-variant mt-xs leading-none">
            Monitor autonomous fleet SRE performance indices and customize prompt weights.
          </p>
        </div>
        <div className="flex gap-sm">
          <button 
            onClick={() => setNotifyCommit("Audit logs of Agent Alpha configuration: 2 commits in last 24h by SysAdmin_01.")}
            className="flex items-center gap-xs px-md py-sm border border-outline-variant rounded text-on-surface font-body-sm text-xs hover:bg-surface-variant transition-colors cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">history</span> View Audit Log
          </button>
          <button 
            onClick={() => {
              setNotifyCommit("Spawning a new autonomous validator agent. Distributing weights...");
              setTimeout(() => setNotifyCommit("SUCCESS: New AIOps LogGuard Agent initialized and waiting on cluster idle loop."), 2000);
            }}
            className="flex items-center gap-xs px-md py-sm bg-primary-container text-on-primary-container hover:bg-primary border border-primary-container rounded font-body-sm text-xs font-semibold hover:text-white transition-all shadow-[0_0_8px_rgba(77,142,255,0.2)] cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span> Deploy Agent
          </button>
        </div>
      </header>

      {/* Dynamic Status Notifications */}
      {notifyCommit && (
        <div className={`p-sm rounded-lg border text-xs font-semibold animate-pulse shadow-sm flex items-center gap-sm ${
          notifyCommit.includes('SUCCESS') 
            ? 'bg-secondary/10 border-secondary/30 text-secondary' 
            : 'bg-primary/10 border-primary/30 text-primary'
        }`}>
          <span className="material-symbols-outlined text-[16px] animate-bounce">
            {notifyCommit.includes('SUCCESS') ? 'check_circle' : 'hourglass_top'}
          </span>
          <span>{notifyCommit}</span>
        </div>
      )}

      {/* Top Section: Agent Cards (Row of 3) */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-lg select-none">
        {agents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          const isIdle = agent.status === 'IDLE';
          const isBusy = agent.status === 'BUSY';
          const isFailed = agent.status === 'FAILED';

          let statusTheme = 'text-primary bg-primary/10 border-primary/20';
          let borderGlow = '';
          if (isBusy) {
            statusTheme = 'text-tertiary bg-tertiary/10 border-tertiary/20';
            borderGlow = 'glow-border-active border-tertiary';
          } else if (isFailed) {
            statusTheme = 'text-error bg-error/10 border-error/20';
            borderGlow = 'glow-border-critical border-error';
          } else if (isIdle) {
            statusTheme = 'text-secondary bg-secondary/10 border-secondary/20';
            borderGlow = 'border-secondary';
          }

          return (
            <div
              key={agent.id}
              onClick={() => handleAgentCardClick(agent.id)}
              className={`bg-surface-container border rounded-lg overflow-hidden flex flex-col transition-all hover:bg-surface-bright group cursor-pointer relative ${
                isSelected ? `${borderGlow} shadow-[0_0_12px_rgba(173,198,255,0.15)] scale-[1.01]` : 'border-outline-variant'
              }`}
            >
              {/* Colored top decorative bar */}
              <div className={`absolute top-0 left-0 w-full h-[3px] ${
                isIdle ? 'bg-secondary' : isBusy ? 'bg-tertiary' : 'bg-error'
              }`}></div>

              <div className="p-md border-b border-outline-variant flex justify-between items-center bg-[#13161f] pt-4">
                <div className="flex items-center gap-sm">
                  <span className={`material-symbols-outlined ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {agent.id === 'investigator' ? 'search_insights' : agent.id === 'resolution' ? 'build_circle' : 'account_tree'}
                  </span>
                  <h2 className="font-headline-md text-sm leading-tight font-semibold text-on-surface tracking-wide uppercase">
                    {agent.name}
                  </h2>
                </div>
                <div className={`flex items-center gap-xs px-2 py-0.5 rounded text-[10px] font-label-caps font-bold ${statusTheme}`}>
                  {!isFailed && <div className="w-1.5 h-1.5 rounded-full bg-current pulse-dot"></div>}
                  {isFailed && <span className="material-symbols-outlined text-[12px] mr-[2px]">warning</span>}
                  {agent.status}
                </div>
              </div>

              {/* Grid attributes */}
              <div className="p-md flex-grow grid grid-cols-2 gap-y-sm gap-x-sm font-mono text-[11px] leading-relaxed text-on-surface-variant">
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider font-sans font-bold">Model</span>
                  <span className="text-on-surface font-semibold text-[13px]">{agent.model}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider font-sans font-bold">Latency</span>
                  <span className={`font-semibold text-[13px] ${isFailed ? 'text-error' : isBusy ? 'text-tertiary' : 'text-secondary'}`}>
                    {agent.latency}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider font-sans font-bold">Uptime</span>
                  <span className="text-on-surface font-semibold text-[13px]">{agent.uptime}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider font-sans font-bold">Success Rate</span>
                  <span className={`font-semibold text-[13px] ${Number(agent.successRate.slice(0, -1)) < 80 ? 'text-error' : 'text-secondary'}`}>
                    {agent.successRate}
                  </span>
                </div>
              </div>

              {/* Token pricing footer */}
              <div className="px-md py-2 bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center text-xs font-mono">
                <span className="text-on-surface-variant/70">Total Token Cost</span>
                <span className="text-on-surface font-semibold">{agent.tokenCost}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Configuration Prompt Editor */}
      <section className="flex flex-col flex-grow min-h-[350px] bg-surface-container border border-outline-variant rounded-lg overflow-hidden shadow-lg">
        {/* Editor Toolbar Header */}
        <div className="bg-[#141822] border-b border-outline-variant p-sm flex items-center justify-between select-none">
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm border-r border-[#2d313d] pr-md">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">tune</span>
              <span className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                Configuration Editor
              </span>
            </div>
            
            {/* Target Selector */}
            <div className="relative">
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="appearance-none bg-[#09090b] border border-[#2d313d] text-on-surface font-mono text-xs py-1 pl-3 pr-8 rounded focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="investigator">Investigator (GPT-4)</option>
                <option value="resolution">Resolution (GPT-4-Turbo)</option>
                <option value="orchestrator">Orchestrator (Claude-Opus)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">
                arrow_drop_down
              </span>
            </div>
          </div>

          <div className="flex items-center gap-md text-xs">
            {/* Params Inputs */}
            <div className="flex items-center gap-1.5 bg-[#09090b] border border-[#2d313d] rounded px-2.5 py-1">
              <label className="font-sans font-bold text-[9px] text-on-surface-variant uppercase">Temp:</label>
              <input
                type="number"
                min="0"
                max="1.5"
                step="0.05"
                value={activeAgent?.temperature || 0.2}
                onChange={(e) => handleParamChange('temperature', parseFloat(e.target.value))}
                className="bg-transparent border-none text-primary font-mono text-xs w-10 p-0 focus:ring-0 text-right focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-[#09090b] border border-[#2d313d] rounded px-2.5 py-1 font-mono">
              <label className="font-sans font-bold text-[9px] text-on-surface-variant uppercase">Max Tokens:</label>
              <input
                type="number"
                min="256"
                max="8192"
                step="128"
                value={activeAgent?.maxTokens || 2048}
                onChange={(e) => handleParamChange('maxTokens', parseInt(e.target.value))}
                className="bg-transparent border-none text-tertiary font-mono text-xs w-14 p-0 focus:ring-0 text-right focus:outline-none"
              />
            </div>

            <div className="w-px h-6 bg-outline-variant mx-xs"></div>
            
            {/* Deploy Commit Button */}
            <button
              onClick={handleCommit}
              className="flex items-center gap-xs px-3 py-1.5 bg-surface-bright text-on-surface hover:text-white border border-[#2d313d] rounded text-xs cursor-pointer active:scale-95 hover:bg-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">save</span>
              Save &amp; Deploy
            </button>
          </div>
        </div>

        {/* Editor Code Canvas Body (Monaco YAML Mockup) */}
        <div className="flex-grow bg-[#000000] relative overflow-hidden flex font-mono text-[12px] leading-relaxed">
          {/* Editor Sidebar Line Numbers */}
          <div className="w-12 bg-[#09090b] border-r border-[#191c24] flex flex-col items-end py-4 pr-2.5 text-[#3b4252] select-none leading-[22px] font-mono text-right font-medium">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          {/* Interactive Monaco Code Prompt Terminal Textarea block */}
          <div className="flex-1 relative">
            <textarea
              value={editorText}
              onChange={(e) => handleDirectiveChange(e.target.value)}
              spellCheck="false"
              className="absolute inset-0 w-full h-full bg-transparent border-none p-4 pb-12 focus:ring-0 font-mono text-[12.5px] leading-[22px] text-on-surface resize-none whitespace-pre overflow-auto font-sans focus:outline-none focus:border-none cursor-text terminal-scroll selection:bg-surface-variant"
            />
            {/* Decorative Overlay indicators for YAML code elements */}
            <div className="absolute bottom-3 right-5 pointer-events-none text-[10px] text-on-surface-variant opacity-70 bg-[#10131a] border border-outline-variant rounded px-2 py-0.5 select-none font-mono uppercase">
              YAML • {activeAgent?.model || 'Agent Engine'}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
