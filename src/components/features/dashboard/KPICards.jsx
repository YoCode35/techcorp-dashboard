import { TrendingUp, Wrench, Building2, Users } from 'lucide-react'
import InsightKPI from '@/components/insights/InsightKPI'

function KPICards({ analytics, tools }) {
    const activeToolsCount = tools?.filter(t => t.status === 'active').length ?? 0
    const budget = analytics?.budget_overview
    const kpi = analytics?.kpi_trends
    const cost = analytics?.cost_analytics
    const budgetProgress = budget
        ? Math.round((budget.current_month_total / budget.monthly_limit) * 100)
        : null

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InsightKPI
                label="Monthly Budget"
                value={`€${budget?.current_month_total?.toLocaleString()}`}
                sub={`€${budget?.monthly_limit?.toLocaleString()}`}
                trend={1}
                trendLabel={kpi?.budget_change}
                icon={TrendingUp}
                iconBg="bg-emerald-500"
                progress={budgetProgress}
            />
            <InsightKPI
                label="Active Tools"
                value={activeToolsCount}
                trend={1}
                trendLabel={kpi?.tools_change}
                icon={Wrench}
                iconBg="bg-violet-500"
            />
            <InsightKPI
                label="Departments"
                value={5}
                trend={0}
                trendLabel={kpi?.departments_change}
                icon={Building2}
                iconBg="bg-orange-500"
            />
            <InsightKPI
                label="Cost/User"
                value={`€${cost?.cost_per_user}`}
                trend={-1}
                trendLabel={kpi?.cost_per_user_change}
                icon={Users}
                iconBg="bg-pink-500"
            />
        </div>
    )
}

export default KPICards