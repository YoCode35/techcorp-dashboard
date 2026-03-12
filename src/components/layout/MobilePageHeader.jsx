import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui'
import clsx from 'clsx'

function MobilePageHeader({ title, placeholder, search, onSearch }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={clsx(
      'sm:hidden fixed top-14 left-0 right-0 z-30 px-3 py-2 transition-all duration-300',
      isScrolled
        ? 'bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 shadow-lg'
        : 'bg-transparent'
    )}>
      <div className={clsx(
        'flex items-center gap-3 transition-all duration-300',
        isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <span className="text-sm font-bold text-white shrink-0">{title}</span>
        <Input
          icon={Search}
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="text-xs py-1.5"
        />
      </div>
    </div>
  )
}

export default MobilePageHeader