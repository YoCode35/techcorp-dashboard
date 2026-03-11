import clsx from 'clsx'

const variants = {
    primary: 'bg-violet-500 hover:bg-violet-600 text-white',
    secondary: 'border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    ghost: 'text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10',
    warning: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
}

const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    icon: 'w-8 h-8',
}

function Button({ variant = 'primary', size = 'md', className, children, disabled, ...props }) {
    return (
        <button
            disabled={disabled}
            className={clsx(
                'flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
                variants[variant],
                sizes[size],
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button