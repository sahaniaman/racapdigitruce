'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, Filter, TrendingUp } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { complianceTrend30Days } from '@/lib/data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function ComplianceTrendsContent() {
  const { selectedLocation, hasPermission } = useApp()
  const [timeRange, setTimeRange] = useState('30')
  const [framework, setFramework] = useState('all')

  const currentScore = complianceTrend30Days[complianceTrend30Days.length - 1]?.score || 0
  const firstScore = complianceTrend30Days[0]?.score || 0
  const periodChange = ((currentScore - firstScore) / firstScore * 100).toFixed(1)

  const handleExport = () => {
    if (!hasPermission('canExport')) {
      alert('You do not have permission to export data')
      return
    }
    // Generate CSV
    const headers = ['Date', 'Compliance Score']
    const rows = complianceTrend30Days.map(d => [d.date, d.score])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'compliance-trends.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance Trends</h1>
          <p className="text-muted-foreground">Historical compliance data and trend analysis</p>
          <p className="text-sm text-cyan mt-1">
            Viewing data for: {selectedLocation}
          </p>
        </div>
        <Button
          variant="outline"
          className="border-border text-foreground hover:bg-secondary bg-transparent"
          onClick={handleExport}
          disabled={!hasPermission('canExport')}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Time Range & Filters</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={framework} onValueChange={setFramework}>
              <SelectTrigger className="w-32 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="cis">CIS</SelectItem>
                <SelectItem value="iso">ISO</SelectItem>
                <SelectItem value="nist">NIST</SelectItem>
                <SelectItem value="pci">PCI</SelectItem>
                <SelectItem value="hipaa">HIPAA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Current Score</p>
            <p className="text-3xl font-bold text-cyan">{currentScore}%</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Period Change</p>
            <p className="text-3xl font-bold text-green">+{periodChange}%</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Avg Failed Controls</p>
            <p className="text-3xl font-bold text-orange">21</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Data Points</p>
            <p className="text-3xl font-bold text-foreground">{complianceTrend30Days.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Overall Compliance Percentage</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Compliance score over the selected time period
          </p>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceTrend30Days.slice(0, Number(timeRange))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis
                  dataKey="date"
                  stroke="#888899"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888899"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[60, 100]}
                  ticks={[60, 70, 80, 90, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111118',
                    border: '1px solid #2a2a3a',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                  labelStyle={{ color: '#888899' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00d4d4"
                  strokeWidth={2}
                  dot={{ fill: '#00d4d4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#00d4d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
