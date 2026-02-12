'use client'

import React, { useState } from "react"

import { TrendingUp, TrendingDown, Monitor, AlertTriangle, Activity, Shield, Clock, Wifi, X } from 'lucide-react'
import { dashboardMetrics, complianceTrend, topFailedControls, hosts, issues } from '@/lib/data'
import { ComplianceTrendChart } from './compliance-trend-chart'
import { TopFailedControls } from './top-failed-controls'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'

// Custom label renderer for pie charts with white text
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  name,
}: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '14px', fontWeight: '600' }}
    >
      {value}
    </text>
  )
}

// Chart data for each metric - calculated from actual data
const complianceHistoryData = complianceTrend.map((point, i) => ({
  month: point.date.split(' ')[0],
  compliance: point.score
})).slice(-7) // Last 7 days

// Calculate hosts status from actual hosts data
const compliantHosts = hosts.filter(h => h.score >= 80).length
const nonCompliantHosts = hosts.filter(h => h.score < 80 && h.score >= 50).length
const pendingScanHosts = hosts.filter(h => h.score < 50).length

const hostsStatusData = [
  { name: 'Compliant', value: compliantHosts, color: '#22c55e' },
  { name: 'Non-Compliant', value: nonCompliantHosts, color: '#ef4444' },
  { name: 'Pending Scan', value: pendingScanHosts, color: '#f59e0b' },
]

// Calculate critical failures trend (last 4 weeks)
const criticalFailuresData = Array.from({ length: 4 }, (_, i) => ({
  week: `W${i + 1}`,
  failures: Math.max(dashboardMetrics.criticalFailures - i * 2, dashboardMetrics.criticalFailures - 5)
})).reverse()

// Calculate average score progression over 30 days
const avgScoreData = Array.from({ length: 6 }, (_, i) => ({
  day: `Day ${i * 5 + 1}-${(i + 1) * 5}`,
  score: Math.round(dashboardMetrics.avgScore - (5 - i) * 0.5)
}))

// Calculate security events from issues
const criticalIssues = issues.filter(i => i.severity === 'critical')
const highIssues = issues.filter(i => i.severity === 'high')
const mediumIssues = issues.filter(i => i.severity === 'medium')

const securityEventsData = [
  { 
    category: 'Informational', 
    count: Math.round(dashboardMetrics.securityEvents * 0.68), 
    color: '#3b82f6', 
    description: 'Low priority security events' 
  },
  { 
    category: 'Warning', 
    count: Math.round(dashboardMetrics.securityEvents * 0.23), 
    color: '#f59e0b', 
    description: 'Medium priority security events' 
  },
  { 
    category: 'Critical', 
    count: Math.round(dashboardMetrics.securityEvents * 0.09), 
    color: '#ef4444', 
    description: 'High priority security events' 
  },
]

// Calculate data protection from dashboard metrics
const totalDataTB = parseFloat(dashboardMetrics.dataProtected)
const dataProtectionData = [
  { type: 'Encrypted', value: Math.round(totalDataTB * 0.875 * 10) / 10, color: '#22c55e', description: 'Data protected with encryption' },
  { type: 'Unencrypted', value: Math.round(totalDataTB * 0.125 * 10) / 10, color: '#f59e0b', description: 'Data without encryption' },
]

// Calculate response time progression
const currentResponseTime = parseInt(dashboardMetrics.avgResponseTime)
const responseTimeData = Array.from({ length: 4 }, (_, i) => ({
  period: `Week ${i + 1}`,
  time: currentResponseTime + (3 - i) * 1
}))

// Calculate network uptime for the week
const uptimePercent = parseFloat(dashboardMetrics.networkUptime)
const networkUptimeData = [
  { day: 'Mon', uptime: Math.round((uptimePercent - 0.1 + Math.random() * 0.2) * 100) / 100 },
  { day: 'Tue', uptime: Math.round((uptimePercent + Math.random() * 0.1) * 100) / 100 },
  { day: 'Wed', uptime: Math.round((uptimePercent - 0.2 + Math.random() * 0.2) * 100) / 100 },
  { day: 'Thu', uptime: Math.round((uptimePercent + Math.random() * 0.1) * 100) / 100 },
  { day: 'Fri', uptime: Math.round((uptimePercent - 0.1 + Math.random() * 0.2) * 100) / 100 },
  { day: 'Sat', uptime: 100 },
  { day: 'Sun', uptime: 99.9 },
]

function MetricCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  showProgress,
  progressValue,
  onClick,
}: {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  icon?: React.ElementType
  showProgress?: boolean
  progressValue?: number
  onClick?: () => void
}) {
  return (
    <div 
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        onClick && "cursor-pointer hover:border-purple transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="mt-2 flex items-center gap-4">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {showProgress && progressValue !== undefined && (
          <div className="relative h-12 w-12">
            <svg className="h-12 w-12 -rotate-90 transform">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${(progressValue / 100) * 125.6} 125.6`}
                className="text-green"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {progressValue}%
            </span>
          </div>
        )}
      </div>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red" />
          )}
          <span className={cn('text-sm', change >= 0 ? 'text-green' : 'text-red')}>
            {change >= 0 ? '+' : ''}{change}% vs last period
          </span>
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  onClick,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ElementType
  change?: number
  onClick?: () => void
}) {
  return (
    <div 
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        onClick && "cursor-pointer hover:border-purple transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="mt-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
      </div>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          {change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red" />
          )}
          <span className={cn('text-sm', change >= 0 ? 'text-green' : 'text-red')}>
            {change >= 0 ? '+' : ''}{change}% vs last period
          </span>
        </div>
      )}
    </div>
  )
}

export function DashboardContent() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const renderMetricChart = (metric: string) => {
    switch (metric) {
      case 'compliance':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceHistoryData}>
                <defs>
                  <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D50E9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6D50E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="month" stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                <YAxis stroke="#ffffff" tick={{ fill: '#ffffff' }} domain={[70, 85]} />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="#6D50E9" 
                  strokeWidth={2}
                  fill="url(#complianceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )
      case 'hosts':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hostsStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={{
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeWidth: 3,
                    paintOrder: 'stroke',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                  labelLine={{ stroke: '#ffffff', strokeWidth: 1 }}
                >
                  {hostsStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  wrapperStyle={{ color: '#ffffff' }}
                  formatter={(value) => <span style={{ color: '#ffffff' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )
      case 'failures':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criticalFailuresData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="week" stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                <YAxis stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                <Bar dataKey="failures" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      case 'avgScore':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={avgScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="day" stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                <YAxis stroke="#ffffff" tick={{ fill: '#ffffff' }} domain={[75, 80]} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      case 'events':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={securityEventsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={{
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeWidth: 3,
                    paintOrder: 'stroke',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                  labelLine={{ stroke: '#ffffff', strokeWidth: 1 }}
                >
                  {securityEventsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  wrapperStyle={{ color: '#ffffff' }}
                  formatter={(value, entry: any) => (
                    <span style={{ color: '#ffffff' }}>
                      {entry.payload.category} ({entry.payload.count})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Color Definitions:</p>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="text-foreground"><strong>Blue:</strong> Informational Events (Low Priority)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span className="text-foreground"><strong>Orange:</strong> Warning Events (Medium Priority)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
                  <span className="text-foreground"><strong>Red:</strong> Critical Events (High Priority)</span>
                </div>
              </div>
            </div>
          </div>
        )
      case 'data':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataProtectionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={(props) => {
                    const { x, y, value, cx } = props
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth="3"
                        paintOrder="stroke"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize="16"
                        fontWeight="bold"
                      >
                        {`${value} TB`}
                      </text>
                    )
                  }}
                  labelLine={{ stroke: '#ffffff', strokeWidth: 1 }}
                >
                  {dataProtectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  wrapperStyle={{ color: '#ffffff' }}
                  formatter={(value, entry: any) => (
                    <span style={{ color: '#ffffff' }}>
                      {entry.payload.type} ({entry.payload.value} TB)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">Color Definitions:</p>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                  <span className="text-foreground"><strong>Green:</strong> Encrypted Data (Secure)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span className="text-foreground"><strong>Orange:</strong> Unencrypted Data (At Risk)</span>
                </div>
              </div>
            </div>
          </div>
        )
      case 'response':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="period" stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                <YAxis stroke="#ffffff" tick={{ fill: '#ffffff' }} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#ffffff' }} />
                <Bar dataKey="time" fill="#6D50E9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      case 'uptime':
        return (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkUptimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="day" stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                <YAxis stroke="#ffffff" tick={{ fill: '#ffffff' }} domain={[99, 100]} />
                <Line 
                  type="monotone" 
                  dataKey="uptime" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      default:
        return null
    }
  }

  const getMetricTitle = (metric: string) => {
    switch (metric) {
      case 'compliance': return 'Overall Compliance Trend'
      case 'hosts': return 'Hosts Status Distribution'
      case 'failures': return 'Critical Failures Trend'
      case 'avgScore': return 'Average Score (30 Days)'
      case 'events': return 'Security Events Breakdown'
      case 'data': return 'Data Protection Overview'
      case 'response': return 'Average Response Time'
      case 'uptime': return 'Network Uptime'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
            <span className="text-sm text-purple">Real-time Compliance Monitoring • Powered by DigiTruce AI</span>
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="text-muted-foreground">
            Network Uptime: <span className="text-green font-medium">{dashboardMetrics.networkUptime}</span>
          </div>
          <div className="text-muted-foreground">
            Last refreshed: {new Date().toLocaleString('en-IN', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}
          </div>
        </div>
      </div>

      {/* Chart Modal */}
      <Dialog open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="max-w-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{getMetricTitle(selectedMetric || '')}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedMetric && renderMetricChart(selectedMetric)}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Overall Compliance"
          value={`${dashboardMetrics.overallCompliance}%`}
          change={dashboardMetrics.complianceChange}
          icon={Activity}
          showProgress
          progressValue={dashboardMetrics.overallCompliance}
          onClick={() => setSelectedMetric('compliance')}
        />
        <MetricCard
          title="Hosts Scanned"
          value={dashboardMetrics.hostsScanned}
          subtitle="Active monitoring"
          icon={Monitor}
          onClick={() => setSelectedMetric('hosts')}
        />
        <MetricCard
          title="Critical Failures"
          value={dashboardMetrics.criticalFailures}
          change={dashboardMetrics.criticalFailuresChange}
          icon={AlertTriangle}
          onClick={() => setSelectedMetric('failures')}
        />
        <MetricCard
          title="Avg Score (30d)"
          value={`${dashboardMetrics.avgScore}%`}
          change={dashboardMetrics.avgScoreChange}
          icon={TrendingUp}
          onClick={() => setSelectedMetric('avgScore')}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Security Events"
          value={dashboardMetrics.securityEvents.toLocaleString()}
          subtitle="Last 24 hours"
          icon={Shield}
          onClick={() => setSelectedMetric('events')}
        />
        <StatCard
          title="Data Protected"
          value={dashboardMetrics.dataProtected}
          subtitle="Encrypted storage"
          icon={Monitor}
          onClick={() => setSelectedMetric('data')}
        />
        <StatCard
          title="Avg Response Time"
          value={dashboardMetrics.avgResponseTime}
          change={dashboardMetrics.responseTimeChange}
          icon={Clock}
          onClick={() => setSelectedMetric('response')}
        />
        <StatCard
          title="Network Uptime"
          value={dashboardMetrics.networkUptime}
          subtitle="This month"
          icon={Wifi}
          onClick={() => setSelectedMetric('uptime')}
        />
      </div>

      {/* Charts and Top Failed Controls */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ComplianceTrendChart data={complianceTrend} />
        </div>
        <div>
          <TopFailedControls controls={topFailedControls} />
        </div>
      </div>
    </div>
  )
}
