'use client'

import { useState } from 'react'
import { Shield, Clock, Settings, Download, RotateCcw } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { auditLogsStorage } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

const severityColors = {
  critical: 'bg-red text-white',
  high: 'bg-orange text-black',
  medium: 'bg-yellow text-black',
  low: 'bg-green text-black',
}

const frameworkColors: Record<string, string> = {
  CIS: 'bg-secondary text-foreground',
  ISO: 'bg-secondary text-foreground',
  NIST: 'bg-secondary text-foreground',
  PCI: 'bg-secondary text-foreground',
  HIPAA: 'bg-secondary text-foreground',
}

export function AdminContent() {
  const { 
    currentUser, 
    complianceRules, 
    toggleRuleLocation, 
    hasPermission, 
    auditLogs,
    resetComplianceRules 
  } = useApp()
  const [activeTab, setActiveTab] = useState('compliance-controls')

  const canManageRules = hasPermission('canManageRules')
  const canViewAuditLogs = hasPermission('canViewAuditLogs')
  const canChangeSettings = hasPermission('canChangeSettings')

  const handleExportLogs = () => {
    const logsText = auditLogsStorage.export()
    const blob = new Blob([logsText], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    } catch {
      return timestamp
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="mt-1 text-muted-foreground">
          System configuration and compliance control management
        </p>
        <span className="mt-2 inline-block rounded bg-purple px-3 py-1 text-sm font-medium text-white">
          {currentUser.role}
        </span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="compliance-controls" className="data-[state=active]:bg-card">
            <Shield className="h-4 w-4 mr-2" />
            Compliance Controls
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="data-[state=active]:bg-card">
            <Clock className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-card">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Compliance Controls Tab */}
        <TabsContent value="compliance-controls" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Location-wise Compliance Control Management
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enable or disable compliance rules per location. Disabled rules will be marked as "Not Applicable" and excluded from compliance calculations.
              </p>
              {!canManageRules && (
                <div className="mt-4 p-3 bg-orange/10 border border-orange/30 rounded-lg">
                  <p className="text-orange text-sm">
                    You have view-only access. Contact an administrator to make changes to compliance rules.
                  </p>
                </div>
              )}
              {canManageRules && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={resetComplianceRules}
                    className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Defaults
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Rule ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Framework
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Severity
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      DEL
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      MUM
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      BLR
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                      HYD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complianceRules.map((rule) => (
                    <tr key={rule.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm text-purple">{rule.ruleId}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('rounded px-2 py-1 text-xs font-bold', frameworkColors[rule.framework])}>
                          {rule.framework}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground max-w-md">
                        {rule.description}
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('rounded px-2 py-1 text-xs font-medium', severityColors[rule.severity])}>
                          {rule.severity}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Switch
                          checked={rule.locations.DEL}
                          onCheckedChange={() => toggleRuleLocation(rule.id, 'DEL')}
                          disabled={!canManageRules}
                          className="data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Switch
                          checked={rule.locations.MUM}
                          onCheckedChange={() => toggleRuleLocation(rule.id, 'MUM')}
                          disabled={!canManageRules}
                          className="data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Switch
                          checked={rule.locations.BLR}
                          onCheckedChange={() => toggleRuleLocation(rule.id, 'BLR')}
                          disabled={!canManageRules}
                          className="data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Switch
                          checked={rule.locations.HYD}
                          onCheckedChange={() => toggleRuleLocation(rule.id, 'HYD')}
                          disabled={!canManageRules}
                          className="data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Audit Logs</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Track all administrative actions and configuration changes. Showing {auditLogs.length} recent entries.
                </p>
              </div>
              {canViewAuditLogs && (
                <button
                  onClick={handleExportLogs}
                  className="flex items-center gap-2 rounded-lg bg-purple px-4 py-2 text-sm font-medium text-white hover:bg-purple/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export Logs
                </button>
              )}
            </div>

            {!canViewAuditLogs ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  You do not have permission to view audit logs.
                </p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No audit logs available yet. Actions will be logged here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'rounded px-2 py-1 text-xs font-medium',
                            log.action.includes('Enabled') ? 'bg-green/20 text-green' :
                            log.action.includes('Disabled') ? 'bg-orange/20 text-orange' :
                            log.action.includes('Denied') ? 'bg-red/20 text-red' :
                            'bg-purple/20 text-purple'
                          )}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {log.userName}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {log.role}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">System Settings</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Configure global system settings and preferences.
            </p>

            {!canChangeSettings && (
              <div className="mb-6 p-3 bg-orange/10 border border-orange/30 rounded-lg">
                <p className="text-orange text-sm">
                  You have view-only access. Only Super Admins can modify system settings.
                </p>
              </div>
            )}

            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                <div>
                  <h3 className="font-medium text-foreground">Auto-scan Interval</h3>
                  <p className="text-sm text-muted-foreground">How often to automatically scan hosts</p>
                </div>
                <select 
                  className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!canChangeSettings}
                  defaultValue="24"
                >
                  <option value="6">Every 6 hours</option>
                  <option value="12">Every 12 hours</option>
                  <option value="24">Every 24 hours</option>
                  <option value="48">Every 48 hours</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                <div>
                  <h3 className="font-medium text-foreground">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive alerts for critical compliance issues</p>
                </div>
                <Switch 
                  defaultChecked 
                  disabled={!canChangeSettings}
                  className="data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed" 
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                <div>
                  <h3 className="font-medium text-foreground">Slack Integration</h3>
                  <p className="text-sm text-muted-foreground">Send notifications to Slack channel</p>
                </div>
                <Switch 
                  disabled={!canChangeSettings}
                  className="data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed" 
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                <div>
                  <h3 className="font-medium text-foreground">Data Retention</h3>
                  <p className="text-sm text-muted-foreground">How long to keep scan history</p>
                </div>
                <select 
                  className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!canChangeSettings}
                  defaultValue="90"
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
                <div>
                  <h3 className="font-medium text-foreground">API Access</h3>
                  <p className="text-sm text-muted-foreground">Enable REST API for external integrations</p>
                </div>
                <Switch 
                  defaultChecked 
                  disabled={!canChangeSettings}
                  className="data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed" 
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
