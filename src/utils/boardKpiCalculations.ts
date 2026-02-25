import type { MainTask, TaskStatus } from '../types/task'
import type { UserAllocation } from '../types/user'
import { getOverloadedCountByBoard } from './allocationHelpers'

const today = new Date().toISOString().split('T')[0]

function isOverdue(dateStr: string): boolean {
  return dateStr < today
}

function daysBetween(start: string, end: string): number {
  const a = new Date(start)
  const b = new Date(end)
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export type BoardHealthStatus = 'Healthy' | 'Needs Attention' | 'At Risk'

export interface BoardKpiRow {
  boardName: string
  healthStatus: BoardHealthStatus
  healthPercent: number
  totalTasks: number
  overdueCount: number
  healthyCount: number
  needsAttentionCount: number
  atRiskCount: number
  avgCompletionDays: number
  overloadedResourcesCount: number
}

function getBoardTasks(tasks: MainTask[], boardName: string): MainTask[] {
  return tasks.filter((t) => t.boardName === boardName)
}

function countItemsByStatus(tasks: MainTask[], status: TaskStatus): number {
  let n = 0
  tasks.forEach((t) => {
    if (t.status === status) n++
    t.subtasks.forEach((s) => {
      if (s.status === status) n++
    })
  })
  return n
}

function countOverdue(tasks: MainTask[]): number {
  let n = 0
  tasks.forEach((t) => {
    if (isOverdue(t.dueDate)) n++
    t.subtasks.forEach((s) => {
      if (isOverdue(s.dueDate)) n++
    })
  })
  return n
}

function totalItemCount(tasks: MainTask[]): number {
  return tasks.reduce((sum, t) => sum + 1 + t.subtasks.length, 0)
}

function avgCompletionDays(tasks: MainTask[]): number {
  const days: number[] = []
  tasks.forEach((t) => {
    days.push(daysBetween(t.startDate, t.dueDate))
    t.subtasks.forEach((s) => {
      days.push(daysBetween(s.startDate, s.dueDate))
    })
  })
  if (days.length === 0) return 0
  return Math.round((days.reduce((a, b) => a + b, 0) / days.length) * 10) / 10
}

function healthStatusFromPercent(pct: number): BoardHealthStatus {
  if (pct >= 70) return 'Healthy'
  if (pct >= 40) return 'Needs Attention'
  return 'At Risk'
}

export function getBoardKpiRows(
  tasks: MainTask[],
  allocations: UserAllocation[]
): BoardKpiRow[] {
  const boards = Array.from(new Set(tasks.map((t) => t.boardName))).sort()
  const overloadedByBoard = getOverloadedCountByBoard(tasks, allocations)

  return boards.map((boardName) => {
    const boardTasks = getBoardTasks(tasks, boardName)
    const total = totalItemCount(boardTasks)
    const healthy = countItemsByStatus(boardTasks, 'Healthy')
    const needsAttention = countItemsByStatus(boardTasks, 'Needs Attention')
    const atRisk = countItemsByStatus(boardTasks, 'At Risk')
    const overdue = countOverdue(boardTasks)
    const healthPercent = total > 0 ? Math.round((healthy / total) * 100) : 0
    const status = healthStatusFromPercent(healthPercent)
    const overloadedEntry = overloadedByBoard.find((b) => b.boardName === boardName)

    return {
      boardName,
      healthStatus: status,
      healthPercent,
      totalTasks: total,
      overdueCount: overdue,
      healthyCount: healthy,
      needsAttentionCount: needsAttention,
      atRiskCount: atRisk,
      avgCompletionDays: avgCompletionDays(boardTasks),
      overloadedResourcesCount: overloadedEntry?.overloadedCount ?? 0,
    }
  })
}

export interface WorkspaceBoardKpiSummary {
  totalBoards: number
  healthyBoards: number
  needsAttentionBoards: number
  atRiskBoards: number
  overdueBoards: number
  healthyPercent: number
  needsAttentionPercent: number
  atRiskPercent: number
  overduePercent: number
}

export function getWorkspaceBoardKpiSummary(rows: BoardKpiRow[]): WorkspaceBoardKpiSummary {
  const total = rows.length
  const healthy = rows.filter((r) => r.healthStatus === 'Healthy').length
  const needsAttention = rows.filter((r) => r.healthStatus === 'Needs Attention').length
  const atRisk = rows.filter((r) => r.healthStatus === 'At Risk').length
  const overdue = rows.filter((r) => r.overdueCount > 0).length

  return {
    totalBoards: total,
    healthyBoards: healthy,
    needsAttentionBoards: needsAttention,
    atRiskBoards: atRisk,
    overdueBoards: overdue,
    healthyPercent: total > 0 ? Math.round((healthy / total) * 100) : 0,
    needsAttentionPercent: total > 0 ? Math.round((needsAttention / total) * 100) : 0,
    atRiskPercent: total > 0 ? Math.round((atRisk / total) * 100) : 0,
    overduePercent: total > 0 ? Math.round((overdue / total) * 100) : 0,
  }
}
