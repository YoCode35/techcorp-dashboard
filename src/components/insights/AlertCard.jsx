import clsx from 'clsx'
import { AlertTriangle, XCircle, Info, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const variants = {
    warning: {
        container: 'border-orange-500/30 bg-orange-500/5',
        icon: 'text-orange-500',
        IconComponent: AlertTriangle,
    },
    danger: {
        container: 'border-red-500/30 bg-red-500/5',
        icon: 'text-red-500',
        IconComponent: XCircle,
    },
    info: {
        container: 'border-violet-500/30 bg-violet-500/5',
        icon: 'text-violet-500',
        IconComponent: Info,
    },
}

function AlertCard({ variant = 'warning', title, message, count, linkTo, linkLabel }) {
    const { container, icon, IconComponent } = variants[variant]

    return (
        <div className={clsx(
            'rounded-xl border p-4 flex items-start gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150',
            container
        )}>
            <IconComponent size={18} className={clsx('shrink-0 mt-0.5', icon)} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
                    {count != null && (
                        <span className={clsx(
                            'px-1.5 py-0.5 rounded-full text-xs font-bold text-white',
                            variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-orange-500' : 'bg-violet-500'
                        )}>
                            {count}
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{message}</p>
                {linkTo && (
                    <Link
                        to={linkTo}
                        className={clsx('inline-flex items-center gap-1 text-xs font-medium mt-2 hover:underline', icon)}
                    >
                        {linkLabel ?? 'Voir'}
                        <ArrowRight size={11} />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default AlertCard