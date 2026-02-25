import {
  getTotalTasks,
  getHealthyCount,
  getNeedsAttentionCount,
  getAtRiskCount,
  getOverdueCount,
} from '../../utils/kpiCalculations'
import type { MainTask } from '../../types/task'

interface KpiCardsProps {
  tasks: MainTask[]
}

const cards: {
  key: string
  label: string
  getValue: (tasks: MainTask[]) => number
  tooltip: string
  className: string
}[] = [
  {
    key: 'total',
    label: 'Total Tasks',
    getValue: getTotalTasks,
    tooltip: 'Total number of main tasks and subtasks',
    className: 'bg-slate-100 border-slate-200 text-slate-800',
  },
  {
    key: 'healthy',
    label: 'Healthy',
    getValue: getHealthyCount,
    tooltip: 'Tasks with Healthy status',
    className: 'bg-green-50 border-green-200 text-green-800',
  },
  {
    key: 'needsAttention',
    label: 'Needs Attention',
    getValue: getNeedsAttentionCount,
    tooltip: 'Tasks needing attention',
    className: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  {
    key: 'atRisk',
    label: 'At Risk',
    getValue: getAtRiskCount,
    tooltip: 'Tasks at risk',
    className: 'bg-red-50 border-red-200 text-red-800',
  },
  {
    key: 'overdue',
    label: 'Overdue',
    getValue: getOverdueCount,
    tooltip: 'Tasks past due date',
    className: 'bg-red-50 border-red-200 text-red-700',
  },
]

export function KpiCards({ tasks }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 p-4">
      {cards.map(({ key, label, getValue, tooltip, className }) => (
        <div
          key={key}
          className={`rounded-xl border p-3.5 transition-all hover:shadow-md hover:-translate-y-0.5 ${className}`}
          title={tooltip}
        >
          <p className="text-xs font-medium opacity-90">{label}</p>
          <p className="text-2xl font-bold mt-1 tabular-nums tracking-tight">{getValue(tasks)}</p>
        </div>
      ))}
    </div>
  )
}
