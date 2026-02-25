import type { TaskStatus } from '../../types/task'

const statusConfig: Record<
  TaskStatus,
  { label: string; className: string; indicator: string }
> = {
  Healthy: { label: 'Healthy', className: 'bg-green-100 text-green-800', indicator: '🟢' },
  'Needs Attention': {
    label: 'Needs Attention',
    className: 'bg-amber-100 text-amber-800',
    indicator: '🟡',
  },
  'At Risk': { label: 'At Risk', className: 'bg-red-100 text-red-800', indicator: '🔴' },
}

interface StatusBadgeProps {
  status: TaskStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  if (!config) return <span>{status}</span>
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.className}`}
      title={config.label}
    >
      <span aria-hidden>{config.indicator}</span>
      {config.label}
    </span>
  )
}
