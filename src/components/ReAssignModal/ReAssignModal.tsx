import { useMemo, useEffect, useRef } from 'react'
import { useTasks } from '../../context/TaskContext'
import { sampleUsers } from '../../data/sampleUsers'
import { computeUserAllocations } from '../../utils/allocationHelpers'
import { getCapacityPercent, getWorkloadStatus } from '../../utils/workloadLogic'

interface ReAssignModalProps {
  subtaskId: string
  onClose: () => void
}

export function ReAssignModal({ subtaskId, onClose }: ReAssignModalProps) {
  const { tasks, reassignSubtask } = useTasks()
  const dialogRef = useRef<HTMLDivElement>(null)

  const { subtask, currentUserName, allocations, subtaskHours } = useMemo(() => {
    let sub: { id: string; assignedUserId: string; estimatedHours: number } | null = null
    for (const t of tasks) {
      const s = t.subtasks.find((x) => x.id === subtaskId)
      if (s) {
        sub = { id: s.id, assignedUserId: s.assignedUserId, estimatedHours: s.estimatedHours }
        break
      }
    }
    const currentUser = sub ? sampleUsers.find((u) => u.id === sub!.assignedUserId) : null
    const allocations = computeUserAllocations(tasks, sampleUsers)
    return {
      subtask: sub,
      currentUserName: currentUser?.name ?? 'Unknown',
      allocations,
      subtaskHours: sub?.estimatedHours ?? 0,
    }
  }, [tasks, subtaskId])

  const handleSelect = (newUserId: string) => {
    if (!subtask || newUserId === subtask.assignedUserId) return
    const target = allocations.find((a) => a.user.id === newUserId)
    if (target?.workloadStatus === 'Overloaded') {
      if (!window.confirm('This user is already overloaded. Assign anyway?')) return
    }
    reassignSubtask(subtaskId, newUserId)
    onClose()
  }

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [onClose])

  if (!subtask) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reassign-title"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200/80 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 id="reassign-title" className="text-xl font-semibold text-slate-800">
            Re-Assign Subtask
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200/80 text-sm text-slate-600">
          <p><strong className="text-slate-700">Current assignee:</strong> {currentUserName}</p>
          <p className="mt-1"><strong className="text-slate-700">Subtask hours:</strong> {subtaskHours}h (will be added to new assignee)</p>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="py-3 font-semibold">User</th>
                <th className="py-3 font-semibold">Allocated</th>
                <th className="py-3 font-semibold">Capacity %</th>
                <th className="py-3 font-semibold">Overdue</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Preview</th>
                <th className="py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allocations.map((a) => {
                const isCurrent = a.user.id === subtask.assignedUserId
                const newAllocated = a.totalAllocatedHours + (isCurrent ? 0 : subtaskHours)
                const newCap = getCapacityPercent(newAllocated, a.user.availableHours)
                const newStatus = getWorkloadStatus(newCap)

                return (
                  <tr
                    key={a.user.id}
                    className={isCurrent ? 'bg-indigo-50/80' : 'hover:bg-slate-50/80'}
                  >
                    <td className="py-2.5 font-medium text-slate-800">
                      {a.user.name}
                      {isCurrent && <span className="ml-1 text-xs font-normal text-indigo-600">(current)</span>}
                    </td>
                    <td className="py-2.5 text-slate-600 tabular-nums">{a.totalAllocatedHours}h</td>
                    <td className="py-2.5 text-slate-600 tabular-nums">{a.capacityPercent}%</td>
                    <td className="py-2.5 text-slate-600">{a.overdueSubtasks}</td>
                    <td className="py-2.5">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-md ${
                          a.workloadStatus === 'Overloaded'
                            ? 'bg-red-100 text-red-800'
                            : a.workloadStatus === 'Near Capacity'
                              ? 'bg-amber-100 text-amber-800'
                              : a.workloadStatus === 'Balanced'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {a.workloadStatus}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600 text-xs">
                      {isCurrent ? '—' : `${newAllocated}h → ${newCap}% (${newStatus})`}
                    </td>
                    <td className="py-2.5 text-right">
                      {isCurrent ? (
                        <span className="text-slate-400 text-sm">Current</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelect(a.user.id)}
                          className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
