import clsx from 'clsx'
import { TrendingUp, TrendingDown } from 'lucide-react'

function InsightKPI({ label, value, sub, trend, trendLabel, icon: Icon, iconBg, progress, className }) {
    const isPositive = trend > 0
    const isNeutral = trend === 0

    return (
        <div className={clsx(
            'group relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
            className
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                    {Icon && (
                        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
                            <Icon size={18} className="text-white" />
                        </div>
                    )}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                    {sub && (
                        <span className="text-gray-400 dark:text-gray-500 font-normal text-lg">/{sub}</span>
                    )}
                </div>
                {trendLabel && (
                    <div className={clsx(
                        'inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium',
                        isNeutral
                            ? 'bg-gray-100 dark:bg-white/10 text-gray-500'
                            : isPositive
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    )}>
                        {!isNeutral && (isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />)}
                        {trendLabel}
                    </div>
                )}
                {/* Progress bar optionnelle */}
                {progress != null && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Budget utilisé</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InsightKPI