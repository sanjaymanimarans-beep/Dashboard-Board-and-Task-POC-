import type { SubTask } from '../../types/task'
import { StatusBadge } from './StatusBadge'

const today = new Date().toISOString().split('T')[0]

interface SubTaskRowProps {
  subtask: SubTask
  assignedUserName: string
  onReAssign: () => void
}

function isOverdue(dateStr: string) {
  return dateStr < today
}

export function SubTaskRow({ subtask, assignedUserName, onReAssign }: SubTaskRowProps) {
  const overdue = isOverdue(subtask.dueDate)

  return (
    <tr
      className={`transition-colors ${
        overdue ? 'bg-red-50/50' : 'hover:bg-slate-50/60'
      }`}
    >
      <td className="px-3 py-2 w-10" />
      <td className="px-4 py-2 text-slate-400">—</td>
      <td className="px-4 py-2 text-slate-600">{subtask.subTaskName}</td>
      <td className="px-4 py-2 text-slate-600">{subtask.boardName}</td>
      <td className="px-4 py-2 text-slate-700 font-medium">{assignedUserName}</td>
      <td className="px-4 py-2 text-slate-600 tabular-nums">{subtask.startDate}</td>
      <td className={`px-4 py-2 tabular-nums ${overdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
        {subtask.dueDate}
        {overdue && <span className="ml-1 text-xs text-red-500">(Overdue)</span>}
      </td>
      <td className="px-4 py-2">
        <StatusBadge status={subtask.status} />
      </td>
      <td className="px-4 py-2 text-slate-600">{subtask.priority}</td>
      <td className="px-4 py-2 text-right">
        <button
          type="button"
          onClick={onReAssign}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
        >
          Re-Assign
        </button>
      </td>
    </tr>
  )
}
