'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Download, RefreshCw, ChevronDown, ArrowLeft } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { hostDetails, hosts } from '@/lib/data'

interface HostDetailContentProps {
  hostId: string
}

export function HostDetailContent({ hostId }: HostDetailContentProps) {
  const router = useRouter()
  const { hasPermission } = useApp()
  const [rawPayloadOpen, setRawPayloadOpen] = useState(false)
  const [isRescanning, setIsRescanning] = useState(false)

  // Get host details or create from basic host data
  const hostDetail = hostDetails[hostId]
  const basicHost = hosts.find((h) => h.id === hostId)

  if (!hostDetail && !basicHost) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Host not found</p>
        <Button
          variant="outline"
          className="mt-4 bg-transparent"
          onClick={() => router.push('/hosts')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hosts
        </Button>
      </div>
    )
  }

  const host = hostDetail || {
    id: basicHost!.id,
    hostname: basicHost!.hostname,
    os: basicHost!.os,
    ipAddress: '10.0.0.' + basicHost!.id,
    domain: 'CORP',
    lastSeen: basicHost!.lastSeen,
    cpu: 'Intel Xeon E5-2690',
    memory: '32 GB',
    disk: '1TB SSD',
    uptime: '30 days',
    tags: ['production'],
    score: basicHost!.score,
    location: 'DEL' as const,
    recentActivity: [
      {
        type: 'Scan completed',
        timestamp: basicHost!.lastSeen,
        details: `Score: ${basicHost!.score}%`,
      },
    ],
    evaluatedRules: [],
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green text-black'
    if (score >= 60) return 'bg-orange text-black'
    return 'bg-red text-white'
  }

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red text-white',
      high: 'bg-orange text-black',
      medium: 'bg-yellow text-black',
      low: 'bg-green text-black',
    }
    return colors[severity as keyof typeof colors] || 'bg-muted'
  }

  const handleExport = () => {
    if (!hasPermission('canExport')) {
      alert('You do not have permission to export data')
      return
    }
    const data = JSON.stringify(host, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${host.hostname}-report.json`
    a.click()
  }

  const handleRescan = async () => {
    if (!hasPermission('canRescan')) {
      alert('You do not have permission to rescan hosts')
      return
    }
    setIsRescanning(true)
    // Simulate rescan
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRescanning(false)
    alert('Rescan completed successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/hosts')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{host.hostname}</h1>
          <p className="text-muted-foreground">{host.os}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`text-lg px-4 py-2 ${getScoreColor(host.score)}`}>
            Score: {host.score}%
          </Badge>
          <Button
            variant="outline"
            className="border-border bg-transparent"
            onClick={handleExport}
            disabled={!hasPermission('canExport')}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            className="bg-cyan text-black hover:bg-cyan/90"
            onClick={handleRescan}
            disabled={!hasPermission('canRescan') || isRescanning}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRescanning ? 'animate-spin' : ''}`} />
            {isRescanning ? 'Scanning...' : 'Rescan'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Host Info */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Host Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">IP Address</p>
                <p className="text-foreground font-medium">{host.ipAddress}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Domain</p>
                <p className="text-foreground font-medium">{host.domain}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Last Seen</p>
                <p className="text-foreground font-medium">{host.lastSeen}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">CPU</p>
                <p className="text-foreground font-medium">{host.cpu}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Memory</p>
                <p className="text-foreground font-medium">{host.memory}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Disk</p>
                <p className="text-foreground font-medium">{host.disk}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Uptime</p>
                <p className="text-foreground font-medium">{host.uptime}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {host.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-secondary text-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raw Payload */}
          <Collapsible open={rawPayloadOpen} onOpenChange={setRawPayloadOpen}>
            <Card className="bg-card border-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Raw Payload</CardTitle>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        rawPayloadOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <pre className="text-xs text-muted-foreground bg-secondary p-4 rounded-lg overflow-auto max-h-64">
                    {JSON.stringify(host, null, 2)}
                  </pre>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {host.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan mt-2" />
                  <div>
                    <p className="text-foreground font-medium">{activity.type}</p>
                    <p className="text-muted-foreground text-sm">{activity.timestamp}</p>
                    <p className="text-muted-foreground text-sm">{activity.details}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Evaluated Rules */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Evaluated Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {host.evaluatedRules.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No evaluated rules available for this host.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                          Rule ID
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                          Description
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                          Expected
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                          Actual
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                          Status
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                          Severity
                        </th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium text-sm">
                          Remediation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {host.evaluatedRules.map((rule, index) => (
                        <tr
                          key={index}
                          className="border-b border-border hover:bg-secondary/30"
                        >
                          <td className="py-4 px-2">
                            <span className="text-cyan font-mono text-sm">
                              {rule.ruleId}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-foreground text-sm max-w-48">
                            {rule.description}
                          </td>
                          <td className="py-4 px-2 text-muted-foreground text-sm max-w-32">
                            {rule.expected}
                          </td>
                          <td className="py-4 px-2 text-foreground text-sm max-w-32">
                            {rule.actual}
                          </td>
                          <td className="py-4 px-2">
                            <Badge
                              className={
                                rule.status === 'PASS'
                                  ? 'bg-green text-black'
                                  : 'bg-red text-white'
                              }
                            >
                              {rule.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-2">
                            <Badge className={getSeverityBadge(rule.severity)}>
                              {rule.severity}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 text-muted-foreground text-sm max-w-64">
                            {rule.remediation || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
