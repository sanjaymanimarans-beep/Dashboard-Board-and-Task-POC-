import type { MainTask } from '../types/task'
import type { User, UserAllocation } from '../types/user'
import { getCapacityPercent, getWorkloadStatus } from './workloadLogic'

const today = new Date().toISOString().split('T')[0]

function isOverdue(dateStr: string) {
  return dateStr < today
}

export function computeUserAllocations(
  tasks: MainTask[],
  users: User[]
): UserAllocation[] {
  const subtasks = tasks.flatMap((t) => t.subtasks)

  return users.map((user) => {
    const userSubs = subtasks.filter((s) => s.assignedUserId === user.id)
    const totalAllocatedHours = userSubs.reduce((sum, s) => sum + s.estimatedHours, 0)
    const overdueSubtasks = userSubs.filter((s) => isOverdue(s.dueDate)).length
    const capacityPercent = getCapacityPercent(totalAllocatedHours, user.availableHours)
    const workloadStatus = getWorkloadStatus(capacityPercent)

    return {
      user,
      totalAssignedSubtasks: userSubs.length,
      overdueSubtasks,
      totalAllocatedHours,
      capacityPercent,
      workloadStatus,
    }
  })
}

export function getBoardsFromTasks(tasks: MainTask[]): string[] {
  const set = new Set<string>()
  tasks.forEach((t) => set.add(t.boardName))
  return Array.from(set).sort()
}

/** For each board, returns the set of user IDs that have at least one subtask on that board */
export function getBoardUserIds(tasks: MainTask[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  tasks.forEach((t) => {
    const board = t.boardName
    if (!map.has(board)) map.set(board, new Set())
    t.subtasks.forEach((s) => map.get(board)!.add(s.assignedUserId))
  })
  return map
}

/** Per-board count of overloaded users (users with at least one subtask on that board who are overloaded overall) */
export function getOverloadedCountByBoard(
  tasks: MainTask[],
  allocations: UserAllocation[]
): { boardName: string; overloadedCount: number }[] {
  const boardUserIds = getBoardUserIds(tasks)
  const overloadedIds = new Set(
    allocations.filter((a) => a.workloadStatus === 'Overloaded').map((a) => a.user.id)
  )
  return Array.from(boardUserIds.entries()).map(([boardName, userIds]) => ({
    boardName,
    overloadedCount: Array.from(userIds).filter((id) => overloadedIds.has(id)).length,
  }))
}
