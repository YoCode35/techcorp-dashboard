import { useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts'
import { CHART_COLORS } from '@/utils/constants'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">
        €{payload[0].value.toLocaleString()}/mois
      </p>
    </div>
  )
}

function TopToolsBarChart({ tools }) {
  const data = useMemo(() => {
    if (!tools) return []
    return [...tools]
      .sort((a, b) => (b.monthly_cost ?? 0) - (a.monthly_cost ?? 0))
      .slice(0, 8)
      .map(t => ({ name: t.name, cost: t.monthly_cost ?? 0 }))
  }, [tools])

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `€${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="cost" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default TopToolsBarChart