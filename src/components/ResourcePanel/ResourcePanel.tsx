import { useMemo } from 'react'
import { useTasks } from '../../context/TaskContext'
import { useSelectedBoard } from '../../context/SelectedBoardContext'
import { sampleUsers } from '../../data/sampleUsers'
import { computeUserAllocations, getBoardUserIds, getBoardsFromTasks } from '../../utils/allocationHelpers'
import { BoardSection } from './BoardSection'

export function ResourcePanel() {
  const { tasks } = useTasks()
  const { selectedBoard } = useSelectedBoard()
  const allocations = useMemo(
    () => computeUserAllocations(tasks, sampleUsers),
    [tasks]
  )
  const allBoards = useMemo(() => getBoardsFromTasks(tasks), [tasks])
  const boards = useMemo(() => {
    if (!selectedBoard) return allBoards
    return allBoards.includes(selectedBoard) ? [selectedBoard] : []
  }, [allBoards, selectedBoard])
  const boardUserIds = useMemo(() => getBoardUserIds(tasks), [tasks])

  return (
    <div className="py-5">
      <div className="flex items-center gap-2 px-4 mb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600" aria-hidden>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </span>
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
          Resource Allocation
          {selectedBoard && <span className="text-slate-500 font-normal ml-1">· {selectedBoard}</span>}
        </h2>
      </div>
      {boards.map((boardName) => (
        <BoardSection
          key={boardName}
          boardName={boardName}
          userIds={Array.from(boardUserIds.get(boardName) ?? [])}
          allAllocations={allocations}
          tasks={tasks}
        />
      ))}
    </div>
  )
}
