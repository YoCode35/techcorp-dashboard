import clsx from 'clsx'

function Card({ className, children, gradient }) {
    return (
        <div className={clsx(
            'relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black transition-all duration-200',
            className
        )}>
            {gradient && (
                <div className={clsx(
                    'absolute inset-0 bg-gradient-to-br pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200',
                    gradient
                )} />
            )}
            {children}
        </div>
    )
}

export default Card