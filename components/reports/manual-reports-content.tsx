'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, Download, Trash2, Plus, Calendar, AlertCircle } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { useToast } from '@/hooks/use-toast'

interface ManualReport {
  id: string
  title: string
  type: string
  uploadedBy: string
  uploadDate: string
  fileSize: string
  status: 'Active' | 'Archived'
}

const initialReports: ManualReport[] = [
  {
    id: '1',
    title: 'Q4 2025 Security Audit Report',
    type: 'Security Audit',
    uploadedBy: 'Rajesh Kumar',
    uploadDate: '15/01/2026',
    fileSize: '2.4 MB',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Annual Compliance Review 2025',
    type: 'Compliance Review',
    uploadedBy: 'Priya Sharma',
    uploadDate: '10/01/2026',
    fileSize: '5.1 MB',
    status: 'Active',
  },
  {
    id: '3',
    title: 'Penetration Test Results - Nov 2025',
    type: 'Penetration Test',
    uploadedBy: 'Amit Patel',
    uploadDate: '28/11/2025',
    fileSize: '1.8 MB',
    status: 'Active',
  },
  {
    id: '4',
    title: 'Risk Assessment Report Q3',
    type: 'Risk Assessment',
    uploadedBy: 'Sneha Reddy',
    uploadDate: '05/10/2025',
    fileSize: '3.2 MB',
    status: 'Archived',
  },
]

export function ManualReportsContent() {
  const { toast } = useToast()
  const { currentUser, selectedLocation, hasPermission } = useApp()
  const [reports, setReports] = useState<ManualReport[]>(initialReports)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newReport, setNewReport] = useState({
    title: '',
    type: '',
    description: '',
  })

  const handleUpload = async () => {
    if (!hasPermission('canGenerateReports')) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to upload reports. Please contact your administrator for access.',
        variant: 'destructive',
      })
      return
    }

    if (!newReport.title || !newReport.type) {
      toast({
        title: 'Incomplete Form',
        description: 'Please fill in all required fields before uploading.',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 1500))

    const report: ManualReport = {
      id: String(reports.length + 1),
      title: newReport.title,
      type: newReport.type,
      uploadedBy: currentUser.name,
      uploadDate: new Date().toLocaleDateString('en-GB'),
      fileSize: '1.0 MB',
      status: 'Active',
    }

    setReports([report, ...reports])
    setNewReport({ title: '', type: '', description: '' })
    setShowUploadForm(false)
    setIsUploading(false)
    
    toast({
      title: 'Report Uploaded Successfully',
      description: `${newReport.title} has been uploaded and is now available for review.`,
    })
  }

  const handleDelete = (id: string) => {
    if (!hasPermission('canDelete')) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to delete reports. Contact your administrator.',
        variant: 'destructive',
      })
      return
    }

    const report = reports.find((r) => r.id === id)
    setReports(reports.filter((r) => r.id !== id))
    
    toast({
      title: 'Report Deleted',
      description: report ? `${report.title} has been successfully removed.` : 'Report has been deleted.',
    })
  }

  const handleDownload = (report: ManualReport) => {
    if (!hasPermission('canExport')) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to download reports.',
        variant: 'destructive',
      })
      return
    }
    toast({
      title: 'Download Started',
      description: `Downloading ${report.title}...`,
    })
    // Actual download logic would go here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manual Reports</h1>
          <p className="text-muted-foreground">
            Upload and manage manual compliance and audit reports
          </p>
          <p className="text-sm text-purple mt-1">
            Viewing data for: {selectedLocation}
          </p>
        </div>
        <Button
          className="bg-purple text-white hover:bg-purple/90"
          onClick={() => setShowUploadForm(true)}
          disabled={!hasPermission('canGenerateReports')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload Report
        </Button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Upload New Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Report Title *
                </Label>
                <Input
                  id="title"
                  value={newReport.title}
                  onChange={(e) =>
                    setNewReport({ ...newReport, title: e.target.value })
                  }
                  placeholder="Enter report title"
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">
                  Report Type *
                </Label>
                <Select
                  value={newReport.type}
                  onValueChange={(value) =>
                    setNewReport({ ...newReport, type: value })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Security Audit">Security Audit</SelectItem>
                    <SelectItem value="Compliance Review">Compliance Review</SelectItem>
                    <SelectItem value="Penetration Test">Penetration Test</SelectItem>
                    <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                    <SelectItem value="Incident Report">Incident Report</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={newReport.description}
                onChange={(e) =>
                  setNewReport({ ...newReport, description: e.target.value })
                }
                placeholder="Enter report description (optional)"
                className="bg-secondary border-border text-foreground"
                rows={3}
              />
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Supported formats: PDF, DOCX, XLSX (Max 25MB)
              </p>
              <Button variant="outline" className="mt-4 border-border bg-transparent">
                Browse Files
              </Button>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-border bg-transparent"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple text-white hover:bg-purple/90"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Uploading...
                  </>
                ) : (
                  'Upload Report'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Uploaded Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{report.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{report.type}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.uploadDate}
                      </span>
                      <span>{report.uploadedBy}</span>
                      <span>{report.fileSize}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      report.status === 'Active'
                        ? 'bg-green/20 text-green border-green/30'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {report.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(report)}
                    disabled={!hasPermission('canExport')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(report.id)}
                    disabled={!hasPermission('canDelete')}
                    className="text-muted-foreground hover:text-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
