import clsx from 'clsx'
import { TrendingUp, TrendingDown } from 'lucide-react'

function InsightKPI({ label, value, sub, trend, trendLabel, icon: Icon, iconBg, className }) {
    const isPositive = trend > 0
    const isNeutral = trend === 0

    return (
        <div className={clsx(
            'group relative overflow-hidden rounded-xl border ... hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
            className
        )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                {Icon && (
                    <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
                        <Icon size={18} className="text-white" />
                    </div>
                )}
            </div>

            {/* Value */}
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
                {sub && (
                    <span className="text-gray-400 dark:text-gray-500 font-normal text-lg">/{sub}</span>
                )}
            </div>

            {/* Trend */}
            {trendLabel && (
                <div className={clsx(
                    'inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium',
                    isNeutral
                        ? 'bg-gray-100 dark:bg-white/10 text-gray-500'
                        : isPositive
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/20 text-red-600 dark:text-red-400'
                )}>
                    {!isNeutral && (isPositive
                        ? <TrendingUp size={10} />
                        : <TrendingDown size={10} />
                    )}
                    {trendLabel}
                </div>
            )}
        </div>
    )
}

export default InsightKPI