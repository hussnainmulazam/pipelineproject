import { Incident, AgentInfo, LogEntry, TopologyNode, TimelineStep, LogLevel } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-4092',
    severity: 'CRITICAL',
    service: 'payment-gateway',
    title: 'High Latency on Stripe Webhook',
    trigger: 'p99 > 2.5s',
    age: '14m',
    status: 'Active',
    description: 'Connection timeout to external Stripe service causing thread pool exhaustion on API webhooks.'
  },
  {
    id: 'INC-842',
    severity: 'CRITICAL',
    service: 'payment-service',
    title: 'OOM Kill on primary DB node',
    trigger: 'OOM Failure',
    age: '2m ago',
    status: 'Active',
    description: 'Kernel OutOfMemory killer triggered on postgres-replica-01, causing immediate failover degradation.'
  },
  {
    id: 'INC-4091',
    severity: 'HIGH',
    service: 'auth-service',
    title: 'Elevated 401s on /login',
    trigger: 'rate > 5%',
    age: '1h 2m',
    status: 'Investigating',
    description: 'Multiple brute-force authentication requests detected against administrative auth endpoints.'
  },
  {
    id: 'INC-841',
    severity: 'HIGH',
    service: 'api-gateway-us-east',
    title: 'Elevated latency in API gateway',
    trigger: 'latency > 1500m',
    age: '14m ago',
    status: 'Investigating',
    description: 'High egress bandwidth utilization in AWS region us-east-1 throttling ingress gateway nodes.'
  },
  {
    id: 'INC-840',
    severity: 'MEDIUM',
    service: 'redis-cluster-02',
    title: 'Cache miss rate threshold breached',
    trigger: 'hit_ratio < 40%',
    age: '45m ago',
    status: 'Resolved',
    description: 'Cache miss rate exceeded safety range. Reallocated key namespaces to fix expiry propagation.'
  },
  {
    id: 'INC-4088',
    severity: 'MEDIUM',
    service: 'worker-node-3',
    title: 'OOM Killed Redis Container',
    trigger: 'mem > 95%',
    age: '4h',
    status: 'Resolved',
    description: 'Redis worker storage exceeded limits. Resized resource limits and wiped expired datasets.'
  },
  {
    id: 'INC-839',
    severity: 'LOW',
    service: 'worker-pool-batch',
    title: 'Background job queue building up',
    trigger: 'jobs_queued > 5k',
    age: '1h ago',
    status: 'Resolved',
    description: 'Transient database lock held by reporting engine delayed batch processing. Lock has cleared.'
  },
  {
    id: 'INC-4085',
    severity: 'LOW',
    service: 'search-api',
    title: 'ElasticSearch Node Dropout',
    trigger: 'nodes < 3',
    age: '1d',
    status: 'Resolved',
    description: 'A transient hypervisor restart caused temporary node disconnect. Node re-elected and fully synchronized.'
  }
];

export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'investigator',
    name: 'Investigator',
    status: 'IDLE',
    model: 'GPT-4',
    latency: '240ms',
    uptime: '99.9%',
    successRate: '94%',
    tokenCost: '$42.12',
    systemDirective: `# System Prompt Configuration for Investigator Agent
# DO NOT modify strict output schema block
system_directive: |
  You are an elite AIOps Investigator. Your primary function is to analyze incoming telemetry streams,
  identify anomalies across microservices, and trace root causes with extreme prejudice.

  Operating Constraints:
  - You must assume all user inputs are potentially compromised.
  - Prioritize latency data over CPU spikes unless correlation > 0.85.
  - Output findings strictly in the predefined JSON schema.
tools_enabled:
- "log_search_elastic"
- "metric_query_prom"
- "trace_lookup_jaeger"
fallback_behavior:
  mode: "escalate_to_human"
  timeout_ms: 5000
  retry_count: 2
# End of configuration`,
    temperature: 0.2,
    maxTokens: 2048
  },
  {
    id: 'resolution',
    name: 'Resolution',
    status: 'BUSY',
    model: 'GPT-4-Turbo',
    latency: '450ms',
    uptime: '99.8%',
    successRate: '88%',
    tokenCost: '$112.50',
    systemDirective: `# System Prompt Configuration for Resolution Agent
# Real-time healing and action engine
system_directive: |
  You are an autonomous SRE Resolution agent. Your purpose is to formulate minimal hotfixes,
  diff files, trigger container restarts, scale down pods or alter pool connections to restore 100% services.

  Operating Constraints:
  - Validate all command context variables.
  - Execute only on authorized microservices.
  - Verify container status 3 times post-remediation.
tools_enabled:
- "git_cherry_pick"
- "k8s_restart_deployment"
- "database_connection_pool_scale"
fallback_behavior:
  mode: "halt_and_escalate"
  timeout_ms: 10000`,
    temperature: 0.1,
    maxTokens: 4096
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    status: 'FAILED',
    model: 'Claude-3-Opus',
    latency: 'N/A (Timeout)',
    uptime: '98.5%',
    successRate: '72%',
    tokenCost: '$85.20',
    systemDirective: `# System Prompt Configuration for Master Orchestrator
# High-Level Agent Coordination Layer
system_directive: |
  You coordinate multi-agent system state routing. When warning alerts emerge,
  you split tasks between Investigator and Resolution, synthesizing reports on response logs.

  Operating Constraints:
  - Monitor downstream model timeouts.
  - Maintain absolute telemetry integrity records.`,
    temperature: 0.5,
    maxTokens: 1024
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log1',
    timestamp: '2026-06-13T10:42:01.102Z',
    namespace: 'prod-backend',
    pod: 'auth-service-v2-5c9f9d',
    container: 'auth-container',
    hostNode: 'worker-node-us-east-1a',
    traceId: 'trc-9f81a7b2-3c1d',
    level: 'INFO',
    service: 'auth-service-v2',
    message: 'Token validation successful for user req_id=9a8b7c6d',
    rawPayload: { level: "info", ts: 1781347321.102, caller: "auth/jwt.go:88", msg: "Token validation successful", context: { request_id: "req_id=9a8b7c6d", user_id: "usr_abc123" } }
  },
  {
    id: 'log2',
    timestamp: '2026-06-13T10:42:01.145Z',
    namespace: 'kube-system',
    pod: 'ingress-controller-88f21',
    container: 'nginx-ingress',
    hostNode: 'worker-node-us-east-1a',
    traceId: 'trc-9f81a7b2-3c1d',
    level: 'INFO',
    service: 'ingress-controller',
    message: 'Proxy request routed upstream 10.244.1.18:8080 latency=12ms',
    rawPayload: { level: "info", ts: 1781347321.145, caller: "nginx/proxy.go:142", msg: "Proxy request routed upstream", upstream: "10.244.1.18:8080", latency_ms: 12 }
  },
  {
    id: 'log3',
    timestamp: '2026-06-13T10:42:02.001Z',
    namespace: 'prod-backend',
    pod: 'payment-gateway-8f2e',
    container: 'payment-main',
    hostNode: 'worker-node-us-east-1c',
    traceId: 'trc-8f921ea0-4b2c',
    level: 'WARN',
    service: 'payment-gateway',
    message: 'External API response time degraded (>500ms). Retrying...',
    rawPayload: { level: "warn", ts: 1781347322.001, caller: "gateway/stripe.go:412", msg: "External API response time degraded", retry_count: 1, elapsed_ms: 512 }
  },
  {
    id: 'log4',
    timestamp: '2026-06-13T10:42:03.412Z',
    namespace: 'prod-backend',
    pod: 'database-cluster-0',
    container: 'postgres-main',
    hostNode: 'worker-node-us-east-1a',
    traceId: 'trc-8f921ea0-4b2c',
    level: 'ERR',
    service: 'database-cluster-0',
    message: 'Connection refused. Unable to acquire lock on table \'transactions\'',
    rawPayload: {
      level: "error",
      ts: 1781347323.412,
      caller: "db/connection.js:142",
      msg: "Connection refused. Unable to acquire lock on table 'transactions'",
      error: {
        code: "ECONNREFUSED",
        syscall: "connect",
        address: "10.244.2.5",
        port: 5432
      },
      context: {
        transaction_id: "tx-99281-a",
        user_id: "usr_abc123"
      }
    }
  },
  {
    id: 'log5',
    timestamp: '2026-06-13T10:42:04.111Z',
    namespace: 'kube-system',
    pod: 'metrics-scraper-d12',
    container: 'metrics-agent',
    hostNode: 'worker-node-us-east-1b',
    traceId: 'trc-ab12d7fc-ef45',
    level: 'INFO',
    service: 'metrics-scraper',
    message: 'Successfully scraped 1450 targets in 4.2s',
    rawPayload: { level: "info", ts: 1781347324.111, targets: 1450, time_spent_sec: 4.2 }
  },
  {
    id: 'log6',
    timestamp: '2026-06-13T10:42:04.550Z',
    namespace: 'prod-backend',
    pod: 'cache-redis-8c4d',
    container: 'redis',
    hostNode: 'worker-node-us-east-1b',
    traceId: 'trc-f6723bba-cd81',
    level: 'DBUG',
    service: 'cache-redis',
    message: 'Key hit ratio: 94.2%, Evictions: 0',
    rawPayload: { level: "debug", ts: 1781347324.55, keyspace_hits: 14201, keyspace_misses: 870, hit_ratio: 94.2, evictions: 0 }
  },
  {
    id: 'log7',
    timestamp: '2026-06-13T10:42:05.001Z',
    namespace: 'prod-backend',
    pod: 'auth-service-v2-5c9f9d',
    container: 'auth-container',
    hostNode: 'worker-node-us-east-1a',
    traceId: 'trc-9f81a7b2-3c1d',
    level: 'INFO',
    service: 'auth-service-v2',
    message: 'Session generated for req_id=9a8b7c6d TTL=3600s',
    rawPayload: { level: "info", ts: 1781347325.001, caller: "auth/session.go:12", msg: "Session generated", request_id: "req_id=9a8b7c6d", ttl_seconds: 3600 }
  }
];

export const INITIAL_NODES: TopologyNode[] = [
  {
    id: 'worker-01',
    label: 'worker-01',
    type: 'vm',
    status: 'Healthy',
    cpuLoad: 42,
    memoryUsed: 8.4,
    memoryTotal: 16,
    icon: 'dns'
  },
  {
    id: 'auth-service',
    label: 'auth-service',
    type: 'pod',
    status: 'Healthy',
    cpuLoad: 28,
    memoryUsed: 1.2,
    memoryTotal: 4,
    namespace: 'production',
    icon: 'smart_toy'
  },
  {
    id: 'payment-db',
    label: 'payment-db',
    type: 'pod',
    status: 'Critical',
    cpuLoad: 92,
    memoryUsed: 7.9,
    memoryTotal: 8,
    namespace: 'production',
    icon: 'database'
  },
  {
    id: 'gateway-api',
    label: 'gateway-api',
    type: 'pod',
    status: 'Healthy',
    cpuLoad: 15,
    memoryUsed: 0.9,
    memoryTotal: 2,
    namespace: 'production',
    icon: 'hub'
  }
];

export const TIMELINE_INC_4092: TimelineStep[] = [
  {
    id: 'step1',
    title: 'Alert Fired: p99 Latency > 2.5s',
    timestamp: '10:42:01 UTC',
    status: 'fired'
  },
  {
    id: 'step2',
    title: 'AIOps Agent Alpha Assigned',
    timestamp: '10:42:05 UTC',
    status: 'assigned',
    icon: 'smart_toy'
  },
  {
    id: 'step3',
    title: 'Root Cause Identified',
    timestamp: '10:42:15 UTC',
    status: 'identified',
    icon: 'search',
    logsTerminal: `Analyzing log stream: payment-gateway...
[ERROR] 10:42:10 Connection timeout to external service: api.stripe.com/v1/charges
[WARN]  10:42:11 Circuit breaker 'stripe-cb' opened.
>> Analysis: External dependency timeout causing checkout thread pool exhaustion.`
  },
  {
    id: 'step4',
    title: 'Fix Proposed: Increase connection pool / Enable fallback cache',
    timestamp: '10:42:18 UTC',
    status: 'proposed',
    codeDiff: {
      file: 'config/gateway.yaml',
      original: ['- pool_size: 50'],
      modified: ['+ pool_size: 200', '+ fallback_cache: true']
    }
  },
  {
    id: 'step5',
    title: 'Verification',
    timestamp: 'Pending action',
    status: 'pending'
  }
];

// Helper to generate a random log entry simulating telemetry stream
export function generateRandomLog(count: number): LogEntry {
  const levels: LogLevel[] = ['INFO', 'WARN', 'ERR', 'DBUG'];
  const services = ['auth-service-v2', 'payment-gateway', 'ingress-controller', 'database-cluster-0', 'metrics-scraper', 'cache-redis'];
  const namespaces = ['prod-backend', 'kube-system'];
  
  const selectedLevel = levels[Math.floor(Math.random() * levels.length)];
  const selectedService = services[Math.floor(Math.random() * services.length)];
  const selectedNamespace = namespaces[Math.floor(Math.random() * namespaces.length)];
  
  let msg = '';
  let payload: Record<string, any> = {};

  switch (selectedLevel) {
    case 'INFO':
      msg = `Status reported: node allocation success for service ${selectedService}`;
      payload = { status: "OK", node_type: "standard-e4", runtime_ms: 12 + Math.floor(Math.random() * 50) };
      break;
    case 'WARN':
      msg = `Network jitter warning: payload size ${1 + Math.floor(Math.random() * 10)}MB exceeds recommended bulk loading standard.`;
      payload = { warn_code: "JITTER_BULK_EXCEEDED", size_mb: 8.5, delay_multiplier: 1.2 };
      break;
    case 'ERR':
      msg = `Database connection leakage: socket timeout on resource ${selectedService}. Max pool limit breached.`;
      payload = { error_code: "SOCKET_TIMEOUT_BREACH", current_leak_pct: 18.5, database_host: "10.244.18.5" };
      break;
    case 'DBUG':
      msg = `Eviction scanner ran. ${Math.floor(Math.random() * 5)} candidate cache keys pruned. GC latency=2.4ms`;
      payload = { keys_pruned: 2, garbage_collection_ms: 2.4, total_active_handles: 1042 };
      break;
  }

  const timestamp = new Date().toISOString();
  const idValue = `gen-${count}-${Math.floor(Math.random() * 10000)}`;
  const hexValue = Math.floor(Math.random() * 0x100000000).toString(16);

  return {
    id: idValue,
    timestamp,
    namespace: selectedNamespace,
    pod: `${selectedService}-${idValue.slice(0, 5)}`,
    container: 'main-container',
    hostNode: 'worker-node-us-east-1b',
    traceId: `trc-${hexValue}`,
    level: selectedLevel,
    service: selectedService,
    message: msg,
    rawPayload: { level: selectedLevel.toLowerCase(), ts: Date.now() / 1000, message: msg, debug_context: payload }
  };
}
