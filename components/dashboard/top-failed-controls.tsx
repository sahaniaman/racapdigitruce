'use client'

import { AlertTriangle, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react'
import type { TopFailedControl } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

interface TopFailedControlsProps {
  controls: TopFailedControl[]
}

const severityColors = {
  critical: 'bg-red text-white',
  high: 'bg-orange text-black',
  medium: 'bg-yellow text-black',
  low: 'bg-green text-black',
}

const severityPriority = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export function TopFailedControls({ controls }: TopFailedControlsProps) {
  // Calculate risk metrics with proper logic
  const riskAnalysis = useMemo(() => {
    if (!controls || controls.length === 0) return { totalAffected: 0, riskScore: 0, criticalCount: 0, trend: 'stable' as const }
    
    const totalAffected = controls.reduce((sum, c) => sum + c.hostsAffected, 0)
    const criticalCount = controls.filter(c => c.severity === 'critical').length
    
    // Calculate weighted risk score based on severity and affected hosts
    const riskScore = controls.reduce((score, control) => {
      const severityWeight = severityPriority[control.severity]
      return score + (severityWeight * control.hostsAffected)
    }, 0)
    
    // Normalize risk score to 0-100
    const maxPossibleRisk = controls.length * 4 * Math.max(...controls.map(c => c.hostsAffected), 1)
    const normalizedRisk = Math.round((riskScore / maxPossibleRisk) * 100)
    
    // Determine trend (simulated - in production would compare with historical data)
    const trend = normalizedRisk > 60 ? 'worsening' : normalizedRisk > 40 ? 'stable' : 'improving'
    
    return { totalAffected, riskScore: normalizedRisk, criticalCount, trend }
  }, [controls])

  // Sort controls by severity and affected hosts
  const sortedControls = useMemo(() => {
    return [...controls].sort((a, b) => {
      const severityDiff = severityPriority[b.severity] - severityPriority[a.severity]
      if (severityDiff !== 0) return severityDiff
      return b.hostsAffected - a.hostsAffected
    })
  }, [controls])

  // Generate trend SVG path based on control data
  const generateTrendPath = (index: number) => {
    const baseY = 20 - (index * 4)
    const points = [0, 16, 32, 48, 64]
    const variance = controls[index]?.hostsAffected || 0
    
    return points.map((x, i) => {
      const y = baseY + Math.sin(i + index) * (variance / 10)
      return `${i === 0 ? 'M' : 'L'}${x} ${Math.max(2, Math.min(22, y))}`
    }).join(' ')
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange" />
          <h3 className="text-lg font-semibold text-foreground">Top Failed Controls</h3>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Risk Score:</span>
          <span className={cn(
            'font-semibold px-2 py-0.5 rounded',
            riskAnalysis.riskScore > 60 ? 'text-red bg-red/10' : 
            riskAnalysis.riskScore > 40 ? 'text-orange bg-orange/10' : 'text-green bg-green/10'
          )}>
            {riskAnalysis.riskScore}%
          </span>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg bg-secondary/50">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple">{riskAnalysis.totalAffected}</p>
          <p className="text-xs text-muted-foreground">Total Affected</p>
        </div>
        <div className="text-center border-x border-border">
          <p className="text-2xl font-bold text-red">{riskAnalysis.criticalCount}</p>
          <p className="text-xs text-muted-foreground">Critical</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            {riskAnalysis.trend === 'worsening' ? (
              <TrendingUp className="h-4 w-4 text-red" />
            ) : riskAnalysis.trend === 'improving' ? (
              <TrendingDown className="h-4 w-4 text-green" />
            ) : (
              <ArrowRight className="h-4 w-4 text-orange" />
            )}
            <span className={cn(
              'text-sm font-medium capitalize',
              riskAnalysis.trend === 'worsening' ? 'text-red' :
              riskAnalysis.trend === 'improving' ? 'text-green' : 'text-orange'
            )}>
              {riskAnalysis.trend}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Trend</p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedControls.map((control, index) => (
          <div
            key={control.ruleId}
            className="rounded-lg border border-border bg-secondary/50 p-4 hover:border-purple/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-purple">{control.ruleId}</span>
                <span
                  className={cn(
                    'rounded px-2 py-0.5 text-xs font-medium',
                    severityColors[control.severity]
                  )}
                >
                  {control.severity}
                </span>
              </div>
              {/* Impact indicator */}
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      'h-full rounded-full',
                      control.severity === 'critical' ? 'bg-red' :
                      control.severity === 'high' ? 'bg-orange' : 'bg-yellow'
                    )}
                    style={{ width: `${Math.min(100, control.hostsAffected * 4)}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-foreground">{control.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{control.hostsAffected}</span> hosts affected
              </p>
              {/* Mini trend line */}
              <svg className="h-6 w-16" viewBox="0 0 64 24">
                <path
                  d={generateTrendPath(index)}
                  fill="none"
                  stroke={control.severity === 'critical' ? '#ef4444' : control.severity === 'high' ? '#f59e0b' : '#6D50E9'}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
