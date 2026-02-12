// PDF Export Utility using browser's print functionality
// This creates a properly formatted HTML that can be printed to PDF

export interface PDFReportData {
  title: string
  subtitle?: string
  date: string
  sections: PDFSection[]
  metadata?: {
    generatedBy?: string
    organization?: string
    location?: string
    [key: string]: any
  }
  // New fields for compliance summary
  summaryMetrics?: {
    systemCompliance: number
    totalEndpoints: number
    totalControls: number
  }
  severityData?: {
    severity: string
    passed: number
    failed: number
  }[]
  categoryData?: {
    category: string
    total: number
    passed: number
    failed: number
  }[]
  // Comparison data
  comparisonData?: {
    previousDate: string
    currentDate: string
    previousCompliance: number
    currentCompliance: number
    changes: {
      metric: string
      previous: number | string
      current: number | string
      change: number | string
      trend: 'up' | 'down' | 'stable'
    }[]
  } | null
}

export interface PDFSection {
  title: string
  content: string | string[] | { [key: string]: any }[]
  type?: 'text' | 'table' | 'list' | 'chart'
}

export class PDFExporter {
  // Digitruce theme colors
  private static readonly COLORS = {
    primary: '#3498DB',
    primaryDark: '#2980B9',
    secondary: '#A192D9',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#f59e0b',
    text: '#1a1a1a',
    textMuted: '#64748b',
    background: '#ffffff',
    border: '#e2e8f0',
    tableHeader: '#3498DB',
    tableHeaderText: '#ffffff',
  }

  private static readonly styles = `
    <style>
      @media print {
        body { margin: 0; padding: 0; }
        .page-break { page-break-after: always; }
        .no-print { display: none; }
      }
      
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif;
        line-height: 1.6;
        color: ${this.COLORS.text};
        max-width: 210mm;
        margin: 0 auto;
        padding: 25mm 20mm;
        background: ${this.COLORS.background};
      }
      
      .report-header {
        margin-bottom: 24px;
      }
      
      h1 {
        color: ${this.COLORS.text};
        font-size: 32px;
        font-weight: 300;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
      }
      
      .generated-date {
        color: ${this.COLORS.textMuted};
        font-size: 14px;
        margin-bottom: 24px;
      }
      
      .summary-metrics {
        margin: 24px 0;
      }
      
      .summary-metric {
        margin: 8px 0;
        font-size: 16px;
        color: ${this.COLORS.text};
      }
      
      .summary-metric strong {
        font-weight: 600;
      }
      
      h2 {
        color: ${this.COLORS.text};
        font-size: 18px;
        font-weight: 600;
        margin-top: 32px;
        margin-bottom: 16px;
      }
      
      h3 {
        color: ${this.COLORS.text};
        font-size: 16px;
        margin-top: 16px;
        margin-bottom: 8px;
      }
      
      /* Modern Table Styles */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0 32px 0;
        font-size: 14px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      }
      
      th {
        background: ${this.COLORS.tableHeader};
        color: ${this.COLORS.tableHeaderText};
        font-weight: 600;
        text-align: left;
        padding: 14px 16px;
        border: none;
      }
      
      th:first-child {
        border-radius: 4px 0 0 0;
      }
      
      th:last-child {
        border-radius: 0 4px 0 0;
      }
      
      td {
        padding: 12px 16px;
        border-bottom: 1px solid ${this.COLORS.border};
        color: ${this.COLORS.text};
      }
      
      tr:last-child td {
        border-bottom: none;
      }
      
      tr:nth-child(even) {
        background: #f8fafc;
      }
      
      tr:hover {
        background: #f1f5f9;
      }
      
      /* Comparison Section Styles */
      .comparison-section {
        background: linear-gradient(135deg, #f8f9fc 0%, #f1f5f9 100%);
        border-radius: 8px;
        padding: 20px;
        margin: 24px 0;
        border: 1px solid ${this.COLORS.border};
      }
      
      .comparison-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid ${this.COLORS.border};
      }
      
      .comparison-title {
        font-size: 18px;
        font-weight: 600;
        color: ${this.COLORS.text};
        margin: 0;
      }
      
      .comparison-dates {
        font-size: 13px;
        color: ${this.COLORS.textMuted};
      }
      
      .change-positive {
        color: ${this.COLORS.success};
        font-weight: 600;
      }
      
      .change-negative {
        color: ${this.COLORS.danger};
        font-weight: 600;
      }
      
      .change-neutral {
        color: ${this.COLORS.warning};
        font-weight: 600;
      }
      
      .trend-arrow {
        font-size: 12px;
        margin-right: 4px;
      }
      
      /* List Styles */
      ul, ol {
        margin: 12px 0;
        padding-left: 24px;
      }
      
      li {
        margin: 8px 0;
        color: ${this.COLORS.text};
      }
      
      .section {
        margin: 24px 0;
      }
      
      .footer {
        margin-top: 48px;
        padding-top: 16px;
        border-top: 1px solid ${this.COLORS.border};
        font-size: 12px;
        color: ${this.COLORS.textMuted};
        text-align: center;
      }
      
      .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }
      
      .badge-critical { background: #fca5a5; color: #7f1d1d; }
      .badge-high { background: #fed7aa; color: #7c2d12; }
      .badge-medium { background: #fef08a; color: #713f12; }
      .badge-low { background: #bbf7d0; color: #14532d; }
      
      pre {
        background: #f8fafc;
        border: 1px solid ${this.COLORS.border};
        border-radius: 4px;
        padding: 12px;
        overflow-x: auto;
        font-size: 13px;
      }
      
      /* Overall compliance highlight */
      .compliance-highlight {
        font-size: 24px;
        font-weight: 600;
        color: ${this.COLORS.primary};
      }
    </style>
  `

  static generateHTML(data: PDFReportData): string {
    const { title, subtitle, date, sections, metadata, summaryMetrics, severityData, categoryData, comparisonData } = data

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${this.styles}
</head>
<body>
  <div class="report">
    <div class="report-header">
      <h1>${title}</h1>
      <p class="generated-date">Generated: ${date}</p>
    </div>
`

    // Render summary metrics if provided (matching the attached format)
    if (summaryMetrics) {
      html += `
    <div class="summary-metrics">
      <p class="summary-metric">System-Wide Compliance: <strong class="compliance-highlight">${summaryMetrics.systemCompliance}%</strong></p>
      <p class="summary-metric">Total Endpoints: <strong>${summaryMetrics.totalEndpoints}</strong></p>
      <p class="summary-metric">Total Controls: <strong>${summaryMetrics.totalControls}</strong></p>
    </div>
`
    }

    // Render severity data table (matching attached format)
    if (severityData && severityData.length > 0) {
      html += `
    <table>
      <thead>
        <tr>
          <th>Severity</th>
          <th>Passed</th>
          <th>Failed</th>
          <th>Compliance %</th>
        </tr>
      </thead>
      <tbody>
`
      severityData.forEach(item => {
        const total = item.passed + item.failed
        const compliance = total > 0 ? ((item.passed / total) * 100).toFixed(1) : '0.0'
        html += `
        <tr>
          <td>${item.severity}</td>
          <td>${item.passed}</td>
          <td>${item.failed}</td>
          <td>${compliance}%</td>
        </tr>
`
      })
      html += `
      </tbody>
    </table>
`
    }

    // Render category data table (matching attached format)
    if (categoryData && categoryData.length > 0) {
      html += `
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Total</th>
          <th>Passed</th>
          <th>Failed</th>
          <th>Compliance %</th>
        </tr>
      </thead>
      <tbody>
`
      categoryData.forEach(item => {
        const compliance = item.total > 0 ? ((item.passed / item.total) * 100).toFixed(1) : '0.0'
        html += `
        <tr>
          <td>${item.category}</td>
          <td>${item.total}</td>
          <td>${item.passed}</td>
          <td>${item.failed}</td>
          <td>${compliance}%</td>
        </tr>
`
      })
      html += `
      </tbody>
    </table>
`
    }

    // Render comparison section if available
    if (comparisonData) {
      html += this.renderComparisonSection(comparisonData)
    }

    // Render other sections
    sections.forEach(section => {
      html += this.renderSection(section)
    })

    html += `
    <div class="footer">
      <p>This report was generated by RACAP - Remote Automated Compliance Audit Platform</p>
      <p>© ${new Date().getFullYear()} DigiTruce Security Platform. All rights reserved.</p>
    </div>
  </div>
  
  <script>
    // Auto-print on load
    window.onload = function() {
      // Delay to ensure styles are loaded
      setTimeout(() => {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
`
    return html
  }

  private static renderComparisonSection(comparisonData: NonNullable<PDFReportData['comparisonData']>): string {
    const complianceChange = comparisonData.currentCompliance - comparisonData.previousCompliance
    const changeClass = complianceChange > 0 ? 'change-positive' : complianceChange < 0 ? 'change-negative' : 'change-neutral'
    const changeSymbol = complianceChange > 0 ? '↑' : complianceChange < 0 ? '↓' : '→'

    let html = `
    <div class="comparison-section">
      <div class="comparison-header">
        <h3 class="comparison-title">Compliance Comparison Report</h3>
        <span class="comparison-dates">${comparisonData.previousDate} vs ${comparisonData.currentDate}</span>
      </div>
      
      <div style="display: flex; justify-content: space-around; margin-bottom: 16px;">
        <div style="text-align: center;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Previous</p>
          <p style="font-size: 28px; font-weight: 600; color: #64748b; margin: 4px 0;">${comparisonData.previousCompliance}%</p>
        </div>
        <div style="text-align: center;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Change</p>
          <p class="${changeClass}" style="font-size: 28px; margin: 4px 0;">
            <span class="trend-arrow">${changeSymbol}</span>${Math.abs(complianceChange).toFixed(1)}%
          </p>
        </div>
        <div style="text-align: center;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Current</p>
          <p style="font-size: 28px; font-weight: 600; color: #6D50E9; margin: 4px 0;">${comparisonData.currentCompliance}%</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Previous</th>
            <th>Current</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
`
    comparisonData.changes.forEach(change => {
      const trendClass = change.trend === 'up' ? 'change-positive' : change.trend === 'down' ? 'change-negative' : 'change-neutral'
      const trendSymbol = change.trend === 'up' ? '↑' : change.trend === 'down' ? '↓' : '→'
      html += `
          <tr>
            <td>${change.metric}</td>
            <td>${change.previous}</td>
            <td>${change.current}</td>
            <td class="${trendClass}"><span class="trend-arrow">${trendSymbol}</span>${change.change}</td>
          </tr>
`
    })

    html += `
        </tbody>
      </table>
    </div>
`
    return html
  }

  private static renderSection(section: PDFSection): string {
    const { title, content, type = 'text' } = section

    let html = `<div class="section"><h2>${title}</h2>`

    switch (type) {
      case 'table':
        html += this.renderTable(content as any[])
        break
      case 'list':
        html += this.renderList(content as string[])
        break
      case 'text':
      default:
        if (typeof content === 'string') {
          html += `<p>${content}</p>`
        } else if (Array.isArray(content)) {
          html += content.map(item => `<p>${item}</p>`).join('')
        }
    }

    html += '</div>'
    return html
  }

  private static renderTable(rows: { [key: string]: any }[]): string {
    if (!rows || rows.length === 0) return '<p>No data available</p>'

    const headers = Object.keys(rows[0])
    
    let html = '<table><thead><tr>'
    headers.forEach(header => {
      html += `<th>${this.formatLabel(header)}</th>`
    })
    html += '</tr></thead><tbody>'

    rows.forEach(row => {
      html += '<tr>'
      headers.forEach(header => {
        const value = row[header]
        html += `<td>${this.formatValue(value)}</td>`
      })
      html += '</tr>'
    })

    html += '</tbody></table>'
    return html
  }

  private static renderList(items: string[]): string {
    if (!items || items.length === 0) return '<p>No items</p>'
    
    let html = '<ul>'
    items.forEach(item => {
      html += `<li>${item}</li>`
    })
    html += '</ul>'
    return html
  }

  private static formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  private static formatValue(value: any): string {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)
    
    // Check for severity badges
    if (['critical', 'high', 'medium', 'low'].includes(String(value).toLowerCase())) {
      return `<span class="badge badge-${String(value).toLowerCase()}">${value}</span>`
    }
    
    return String(value)
  }

  static exportToPDF(data: PDFReportData): void {
    const html = this.generateHTML(data)
    const printWindow = window.open('', '_blank')
    
    if (!printWindow) {
      alert('Please allow pop-ups to generate PDF reports')
      return
    }

    printWindow.document.write(html)
    printWindow.document.close()
  }

  static downloadAsHTML(data: PDFReportData, filename: string): void {
    const html = this.generateHTML(data)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  static exportToText(data: PDFReportData): string {
    const { title, subtitle, date, sections, metadata } = data
    
    let text = `${title}\n${'='.repeat(title.length)}\n\n`
    
    if (subtitle) {
      text += `${subtitle}\n\n`
    }
    
    text += `Generated: ${date}\n`
    
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        text += `${this.formatLabel(key)}: ${value}\n`
      })
    }
    
    text += '\n'
    
    sections.forEach(section => {
      text += `\n${section.title}\n${'-'.repeat(section.title.length)}\n`
      
      if (typeof section.content === 'string') {
        text += `${section.content}\n`
      } else if (Array.isArray(section.content)) {
        if (section.type === 'table' && section.content.length > 0) {
          section.content.forEach((row, idx) => {
            if (idx === 0) {
              const headers = Object.keys(row).join(' | ')
              text += `${headers}\n`
              text += `${'-'.repeat(headers.length)}\n`
            }
            text += Object.values(row).join(' | ') + '\n'
          })
        } else {
          section.content.forEach(item => {
            text += `- ${item}\n`
          })
        }
      }
    })
    
    text += `\n\n---\nGenerated by RACAP - Remote Automated Compliance Audit Platform\n`
    text += `© ${new Date().getFullYear()} DigiTruce Security Platform\n`
    
    return text
  }

  static downloadAsText(data: PDFReportData, filename: string): void {
    const text = this.exportToText(data)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
}
