'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Eye, FileText, RefreshCw } from 'lucide-react'
import { hosts, type Host } from '@/lib/data'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

function getScoreColor(score: number) {
  if (score >= 90) return 'bg-green text-black'
  if (score >= 70) return 'bg-green/80 text-black'
  if (score >= 50) return 'bg-orange text-black'
  return 'bg-red text-white'
}

const operatingSystems = ['All Operating Systems', 'Ubuntu', 'Windows Server', 'RHEL', 'Debian', 'CentOS']
const scoreRanges = ['All Scores', '90-100%', '70-89%', '50-69%', 'Below 50%']

export function HostsContent() {
  const router = useRouter()
  const { hasPermission, selectedLocation } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOS, setSelectedOS] = useState('All Operating Systems')
  const [selectedScore, setSelectedScore] = useState('All Scores')
  const [selectedHosts, setSelectedHosts] = useState<string[]>([])

  const handleViewHost = (hostId: string) => {
    router.push(`/hosts/${hostId}`)
  }

  const handleRescan = (hostId: string) => {
    if (!hasPermission('canRescan')) {
      alert('You do not have permission to rescan hosts')
      return
    }
    alert(`Rescanning host ${hostId}...`)
  }

  const filteredHosts = useMemo(() => {
    return hosts.filter((host) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !host.hostname.toLowerCase().includes(query) &&
          !host.os.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // OS filter
      if (selectedOS !== 'All Operating Systems') {
        if (!host.os.toLowerCase().includes(selectedOS.toLowerCase())) {
          return false
        }
      }

      // Score filter
      if (selectedScore !== 'All Scores') {
        const score = host.score
        switch (selectedScore) {
          case '90-100%':
            if (score < 90) return false
            break
          case '70-89%':
            if (score < 70 || score >= 90) return false
            break
          case '50-69%':
            if (score < 50 || score >= 70) return false
            break
          case 'Below 50%':
            if (score >= 50) return false
            break
        }
      }

      return true
    })
  }, [searchQuery, selectedOS, selectedScore])

  const toggleHostSelection = (hostId: string) => {
    setSelectedHosts((prev) =>
      prev.includes(hostId)
        ? prev.filter((id) => id !== hostId)
        : [...prev, hostId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hosts</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and monitor all compliance-scanned hosts
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by hostname, OS, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
          />
        </div>

        <Select value={selectedOS} onValueChange={setSelectedOS}>
          <SelectTrigger className="w-48 border-border bg-secondary">
            <SelectValue placeholder="All Operating Systems" />
          </SelectTrigger>
          <SelectContent>
            {operatingSystems.map((os) => (
              <SelectItem key={os} value={os}>
                {os}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedScore} onValueChange={setSelectedScore}>
          <SelectTrigger className="w-36 border-border bg-secondary">
            <SelectValue placeholder="All Scores" />
          </SelectTrigger>
          <SelectContent>
            {scoreRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={selectedHosts.length === filteredHosts.length && filteredHosts.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedHosts(filteredHosts.map((h) => h.id))
                      } else {
                        setSelectedHosts([])
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Hostname
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  OS
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Last Seen
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Critical Failed
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHosts.map((host) => (
                <HostRow
                  key={host.id}
                  host={host}
                  isSelected={selectedHosts.includes(host.id)}
                  onToggleSelect={() => toggleHostSelection(host.id)}
                  onView={() => handleViewHost(host.id)}
                  onRescan={() => handleRescan(host.id)}
                  canRescan={hasPermission('canRescan')}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredHosts.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No hosts found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}

function HostRow({
  host,
  isSelected,
  onToggleSelect,
  onView,
  onRescan,
  canRescan,
}: {
  host: Host
  isSelected: boolean
  onToggleSelect: () => void
  onView: () => void
  onRescan: () => void
  canRescan: boolean
}) {
  return (
    <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-3">
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onView}
          className="font-medium text-purple hover:underline cursor-pointer text-left"
        >
          {host.hostname}
        </button>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{host.os}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{host.lastSeen}</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-medium',
            getScoreColor(host.score)
          )}
        >
          {host.score}%
        </span>
      </td>
      <td className="px-4 py-3">
        {host.criticalFailed !== null ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red text-xs font-bold text-white">
            {host.criticalFailed}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onView}
            className="rounded p-1.5 hover:bg-secondary transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onView}
            className="rounded p-1.5 hover:bg-secondary transition-colors"
            title="View Report"
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onRescan}
            disabled={!canRescan}
            className={cn(
              'rounded p-1.5 transition-colors',
              canRescan
                ? 'hover:bg-secondary'
                : 'opacity-50 cursor-not-allowed'
            )}
            title={canRescan ? 'Rescan' : 'No permission to rescan'}
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </td>
    </tr>
  )
}
