import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTasks } from '../../context/TaskContext'
import { sampleUsers } from '../../data/sampleUsers'
import {
  computeUserAllocations,
  getOverloadedCountByBoard,
} from '../../utils/allocationHelpers'

const WORKLOAD_COLORS: Record<string, string> = {
  Underloaded: '#94a3b8',
  Balanced: '#22c55e',
  'Near Capacity': '#eab308',
  Overloaded: '#ef4444',
}

export function ResourceAllocationCharts() {
  const { tasks } = useTasks()
  const allocations = computeUserAllocations(tasks, sampleUsers)
  const boardOverloadData = getOverloadedCountByBoard(tasks, allocations)

  const userData = allocations.map((a) => ({
    name: a.user.name.split(' ')[0],
    fullName: a.user.name,
    capacityPercent: a.capacityPercent,
    allocated: a.totalAllocatedHours,
    available: a.user.availableHours,
    status: a.workloadStatus,
  }))

  const maxBoardOverload = Math.max(
    ...boardOverloadData.map((d) => d.overloadedCount),
    1
  )

  return (
    <div className="space-y-6 px-4">
      {/* Which board has overloaded users */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Overloaded users by board
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={boardOverloadData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 60, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, maxBoardOverload]}
                tick={{ fontSize: 11 }}
                stroke="#64748b"
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="boardName"
                tick={{ fontSize: 11 }}
                stroke="#64748b"
                width={56}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
                      <p className="font-medium text-slate-800">{d.boardName}</p>
                      <p className="text-slate-600">
                        {d.overloadedCount} overloaded user{d.overloadedCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="overloadedCount" name="Overloaded users" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {boardOverloadData.map((entry, index) => (
                  <Cell
                    key={`board-${index}`}
                    fill={entry.overloadedCount > 0 ? '#ef4444' : '#cbd5e1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Which user is overloaded */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          User workload (capacity %)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={userData}
              layout="vertical"
              margin={{ top: 4, right: 32, left: 44, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 150]}
                tick={{ fontSize: 10 }}
                stroke="#64748b"
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                stroke="#64748b"
                width={40}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  const d = payload[0].payload
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm">
                      <p className="font-medium text-slate-800">{d.fullName}</p>
                      <p>Capacity: {d.capacityPercent}%</p>
                      <p>{d.allocated}h / {d.available}h</p>
                      <p className="font-medium" style={{ color: WORKLOAD_COLORS[d.status] }}>
                        {d.status}
                      </p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="capacityPercent" name="Capacity %" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {userData.map((entry, index) => (
                  <Cell
                    key={`user-${index}`}
                    fill={WORKLOAD_COLORS[entry.status] ?? '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Green = Balanced, Yellow = Near Capacity, Red = Overloaded, Gray = Underloaded
        </p>
      </div>
    </div>
  )
}
