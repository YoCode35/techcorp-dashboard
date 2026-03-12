import clsx from 'clsx'

function Textarea({ className, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={clsx(
        'w-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none',
        className
      )}
      {...props}
    />
  )
}

export default Textarea