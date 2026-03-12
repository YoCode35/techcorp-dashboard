import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

function Select({ value, onChange, options, placeholder, className }) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div className={clsx('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#151515] text-sm text-left focus:outline-none focus:border-violet-500 transition-colors"
      >
        <span className={selected ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className="text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#151515] shadow-xl overflow-hidden max-h-48 overflow-y-auto">
          {placeholder && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              {placeholder}
            </button>
          )}
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setOpen(false) }}
              className={clsx(
                'w-full text-left px-3 py-2.5 text-sm transition-colors',
                value === option.value
                  ? 'bg-violet-500/10 text-violet-500 dark:text-violet-400 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select