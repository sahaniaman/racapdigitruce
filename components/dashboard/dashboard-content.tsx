'use client'

import React from "react"

import { TrendingUp, TrendingDown, Monitor, AlertTriangle, Activity, Shield, Clock, Wifi } from 'lucide-react'
import { dashboardMetrics, complianceTrend, topFailedControls } from '@/lib/data'
import { ComplianceTrendChart } from './compliance-trend-chart'
import { TopFailedControls } from './top-failed-controls'
import { cn } from '@/lib/utils'

function MetricCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  showProgress,
  progressValue,
}: {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  icon?: React.ElementType
  showProgress?: boolean
  progressValue?: number
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
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
}: {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ElementType
  change?: number
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">RACAP Dashboard</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green" />
            <span className="text-sm text-purple">Secured & Monitored by DigiTruce AI</span>
          </div>
        </div>
        <div className="text-right text-sm">
          <div className="text-muted-foreground">
            Uptime: <span className="text-green">{dashboardMetrics.networkUptime}</span>
          </div>
          <div className="text-muted-foreground">
            Last refreshed: 17/11/2025, 15:00:00
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Overall Compliance"
          value={`${dashboardMetrics.overallCompliance}%`}
          change={dashboardMetrics.complianceChange}
          icon={Activity}
          showProgress
          progressValue={dashboardMetrics.overallCompliance}
        />
        <MetricCard
          title="Hosts Scanned"
          value={dashboardMetrics.hostsScanned}
          subtitle="Active monitoring"
          icon={Monitor}
        />
        <MetricCard
          title="Critical Failures"
          value={dashboardMetrics.criticalFailures}
          change={dashboardMetrics.criticalFailuresChange}
          icon={AlertTriangle}
        />
        <MetricCard
          title="Avg Score (30d)"
          value={`${dashboardMetrics.avgScore}%`}
          change={dashboardMetrics.avgScoreChange}
          icon={TrendingUp}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Security Events"
          value={dashboardMetrics.securityEvents.toLocaleString()}
          subtitle="Last 24 hours"
          icon={Shield}
        />
        <StatCard
          title="Data Protected"
          value={dashboardMetrics.dataProtected}
          subtitle="Encrypted storage"
          icon={Monitor}
        />
        <StatCard
          title="Avg Response Time"
          value={dashboardMetrics.avgResponseTime}
          change={dashboardMetrics.responseTimeChange}
          icon={Clock}
        />
        <StatCard
          title="Network Uptime"
          value={dashboardMetrics.networkUptime}
          subtitle="This month"
          icon={Wifi}
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
