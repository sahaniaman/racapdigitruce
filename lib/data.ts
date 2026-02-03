// Types
export interface Host {
  id: string
  hostname: string
  os: string
  lastSeen: string
  score: number
  criticalFailed: number | null
}

export interface Asset {
  id: string
  assetId: string
  hostname: string
  type: 'Router' | 'Server' | 'Firewall'
  osFirmware: string
  owner: string
  status: 'Compliant' | 'Non-Compliant'
  risk: 'Low' | 'Medium' | 'High'
  score: number
  lastScanned: string
}

export interface ComplianceRule {
  id: string
  ruleId: string
  framework: 'CIS' | 'ISO' | 'NIST' | 'PCI' | 'HIPAA'
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  locations: {
    DEL: boolean
    MUM: boolean
    BLR: boolean
    HYD: boolean
  }
}

export interface Report {
  id: string
  name: string
  date: string
  hosts: number
  status: 'Completed' | 'Pending' | 'Failed'
}

export interface Issue {
  id: string
  ruleId: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  hostsAffected: number
  framework: string
  status: 'Open' | 'In Progress' | 'Resolved'
  firstDetected: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'Super Admin' | 'Local Admin' | 'Auditor' | 'Viewer'
  initials: string
}

export interface DashboardMetrics {
  overallCompliance: number
  complianceChange: number
  hostsScanned: number
  criticalFailures: number
  criticalFailuresChange: number
  avgScore: number
  avgScoreChange: number
  securityEvents: number
  dataProtected: string
  avgResponseTime: string
  responseTimeChange: number
  networkUptime: string
}

export interface ComplianceTrendPoint {
  date: string
  score: number
}

export interface TopFailedControl {
  ruleId: string
  severity: 'critical' | 'high' | 'medium'
  description: string
  hostsAffected: number
}

// Mock Data
export const users: User[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh.kumar@digitruce.com', role: 'Super Admin', initials: 'RK' },
  { id: '2', name: 'Priya Sharma', email: 'priya.sharma@digitruce.com', role: 'Local Admin', initials: 'PS' },
  { id: '3', name: 'Amit Patel', email: 'amit.patel@digitruce.com', role: 'Auditor', initials: 'AP' },
  { id: '4', name: 'Sneha Reddy', email: 'sneha.reddy@digitruce.com', role: 'Viewer', initials: 'SR' },
]

export const hosts: Host[] = [
  { id: '1', hostname: 'prod-web-01.corp.local', os: 'Ubuntu 22.04 LTS', lastSeen: 'Nov 17, 02:45 PM', score: 92, criticalFailed: null },
  { id: '2', hostname: 'prod-db-primary.corp.local', os: 'Windows Server 2022', lastSeen: 'Nov 17, 02:40 PM', score: 45, criticalFailed: 5 },
  { id: '3', hostname: 'prod-app-01.corp.local', os: 'RHEL 8.5', lastSeen: 'Nov 17, 02:25 PM', score: 88, criticalFailed: 1 },
  { id: '4', hostname: 'dev-test-server.corp.local', os: 'Ubuntu 20.04 LTS', lastSeen: 'Nov 17, 02:15 PM', score: 67, criticalFailed: 2 },
  { id: '5', hostname: 'prod-cache-01.corp.local', os: 'Debian 11', lastSeen: 'Nov 17, 02:50 PM', score: 95, criticalFailed: null },
  { id: '6', hostname: 'prod-api-gateway.corp.local', os: 'Ubuntu 22.04 LTS', lastSeen: 'Nov 17, 02:35 PM', score: 78, criticalFailed: 1 },
  { id: '7', hostname: 'stage-web-01.corp.local', os: 'Windows Server 2019', lastSeen: 'Nov 17, 01:00 PM', score: 52, criticalFailed: 4 },
  { id: '8', hostname: 'prod-mail-server.corp.local', os: 'CentOS 7', lastSeen: 'Nov 17, 02:30 PM', score: 71, criticalFailed: 2 },
]

export const assets: Asset[] = [
  { id: '1', assetId: 'DEL-RTR-0001', hostname: 'del-router-01.corp.digitruce.in', type: 'Router', osFirmware: 'Debian 11', owner: 'Network Engineering', status: 'Non-Compliant', risk: 'Medium', score: 77, lastScanned: '27/01/2026' },
  { id: '2', assetId: 'DEL-SRV-0002', hostname: 'del-server-02.corp.digitruce.in', type: 'Server', osFirmware: 'Ubuntu 22.04 LTS', owner: 'Database Administration', status: 'Compliant', risk: 'Low', score: 95, lastScanned: '30/01/2026' },
  { id: '3', assetId: 'DEL-FW-0003', hostname: 'del-firewall-03.corp.digitruce.in', type: 'Firewall', osFirmware: 'Cisco IOS 15.1', owner: 'Security Operations', status: 'Compliant', risk: 'Medium', score: 83, lastScanned: '02/02/2026' },
  { id: '4', assetId: 'DEL-RTR-0004', hostname: 'del-router-04.corp.digitruce.in', type: 'Router', osFirmware: 'Ubuntu 22.04 LTS', owner: 'Security Operations', status: 'Non-Compliant', risk: 'High', score: 74, lastScanned: '28/01/2026' },
  { id: '5', assetId: 'DEL-SRV-0005', hostname: 'del-server-05.corp.digitruce.in', type: 'Server', osFirmware: 'Windows Server 2022', owner: 'DevOps Team', status: 'Compliant', risk: 'Medium', score: 89, lastScanned: '31/01/2026' },
  { id: '6', assetId: 'MUM-SRV-0006', hostname: 'mum-server-06.corp.digitruce.in', type: 'Server', osFirmware: 'RHEL 8.5', owner: 'IT Operations', status: 'Compliant', risk: 'Low', score: 91, lastScanned: '29/01/2026' },
  { id: '7', assetId: 'BLR-RTR-0007', hostname: 'blr-router-07.corp.digitruce.in', type: 'Router', osFirmware: 'Juniper Junos', owner: 'Network Engineering', status: 'Non-Compliant', risk: 'High', score: 62, lastScanned: '25/01/2026' },
  { id: '8', assetId: 'HYD-FW-0008', hostname: 'hyd-firewall-08.corp.digitruce.in', type: 'Firewall', osFirmware: 'Palo Alto PAN-OS', owner: 'Security Operations', status: 'Compliant', risk: 'Low', score: 97, lastScanned: '01/02/2026' },
]

export const complianceRules: ComplianceRule[] = [
  { id: '1', ruleId: 'CIS-1.3', framework: 'CIS', description: 'Ensure automatic updates are enabled', severity: 'critical', locations: { DEL: true, MUM: true, BLR: true, HYD: true } },
  { id: '2', ruleId: 'CIS-2.1', framework: 'CIS', description: 'Ensure firewall is enabled on all endpoints', severity: 'high', locations: { DEL: true, MUM: true, BLR: true, HYD: false } },
  { id: '3', ruleId: 'ISO-5.3', framework: 'ISO', description: 'Password complexity requirements not met', severity: 'high', locations: { DEL: false, MUM: true, BLR: true, HYD: true } },
  { id: '4', ruleId: 'NIST-AC-2', framework: 'NIST', description: 'User account monitoring disabled', severity: 'high', locations: { DEL: true, MUM: false, BLR: false, HYD: true } },
  { id: '5', ruleId: 'PCI-8.2.3', framework: 'PCI', description: 'Multi-factor authentication not enforced', severity: 'critical', locations: { DEL: true, MUM: true, BLR: true, HYD: true } },
  { id: '6', ruleId: 'HIPAA-164.312', framework: 'HIPAA', description: 'Encryption at rest not configured', severity: 'medium', locations: { DEL: true, MUM: true, BLR: false, HYD: true } },
  { id: '7', ruleId: 'CIS-5.1', framework: 'CIS', description: 'Antivirus software installed and updated', severity: 'critical', locations: { DEL: true, MUM: true, BLR: true, HYD: true } },
  { id: '8', ruleId: 'ISO-9.4', framework: 'ISO', description: 'System access control not properly configured', severity: 'high', locations: { DEL: false, MUM: true, BLR: true, HYD: true } },
]

export const reports: Report[] = [
  { id: '1', name: 'Weekly Compliance Report - Nov 10', date: '10/11/2025', hosts: 128, status: 'Completed' },
  { id: '2', name: 'Critical Issues Report', date: '15/11/2025', hosts: 38, status: 'Completed' },
  { id: '3', name: 'Monthly Security Audit', date: '01/11/2025', hosts: 128, status: 'Completed' },
  { id: '4', name: 'Quarterly Compliance Summary', date: '01/10/2025', hosts: 120, status: 'Completed' },
]

export const issues: Issue[] = [
  { id: '1', ruleId: 'CIS-1.3', severity: 'critical', description: 'Ensure automatic updates are enabled', hostsAffected: 23, framework: 'CIS', status: 'Open', firstDetected: '2025-11-07' },
  { id: '2', ruleId: 'ISO-5.3', severity: 'high', description: 'Password complexity requirements not met', hostsAffected: 18, framework: 'ISO', status: 'Open', firstDetected: '2025-11-08' },
  { id: '3', ruleId: 'NIST-AC-2', severity: 'high', description: 'User account monitoring disabled', hostsAffected: 15, framework: 'NIST', status: 'In Progress', firstDetected: '2025-11-09' },
  { id: '4', ruleId: 'PCI-8.2.3', severity: 'critical', description: 'Multi-factor authentication not enforced', hostsAffected: 12, framework: 'PCI', status: 'Open', firstDetected: '2025-11-10' },
  { id: '5', ruleId: 'CIS-2.1', severity: 'high', description: 'Ensure firewall is enabled on all endpoints', hostsAffected: 8, framework: 'CIS', status: 'Resolved', firstDetected: '2025-11-05' },
  { id: '6', ruleId: 'HIPAA-164.312', severity: 'medium', description: 'Encryption at rest not configured', hostsAffected: 6, framework: 'HIPAA', status: 'In Progress', firstDetected: '2025-11-11' },
]

export const dashboardMetrics: DashboardMetrics = {
  overallCompliance: 82,
  complianceChange: 3,
  hostsScanned: 128,
  criticalFailures: 7,
  criticalFailuresChange: -15,
  avgScore: 79,
  avgScoreChange: 2,
  securityEvents: 1247,
  dataProtected: '2.4 TB',
  avgResponseTime: '12 min',
  responseTimeChange: -8,
  networkUptime: '99.98%',
}

export const complianceTrend: ComplianceTrendPoint[] = [
  { date: 'Nov 7', score: 75 },
  { date: 'Nov 8', score: 78 },
  { date: 'Nov 9', score: 76 },
  { date: 'Nov 10', score: 80 },
  { date: 'Nov 11', score: 79 },
  { date: 'Nov 12', score: 81 },
  { date: 'Nov 13', score: 83 },
  { date: 'Nov 14', score: 82 },
  { date: 'Nov 15', score: 84 },
  { date: 'Nov 16', score: 82 },
]

export const topFailedControls: TopFailedControl[] = [
  { ruleId: 'CIS-1.3', severity: 'critical', description: 'Ensure automatic updates are enabled', hostsAffected: 23 },
  { ruleId: 'ISO-5.3', severity: 'high', description: 'Password complexity requirements not met', hostsAffected: 18 },
  { ruleId: 'NIST-AC-2', severity: 'high', description: 'User account monitoring disabled', hostsAffected: 15 },
]

export const locations = ['All Locations', 'DEL', 'MUM', 'BLR', 'HYD'] as const
export type Location = (typeof locations)[number]

// Extended Host Details
export interface HostDetail {
  id: string
  hostname: string
  os: string
  ipAddress: string
  domain: string
  lastSeen: string
  cpu: string
  memory: string
  disk: string
  uptime: string
  tags: string[]
  score: number
  location: Location
  recentActivity: {
    type: string
    timestamp: string
    details: string
  }[]
  evaluatedRules: {
    ruleId: string
    description: string
    expected: string
    actual: string
    status: 'PASS' | 'FAIL'
    severity: 'critical' | 'high' | 'medium' | 'low'
    remediation: string
  }[]
}

export const hostDetails: Record<string, HostDetail> = {
  '2': {
    id: '2',
    hostname: 'prod-db-primary.corp.local',
    os: 'Windows Server 2022',
    ipAddress: '10.0.2.15',
    domain: 'CORP',
    lastSeen: '17/11/2025, 14:40:00',
    cpu: 'Intel Xeon E5-2690 v4',
    memory: '64 GB',
    disk: '2TB SSD',
    uptime: '45 days',
    tags: ['production', 'database', 'critical'],
    score: 45,
    location: 'HYD',
    recentActivity: [
      { type: 'Scan completed', timestamp: '17/11/2025, 14:40:00', details: 'Score: 45%' },
      { type: 'Configuration change', timestamp: '16/11/2025, 09:15:00', details: 'Firewall rules updated' },
      { type: 'Scan completed', timestamp: '15/11/2025, 14:30:00', details: 'Score: 42%' },
    ],
    evaluatedRules: [
      { ruleId: 'CIS-1.3', description: 'Ensure automatic updates are enabled', expected: 'Enabled', actual: 'Disabled', status: 'FAIL', severity: 'critical', remediation: 'Enable Windows Update service and configure auto-update policy via GPO.' },
      { ruleId: 'CIS-2.1', description: 'Ensure firewall is enabled', expected: 'Enabled', actual: 'Enabled', status: 'PASS', severity: 'high', remediation: '' },
      { ruleId: 'ISO-5.3', description: 'Password complexity requirements', expected: 'Min 12 chars, complexity enabled', actual: 'Min 8 chars, no complexity', status: 'FAIL', severity: 'high', remediation: 'Update Group Policy to enforce minimum 12 character passwords with complexity requirements.' },
      { ruleId: 'NIST-AC-2', description: 'User account monitoring', expected: 'Audit logging enabled', actual: 'Audit logging disabled', status: 'FAIL', severity: 'high', remediation: 'Enable audit policy for account management events.' },
      { ruleId: 'PCI-8.2.3', description: 'Multi-factor authentication', expected: 'MFA enforced for all accounts', actual: 'MFA not configured', status: 'FAIL', severity: 'critical', remediation: 'Deploy and enforce MFA using Azure AD or similar solution.' },
      { ruleId: 'CIS-5.1', description: 'Antivirus software installed and updated', expected: 'Active with current definitions', actual: 'Active with current definitions', status: 'PASS', severity: 'critical', remediation: '' },
    ],
  },
  '1': {
    id: '1',
    hostname: 'prod-web-01.corp.local',
    os: 'Ubuntu 22.04 LTS',
    ipAddress: '10.0.1.10',
    domain: 'CORP',
    lastSeen: '17/11/2025, 14:45:00',
    cpu: 'AMD EPYC 7542',
    memory: '32 GB',
    disk: '500GB NVMe',
    uptime: '120 days',
    tags: ['production', 'web', 'frontend'],
    score: 92,
    location: 'DEL',
    recentActivity: [
      { type: 'Scan completed', timestamp: '17/11/2025, 14:45:00', details: 'Score: 92%' },
      { type: 'Patch applied', timestamp: '16/11/2025, 03:00:00', details: 'Security update KB5034441' },
    ],
    evaluatedRules: [
      { ruleId: 'CIS-1.3', description: 'Ensure automatic updates are enabled', expected: 'Enabled', actual: 'Enabled', status: 'PASS', severity: 'critical', remediation: '' },
      { ruleId: 'CIS-2.1', description: 'Ensure firewall is enabled', expected: 'Enabled', actual: 'Enabled', status: 'PASS', severity: 'high', remediation: '' },
      { ruleId: 'ISO-5.3', description: 'Password complexity requirements', expected: 'Min 12 chars, complexity enabled', actual: 'Min 12 chars, complexity enabled', status: 'PASS', severity: 'high', remediation: '' },
      { ruleId: 'NIST-AC-2', description: 'User account monitoring', expected: 'Audit logging enabled', actual: 'Audit logging enabled', status: 'PASS', severity: 'high', remediation: '' },
      { ruleId: 'PCI-8.2.3', description: 'Multi-factor authentication', expected: 'MFA enforced for all accounts', actual: 'MFA not configured', status: 'FAIL', severity: 'critical', remediation: 'Deploy and enforce MFA using Azure AD or similar solution.' },
      { ruleId: 'CIS-5.1', description: 'Antivirus software installed and updated', expected: 'Active with current definitions', actual: 'Active with current definitions', status: 'PASS', severity: 'critical', remediation: '' },
    ],
  },
}

// Extended compliance trend data for 30 days
export const complianceTrend30Days: ComplianceTrendPoint[] = Array.from({ length: 31 }, (_, i) => {
  const date = new Date(2026, 0, 4 + i)
  const baseScore = 77
  const variance = Math.sin(i * 0.3) * 5 + Math.random() * 3
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: Math.min(100, Math.max(60, Math.round(baseScore + variance + i * 0.3))),
  }
})

// Compliance analytics data
export interface ComplianceAnalytics {
  systemCompliance: number
  complianceChange: number
  totalEndpoints: number
  totalPolicies: number
  totalControls: number
  statusDistribution: {
    compliant: number
    nonCompliant: number
    notApplicable: number
    unknown: number
  }
  severityData: {
    severity: string
    passed: number
    failed: number
  }[]
}

export const complianceAnalytics: ComplianceAnalytics = {
  systemCompliance: 78.5,
  complianceChange: 2.3,
  totalEndpoints: 245,
  totalPolicies: 128,
  totalControls: 856,
  statusDistribution: {
    compliant: 78.5,
    nonCompliant: 10.9,
    notApplicable: 6.4,
    unknown: 4.1,
  },
  severityData: [
    { severity: 'Critical', passed: 156, failed: 32 },
    { severity: 'High', passed: 189, failed: 67 },
    { severity: 'Medium', passed: 298, failed: 45 },
    { severity: 'Low', passed: 156, failed: 23 },
  ],
}
