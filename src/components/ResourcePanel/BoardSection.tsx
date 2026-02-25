import { useMemo } from 'react'
import type { MainTask, SubTask } from '../../types/task'
import type { UserAllocation } from '../../types/user'
import { UserCard } from './UserCard'

interface BoardSectionProps {
  boardName: string
  userIds: string[]
  allAllocations: UserAllocation[]
  tasks: MainTask[]
}

function getSubtasksForUserOnBoard(
  tasks: MainTask[],
  userId: string,
  boardName: string
): SubTask[] {
  const out: SubTask[] = []
  tasks.forEach((t) => {
    t.subtasks
      .filter((s) => s.assignedUserId === userId && s.boardName === boardName)
      .forEach((s) => out.push(s))
  })
  return out
}

export function BoardSection({ boardName, userIds, allAllocations, tasks }: BoardSectionProps) {
  const userAllocations = useMemo(() => {
    return userIds
      .map((uid) => allAllocations.find((a) => a.user.id === uid))
      .filter((a): a is UserAllocation => !!a)
  }, [userIds, allAllocations])

  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 px-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden />
        {boardName}
        <span className="text-slate-500 font-normal">({userAllocations.length} user{userAllocations.length !== 1 ? 's' : ''})</span>
      </h3>
      <div className="space-y-3 px-4">
        {userAllocations.map((a) => (
          <UserCard
            key={a.user.id}
            allocation={a}
            subtasks={getSubtasksForUserOnBoard(tasks, a.user.id, boardName)}
          />
        ))}
      </div>
    </div>
  )
}
