import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
    TrendingUp, TrendingDown, DollarSign, Users, Wrench,
    AlertTriangle, ArrowRight, BarChart2, PieChart, Activity
} from 'lucide-react'
import { useAnalytics, useAllTools } from '@/hooks/useTools'
import MobilePageHeader from '@/components/layout/MobilePageHeader'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui'
import { Button, Badge } from '@/components/ui'
import InsightKPI from '@/components/insights/InsightKPI'
import AlertCard from '@/components/insights/AlertCard'
import SpendLineChart from '@/components/charts/SpendLineChart'
import DepartmentPieChart from '@/components/charts/DepartmentPieChart'
import TopToolsBarChart from '@/components/charts/TopToolsBarChart'
import ErrorState from '@/components/ui/ErrorState'
import { formatCurrency, getDaysFromTimeRange } from '@/utils/helpers'
import { TIME_RANGES } from '@/utils/constants'

const ChartCard = ({ title, subtitle, icon: Icon, children, className }) => (
    <div className={`rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black overflow-hidden ${className ?? ''}`}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-white/10">
            {Icon && (
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <Icon size={15} className="text-violet-500" />
                </div>
            )}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
        <div className="px-6 py-4">{children}</div>
    </div>
)

const SkeletonBox = ({ className }) => (
    <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-white/10 ${className}`} />
)

function AnalyticsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:pt-8 pt-12">
            <div className="mb-8">
                <SkeletonBox className="h-8 w-48 mb-2" />
                <SkeletonBox className="h-4 w-72" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => <SkeletonBox key={i} className="h-32 rounded-xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeletonBox className="lg:col-span-2 h-72 rounded-xl" />
                <SkeletonBox className="h-72 rounded-xl" />
            </div>
        </div>
    )
}

function Analytics({ search, onSearch }) {
    const [timeRange, setTimeRange] = useState('30d')
    const [selectedDept, setSelectedDept] = useState(null)

    const { data: analytics, isLoading: loadingAnalytics, isError: errorAnalytics, refetch } = useAnalytics()
    const { data: tools, isLoading: loadingTools } = useAllTools()

    const isLoading = loadingAnalytics || loadingTools

    const unusedTools = useMemo(() => tools?.filter(t => t.status === 'unused') ?? [], [tools])
    const expiringTools = useMemo(() => tools?.filter(t => t.status === 'expiring') ?? [], [tools])
    const activeTools = useMemo(() => tools?.filter(t => t.status === 'active') ?? [], [tools])

    const budget = analytics?.budget_overview
    const kpi = analytics?.kpi_trends
    const cost = analytics?.cost_analytics

    const budgetProgress = budget
        ? Math.round((budget.current_month_total / budget.monthly_limit) * 100)
        : 0

    const adoptionRate = cost
        ? Math.round((cost.active_users / cost.total_users) * 100)
        : 0

    const filteredTools = useMemo(() => {
        if (!tools) return []

        const now = new Date()
        const days = getDaysFromTimeRange(timeRange)

        return tools.filter(t => {
            const matchDept = !selectedDept || t.owner_department === selectedDept
            const matchSearch = !search || (
                t.name?.toLowerCase().includes(search.toLowerCase()) ||
                t.category?.toLowerCase().includes(search.toLowerCase()) ||
                t.owner_department?.toLowerCase().includes(search.toLowerCase())
            )
            const matchTime = !t.updated_at || (
                (now - new Date(t.updated_at)) / (1000 * 60 * 60 * 24) <= days
            )
            return matchDept && matchSearch && matchTime
        })
    }, [tools, selectedDept, search, timeRange])

    if (isLoading) return <AnalyticsSkeleton />

    if (errorAnalytics) return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <ErrorState
                title="Impossible de charger les analytics"
                message="Le serveur est inaccessible."
                onRetry={refetch}
            />
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">

            <MobilePageHeader
                title="Analytics"
                placeholder="Search metrics, insights..."
                search={search}
                onSearch={onSearch}
            />

            {/* Page header */}
            <div className="flex items-start justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Visualisez et optimisez vos dépenses SaaS
                    </p>
                </div>

                {/* Time range picker */}
                <div className="flex items-center gap-1 p-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black shrink-0">
                    {TIME_RANGES.map(({ label, value }) => (
                        <button
                            key={value}
                            onClick={() => setTimeRange(value)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${timeRange === value
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search mobile */}
            <div className="sm:hidden mb-6">
                <Input
                    icon={Search}
                    type="text"
                    placeholder="Search metrics, insights..."
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                />
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <InsightKPI
                    label="Budget mensuel"
                    value={`€${budget?.current_month_total?.toLocaleString() ?? '—'}`}
                    sub={`€${budget?.monthly_limit?.toLocaleString() ?? '—'}`}
                    trend={1}
                    trendLabel={kpi?.budget_change}
                    icon={DollarSign}
                    iconBg="bg-emerald-500"
                />
                <InsightKPI
                    label="Coût par utilisateur"
                    value={`€${cost?.cost_per_user ?? '—'}`}
                    trend={-1}
                    trendLabel={kpi?.cost_per_user_change}
                    icon={Users}
                    iconBg="bg-pink-500"
                />
                <InsightKPI
                    label="Outils actifs"
                    value={activeTools.length}
                    trend={1}
                    trendLabel={kpi?.tools_change}
                    icon={Wrench}
                    iconBg="bg-violet-500"
                />
                <InsightKPI
                    label="Taux d'adoption"
                    value={`${adoptionRate}%`}
                    sub={`${cost?.active_users}/${cost?.total_users} users`}
                    trend={0}
                    trendLabel="Stable"
                    icon={Activity}
                    iconBg="bg-cyan-500"
                />
            </div>

            {/* Budget Progress */}
            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-6 py-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Budget Progress</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {formatCurrency(budget?.current_month_total)} utilisés sur €{budget?.monthly_limit?.toLocaleString()}
                        </p>
                    </div>
                    <span className={`text-sm font-bold ${budgetProgress > 90 ? 'text-red-500' : budgetProgress > 70 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {budgetProgress}%
                    </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${budgetProgress > 90 ? 'bg-red-500' : budgetProgress > 70 ? 'bg-orange-500' : 'bg-emerald-500'
                            }`}
                        style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                    />
                </div>
                {budgetProgress > 80 && (
                    <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                        <AlertTriangle size={11} />
                        Budget à {budgetProgress}% — attention au dépassement
                    </p>
                )}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <ChartCard
                    title="Monthly Spend Evolution"
                    subtitle="Évolution des dépenses mensuelles"
                    icon={TrendingUp}
                    className="lg:col-span-2"
                >
                    <SpendLineChart analytics={analytics} timeRange={timeRange} />
                </ChartCard>

                <ChartCard
                    title="Department Breakdown"
                    subtitle="Répartition par département"
                    icon={PieChart}
                >
                    <DepartmentPieChart />
                </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartCard
                    title="Top Expensive Tools"
                    subtitle="Outils les plus coûteux"
                    icon={BarChart2}
                >
                    <TopToolsBarChart tools={tools} />
                </ChartCard>

                {/* Usage & Adoption */}
                <ChartCard
                    title="User Adoption Rates"
                    subtitle="Taux d'adoption par outil"
                    icon={Users}
                >
                    <div className="space-y-3">
                        {(filteredTools ?? [])
                            .filter(t => t.active_users_count && t.active_users_count > 0)
                            .sort((a, b) => (b.active_users_count ?? 0) - (a.active_users_count ?? 0))
                            .slice(0, 6)
                            .map(tool => {
                                const rate = Math.round((tool.active_users_count / (cost?.total_users ?? 66)) * 100)
                                return (
                                    <div key={tool.id}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[160px]">{tool.name}</span>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0 ml-2">{rate}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(rate, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </ChartCard>
            </div>

            {/* Drill-down départements */}
            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-6 py-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Department Activity</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedDept(null)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${!selectedDept
                                ? 'bg-violet-500 text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                                }`}
                        >
                            Tous
                        </button>
                        {['Engineering', 'Design', 'Marketing', 'Operations', 'Communication'].map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDept(dept === selectedDept ? null : dept)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${selectedDept === dept
                                    ? 'bg-violet-500 text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredTools
                        .slice(0, 6)
                        .map(tool => (
                            <div
                                key={tool.id}
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-white/10 hover:border-violet-500/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    {tool.icon_url
                                        ? <img src={tool.icon_url} alt={tool.name} className="w-5 h-5 object-contain" onError={e => e.target.style.display = 'none'} />
                                        : <span className="text-xs font-bold text-gray-600 dark:text-white">{tool.name?.[0]}</span>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{tool.name}</p>
                                    <p className="text-xs text-gray-400">{tool.active_users_count ?? 0} users · €{tool.monthly_cost?.toLocaleString() ?? '—'}</p>
                                </div>
                                <Badge variant={tool.status} />
                            </div>
                        ))
                    }
                </div>
                {filteredTools.length > 6 && (
                    <div className="mt-4 text-center">
                        <Link to="/tools">
                            <Button variant="secondary" size="sm">
                                Voir tous les outils
                                <ArrowRight size={13} />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Alerts */}
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-6 py-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        Cost Optimization Alerts
                    </h3>
                    <div className="space-y-3">
                        {budgetProgress > 80 && (
                            <AlertCard
                                variant="danger"
                                title="Budget critique"
                                message={`${budgetProgress}% du budget mensuel consommé`}
                                count={1}
                                linkTo="/tools?status=active"
                                linkLabel="Gérer les outils"
                            />
                        )}
                        {unusedTools.length > 0 && (
                            <AlertCard
                                variant="warning"
                                title="Outils non utilisés"
                                message={`${unusedTools.length} outils inactifs représentent des coûts inutiles`}
                                count={unusedTools.length}
                                linkTo="/tools?status=unused"
                                linkLabel="Voir les outils"
                            />
                        )}
                        {expiringTools.length > 0 && (
                            <AlertCard
                                variant="info"
                                title="Licences expirantes"
                                message={`${expiringTools.length} outils avec des licences bientôt expirées`}
                                count={expiringTools.length}
                                linkTo="/tools?status=expiring"
                                linkLabel="Renouveler"
                            />
                        )}
                        {unusedTools.length === 0 && expiringTools.length === 0 && budgetProgress <= 80 && (
                            <AlertCard
                                variant="info"
                                title="Tout est en ordre"
                                message="Aucune alerte critique détectée pour le moment"
                            />
                        )}
                    </div>
                </div>

                {/* ROI & Metrics */}
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-6 py-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        ROI & Key Metrics
                    </h3>
                    <div className="space-y-4">

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Coût mensuel total</p>
                                <p className="text-xs text-gray-400">vs mois précédent</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(budget?.current_month_total)}
                                </p>
                                <p className="text-xs text-emerald-500">{kpi?.budget_change}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Coût par utilisateur</p>
                                <p className="text-xs text-gray-400">actifs / total</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">€{cost?.cost_per_user}</p>
                                <p className="text-xs text-red-400">{kpi?.cost_per_user_change}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Utilisateurs actifs</p>
                                <p className="text-xs text-gray-400">sur {cost?.total_users} total</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{cost?.active_users}</p>
                                <p className="text-xs text-gray-400">{adoptionRate}% adoption</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Économies potentielles</p>
                                <p className="text-xs text-gray-400">outils inutilisés</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-emerald-500">
                                    {formatCurrency(unusedTools.reduce((acc, t) => acc + Number(t.monthly_cost ?? 0), 0))}
                                </p>
                                <p className="text-xs text-gray-400">{unusedTools.length} outils</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Cross-page navigation */}
            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black px-6 py-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Navigation rapide</h3>
                <div className="flex flex-wrap gap-3">
                    <Link to="/">
                        <Button variant="secondary" size="md">
                            <TrendingUp size={14} />
                            Dashboard KPIs
                        </Button>
                    </Link>
                    <Link to="/tools">
                        <Button variant="secondary" size="md">
                            <Wrench size={14} />
                            Gérer les outils
                        </Button>
                    </Link>
                    <Link to="/tools?status=unused">
                        <Button variant="danger" size="md">
                            <AlertTriangle size={14} />
                            Voir outils inutilisés ({unusedTools.length})
                        </Button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default Analytics