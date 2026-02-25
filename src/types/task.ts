export type TaskStatus = 'Healthy' | 'Needs Attention' | 'At Risk'
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface MainTask {
  id: string
  mainTaskName: string
  boardName: string
  startDate: string
  dueDate: string
  status: TaskStatus
  priority: Priority
  estimatedHours: number
  actualLoggedHours: number
  subtasks: SubTask[]
}

export interface SubTask {
  id: string
  parentTaskId: string
  subTaskName: string
  boardName: string
  assignedUserId: string
  startDate: string
  dueDate: string
  status: TaskStatus
  priority: Priority
  estimatedHours: number
  actualLoggedHours: number
}
