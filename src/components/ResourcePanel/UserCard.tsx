import { useState } from 'react'
import type { UserAllocation } from '../../types/user'
import type { SubTask } from '../../types/task'
import { useTasks } from '../../context/TaskContext'

interface UserCardProps {
  allocation: UserAllocation
  subtasks: SubTask[]
}

const statusClass: Record<string, string> = {
  Underloaded: 'bg-slate-100 text-slate-700',
  Balanced: 'bg-green-100 text-green-800',
  'Near Capacity': 'bg-amber-100 text-amber-800',
  Overloaded: 'bg-red-100 text-red-800',
}

export function UserCard({ allocation, subtasks }: UserCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { tasks } = useTasks()

  const getSubtaskParentName = (parentTaskId: string) => {
    const main = tasks.find((t) => t.id === parentTaskId)
    return main?.mainTaskName ?? parentTaskId
  }

  return (
    <div className="border border-slate-200/80 rounded-xl bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left p-3.5 hover:bg-slate-50/80 transition-colors flex flex-wrap items-center gap-x-3 gap-y-2"
        aria-expanded={expanded}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-semibold text-sm">
          {allocation.user.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <span className="font-medium text-slate-800 block truncate">{allocation.user.name}</span>
          <span className="text-xs text-slate-500">
            {allocation.totalAssignedSubtasks} subtasks · {allocation.overdueSubtasks} overdue
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-md ${statusClass[allocation.workloadStatus] ?? 'bg-slate-100 text-slate-600'}`}
        >
          {allocation.workloadStatus}
        </span>
        <span className="ml-auto text-slate-400 shrink-0">
          <svg className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {expanded && (
        <div className="border-t border-slate-200/80 bg-slate-50/80 p-3 text-sm expandable-content">
          <p className="font-medium text-slate-700 mb-2">Assigned subtasks</p>
          <ul className="space-y-2">
            {subtasks.map((s) => (
              <li key={s.id} className="flex justify-between gap-2 text-slate-600 rounded-lg bg-white/80 px-2.5 py-2 border border-slate-200/60">
                <span className="min-w-0">
                  <span className="font-medium text-slate-700">{s.subTaskName}</span>
                  <span className="text-slate-400 ml-1">({getSubtaskParentName(s.parentTaskId)})</span>
                </span>
                <span className="text-slate-500 shrink-0 tabular-nums">Due: {s.dueDate} · {s.estimatedHours}h</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
