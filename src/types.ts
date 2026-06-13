export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'Active' | 'Investigating' | 'Resolved';

export interface Incident {
  id: string;
  severity: Severity;
  service: string;
  title: string;
  trigger: string;
  age: string; // e.g. "14m", "1h ago"
  status: IncidentStatus;
  description: string;
}

export type AgentStatus = 'IDLE' | 'BUSY' | 'FAILED';

export interface AgentInfo {
  id: string;
  name: string;
  status: AgentStatus;
  model: string;
  latency: string;
  uptime: string;
  successRate: string;
  tokenCost: string;
  systemDirective: string;
  temperature: number;
  maxTokens: number;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERR' | 'DBUG';

export interface LogEntry {
  id: string;
  timestamp: string;
  namespace: string;
  pod: string;
  container: string;
  hostNode: string;
  traceId: string;
  level: LogLevel;
  service: string;
  message: string;
  rawPayload: Record<string, any>;
}

export type NodeStatus = 'Healthy' | 'Warning' | 'Critical';

export interface TopologyNode {
  id: string;
  label: string;
  type: 'vm' | 'pod';
  status: NodeStatus;
  cpuLoad: number;
  memoryUsed: number;
  memoryTotal: number;
  namespace?: string;
  icon: string;
}

export interface TimelineStep {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
  status: 'fired' | 'assigned' | 'identified' | 'proposed' | 'pending';
  icon?: string;
  logsTerminal?: string;
  codeDiff?: {
    file: string;
    original: string[];
    modified: string[];
  };
}
