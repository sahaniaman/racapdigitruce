'use client'

import { useState, useMemo } from 'react'
import { FileText, Download, Calendar, Check, FileDown, GitCompare, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { reports, hosts, complianceRules, issues, complianceAnalytics, type Report } from '@/lib/data'
import { cn } from '@/lib/utils'
import { reportsStorage, complianceSnapshotStorage, type ComplianceSnapshot } from '@/lib/storage'
import { PDFExporter, type PDFReportData } from '@/lib/pdf-exporter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Sample historical compliance data for comparison
const historicalData: Record<string, {
  systemCompliance: number
  totalEndpoints: number
  totalControls: number
  severityData: { severity: string; passed: number; failed: number }[]
  categoryData: { category: string; total: number; passed: number; failed: number }[]
}> = {
  '2026-01-15': {
    systemCompliance: 72.3,
    totalEndpoints: 230,
    totalControls: 820,
    severityData: [
      { severity: 'Critical', passed: 135, failed: 45 },
      { severity: 'High', passed: 170, failed: 80 },
      { severity: 'Medium', passed: 265, failed: 65 },
      { severity: 'Low', passed: 140, failed: 32 },
    ],
    categoryData: [
      { category: 'Authentication', total: 118, passed: 85, failed: 33 },
      { category: 'Network Security', total: 148, passed: 118, failed: 30 },
      { category: 'Data Protection', total: 92, passed: 62, failed: 30 },
      { category: 'Access Control', total: 135, passed: 105, failed: 30 },
      { category: 'Patch Management', total: 160, passed: 108, failed: 52 },
      { category: 'Configuration', total: 160, passed: 120, failed: 40 },
    ]
  },
  '2026-02-01': {
    systemCompliance: 75.8,
    totalEndpoints: 240,
    totalControls: 845,
    severityData: [
      { severity: 'Critical', passed: 148, failed: 35 },
      { severity: 'High', passed: 182, failed: 62 },
      { severity: 'Medium', passed: 280, failed: 52 },
      { severity: 'Low', passed: 148, failed: 25 },
    ],
    categoryData: [
      { category: 'Authentication', total: 120, passed: 92, failed: 28 },
      { category: 'Network Security', total: 152, passed: 126, failed: 26 },
      { category: 'Data Protection', total: 95, passed: 68, failed: 27 },
      { category: 'Access Control', total: 138, passed: 112, failed: 26 },
      { category: 'Patch Management', total: 165, passed: 118, failed: 47 },
      { category: 'Configuration', total: 165, passed: 132, failed: 33 },
    ]
  },
  '2026-02-12': {
    systemCompliance: 78.5,
    totalEndpoints: 245,
    totalControls: 856,
    severityData: [
      { severity: 'Critical', passed: 142, failed: 18 },
      { severity: 'High', passed: 198, failed: 34 },
      { severity: 'Medium', passed: 287, failed: 45 },
      { severity: 'Low', passed: 156, failed: 12 },
    ],
    categoryData: [
      { category: 'Authentication', total: 124, passed: 98, failed: 26 },
      { category: 'Network Security', total: 156, passed: 132, failed: 24 },
      { category: 'Data Protection', total: 98, passed: 71, failed: 27 },
      { category: 'Access Control', total: 142, passed: 118, failed: 24 },
      { category: 'Patch Management', total: 168, passed: 125, failed: 43 },
      { category: 'Configuration', total: 168, passed: 139, failed: 29 },
    ]
  }
}

const availableDates = Object.keys(historicalData).sort()

export function ReportsContent() {
  const [activeTab, setActiveTab] = useState('generate')
  const [reportName, setReportName] = useState(`Compliance Report - ${new Date().toLocaleDateString('en-GB').replace(/\//g, '/')}`)
  const [startDate, setStartDate] = useState('2026-01-27')
  const [endDate, setEndDate] = useState('2026-02-03')
  const [selectedHosts, setSelectedHosts] = useState('all')
  const [includeRawPayload, setIncludeRawPayload] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [recentReports, setRecentReports] = useState<Report[]>(reports)
  
  // Comparison state
  const [compareDate1, setCompareDate1] = useState(availableDates[0])
  const [compareDate2, setCompareDate2] = useState(availableDates[availableDates.length - 1])

  // Calculate comparison data
  const comparisonResult = useMemo(() => {
    const data1 = historicalData[compareDate1]
    const data2 = historicalData[compareDate2]
    
    if (!data1 || !data2) return null
    
    const complianceChange = data2.systemCompliance - data1.systemCompliance
    const endpointsChange = data2.totalEndpoints - data1.totalEndpoints
    const controlsChange = data2.totalControls - data1.totalControls
    
    // Calculate severity changes
    const severityChanges = data2.severityData.map((item, idx) => {
      const prev = data1.severityData[idx]
      const prevComp = prev ? (prev.passed / (prev.passed + prev.failed)) * 100 : 0
      const currComp = (item.passed / (item.passed + item.failed)) * 100
      return {
        severity: item.severity,
        previousCompliance: prevComp.toFixed(1),
        currentCompliance: currComp.toFixed(1),
        change: (currComp - prevComp).toFixed(1),
        trend: currComp > prevComp ? 'up' : currComp < prevComp ? 'down' : 'stable'
      }
    })
    
    // Calculate category changes
    const categoryChanges = data2.categoryData.map((item, idx) => {
      const prev = data1.categoryData[idx]
      const prevComp = prev ? (prev.passed / prev.total) * 100 : 0
      const currComp = (item.passed / item.total) * 100
      return {
        category: item.category,
        previousCompliance: prevComp.toFixed(1),
        currentCompliance: currComp.toFixed(1),
        change: (currComp - prevComp).toFixed(1),
        trend: currComp > prevComp ? 'up' : currComp < prevComp ? 'down' : 'stable'
      }
    })
    
    return {
      previousDate: compareDate1,
      currentDate: compareDate2,
      previousCompliance: data1.systemCompliance,
      currentCompliance: data2.systemCompliance,
      complianceChange,
      endpointsChange,
      controlsChange,
      overallTrend: complianceChange > 0 ? 'improving' : complianceChange < 0 ? 'worsening' : 'stable',
      severityChanges,
      categoryChanges,
      data1,
      data2
    }
  }, [compareDate1, compareDate2])

  const handleGenerateReport = () => {
    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      const newReport: Report = {
        id: String(Date.now()),
        name: reportName,
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '/'),
        hosts: selectedHosts === 'all' ? hosts.length : parseInt(selectedHosts),
        status: 'Completed',
      }
      setRecentReports((prev) => [newReport, ...prev])
      setIsGenerating(false)
    }, 2000)
  }

  const handleDownload = (report: Report) => {
    // Generate comprehensive PDF report data
    const criticalIssues = issues.filter(i => i.severity === 'critical')
    const highIssues = issues.filter(i => i.severity === 'high')
    
    const pdfData: PDFReportData = {
      title: report.name,
      subtitle: 'RACAP Compliance Report - DigiTruce Security Platform',
      date: new Date().toLocaleString('en-IN'),
      metadata: {
        'Report ID': report.id,
        'Generated': report.date,
        'Hosts Included': report.hosts.toString(),
        'Status': report.status,
        'Generated By': 'RACAP System'
      },
      sections: [
        {
          title: 'Executive Summary',
          content: [
            'This report provides a comprehensive overview of the compliance status across all monitored hosts in the organization.',
            `Total Hosts Scanned: ${hosts.length}`,
            `Total Compliance Rules: ${complianceRules.length}`,
            `Critical Issues: ${criticalIssues.length}`,
            `High Priority Issues: ${highIssues.length}`
          ]
        },
        {
          title: 'Compliance Score Overview',
          content: [
            'Average Compliance Score: 82%',
            'Improvement from Last Period: +3%',
            'Total Failed Controls: 56',
            'Total Passed Controls: 234'
          ]
        },
        {
          title: 'Top Failed Controls',
          type: 'table',
          content: criticalIssues.slice(0, 10).map(issue => ({
            'Rule ID': issue.ruleId,
            'Framework': issue.framework,
            'Severity': issue.severity,
            'Hosts Affected': issue.hostsAffected,
            'Status': issue.status
          }))
        },
        {
          title: 'Host Summary',
          type: 'table',
          content: hosts.slice(0, 15).map(host => ({
            'Hostname': host.hostname,
            'OS': host.os,
            'Score': `${host.score}%`,
            'Critical Failed': host.criticalFailed || 0,
            'Last Seen': host.lastSeen
          }))
        },
        {
          title: 'Recommendations',
          type: 'list',
          content: [
            'Enable automatic security updates on all affected hosts',
            'Implement strong password complexity requirements across all systems',
            'Enable comprehensive user account monitoring and auditing',
            'Review and update firewall rules for critical infrastructure',
            'Schedule regular compliance assessments and remediation cycles',
            'Conduct security awareness training for all administrative staff',
            'Implement multi-factor authentication for administrative access'
          ]
        }
      ]
    }
    
    // Export to PDF (opens print dialog)
    PDFExporter.exportToPDF(pdfData)
  }

  const handleDownloadText = (report: Report) => {
    // Generate text version
    const pdfData: PDFReportData = {
      title: report.name,
      date: new Date().toLocaleString('en-IN'),
      metadata: {
        'Report ID': report.id,
        'Generated': report.date,
        'Hosts': report.hosts.toString()
      },
      sections: [
        {
          title: 'Executive Summary',
          content: 'This report provides a comprehensive overview of the compliance status.'
        }
      ]
    }
    
    PDFExporter.downloadAsText(pdfData, report.name.replace(/\s+/g, '-'))
  }

  const handleExportComparisonPDF = () => {
    if (!comparisonResult) return

    const pdfData: PDFReportData = {
      title: 'Compliance Comparison Report',
      date: new Date().toLocaleString('en-IN'),
      summaryMetrics: {
        systemCompliance: comparisonResult.currentCompliance,
        totalEndpoints: comparisonResult.data2.totalEndpoints,
        totalControls: comparisonResult.data2.totalControls,
      },
      severityData: comparisonResult.data2.severityData,
      categoryData: comparisonResult.data2.categoryData,
      comparisonData: {
        previousDate: comparisonResult.previousDate,
        currentDate: comparisonResult.currentDate,
        previousCompliance: comparisonResult.previousCompliance,
        currentCompliance: comparisonResult.currentCompliance,
        changes: [
          {
            metric: 'System Compliance',
            previous: `${comparisonResult.previousCompliance}%`,
            current: `${comparisonResult.currentCompliance}%`,
            change: `${comparisonResult.complianceChange > 0 ? '+' : ''}${comparisonResult.complianceChange.toFixed(1)}%`,
            trend: comparisonResult.complianceChange > 0 ? 'up' : comparisonResult.complianceChange < 0 ? 'down' : 'stable'
          },
          {
            metric: 'Total Endpoints',
            previous: comparisonResult.data1.totalEndpoints,
            current: comparisonResult.data2.totalEndpoints,
            change: `${comparisonResult.endpointsChange > 0 ? '+' : ''}${comparisonResult.endpointsChange}`,
            trend: comparisonResult.endpointsChange > 0 ? 'up' : comparisonResult.endpointsChange < 0 ? 'down' : 'stable'
          },
          {
            metric: 'Total Controls',
            previous: comparisonResult.data1.totalControls,
            current: comparisonResult.data2.totalControls,
            change: `${comparisonResult.controlsChange > 0 ? '+' : ''}${comparisonResult.controlsChange}`,
            trend: comparisonResult.controlsChange > 0 ? 'up' : comparisonResult.controlsChange < 0 ? 'down' : 'stable'
          },
          ...comparisonResult.severityChanges.map(s => ({
            metric: `${s.severity} Severity Compliance`,
            previous: `${s.previousCompliance}%`,
            current: `${s.currentCompliance}%`,
            change: `${Number(s.change) > 0 ? '+' : ''}${s.change}%`,
            trend: s.trend as 'up' | 'down' | 'stable'
          }))
        ]
      },
      sections: []
    }

    PDFExporter.exportToPDF(pdfData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="mt-1 text-muted-foreground">
          Generate, compare, and download compliance reports
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger
            value="generate"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </TabsTrigger>
          <TabsTrigger
            value="compare"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
        {/* Generate New Report Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Generate New Report</h2>
            
            <div className="space-y-5">
              {/* Report Name */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary py-2.5 px-4 text-sm placeholder:text-muted-foreground focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                />
              </div>

              {/* Date Range */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-secondary py-2.5 px-4 text-sm focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                    />
                    <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-lg border border-border bg-secondary py-2.5 px-4 text-sm focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
                    />
                    <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Select Hosts */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Select Hosts
                </label>
                <Select value={selectedHosts} onValueChange={setSelectedHosts}>
                  <SelectTrigger className="w-full border-border bg-secondary">
                    <SelectValue placeholder="Select hosts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hosts ({hosts.length})</SelectItem>
                    <SelectItem value="critical">Critical Hosts Only</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant Hosts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Include Raw Payload */}
              <div className="flex items-center gap-3">
                <Checkbox
                  id="raw-payload"
                  checked={includeRawPayload}
                  onCheckedChange={(checked) => setIncludeRawPayload(checked as boolean)}
                />
                <label htmlFor="raw-payload" className="text-sm text-muted-foreground cursor-pointer">
                  Include raw scan payload (increases file size)
                </label>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className={cn(
                  'w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors',
                  isGenerating
                    ? 'bg-purple/50 text-white/50 cursor-not-allowed'
                    : 'bg-purple text-white hover:bg-purple/90'
                )}
              >
                <FileText className="h-4 w-4" />
                {isGenerating ? 'Generating Report...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Reports</h2>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {report.date} &middot; {report.hosts} hosts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 rounded-full border border-green/50 px-3 py-1 text-xs font-medium text-green">
                      <Check className="h-3 w-3" />
                      {report.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(report)}
                        className="flex items-center gap-2 rounded-lg bg-purple px-4 py-2 text-sm font-medium text-white hover:bg-purple/90 transition-colors"
                      >
                        <FileDown className="h-4 w-4" />
                        PDF
                      </button>
                      <button
                        onClick={() => handleDownloadText(report)}
                        className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Text
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Details Sidebar */}
        <div>
          <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">Report Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Included Information:</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Executive summary
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Compliance score trends
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Failed controls breakdown
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Host-by-host details
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    Remediation recommendations
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Format:</h3>
                <p className="text-sm text-muted-foreground">PDF (portable document)</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-1">Estimated Size:</h3>
                <p className="text-sm text-muted-foreground">~2 MB</p>
              </div>
            </div>
          </div>
        </div>
          </div>
        </TabsContent>

        {/* Compare Reports Tab */}
        <TabsContent value="compare" className="mt-6">
          <div className="space-y-6">
            {/* Date Selectors */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Select Reports to Compare</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Previous Report Date
                    </label>
                    <Select value={compareDate1} onValueChange={setCompareDate1}>
                      <SelectTrigger className="w-full bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {availableDates.map(date => (
                          <SelectItem key={date} value={date}>{date}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Current Report Date
                    </label>
                    <Select value={compareDate2} onValueChange={setCompareDate2}>
                      <SelectTrigger className="w-full bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {availableDates.map(date => (
                          <SelectItem key={date} value={date}>{date}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Results */}
            {comparisonResult && (
              <>
                {/* Overall Comparison */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-foreground">Compliance Comparison</h2>
                      <button
                        onClick={handleExportComparisonPDF}
                        className="flex items-center gap-2 rounded-lg bg-purple px-4 py-2 text-sm font-medium text-white hover:bg-purple/90 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Export Comparison PDF
                      </button>
                    </div>

                    {/* Comparison Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-secondary/50 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Previous ({comparisonResult.previousDate})</p>
                        <p className="text-3xl font-bold text-muted-foreground">{comparisonResult.previousCompliance}%</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Change</p>
                        <div className="flex items-center justify-center gap-2">
                          {comparisonResult.complianceChange > 0 ? (
                            <TrendingUp className="h-6 w-6 text-green" />
                          ) : comparisonResult.complianceChange < 0 ? (
                            <TrendingDown className="h-6 w-6 text-red" />
                          ) : (
                            <ArrowRight className="h-6 w-6 text-orange" />
                          )}
                          <span className={cn(
                            'text-3xl font-bold',
                            comparisonResult.complianceChange > 0 ? 'text-green' :
                            comparisonResult.complianceChange < 0 ? 'text-red' : 'text-orange'
                          )}>
                            {comparisonResult.complianceChange > 0 ? '+' : ''}{comparisonResult.complianceChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Current ({comparisonResult.currentDate})</p>
                        <p className="text-3xl font-bold text-purple">{comparisonResult.currentCompliance}%</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center mb-6">
                      <span className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium',
                        comparisonResult.overallTrend === 'improving' ? 'bg-green/10 text-green' :
                        comparisonResult.overallTrend === 'worsening' ? 'bg-red/10 text-red' : 'bg-orange/10 text-orange'
                      )}>
                        {comparisonResult.overallTrend === 'improving' ? '↑ Compliance Improving' :
                         comparisonResult.overallTrend === 'worsening' ? '↓ Compliance Declining' : '→ Compliance Stable'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Severity Comparison */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Severity Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Severity</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Previous</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Current</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonResult.severityChanges.map((item) => (
                            <tr key={item.severity} className="border-b border-border/50">
                              <td className="py-3 px-4 text-sm font-medium text-foreground">{item.severity}</td>
                              <td className="py-3 px-4 text-sm text-center text-muted-foreground">{item.previousCompliance}%</td>
                              <td className="py-3 px-4 text-sm text-center text-foreground">{item.currentCompliance}%</td>
                              <td className="py-3 px-4 text-sm text-center">
                                <span className={cn(
                                  'flex items-center justify-center gap-1',
                                  item.trend === 'up' ? 'text-green' :
                                  item.trend === 'down' ? 'text-red' : 'text-orange'
                                )}>
                                  {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                                   item.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                                   <ArrowRight className="h-4 w-4" />}
                                  {Number(item.change) > 0 ? '+' : ''}{item.change}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Comparison */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Category Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Previous</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Current</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonResult.categoryChanges.map((item) => (
                            <tr key={item.category} className="border-b border-border/50">
                              <td className="py-3 px-4 text-sm font-medium text-foreground">{item.category}</td>
                              <td className="py-3 px-4 text-sm text-center text-muted-foreground">{item.previousCompliance}%</td>
                              <td className="py-3 px-4 text-sm text-center text-foreground">{item.currentCompliance}%</td>
                              <td className="py-3 px-4 text-sm text-center">
                                <span className={cn(
                                  'flex items-center justify-center gap-1',
                                  item.trend === 'up' ? 'text-green' :
                                  item.trend === 'down' ? 'text-red' : 'text-orange'
                                )}>
                                  {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> :
                                   item.trend === 'down' ? <TrendingDown className="h-4 w-4" /> :
                                   <ArrowRight className="h-4 w-4" />}
                                  {Number(item.change) > 0 ? '+' : ''}{item.change}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
