import { TrendingUp, Wrench, Building2, Users } from 'lucide-react'

const cards = (analytics, tools) => {
    const activeToolsCount = tools?.filter(t => t.status === 'active').length ?? 0
    const budget = analytics?.budget_overview
    const kpi = analytics?.kpi_trends
    const cost = analytics?.cost_analytics

    return [
        {
            label: 'Monthly Budget',
            value: `€${budget?.current_month_total?.toLocaleString()}`,
            sub: `€${budget?.monthly_limit?.toLocaleString()}`,
            badge: kpi?.budget_change,
            badgeColor: 'bg-emerald-500',
            icon: TrendingUp,
            iconBg: 'bg-emerald-500',
            progress: budget ? Math.round((budget.current_month_total / budget.monthly_limit) * 100) : null,
            gradient: 'from-emerald-500/30 via-transparent to-transparent', // 30% opacity
        },
        {
            label: 'Active Tools',
            value: activeToolsCount,
            badge: kpi?.tools_change,
            badgeColor: 'bg-violet-500',
            icon: Wrench,
            iconBg: 'bg-violet-500',
            gradient: 'from-violet-500/30 via-transparent to-transparent',
        },
        {
            label: 'Departments',
            value: 5,
            badge: kpi?.departments_change,
            badgeColor: 'bg-orange-500',
            icon: Building2,
            iconBg: 'bg-orange-500',
            gradient: 'from-orange-500/30 via-transparent to-transparent',
        },
        {
            label: 'Cost/User',
            value: `€${cost?.cost_per_user}`,
            badge: kpi?.cost_per_user_change,
            badgeColor: 'bg-pink-500',
            icon: Users,
            iconBg: 'bg-pink-500',
            gradient: 'from-pink-500/30 via-transparent to-transparent',
        },
    ]
}

function KPICards({ analytics, tools }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards(analytics, tools).map((card) => (
                <div
                    key={card.label}
                    className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                    {/* Gradient visible uniquement au hover */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0`}
                    />

                    {/* Contenu de la card */}
                    <div className="relative z-10 p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{card.label}</span>
                            <div className={`${card.iconBg} w-9 h-9 rounded-lg flex items-center justify-center shrink-0`}>
                                <card.icon size={18} className="text-white" />
                            </div>
                        </div>

                        {/* Value */}
                        <div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {card.value}
                                {card.sub && (
                                    <span className="text-gray-400 dark:text-gray-500 font-normal text-lg">/{card.sub}</span>
                                )}
                            </div>

                            {/* Badge */}
                            {card.badge && (
                                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium text-white ${card.badgeColor}`}>
                                    {card.badge}
                                </span>
                            )}

                            {/* Progress bar — Budget uniquement */}
                            {card.progress != null && (
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>Budget utilisé</span>
                                        <span>{card.progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${card.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default KPICards