import type { MainTask, SubTask, TaskStatus } from '../types/task'

const today = new Date().toISOString().split('T')[0]

function allSubtasks(tasks: MainTask[]): SubTask[] {
  return tasks.flatMap((t) => t.subtasks)
}

function countByStatus(subtasks: SubTask[], status: TaskStatus): number {
  return subtasks.filter((s) => s.status === status).length
}

function isOverdue(dateStr: string): boolean {
  return dateStr < today
}

export function getTotalTasks(tasks: MainTask[]): number {
  const subs = allSubtasks(tasks)
  return tasks.length + subs.length
}

export function getHealthyCount(tasks: MainTask[]): number {
  const subs = allSubtasks(tasks)
  return countByStatus(subs, 'Healthy') + tasks.filter((t) => t.status === 'Healthy').length
}

export function getNeedsAttentionCount(tasks: MainTask[]): number {
  const subs = allSubtasks(tasks)
  return (
    countByStatus(subs, 'Needs Attention') +
    tasks.filter((t) => t.status === 'Needs Attention').length
  )
}

export function getAtRiskCount(tasks: MainTask[]): number {
  const subs = allSubtasks(tasks)
  return countByStatus(subs, 'At Risk') + tasks.filter((t) => t.status === 'At Risk').length
}

export function getOverdueCount(tasks: MainTask[]): number {
  const subs = allSubtasks(tasks)
  const mainOverdue = tasks.filter((t) => isOverdue(t.dueDate)).length
  const subOverdue = subs.filter((s) => isOverdue(s.dueDate)).length
  return mainOverdue + subOverdue
}

export function getTaskHealthDistribution(tasks: MainTask[]): { name: TaskStatus; value: number }[] {
  const healthy = getHealthyCount(tasks)
  const needsAttention = getNeedsAttentionCount(tasks)
  const atRisk = getAtRiskCount(tasks)
  return [
    { name: 'Healthy' as TaskStatus, value: healthy },
    { name: 'Needs Attention' as TaskStatus, value: needsAttention },
    { name: 'At Risk' as TaskStatus, value: atRisk },
  ].filter((d) => d.value > 0)
}
