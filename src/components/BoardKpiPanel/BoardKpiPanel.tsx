import { useState, useMemo } from 'react'
import { useTasks } from '../../context/TaskContext'
import { useSelectedBoard } from '../../context/SelectedBoardContext'
import { sampleUsers } from '../../data/sampleUsers'
import { computeUserAllocations } from '../../utils/allocationHelpers'
import {
  getBoardKpiRows,
  getWorkspaceBoardKpiSummary,
  type BoardKpiRow,
  type BoardHealthStatus,
} from '../../utils/boardKpiCalculations'

const HEALTH_INDICATOR: Record<BoardHealthStatus, string> = {
  Healthy: '🟢',
  'Needs Attention': '🟡',
  'At Risk': '🔴',
}

const HEALTH_CLASS: Record<BoardHealthStatus, string> = {
  Healthy: 'bg-green-100 text-green-800',
  'Needs Attention': 'bg-amber-100 text-amber-800',
  'At Risk': 'bg-red-100 text-red-800',
}

function BoardKpiSummaryCards({ summary }: { summary: ReturnType<typeof getWorkspaceBoardKpiSummary> }) {
  const cards = [
    { label: 'Total Boards', value: summary.totalBoards, pct: null, className: 'bg-slate-50 border-slate-200 text-slate-800' },
    { label: 'Healthy', value: summary.healthyBoards, pct: summary.healthyPercent, className: 'bg-green-50/80 border-green-200/80 text-green-800' },
    { label: 'Needs Attention', value: summary.needsAttentionBoards, pct: summary.needsAttentionPercent, className: 'bg-amber-50/80 border-amber-200/80 text-amber-800' },
    { label: 'At Risk', value: summary.atRiskBoards, pct: summary.atRiskPercent, className: 'bg-red-50/80 border-red-200/80 text-red-800' },
    { label: 'Overdue', value: summary.overdueBoards, pct: summary.overduePercent, className: 'bg-slate-100 border-slate-200 text-slate-700' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {cards.map(({ label, value, pct, className }) => (
        <div
          key={label}
          className={`rounded-lg border p-2.5 ${className}`}
        >
          <p className="text-[10px] font-medium opacity-90 uppercase tracking-wide">{label}</p>
          <p className="text-lg font-bold tabular-nums mt-0.5">{value}</p>
          {pct !== null && (
            <p className="text-xs opacity-90 mt-0.5">{pct}%</p>
          )}
          <p className="text-[10px] text-slate-500 mt-1" title="Comparison with last month">— vs last month</p>
        </div>
      ))}
    </div>
  )
}

function BoardRow({
  row,
  expanded,
  isSelected,
  onToggle,
  onSelect,
}: {
  row: BoardKpiRow
  expanded: boolean
  isSelected: boolean
  onToggle: () => void
  onSelect: () => void
}) {
  return (
    <div className="border border-slate-200/80 rounded-lg overflow-hidden bg-white shadow-sm mb-2">
      <button
        type="button"
        onClick={() => {
          onSelect()
          onToggle()
        }}
        className={`w-full text-left px-3 py-2.5 flex items-center gap-2 transition-colors ${
          isSelected ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-slate-50/80'
        }`}
      >
        <span className="text-slate-400 shrink-0" aria-hidden>
          {expanded ? '▾' : '▸'}
        </span>
        <span className="h-2 w-2 rounded-full shrink-0" aria-hidden
          style={{
            backgroundColor: row.healthStatus === 'Healthy' ? '#22c55e' : row.healthStatus === 'Needs Attention' ? '#eab308' : '#ef4444',
          }}
        />
        <span className="font-medium text-slate-800 truncate flex-1 min-w-0">{row.boardName}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${HEALTH_CLASS[row.healthStatus]}`}>
          {HEALTH_INDICATOR[row.healthStatus]} {row.healthPercent}%
        </span>
        <span className="text-xs text-slate-500 tabular-nums">{row.totalTasks} tasks</span>
        {row.overdueCount > 0 && (
          <span className="text-xs text-red-600 font-medium tabular-nums">{row.overdueCount} overdue</span>
        )}
      </button>
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-slate-100 bg-slate-50/50 text-sm text-slate-700 space-y-1.5">
          <p>Healthy: <strong>{row.healthyCount}</strong></p>
          <p>Needs Attention: <strong>{row.needsAttentionCount}</strong></p>
          <p>At Risk: <strong>{row.atRiskCount}</strong></p>
          <p>Overdue: <strong>{row.overdueCount}</strong></p>
          <p>Avg Completion: <strong>{row.avgCompletionDays} days</strong></p>
          <p>Overloaded Resources: <strong>{row.overloadedResourcesCount}</strong></p>
        </div>
      )}
    </div>
  )
}

export function BoardKpiPanel() {
  const [panelExpanded, setPanelExpanded] = useState(true)
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null)
  const { tasks } = useTasks()
  const { selectedBoard, setSelectedBoard } = useSelectedBoard()

  const allocations = useMemo(
    () => computeUserAllocations(tasks, sampleUsers),
    [tasks]
  )
  const rows = useMemo(
    () => getBoardKpiRows(tasks, allocations),
    [tasks, allocations]
  )
  const summary = useMemo(
    () => getWorkspaceBoardKpiSummary(rows),
    [rows]
  )

  const toggleBoard = (boardName: string) => {
    setExpandedBoard((prev) => (prev === boardName ? null : boardName))
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      <div className="flex-shrink-0 flex items-center justify-between gap-2 p-3 border-b border-slate-200/80 bg-slate-50/50">
        <h2 className="text-sm font-semibold text-slate-800 truncate">Board KPI</h2>
        <button
          type="button"
          onClick={() => setPanelExpanded((e) => !e)}
          className="p-1.5 rounded-md hover:bg-slate-200/80 text-slate-500 hover:text-slate-700 transition-colors"
          aria-label={panelExpanded ? 'Collapse panel' : 'Expand panel'}
          title={panelExpanded ? 'Collapse' : 'Expand'}
        >
          {panelExpanded ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          )}
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto p-3">
        {panelExpanded ? (
          <>
            <BoardKpiSummaryCards summary={summary} />
            <p className="text-xs font-medium text-slate-600 mb-2">Boards</p>
            {rows.length === 0 ? (
              <p className="text-sm text-slate-500">No boards</p>
            ) : (
              rows.map((row) => (
                <BoardRow
                  key={row.boardName}
                  row={row}
                  expanded={expandedBoard === row.boardName}
                  isSelected={selectedBoard === row.boardName}
                  onToggle={() => toggleBoard(row.boardName)}
                  onSelect={() => setSelectedBoard(row.boardName)}
                />
              ))
            )}
            {selectedBoard && (
              <button
                type="button"
                onClick={() => setSelectedBoard(null)}
                className="mt-3 w-full text-xs font-medium text-slate-600 hover:text-slate-800 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                Clear filter · Show all boards
              </button>
            )}
          </>
        ) : (
          <div className="space-y-1">
            {rows.map((row) => (
              <button
                key={row.boardName}
                type="button"
                onClick={() => {
                  setSelectedBoard(row.boardName)
                  setExpandedBoard((p) => (p === row.boardName ? null : row.boardName))
                }}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                  selectedBoard === row.boardName ? 'bg-indigo-50' : 'hover:bg-slate-100'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: row.healthStatus === 'Healthy' ? '#22c55e' : row.healthStatus === 'Needs Attention' ? '#eab308' : '#ef4444',
                  }}
                />
                <span className="text-sm font-medium text-slate-800 truncate flex-1">{row.boardName}</span>
              </button>
            ))}
            {selectedBoard && (
              <button
                type="button"
                onClick={() => setSelectedBoard(null)}
                className="w-full text-xs text-slate-500 hover:text-slate-700 py-1.5"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
