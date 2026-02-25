import type { MainTask } from '../../types/task'
import { StatusBadge } from './StatusBadge'

interface TaskRowProps {
  task: MainTask
  expanded: boolean
  onToggle: () => void
}

const today = new Date().toISOString().split('T')[0]

function isOverdue(dateStr: string) {
  return dateStr < today
}

export function TaskRow({ task, expanded, onToggle }: TaskRowProps) {
  const overdue = isOverdue(task.dueDate)

  return (
    <>
      <tr
        className={`transition-colors ${
          overdue ? 'bg-red-50/70' : 'hover:bg-slate-50/80'
        }`}
      >
        <td className="px-3 py-2.5 align-middle">
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-slate-200/80 text-slate-500 hover:text-slate-700 transition-colors"
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <svg className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </td>
        <td className="px-4 py-2.5 font-medium text-slate-800">{task.mainTaskName}</td>
        <td className="px-4 py-2.5 text-slate-400">—</td>
        <td className="px-4 py-2.5 text-slate-600">{task.boardName}</td>
        <td className="px-4 py-2.5 text-slate-400">—</td>
        <td className="px-4 py-2.5 text-slate-600 tabular-nums">{task.startDate}</td>
        <td className={`px-4 py-2.5 tabular-nums ${overdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
          {task.dueDate}
          {overdue && <span className="ml-1 text-xs font-medium text-red-500">(Overdue)</span>}
        </td>
        <td className="px-4 py-2.5">
          <StatusBadge status={task.status} />
        </td>
        <td className="px-4 py-2.5 text-slate-600">{task.priority}</td>
        <td className="px-4 py-2.5 text-right">—</td>
      </tr>
    </>
  )
}
