import { useState, useMemo, Fragment } from 'react'
import { useTasks } from '../../context/TaskContext'
import { useSelectedBoard } from '../../context/SelectedBoardContext'
import { sampleUsers } from '../../data/sampleUsers'
import { getBoardsFromTasks } from '../../utils/allocationHelpers'
import type { MainTask, TaskStatus } from '../../types/task'
import { TaskRow } from './TaskRow'
import { SubTaskRow } from './SubTaskRow'
import { ReAssignModal } from '../ReAssignModal/ReAssignModal'

function getUserName(userId: string): string {
  return sampleUsers.find((u) => u.id === userId)?.name ?? userId
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'Healthy', label: 'Healthy' },
  { value: 'Needs Attention', label: 'Needs Attention' },
  { value: 'At Risk', label: 'At Risk' },
]

function isDateInRange(dateStr: string, from: string, to: string): boolean {
  if (from && to) return dateStr >= from && dateStr <= to
  if (from) return dateStr >= from
  if (to) return dateStr <= to
  return true
}

export function TaskGrid() {
  const { tasks } = useTasks()
  const { selectedBoard, setSelectedBoard } = useSelectedBoard()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [reassignSubtaskId, setReassignSubtaskId] = useState<string | null>(null)
  const [assignedUserFilter, setAssignedUserFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [boardFilter, setBoardFilter] = useState<string>('')

  const boards = useMemo(() => getBoardsFromTasks(tasks), [tasks])
  const effectiveBoardFilter = selectedBoard ?? boardFilter

  const filteredTasks = useMemo((): MainTask[] => {
    return tasks
      .filter((task) => !effectiveBoardFilter || task.boardName === effectiveBoardFilter)
      .map((task) => {
        let subtasks = task.subtasks
        if (assignedUserFilter) subtasks = subtasks.filter((s) => s.assignedUserId === assignedUserFilter)
        if (statusFilter) subtasks = subtasks.filter((s) => s.status === (statusFilter as TaskStatus))
        if (dateFrom || dateTo) subtasks = subtasks.filter((s) => isDateInRange(s.dueDate, dateFrom, dateTo))
        const mainTaskInStatus = !statusFilter || task.status === (statusFilter as TaskStatus)
        const mainTaskInDate = !dateFrom && !dateTo || isDateInRange(task.dueDate, dateFrom, dateTo)
        const showTask = (mainTaskInStatus && mainTaskInDate) || subtasks.length > 0
        if (!showTask) return null
        return { ...task, subtasks }
      })
      .filter((t): t is MainTask => t !== null && (t.subtasks.length > 0 || !assignedUserFilter))
  }, [tasks, assignedUserFilter, dateFrom, dateTo, statusFilter, effectiveBoardFilter])

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600" aria-hidden>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </span>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Task Grid</h2>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span>Assigned user:</span>
          <select
            value={assignedUserFilter}
            onChange={(e) => setAssignedUserFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[180px]"
            aria-label="Filter by assigned user"
          >
            <option value="">All users</option>
            {sampleUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span>Board:</span>
          <select
            value={effectiveBoardFilter}
            onChange={(e) => {
              const v = e.target.value
              setBoardFilter(v)
              setSelectedBoard(v || null)
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[140px]"
            aria-label="Filter by board"
          >
            <option value="">All boards</option>
            {boards.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[140px]"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span>Due from:</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="Filter due date from"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span>Due to:</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="Filter due date to"
          />
        </label>
      </div>
      <div className="overflow-x-auto overflow-y-visible rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="sticky top-0 z-[1] bg-slate-50/95 backdrop-blur-sm">
            <tr className="border-b border-slate-200 bg-slate-50/90 text-left text-slate-600">
              <th className="w-10 px-3 py-3 font-semibold" aria-label="Expand" />
              <th className="px-4 py-3 font-semibold">Main Task</th>
              <th className="px-4 py-3 font-semibold">Sub Task</th>
              <th className="px-4 py-3 font-semibold">Board</th>
              <th className="px-4 py-3 font-semibold">Assigned User</th>
              <th className="px-4 py-3 font-semibold">Start Date</th>
              <th className="px-4 py-3 font-semibold">Due Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                  <p className="font-medium">
                    {assignedUserFilter || effectiveBoardFilter || statusFilter || dateFrom || dateTo
                      ? 'No tasks match the current filters.'
                      : 'No tasks yet'}
                  </p>
                  <p className="text-sm mt-1">
                    {assignedUserFilter || effectiveBoardFilter || statusFilter || dateFrom || dateTo
                      ? 'Try changing or clearing filters.'
                      : 'Tasks will appear here when available.'}
                  </p>
                </td>
              </tr>
            ) : null}
            {filteredTasks.map((task) => (
              <Fragment key={task.id}>
                <TaskRow
                  key={task.id}
                  task={task}
                  expanded={expandedIds.has(task.id)}
                  onToggle={() => toggle(task.id)}
                />
                {expandedIds.has(task.id) &&
                  task.subtasks.map((sub) => (
                    <SubTaskRow
                      key={sub.id}
                      subtask={sub}
                      assignedUserName={getUserName(sub.assignedUserId)}
                      onReAssign={() => setReassignSubtaskId(sub.id)}
                    />
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {reassignSubtaskId && (
        <ReAssignModal
          subtaskId={reassignSubtaskId}
          onClose={() => setReassignSubtaskId(null)}
        />
      )}
    </div>
  )
}
