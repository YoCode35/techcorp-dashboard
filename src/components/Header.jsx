import { Link, useLocation } from 'react-router-dom'
import { Search, Bell, Settings, Sun, Moon, Zap, Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Tools', path: '/tools' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Settings', path: '/settings' },
]

function Header({ darkMode, toggleDarkMode, search, onSearch, placeholder }) {
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [avatarOpen, setAvatarOpen] = useState(false)


    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-black">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                        <Zap size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">TechCorp</span>
                </Link>

                {/* Nav desktop */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${location.pathname === link.path
                                ? 'text-gray-900 dark:text-white font-medium'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Actions */}
                <div className="flex items-center gap-3 sm:gap-2">

                    {/* Search */}
                    <div className="relative hidden sm:block">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder={placeholder ?? 'Search tools...'}
                            value={search}
                            onChange={e => onSearch(e.target.value)}
                            className="w-80 bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-lg pl-8 pr-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 focus:w-80 transition-all"
                        />
                    </div>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {darkMode
                            ? <Sun size={16} className="text-yellow-400" />
                            : <Moon size={16} className="text-gray-500" />
                        }
                    </button>

                    {/* Notifications */}
                    <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <Bell size={16} />
                        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold leading-none">
                            3
                        </span>
                    </button>

                    {/* Settings */}
                    <button className="hidden sm:flex w-8 h-8 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                        <Settings size={16} />
                    </button>

                    {/* Avatar + dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setAvatarOpen(o => !o)}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
                        >
                            A
                        </button>

                        {avatarOpen && (
                            <div className="fixed sm:absolute left-0 right-0 sm:left-auto sm:right-0 top-14 sm:top-10 z-50 sm:w-48 rounded-none sm:rounded-xl border-y sm:border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-xl overflow-hidden">
                                {/* User info */}
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                                    <p className="text-xs text-gray-400 mt-0.5">admin@techcorp.com</p>
                                </div>
                                {/* Links */}
                                {[
                                    { icon: User, label: 'Profile' },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        onClick={() => setAvatarOpen(false)}
                                    >
                                        <item.icon size={14} />
                                        {item.label}
                                    </button>
                                ))}
                                {/* Logout */}
                                <div className="border-t border-gray-100 dark:border-white/10">
                                    <button
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        onClick={() => setAvatarOpen(false)}
                                    >
                                        <LogOut size={14} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {menuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                </div>
            </header>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="fixed top-14 left-0 right-0 z-40 md:hidden border-b border-gray-200 dark:border-white/10 bg-white/98 dark:bg-[#0f0f0f]/98 backdrop-blur-sm transition-colors duration-300">

                    {/* Search mobile */}
                    <div className={`px-4 pt-4 pb-2 sm:hidden ${location.pathname === '/tools' ? 'hidden' : ''}`}>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder={placeholder ?? 'Search tools...'}
                                value={search}
                                onChange={e => onSearch(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-lg pl-8 pr-4 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Nav links mobile */}
                    <nav className="flex flex-col px-4 py-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center px-3 py-3 rounded-lg text-sm transition-colors ${location.pathname === link.path
                                    ? 'text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-white/10'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="h-2" />
                </div>
            )}
        </>
    )
}

export default Header