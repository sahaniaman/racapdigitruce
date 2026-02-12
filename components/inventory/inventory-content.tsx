'use client'

import { useState, useMemo } from 'react'
import { Search, Download, Package, AlertTriangle, XCircle, HelpCircle } from 'lucide-react'
import { assets, type Asset } from '@/lib/data'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const assetTypes = ['All Types', 'Router', 'Server', 'Firewall']
const statusOptions = ['All Status', 'Compliant', 'Non-Compliant']
const riskOptions = ['All Risk', 'Low', 'Medium', 'High']

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green'
  if (score >= 70) return 'text-green/80'
  if (score >= 50) return 'text-orange'
  return 'text-red'
}

const statusColors = {
  Compliant: 'bg-green text-black',
  'Non-Compliant': 'bg-red text-white',
}

const riskColors = {
  Low: 'bg-green text-black',
  Medium: 'bg-orange text-black',
  High: 'bg-red text-white',
}

const typeColors = {
  Router: 'bg-secondary text-foreground',
  Server: 'bg-secondary text-foreground',
  Firewall: 'bg-secondary text-foreground',
}

export function InventoryContent() {
  const { selectedLocation } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [selectedRisk, setSelectedRisk] = useState('All Risk')

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !asset.hostname.toLowerCase().includes(query) &&
          !asset.assetId.toLowerCase().includes(query) &&
          !asset.owner.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Type filter
      if (selectedType !== 'All Types' && asset.type !== selectedType) {
        return false
      }

      // Status filter
      if (selectedStatus !== 'All Status' && asset.status !== selectedStatus) {
        return false
      }

      // Risk filter
      if (selectedRisk !== 'All Risk' && asset.risk !== selectedRisk) {
        return false
      }

      return true
    })
  }, [searchQuery, selectedType, selectedStatus, selectedRisk])

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredAssets.length
    const highRisk = filteredAssets.filter((a) => a.risk === 'High').length
    const nonCompliant = filteredAssets.filter((a) => a.status === 'Non-Compliant').length
    return { total, highRisk, nonCompliant, unknown: 0 }
  }, [filteredAssets])

  const handleExportCSV = () => {
    const headers = ['Asset ID', 'Hostname', 'Type', 'OS/Firmware', 'Owner', 'Status', 'Risk', 'Score', 'Last Scanned']
    const csvContent = [
      headers.join(','),
      ...filteredAssets.map((asset) =>
        [
          asset.assetId,
          asset.hostname,
          asset.type,
          asset.osFirmware,
          asset.owner,
          asset.status,
          asset.risk,
          `${asset.score}%`,
          asset.lastScanned,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'asset-inventory.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Asset Inventory</h1>
          <p className="mt-1 text-muted-foreground">
            Complete inventory of all managed assets
          </p>
          <p className="text-sm text-purple">
            Viewing data for: {selectedLocation}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span className="text-sm">Total Assets</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-red" />
            <span className="text-sm">High Risk Assets</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-red">{stats.highRisk}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <XCircle className="h-4 w-4 text-orange" />
            <span className="text-sm">Non-Compliant</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-orange">{stats.nonCompliant}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm">Unknown Status</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{stats.unknown}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          <span className="font-medium text-foreground">Filters</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search hostname, asset ID, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32 border-border bg-secondary">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
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

          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger className="w-28 border-border bg-secondary">
              <SelectValue placeholder="All Risk" />
            </SelectTrigger>
            <SelectContent>
              {riskOptions.map((risk) => (
                <SelectItem key={risk} value={risk}>
                  {risk}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Assets ({filteredAssets.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Asset ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Hostname
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  OS / Firmware
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Risk
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Score
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Last Scanned
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <AssetRow key={asset.id} asset={asset} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssets.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No assets found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}

function AssetRow({ asset }: { asset: Asset }) {
  return (
    <tr className="border-b border-border hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-3">
        <span className="font-mono text-sm text-purple">{asset.assetId}</span>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">{asset.hostname}</td>
      <td className="px-4 py-3">
        <span className={cn('rounded px-2 py-1 text-xs font-medium', typeColors[asset.type])}>
          {asset.type}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{asset.osFirmware}</td>
      <td className="px-4 py-3 text-sm text-foreground">{asset.owner}</td>
      <td className="px-4 py-3">
        <span className={cn('rounded px-2 py-1 text-xs font-medium', statusColors[asset.status])}>
          {asset.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={cn('rounded px-2 py-1 text-xs font-medium', riskColors[asset.risk])}>
          {asset.risk}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={cn('text-sm font-medium', getScoreColor(asset.score))}>
          {asset.score}%
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{asset.lastScanned}</td>
    </tr>
  )
}
