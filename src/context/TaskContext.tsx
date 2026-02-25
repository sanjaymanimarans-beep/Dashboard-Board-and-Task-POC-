import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { MainTask } from '../types/task'
import { initialTasks } from '../data/sampleTasks'

interface TaskContextValue {
  tasks: MainTask[]
  setTasks: React.Dispatch<React.SetStateAction<MainTask[]>>
  reassignSubtask: (subtaskId: string, newUserId: string) => void
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<MainTask[]>(initialTasks)

  const reassignSubtask = useCallback((subtaskId: string, newUserId: string) => {
    setTasks((prev) =>
      prev.map((main) => ({
        ...main,
        subtasks: main.subtasks.map((sub) =>
          sub.id === subtaskId ? { ...sub, assignedUserId: newUserId } : sub
        ),
      }))
    )
  }, [])

  const value = useMemo(
    () => ({ tasks, setTasks, reassignSubtask }),
    [tasks, reassignSubtask]
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
