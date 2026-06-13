import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import IncidentsView from './components/IncidentsView';
import AgentsView from './components/AgentsView';
import LogsView from './components/LogsView';
import InfrastructureView from './components/InfrastructureView';
import SettingsView from './components/SettingsView';

import { Incident, AgentInfo, LogEntry, TopologyNode } from './types';
import {
  INITIAL_INCIDENTS,
  INITIAL_AGENTS,
  INITIAL_LOGS,
  INITIAL_NODES
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Real-time globally managed states
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [nodes, setNodes] = useState<TopologyNode[]>(INITIAL_NODES);
  
  // Default selected incident, initialized directly to INC-4092 to match the drill-down mockup!
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-4092');

  // Logs stream details
  const [logsRate, setLogsRate] = useState<number>(4500);
  const [systemAlias, setSystemAlias] = useState<string>('SysAdmin_01');

  // Computed counters
  const unhealthyIncidents = incidents.filter((i) => i.status !== 'Resolved');
  const unhealthyCount = unhealthyIncidents.length;

  // Search filtering proxy
  const handleGlobalSearch = (query: string) => {
    // If query matches a tab, switch directly! Very responsive.
    const lQuery = query.toLowerCase().trim();
    if (['dashboard', 'incidents', 'agents', 'infrastructure', 'logs', 'settings'].includes(lQuery)) {
      setActiveTab(lQuery);
      return;
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Side Navigation panel */}
      <Sidebar 
        currentTab={activeTab} 
        setTab={setActiveTab} 
        unhealthyCount={unhealthyCount} 
      />

      {/* Global Top Command Control Center Row */}
      <Header 
        onSearch={handleGlobalSearch} 
        unhealthyIncidents={unhealthyIncidents}
        setTab={setActiveTab}
      />

      {/* Main viewport canvas layout */}
      <main className="ml-64 mt-16 p-lg flex flex-col gap-lg min-h-[calc(100vh-4rem)] transition-all duration-300">
        
        {/* Render View Dynamically depending on Active Tab Selector */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            incidents={incidents}
            agents={agents}
            setTab={setActiveTab}
            setSelectedIncidentId={setSelectedIncidentId}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentsView 
            incidents={incidents}
            setIncidents={setIncidents}
            selectedIncidentId={selectedIncidentId}
            setSelectedIncidentId={setSelectedIncidentId}
          />
        )}

        {activeTab === 'agents' && (
          <AgentsView 
            agents={agents}
            setAgents={setAgents}
          />
        )}

        {activeTab === 'logs' && (
          <LogsView 
            logs={logs}
            setLogs={setLogs}
          />
        )}

        {activeTab === 'infrastructure' && (
          <InfrastructureView 
            nodes={nodes}
            setNodes={setNodes}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            logsRate={logsRate}
            setLogsRate={setLogsRate}
            systemAlias={systemAlias}
            setSystemAlias={setSystemAlias}
          />
        )}

      </main>
    </div>
  );
}
