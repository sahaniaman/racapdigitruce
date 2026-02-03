'use client'

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { ComplianceTrendPoint } from '@/lib/data'

interface ComplianceTrendChartProps {
  data: ComplianceTrendPoint[]
}

export function ComplianceTrendChart({ data }: ComplianceTrendChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-lg font-semibold text-foreground">Compliance Trend (30 Days)</h3>
      <div className="mt-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
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
              dot={{ fill: '#00d4d4', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: '#00d4d4', strokeWidth: 0, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
