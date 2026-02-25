import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useTasks } from '../../context/TaskContext'
import { sampleUsers } from '../../data/sampleUsers'
import { computeUserAllocations } from '../../utils/allocationHelpers'

export function UserAllocationBarChart() {
  const { tasks } = useTasks()
  const allocations = computeUserAllocations(tasks, sampleUsers)

  const data = allocations.map((a) => ({
    name: a.user.name.split(' ')[0],
    fullName: a.user.name,
    allocated: a.totalAllocatedHours,
    capacity: a.user.availableHours,
    capacityPercent: a.capacityPercent,
    status: a.workloadStatus,
  }))

  const maxHours = Math.max(
    ...data.map((d) => d.allocated),
    ...sampleUsers.map((u) => u.availableHours),
    40
  )

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            stroke="#64748b"
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis tick={{ fontSize: 11 }} stroke="#64748b" domain={[0, maxHours]} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null
              const d = payload[0].payload
              return (
                <div className="bg-white border border-slate-200 rounded shadow-lg p-2 text-sm">
                  <p className="font-medium">{d.fullName}</p>
                  <p>Allocated: {d.allocated}h</p>
                  <p>Capacity: {d.capacity}h</p>
                  <p>Capacity %: {d.capacityPercent}%</p>
                  <p>Status: {d.status}</p>
                </div>
              )
            }}
          />
          <Bar dataKey="capacity" name="Available Hours" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="allocated" name="Allocated Hours" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.capacityPercent > 100 ? '#ef4444' : '#22c55e'}
              />
            ))}
          </Bar>
          <Legend />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-500 mt-2 px-1">
        Gray = available hours. Green = within capacity, red = overloaded.
      </p>
    </div>
  )
}
