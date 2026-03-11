import clsx from 'clsx'

function Input({ className, icon: Icon, ...props }) {
    if (Icon) {
        return (
            <div className="relative">
                <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                    className={clsx(
                        'w-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-lg pl-8 pr-4 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors',
                        className
                    )}
                    {...props}
                />
            </div>
        )
    }

    return (
        <input
            className={clsx(
                'w-full bg-gray-100 dark:bg-[#151515] border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors',
                className
            )}
            {...props}
        />
    )
}

export default Input