'use client'

import { useState, useMemo } from 'react'
import { Search, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { issues, type Issue } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const severityColors = {
  critical: 'bg-red text-white',
  high: 'bg-orange text-black',
  medium: 'bg-yellow text-black',
  low: 'bg-green text-black',
}

const statusColors = {
  Open: 'text-red',
  'In Progress': 'text-orange',
  Resolved: 'text-green',
}

const statusIcons = {
  Open: XCircle,
  'In Progress': Clock,
  Resolved: CheckCircle,
}

const severityOptions = ['All Severities', 'critical', 'high', 'medium', 'low']
const statusOptions = ['All Status', 'Open', 'In Progress', 'Resolved']
const frameworkOptions = ['All Frameworks', 'CIS', 'ISO', 'NIST', 'PCI', 'HIPAA']

export function IssuesContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedFramework, setSelectedFramework] = useState('All Frameworks')
  const [issuesList, setIssuesList] = useState<Issue[]>(issues)

  const filteredIssues = useMemo(() => {
    return issuesList.filter((issue) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !issue.ruleId.toLowerCase().includes(query) &&
          !issue.description.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      if (selectedSeverity !== 'All Severities' && issue.severity !== selectedSeverity) {
        return false
      }

      if (selectedStatus !== 'All Status' && issue.status !== selectedStatus) {
        return false
      }

      if (selectedFramework !== 'All Frameworks' && issue.framework !== selectedFramework) {
        return false
      }

      return true
    })
  }, [issuesList, searchQuery, selectedSeverity, selectedStatus, selectedFramework])

  const stats = useMemo(() => {
    const open = issuesList.filter((i) => i.status === 'Open').length
    const inProgress = issuesList.filter((i) => i.status === 'In Progress').length
    const resolved = issuesList.filter((i) => i.status === 'Resolved').length
    const critical = issuesList.filter((i) => i.severity === 'critical').length
    return { open, inProgress, resolved, critical }
  }, [issuesList])

  const updateIssueStatus = (issueId: string, newStatus: Issue['status']) => {
    setIssuesList((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Issues</h1>
        <p className="mt-1 text-muted-foreground">
          Track and manage compliance issues across your infrastructure
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <XCircle className="h-4 w-4 text-red" />
            <span className="text-sm">Open Issues</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-red">{stats.open}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-orange" />
            <span className="text-sm">In Progress</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-orange">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green" />
            <span className="text-sm">Resolved</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-green">{stats.resolved}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-red" />
            <span className="text-sm">Critical</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.critical}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by rule ID or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
          />
        </div>

        <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
          <SelectTrigger className="w-40 border-border bg-secondary">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            {severityOptions.map((severity) => (
              <SelectItem key={severity} value={severity}>
                {severity === 'All Severities' ? severity : severity.charAt(0).toUpperCase() + severity.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-36 border-border bg-secondary">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedFramework} onValueChange={setSelectedFramework}>
          <SelectTrigger className="w-40 border-border bg-secondary">
            <SelectValue placeholder="All Frameworks" />
          </SelectTrigger>
          <SelectContent>
            {frameworkOptions.map((framework) => (
              <SelectItem key={framework} value={framework}>
                {framework}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Issues Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Rule ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Severity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Framework
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Hosts Affected
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  First Detected
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => {
                const StatusIcon = statusIcons[issue.status]
                return (
                  <tr key={issue.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-cyan">{issue.ruleId}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn('rounded px-2 py-1 text-xs font-medium', severityColors[issue.severity])}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground max-w-md">
                      {issue.description}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded bg-secondary px-2 py-1 text-xs font-bold text-foreground">
                        {issue.framework}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-foreground">{issue.hostsAffected}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {issue.firstDetected}
                    </td>
                    <td className="px-4 py-4">
                      <div className={cn('flex items-center gap-1.5', statusColors[issue.status])}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{issue.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Select
                        value={issue.status}
                        onValueChange={(value) => updateIssueStatus(issue.id, value as Issue['status'])}
                      >
                        <SelectTrigger className="w-32 h-8 border-border bg-secondary text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredIssues.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No issues found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}
