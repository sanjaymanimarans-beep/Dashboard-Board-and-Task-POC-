import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { sampleKpiTrend } from '../../data/sampleKpiTrend'

export function KpiTrendLineChart() {
  return (
    <div className="h-48 w-full px-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sampleKpiTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 11 }} stroke="#64748b" unit="%" domain={[0, 100]} />
          <Tooltip formatter={(value: number | undefined) => [`${value != null ? value : 0}%`, '']} />
          <Legend />
          <Line
            type="monotone"
            dataKey="healthyPercent"
            name="Healthy %"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="needsAttentionPercent"
            name="Needs Attention %"
            stroke="#eab308"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="atRiskPercent"
            name="At Risk %"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
