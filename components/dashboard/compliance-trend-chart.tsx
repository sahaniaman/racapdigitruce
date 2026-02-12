'use client'

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart, CartesianGrid } from 'recharts'
import type { ComplianceTrendPoint } from '@/lib/data'
import { useMemo } from 'react'

interface ComplianceTrendChartProps {
  data: ComplianceTrendPoint[]
}

export function ComplianceTrendChart({ data }: ComplianceTrendChartProps) {
  // Calculate trend statistics with proper logic
  const statistics = useMemo(() => {
    if (!data || data.length === 0) return { avg: 0, min: 0, max: 0, trend: 0, volatility: 0 }
    
    const scores = data.map(d => d.score)
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const trend = scores.length > 1 ? ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100 : 0
    
    // Calculate volatility (standard deviation)
    const squaredDiffs = scores.map(score => Math.pow(score - avg, 2))
    const volatility = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / scores.length)
    
    return { avg: Math.round(avg * 10) / 10, min, max, trend: Math.round(trend * 10) / 10, volatility: Math.round(volatility * 10) / 10 }
  }, [data])

  // Enhance data with moving average for smoother trend visualization
  const enhancedData = useMemo(() => {
    if (!data || data.length < 3) return data
    
    return data.map((point, index) => {
      // Calculate 3-point moving average
      const start = Math.max(0, index - 1)
      const end = Math.min(data.length, index + 2)
      const windowData = data.slice(start, end)
      const movingAvg = windowData.reduce((sum, d) => sum + d.score, 0) / windowData.length
      
      return {
        ...point,
        movingAvg: Math.round(movingAvg * 10) / 10,
        baseline: statistics.avg
      }
    })
  }, [data, statistics.avg])

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Compliance Trend (30 Days)</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Avg: <span className="text-purple font-medium">{statistics.avg}%</span></span>
          <span className="text-muted-foreground">Range: <span className="text-foreground">{statistics.min}-{statistics.max}%</span></span>
          <span className={`${statistics.trend >= 0 ? 'text-green' : 'text-red'}`}>
            {statistics.trend >= 0 ? '↑' : '↓'} {Math.abs(statistics.trend)}%
          </span>
        </div>
      </div>
      <div className="mt-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={enhancedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6D50E9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6D50E9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d42" />
            <XAxis
              dataKey="date"
              stroke="#A192D9"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#A192D9"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12121a',
                border: '1px solid #2d2d42',
                borderRadius: '8px',
                color: '#ffffff',
              }}
              labelStyle={{ color: '#A192D9' }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  score: 'Score',
                  movingAvg: 'Moving Avg',
                  baseline: 'Baseline'
                }
                return [`${value}%`, labels[name] || name]
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6D50E9"
              strokeWidth={2}
              fill="url(#colorScore)"
              dot={{ fill: '#6D50E9', strokeWidth: 0, r: 3 }}
              activeDot={{ fill: '#6D50E9', strokeWidth: 2, stroke: '#ffffff', r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="movingAvg"
              stroke="#A192D9"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Trend Indicator */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple" />
            <span className="text-sm text-muted-foreground">Compliance Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-light" style={{ borderStyle: 'dashed' }} />
            <span className="text-sm text-muted-foreground">Moving Average</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Volatility Index: <span className="text-foreground font-medium">{statistics.volatility}</span>
        </div>
      </div>
    </div>
  )
}
