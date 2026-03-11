import clsx from 'clsx'

const variants = {
    active: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    expiring: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30',
    unused: 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30',
    violet: 'bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-500/30',
    gray: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300',
}

const labels = {
    active: 'Active',
    expiring: 'Expiring',
    unused: 'Unused',
}

function Badge({ variant = 'gray', className, children }) {
    return (
        <span className={clsx(
            'px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
            variants[variant],
            className
        )}>
            {children ?? labels[variant] ?? variant}
        </span>
    )
}

export default Badge