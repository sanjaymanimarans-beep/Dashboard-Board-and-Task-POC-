import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { getTaskHealthDistribution } from '../../utils/kpiCalculations'
import type { MainTask } from '../../types/task'

const COLORS = ['#22c55e', '#eab308', '#ef4444']

interface TaskHealthDonutProps {
  tasks: MainTask[]
}

const STATUS_ORDER: Array<'Healthy' | 'Needs Attention' | 'At Risk'> = ['Healthy', 'Needs Attention', 'At Risk']

export function TaskHealthDonut({ tasks }: TaskHealthDonutProps) {
  const data = getTaskHealthDistribution(tasks)
  const sortedData = [...data].sort(
    (a, b) => STATUS_ORDER.indexOf(a.name) - STATUS_ORDER.indexOf(b.name)
  )

  if (sortedData.length === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center text-slate-500 text-sm">
        No task data
      </div>
    )
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {sortedData.map((d) => (
              <Cell key={d.name} fill={COLORS[STATUS_ORDER.indexOf(d.name) % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
