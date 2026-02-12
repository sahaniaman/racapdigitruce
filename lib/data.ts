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
  { id: '8', hostname: 'prod-mail-server.corp.local', os: 'CentOS 7', lastSeen: 'Nov 17, 02:30 PM', score: 75, criticalFailed: 2 },
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

// Generate reports based on hosts data
export const reports: Report[] = [
  { id: '1', name: 'Weekly Compliance Report - Nov 10', date: '10/11/2025', hosts: hosts.length, status: 'Completed' },
  { id: '2', name: 'Critical Issues Report', date: '15/11/2025', hosts: hosts.filter(h => h.criticalFailed !== null).length, status: 'Completed' },
  { id: '3', name: 'Monthly Security Audit', date: '01/11/2025', hosts: hosts.length, status: 'Completed' },
  { id: '4', name: 'Quarterly Compliance Summary', date: '01/10/2025', hosts: Math.round(hosts.length * 0.95), status: 'Completed' },
]

export const issues: Issue[] = [
  { id: '1', ruleId: 'CIS-1.3', severity: 'critical', description: 'Ensure automatic updates are enabled', hostsAffected: 23, framework: 'CIS', status: 'Open', firstDetected: '2025-11-07' },
  { id: '2', ruleId: 'ISO-5.3', severity: 'high', description: 'Password complexity requirements not met', hostsAffected: 18, framework: 'ISO', status: 'Open', firstDetected: '2025-11-08' },
  { id: '3', ruleId: 'NIST-AC-2', severity: 'high', description: 'User account monitoring disabled', hostsAffected: 15, framework: 'NIST', status: 'In Progress', firstDetected: '2025-11-09' },
  { id: '4', ruleId: 'PCI-8.2.3', severity: 'critical', description: 'Multi-factor authentication not enforced', hostsAffected: 12, framework: 'PCI', status: 'Open', firstDetected: '2025-11-10' },
  { id: '5', ruleId: 'CIS-2.1', severity: 'high', description: 'Ensure firewall is enabled on all endpoints', hostsAffected: 8, framework: 'CIS', status: 'Resolved', firstDetected: '2025-11-05' },
  { id: '6', ruleId: 'HIPAA-164.312', severity: 'medium', description: 'Encryption at rest not configured', hostsAffected: 6, framework: 'HIPAA', status: 'In Progress', firstDetected: '2025-11-11' },
]

// Calculate dashboard metrics from actual data
const calculateDashboardMetrics = (): DashboardMetrics => {
  // Calculate overall compliance from hosts
  const totalHosts = hosts.length
  const totalScore = hosts.reduce((sum, host) => sum + host.score, 0)
  const overallCompliance = Math.round(totalScore / totalHosts)
  
  // Count hosts scanned (all active hosts)
  const hostsScanned = totalHosts
  
  // Count critical failures
  const criticalFailures = hosts.filter(h => h.criticalFailed !== null).reduce((sum, h) => sum + (h.criticalFailed || 0), 0)
  
  // Calculate average score
  const avgScore = Math.round(totalScore / totalHosts)
  
  // Count security events from issues
  const securityEvents = issues.reduce((sum, issue) => sum + issue.hostsAffected, 0) * 15 // multiply by avg events per issue
  
  // Calculate data protected (assets count)
  const dataProtected = `${(assets.length * 0.3).toFixed(1)} TB`
  
  return {
    overallCompliance,
    complianceChange: 3,
    hostsScanned,
    criticalFailures,
    criticalFailuresChange: -15,
    avgScore,
    avgScoreChange: 2,
    securityEvents,
    dataProtected,
    avgResponseTime: '12 min',
    responseTimeChange: -8,
    networkUptime: '99.98%',
  }
}

export const dashboardMetrics: DashboardMetrics = calculateDashboardMetrics()

// Generate compliance trend leading to current score
const generateComplianceTrend = (): ComplianceTrendPoint[] => {
  const currentScore = dashboardMetrics.overallCompliance
  const days = 10
  const trend: ComplianceTrendPoint[] = []
  
  for (let i = 0; i < days; i++) {
    const date = new Date(2026, 1, 3 + i) // Feb 3-12, 2026
    const progress = i / (days - 1)
    // Score progresses from 70 to current score with some variance
    const baseScore = 70 + (currentScore - 70) * progress
    const variance = Math.sin(i * 0.5) * 1.5
    const score = Math.round(baseScore + variance)
    
    trend.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.min(100, Math.max(60, score))
    })
  }
  
  return trend
}

export const complianceTrend: ComplianceTrendPoint[] = generateComplianceTrend()

// Calculate top failed controls from issues
export const topFailedControls: TopFailedControl[] = issues
  .filter(issue => issue.status === 'Open' || issue.status === 'In Progress')
  .sort((a, b) => b.hostsAffected - a.hostsAffected)
  .slice(0, 3)
  .map(issue => ({
    ruleId: issue.ruleId,
    severity: issue.severity as 'critical' | 'high' | 'medium',
    description: issue.description,
    hostsAffected: issue.hostsAffected
  }))

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

// Extended compliance trend data for 30 days leading to current score
export const complianceTrend30Days: ComplianceTrendPoint[] = Array.from({ length: 31 }, (_, i) => {
  const date = new Date(2026, 0, 13 + i) // Jan 13 - Feb 12, 2026
  const currentScore = dashboardMetrics.overallCompliance
  const startScore = currentScore - 10 // Started 10 points lower
  const progress = i / 30
  const baseScore = startScore + (currentScore - startScore) * progress
  const variance = Math.sin(i * 0.3) * 3 + Math.random() * 2
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: Math.min(100, Math.max(60, Math.round(baseScore + variance))),
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

// Calculate compliance analytics from actual data
const calculateComplianceAnalytics = (): ComplianceAnalytics => {
  // Calculate from hosts
  const totalEndpoints = hosts.length
  const compliantHosts = hosts.filter(h => h.score >= 80).length
  const nonCompliantHosts = hosts.filter(h => h.score < 80 && h.score >= 50).length
  const criticalHosts = hosts.filter(h => h.score < 50).length
  
  const systemCompliance = (compliantHosts / totalEndpoints) * 100
  
  // Calculate severity data from issues and hosts
  const criticalIssues = issues.filter(i => i.severity === 'critical')
  const highIssues = issues.filter(i => i.severity === 'high')
  const mediumIssues = issues.filter(i => i.severity === 'medium')
  const lowIssues = issues.filter(i => i.severity === 'low')
  
  const totalPolicies = complianceRules.length * 16 // Rules across frameworks
  const totalControls = totalPolicies * 7 // Controls per policy
  
  return {
    systemCompliance: Math.round(systemCompliance * 10) / 10,
    complianceChange: 2.3,
    totalEndpoints,
    totalPolicies,
    totalControls,
    statusDistribution: {
      compliant: Math.round(systemCompliance * 10) / 10,
      nonCompliant: Math.round((nonCompliantHosts / totalEndpoints) * 1000) / 10,
      notApplicable: Math.round((criticalHosts / totalEndpoints) * 1000) / 10,
      unknown: Math.round((1 - compliantHosts / totalEndpoints - nonCompliantHosts / totalEndpoints - criticalHosts / totalEndpoints) * 1000) / 10,
    },
    severityData: [
      { 
        severity: 'Critical', 
        passed: Math.round((totalEndpoints - criticalIssues.reduce((sum, i) => sum + i.hostsAffected, 0)) * 1.2),
        failed: criticalIssues.reduce((sum, i) => sum + i.hostsAffected, 0)
      },
      { 
        severity: 'High', 
        passed: Math.round((totalEndpoints - highIssues.reduce((sum, i) => sum + i.hostsAffected, 0)) * 1.5),
        failed: highIssues.reduce((sum, i) => sum + i.hostsAffected, 0)
      },
      { 
        severity: 'Medium', 
        passed: Math.round((totalEndpoints - mediumIssues.reduce((sum, i) => sum + i.hostsAffected, 0)) * 2.3),
        failed: mediumIssues.reduce((sum, i) => sum + i.hostsAffected, 0) || 12
      },
      { 
        severity: 'Low', 
        passed: Math.round((totalEndpoints - lowIssues.reduce((sum, i) => sum + i.hostsAffected, 0)) * 1.8),
        failed: lowIssues.reduce((sum, i) => sum + i.hostsAffected, 0) || 8
      },
    ],
  }
}

export const complianceAnalytics: ComplianceAnalytics = calculateComplianceAnalytics()