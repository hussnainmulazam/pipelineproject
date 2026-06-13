import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, LogLevel } from '../types';
import { generateRandomLog } from '../data/mockData';

interface LogsViewProps {
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export default function LogsView({ logs, setLogs }: LogsViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLogId, setSelectedLogId] = useState<string>('log4');
  const [isLiveTail, setIsLiveTail] = useState<boolean>(true);
  const [logCounter, setLogCounter] = useState<number>(0);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Background Live Tail Stream simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLiveTail) {
      interval = setInterval(() => {
        setLogCounter(c => {
          const newEntry = generateRandomLog(c);
          setLogs(prev => [...prev, newEntry]);
          return c + 1;
        });
      }, 4500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveTail]);

  // Auto scroll to bottom of logs on new tail entries
  useEffect(() => {
    if (isLiveTail && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.length, isLiveTail]);

  // Handle Quick Search Pills click
  const handlePillClick = (pillQuery: string) => {
    setSearchQuery(pillQuery);
  };

  const handleCopyPayload = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setSuccessToast("JSON raw payload copied to clipboard.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Filter logs according to omnisearch
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    
    // Check specific keys
    if (query.startsWith('lvl:')) {
      const targetLvl = query.split(':')[1];
      return log.level.toLowerCase() === targetLvl;
    }
    if (query.startsWith('pod:')) {
      const targetPod = query.split(':')[1];
      return log.pod.toLowerCase().includes(targetPod);
    }
    if (query.startsWith('ns:')) {
      const targetNs = query.split(':')[1];
      return log.namespace.toLowerCase() === targetNs;
    }

    return (
      log.message.toLowerCase().includes(query) ||
      log.service.toLowerCase().includes(query) ||
      log.pod.toLowerCase().includes(query) ||
      log.level.toLowerCase().includes(query) ||
      log.namespace.toLowerCase().includes(query)
    );
  });

  // Selected Log
  const activeLog = logs.find(l => l.id === selectedLogId) || filteredLogs[0] || logs[0];

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      {/* Mini notification toasts */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-secondary text-background font-semibold text-xs px-md py-sm rounded border border-secondary shadow-lg z-50 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="pb-sm border-b border-outline-variant bg-surface-container-low shrink-0 z-30 relative select-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md mb-md">
          <div>
            <h1 className="font-headline-lg text-2xl font-black text-on-surface m-0">Centralized Log Explorer</h1>
            <p className="font-body-sm text-xs text-on-surface-variant mt-xs leading-none">
              Real-time aggregate telemetry streams compiled across all namespace clusters.
            </p>
          </div>
          <div className="flex items-center gap-md">
            {/* Live Tail toggle */}
            <label className="flex items-center cursor-pointer gap-sm bg-surface-container px-md py-1.5 rounded-lg border border-outline-variant hover:border-outline transition-colors select-none">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={isLiveTail}
                  onChange={(e) => setIsLiveTail(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
              </div>
              <span className="font-label-caps text-[10px] font-bold text-on-surface flex items-center gap-xs">
                {isLiveTail && <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-dot"></span>}
                Live Tail
              </span>
            </label>
            <button 
              onClick={() => handleCopyPayload(filteredLogs)}
              className="bg-surface-container border border-outline-variant text-on-surface hover:text-white px-md py-1.5 rounded-lg hover:bg-surface-bright transition-colors font-label-caps text-[10px] font-bold flex items-center gap-xs h-9 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
          </div>
        </div>

        {/* Search bar and Filters */}
        <div className="flex flex-col sm:flex-row gap-sm w-full select-none">
          <div className="relative flex-grow group">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-primary text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-[#32353c] rounded-lg py-2 pl-xl pr-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-xs placeholder:text-outline transition-all"
              placeholder='Search logs... e.g. "timeout", "payment", lvl:error, pod:auth-service'
            />
            {/* Quick Filters Pill triggers integrated inside search */}
            <div className="absolute right-sm top-1/2 -translate-y-1/2 flex items-center gap-xs hidden md:flex font-mono select-none">
              <span 
                onClick={() => handlePillClick('lvl:error')}
                className="bg-surface-variant hover:bg-surface-bright border border-outline-variant rounded px-1.5 py-0.5 text-[9px] text-outline cursor-pointer hover:text-on-surface transition-colors font-mono"
              >
                lvl:error
              </span>
              <span 
                onClick={() => handlePillClick('pod:api-')}
                className="bg-surface-variant hover:bg-surface-bright border border-outline-variant rounded px-1.5 py-0.5 text-[9px] text-outline cursor-pointer hover:text-on-surface transition-colors font-mono"
              >
                pod:api-
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSearchQuery('')}
            className="bg-primary/20 hover:bg-primary/30 border border-primary/35 text-on-primary-container px-md py-2 rounded-lg transition-colors font-label-caps text-[10px] font-bold flex items-center justify-center gap-xs shrink-0 cursor-pointer active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Terminal + Inspector Split Window */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Continuous Terminal stream */}
        <div className="flex-grow bg-[#000000] border-r border-[#27272a] overflow-y-auto terminal-scroll scroll-smooth flex flex-col p-2 h-[410px]">
          <div className="w-full min-h-full font-mono text-[11px] leading-relaxed select-none">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant font-sans">
                <span className="material-symbols-outlined text-3xl animate-pulse mb-2 text-outline">search</span>
                <p>No telemetry logs matching current query expression</p>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isSelected = log.id === selectedLogId;
                const isErr = log.level === 'ERR';
                const isWarn = log.level === 'WARN';
                const isDbug = log.level === 'DBUG';

                let lvlColor = 'text-[#8c909f]';
                let rowBg = 'hover:bg-[#18181b]';
                let borderL = 'border-transparent';

                if (isSelected) {
                  rowBg = 'bg-[#181c24] border-l-2 border-primary';
                }

                if (isErr) {
                  lvlColor = 'text-[#ffb4ab] font-bold';
                  rowBg = isSelected ? 'bg-[#2d1217]' : 'bg-[#2a1114] hover:bg-[#3d161a]';
                  borderL = isSelected ? 'border-error' : 'border-[#93000a]';
                } else if (isWarn) {
                  lvlColor = 'text-[#ffb95f] font-bold';
                  rowBg = isSelected ? 'bg-[#272013]' : 'bg-[#1d1a14] hover:bg-[#2b251a]';
                  borderL = 'border-[#ca8100]';
                } else if (isDbug) {
                  lvlColor = 'text-primary-fixed-dim/60';
                }

                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`group flex items-center py-1 px-2 border-l-2 cursor-pointer transition-all ${rowBg} ${borderL}`}
                  >
                    <span className="text-outline w-[170px] shrink-0 font-mono text-[10.5px]">
                      {log.timestamp.slice(11, 23)}
                    </span>
                    <span className="text-primary-fixed-dim w-[140px] shrink-0 truncate mr-sm font-mono font-semibold" title={log.pod}>
                      {log.service}
                    </span>
                    <span className={`w-[50px] shrink-0 font-mono font-black ${lvlColor}`}>
                      {log.level}
                    </span>
                    <span className="text-[#c2c6d6] break-all font-mono truncate text-[11px] flex-1">
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Structured Inspector Panel (Right side aligned) */}
        {activeLog && (
          <aside className="w-80 md:w-96 bg-[#18181b] border-l border-[#27272a] flex flex-col h-[410px] z-20 shrink-0 transform transition-all duration-300">
            {/* Inspector Header */}
            <div className="p-md border-b border-[#27272a] bg-[#1d2027] flex items-center justify-between select-none">
              <h3 className="font-headline-sm text-xs font-semibold text-on-surface m-0 flex items-center gap-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">data_object</span>
                Structured Detail
              </h3>
            </div>

            {/* Inspector Content container */}
            <div className="flex-grow overflow-y-auto terminal-scroll p-md flex flex-col justify-between">
              {/* Metadata Core Display */}
              <div className="mb-md pb-md border-b border-[#27272a]">
                <div className="flex items-center gap-sm mb-2 select-none">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-label-caps border ${
                    activeLog.level === 'ERR'
                      ? 'bg-error/10 border-error/20 text-error'
                      : activeLog.level === 'WARN'
                      ? 'bg-tertiary/10 border-tertiary/20 text-tertiary'
                      : 'bg-primary/10 border-primary/20 text-primary'
                  }`}>
                    {activeLog.level === 'ERR' ? 'ERROR' : activeLog.level}
                  </span>
                  <span className="text-on-surface-variant font-mono text-[10px]">{activeLog.timestamp}</span>
                </div>
                <h4 className="font-body-md text-sm text-on-surface font-semibold leading-tight capitalize select-none">
                  {activeLog.message}
                </h4>
              </div>

              {/* Key-Value metadata tables */}
              <div className="space-y-2 mb-md font-mono text-[11px]">
                <div className="grid grid-cols-3 gap-xs">
                  <div className="text-on-surface-variant/75 font-sans font-semibold select-none">Namespace</div>
                  <div className="text-primary-fixed-dim col-span-2 truncate font-mono" title={activeLog.namespace}>
                    {activeLog.namespace}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-xs">
                  <div className="text-on-surface-variant/75 font-sans font-semibold select-none">Pod Address</div>
                  <div className="text-primary-fixed-dim col-span-2 truncate font-mono" title={activeLog.container}>
                    {activeLog.pod}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-xs">
                  <div className="text-on-surface-variant/75 font-sans font-semibold select-none">Container</div>
                  <div className="text-on-surface col-span-2 truncate font-mono">
                    {activeLog.container}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-xs">
                  <div className="text-on-surface-variant/75 font-sans font-semibold select-none">Trace ID</div>
                  <div 
                    onClick={() => {
                      setSuccessToast(`Searching active traces for: ${activeLog.traceId}`);
                    }}
                    className="text-tertiary col-span-2 font-mono truncate underline decoration-dashed cursor-pointer hover:text-tertiary-fixed"
                    title={activeLog.traceId}
                  >
                    {activeLog.traceId}
                  </div>
                </div>
              </div>

              {/* RAW PAYLOAD rendering block */}
              <div>
                <div className="flex items-center justify-between mb-1.5 select-none text-[11px]">
                  <h5 className="font-label-caps text-[10px] text-on-surface-variant font-bold">RAW JSON PAYLOAD</h5>
                  <button 
                    onClick={() => handleCopyPayload(activeLog.rawPayload)}
                    className="text-on-surface-variant hover:text-primary transition-all p-1 rounded hover:bg-surface-variant cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  </button>
                </div>
                <div className="bg-[#09090b] p-2.5 rounded border border-[#27272a] font-mono text-[10px] leading-relaxed overflow-x-auto text-[#c2c6d6] h-28 terminal-scroll">
                  <pre><code>{JSON.stringify(activeLog.rawPayload, null, 2)}</code></pre>
                </div>
              </div>

              {/* Quick tracing actions layout */}
              <div className="mt-md pt-sm flex gap-sm border-t border-[#27272a] select-none shrink-0 w-full">
                <button 
                  onClick={() => handlePillClick(`pod:${activeLog.pod.slice(0, 8)}`)}
                  className="flex-1 bg-surface-variant border border-outline-variant hover:border-outline text-on-surface text-[10px] font-bold font-label-caps py-2 rounded transition-colors flex items-center justify-center gap-xs cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-xs">manage_search</span> SIMILAR PODS
                </button>
                <button 
                  onClick={() => {
                    setSuccessToast(`Fetching network tracing visualization for trace ID ${activeLog.traceId}`);
                  }}
                  className="flex-1 bg-[#10131a] border border-[#2d313d] hover:border-primary text-on-surface text-[10px] font-bold font-label-caps py-2 rounded transition-colors flex items-center justify-center gap-xs cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-xs">timeline</span> VIEW TRACING
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
