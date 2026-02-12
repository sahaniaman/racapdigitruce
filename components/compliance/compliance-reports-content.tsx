'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, TrendingUp } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { complianceAnalytics } from '@/lib/data'
import { PDFExporter, type PDFReportData } from '@/lib/pdf-exporter'
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
} from 'recharts'

const pieData = [
  { name: 'Compliant', value: 78.5, color: '#22c55e' },
  { name: 'Non-Compliant', value: 10.9, color: '#ef4444' },
  { name: 'Not Applicable', value: 6.4, color: '#f59e0b' },
  { name: 'Unknown', value: 4.1, color: '#A192D9' },
]

// Category compliance data
const categoryData = [
  { category: 'Authentication', total: 124, passed: 98, failed: 26 },
  { category: 'Network Security', total: 156, passed: 132, failed: 24 },
  { category: 'Data Protection', total: 98, passed: 71, failed: 27 },
  { category: 'Access Control', total: 142, passed: 118, failed: 24 },
  { category: 'Patch Management', total: 168, passed: 125, failed: 43 },
  { category: 'Configuration', total: 168, passed: 139, failed: 29 },
]

export function ComplianceReportsContent() {
  const { selectedLocation, hasPermission } = useApp()
  const [activeTab, setActiveTab] = useState('overall')

  const handleExportPDF = () => {
    if (!hasPermission('canExport')) {
      alert('You do not have permission to export reports')
      return
    }

    // Generate comprehensive compliance report matching the attached format
    const pdfData: PDFReportData = {
      title: 'Overall Compliance Summary Report',
      date: new Date().toLocaleString('en-IN'),
      summaryMetrics: {
        systemCompliance: complianceAnalytics.systemCompliance,
        totalEndpoints: complianceAnalytics.totalEndpoints,
        totalControls: complianceAnalytics.totalControls,
      },
      severityData: complianceAnalytics.severityData.map(item => ({
        severity: item.severity,
        passed: item.passed,
        failed: item.failed,
      })),
      categoryData: categoryData,
      sections: [],
    }

    // Export to PDF
    PDFExporter.exportToPDF(pdfData)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Compliance & Analytics Reports
        </h1>
        <p className="text-muted-foreground">
          Comprehensive compliance reporting with advanced analytics
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger
            value="overall"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Overall Summary
          </TabsTrigger>
          <TabsTrigger
            value="endpoints"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Endpoints
          </TabsTrigger>
          <TabsTrigger
            value="failed"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Failed Controls
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Control Analysis
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Trends
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-purple data-[state=active]:text-white"
          >
            Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-6 mt-6">
          {/* Overall Compliance Summary */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Overall Compliance Summary
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    System-wide compliance across all endpoints and controls
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-purple text-purple hover:bg-purple hover:text-white bg-transparent"
                  onClick={handleExportPDF}
                  disabled={!hasPermission('canExport')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-secondary/50 border-border">
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-sm">System Compliance</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-purple">
                        {complianceAnalytics.systemCompliance}%
                      </span>
                      <span className="text-green text-sm flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {complianceAnalytics.complianceChange}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/50 border-border">
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-sm">Total Endpoints</p>
                    <span className="text-3xl font-bold text-foreground">
                      {complianceAnalytics.totalEndpoints}
                    </span>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/50 border-border">
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-sm">Total Policies</p>
                    <span className="text-3xl font-bold text-foreground">
                      {complianceAnalytics.totalPolicies}
                    </span>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/50 border-border">
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-sm">Total Controls</p>
                    <span className="text-3xl font-bold text-foreground">
                      {complianceAnalytics.totalControls}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Compliance Status Distribution
                </h3>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111118',
                          border: '1px solid #2a2a3a',
                          borderRadius: '8px',
                          color: '#ffffff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm" style={{ color: item.color }}>
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Compliance by Severity
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complianceAnalytics.severityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                      <XAxis dataKey="severity" stroke="#888899" />
                      <YAxis stroke="#888899" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111118',
                          border: '1px solid #2a2a3a',
                          borderRadius: '8px',
                          color: '#ffffff',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="passed" name="Passed" fill="#22c55e" />
                      <Bar dataKey="failed" name="Failed" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Endpoint Compliance Details
              </h2>
              <p className="text-muted-foreground">
                Detailed compliance information for each endpoint in {selectedLocation}.
              </p>
              <div className="mt-6 text-center py-12 text-muted-foreground">
                Select an endpoint from the Hosts page to view detailed compliance data.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Failed Controls Analysis
              </h2>
              <p className="text-muted-foreground mb-6">
                Breakdown of all failed compliance controls across the organization.
              </p>
              <div className="space-y-4">
                {[
                  { rule: 'CIS-1.3', desc: 'Automatic updates disabled', hosts: 23, severity: 'critical' },
                  { rule: 'ISO-5.3', desc: 'Password complexity requirements', hosts: 18, severity: 'high' },
                  { rule: 'NIST-AC-2', desc: 'User account monitoring', hosts: 15, severity: 'high' },
                  { rule: 'PCI-8.2.3', desc: 'Multi-factor authentication', hosts: 12, severity: 'critical' },
                ].map((item) => (
                  <div
                    key={item.rule}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-purple font-mono">{item.rule}</span>
                      <span className="text-foreground">{item.desc}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{item.hosts} hosts affected</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.severity === 'critical'
                            ? 'bg-red text-white'
                            : 'bg-orange text-black'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Control Analysis
              </h2>
              <p className="text-muted-foreground">
                Deep analysis of compliance controls by framework and category.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Compliance Trends
              </h2>
              <p className="text-muted-foreground">
                View detailed trends on the Compliance Trends page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Asset Inventory Report
              </h2>
              <p className="text-muted-foreground">
                View detailed inventory on the Inventory page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
