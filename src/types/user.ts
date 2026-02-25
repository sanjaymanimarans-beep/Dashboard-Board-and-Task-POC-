export interface User {
  id: string
  name: string
  availableHours: number
}

export type WorkloadStatus = 'Underloaded' | 'Balanced' | 'Near Capacity' | 'Overloaded'

export interface UserAllocation {
  user: User
  totalAssignedSubtasks: number
  overdueSubtasks: number
  totalAllocatedHours: number
  capacityPercent: number
  workloadStatus: WorkloadStatus
}
