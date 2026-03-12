import { useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts'

const generateMonthlyData = (currentTotal, previousTotal, months = 12) => {
  const allMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
  const currentMonth = new Date().getMonth() // 0 = Jan, 2 = Mar...

  // Prend les `months` derniers mois en remontant depuis le mois actuel
  const selectedMonths = []
  for (let i = months - 1; i >= 0; i--) {
    const idx = (currentMonth - i + 12) % 12
    selectedMonths.push(allMonths[idx])
  }

  return selectedMonths.map((month, i) => {
    const progress = months === 1 ? 1 : i / (months - 1)
    const base = previousTotal + (currentTotal - previousTotal) * progress
    const noise = (Math.random() - 0.5) * 1500
    return {
      month,
      cost: Math.round(Math.max(0, base + noise)),
    }
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">
        €{payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

function SpendLineChart({ analytics, timeRange }) {
const data = useMemo(() => {
  const current = analytics?.budget_overview?.current_month_total ?? 17928
  const previous = analytics?.budget_overview?.previous_month_total ?? 15990

  if (timeRange === '30d') return generateMonthlyData(current, previous, 1)
  if (timeRange === '90d') return generateMonthlyData(current, previous, 3)
  return generateMonthlyData(current, previous, 12)
}, [analytics, timeRange])

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
<defs>
  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
  </linearGradient>
</defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `€${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="cost"
          stroke="#8b5cf6"
          strokeWidth={2}
          fill="url(#spendGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default SpendLineChart