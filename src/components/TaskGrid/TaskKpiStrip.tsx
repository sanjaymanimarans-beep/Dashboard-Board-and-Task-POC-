import { useTasks } from '../../context/TaskContext'
import {
  getHealthyCount,
  getNeedsAttentionCount,
  getAtRiskCount,
  getOverdueCount,
} from '../../utils/kpiCalculations'

const items = [
  { key: 'healthy', label: 'Healthy', getValue: getHealthyCount, className: 'bg-green-50 border-green-200/80 text-green-800' },
  { key: 'needsAttention', label: 'Needs Attention', getValue: getNeedsAttentionCount, className: 'bg-amber-50 border-amber-200/80 text-amber-800' },
  { key: 'atRisk', label: 'At Risk', getValue: getAtRiskCount, className: 'bg-red-50 border-red-200/80 text-red-800' },
  { key: 'overdue', label: 'Overdue', getValue: getOverdueCount, className: 'bg-slate-100 border-slate-200/80 text-slate-800' },
] as const

export function TaskKpiStrip() {
  const { tasks } = useTasks()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map(({ key, label, getValue, className }) => (
        <div
          key={key}
          className={`rounded-xl border p-3.5 transition-shadow hover:shadow-md ${className}`}
        >
          <p className="text-xs font-medium opacity-90">{label}</p>
          <p className="text-2xl font-bold mt-1 tabular-nums tracking-tight">{getValue(tasks)}</p>
        </div>
      ))}
    </div>
  )
}
