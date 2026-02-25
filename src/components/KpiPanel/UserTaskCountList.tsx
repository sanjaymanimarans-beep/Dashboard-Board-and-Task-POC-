import { useTasks } from '../../context/TaskContext'
import { sampleUsers } from '../../data/sampleUsers'
import { computeUserAllocations } from '../../utils/allocationHelpers'

export function UserTaskCountList() {
  const { tasks } = useTasks()
  const allocations = computeUserAllocations(tasks, sampleUsers)

  return (
    <div className="px-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden />
        Users & Task Count
      </h3>
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {allocations.map((a) => (
            <li
              key={a.user.id}
              className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-white border border-slate-200/60 hover:border-slate-300/80 transition-colors"
            >
              <span className="text-sm font-medium text-slate-800 truncate flex-1 min-w-0">
                {a.user.name}
              </span>
              <span
                className="flex-shrink-0 inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-md text-xs font-semibold bg-slate-200/80 text-slate-700"
                title={`${a.totalAssignedSubtasks} subtask(s)`}
              >
                {a.totalAssignedSubtasks}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
