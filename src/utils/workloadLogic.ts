import type { WorkloadStatus } from '../types/user'

export function getCapacityPercent(allocatedHours: number, availableHours: number): number {
  if (availableHours <= 0) return 0
  return Math.round((allocatedHours / availableHours) * 100)
}

export function getWorkloadStatus(capacityPercent: number): WorkloadStatus {
  if (capacityPercent > 100) return 'Overloaded'
  if (capacityPercent >= 85) return 'Near Capacity'
  if (capacityPercent >= 60) return 'Balanced'
  return 'Underloaded'
}

export function getAllocatedHoursFromSubtasks(
  subtasks: { estimatedHours: number }[]
): number {
  return subtasks.reduce((sum, t) => sum + t.estimatedHours, 0)
}
