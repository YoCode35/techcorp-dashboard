import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { CHART_COLORS } from '@/utils/constants'

const DEPT_DATA = [
  { name: 'Engineering', value: 8240 },
  { name: 'Design', value: 4150 },
  { name: 'Marketing', value: 3200 },
  { name: 'Operations', value: 2100 },
  { name: 'Communication', value: 1238 },
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{payload[0].name}</p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">
        €{payload[0].value.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400">
        {((payload[0].value / DEPT_DATA.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
      </p>
    </div>
  )
}

const renderLegend = ({ payload }) => (
  <div className="flex flex-col gap-2 mt-2">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
          <span className="text-xs text-gray-500 dark:text-gray-400">{entry.value}</span>
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          €{DEPT_DATA[i].value.toLocaleString()}
        </span>
      </div>
    ))}
  </div>
)

function DepartmentPieChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={DEPT_DATA}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {DEPT_DATA.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default DepartmentPieChart