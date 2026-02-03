'use client'

import { AlertTriangle } from 'lucide-react'
import type { TopFailedControl } from '@/lib/data'
import { cn } from '@/lib/utils'

interface TopFailedControlsProps {
  controls: TopFailedControl[]
}

const severityColors = {
  critical: 'bg-red text-white',
  high: 'bg-orange text-black',
  medium: 'bg-yellow text-black',
  low: 'bg-green text-black',
}

export function TopFailedControls({ controls }: TopFailedControlsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange" />
        <h3 className="text-lg font-semibold text-foreground">Top Failed Controls</h3>
      </div>
      <div className="mt-4 space-y-4">
        {controls.map((control) => (
          <div
            key={control.ruleId}
            className="rounded-lg border border-border bg-secondary/50 p-4"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-cyan">{control.ruleId}</span>
              <span
                className={cn(
                  'rounded px-2 py-0.5 text-xs font-medium',
                  severityColors[control.severity]
                )}
              >
                {control.severity}
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground">{control.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {control.hostsAffected} hosts affected
            </p>
            {/* Mini trend line decoration */}
            <div className="mt-2 flex justify-end">
              <svg className="h-6 w-16" viewBox="0 0 64 24">
                <path
                  d="M0 20 L16 16 L32 18 L48 12 L64 8"
                  fill="none"
                  stroke="#ef4444"
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
