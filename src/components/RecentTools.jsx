import { useState } from 'react'
import { Calendar, ChevronUp, ChevronDown, MoreVertical, Eye, Pencil, Trash2, ChevronsUpDown, Search } from 'lucide-react'

const sortOptions = [
    { label: '— Aucun tri —', col: '' },
    { label: 'Nom', col: 'name' },
    { label: 'Département', col: 'owner_department' },
    { label: 'Users', col: 'active_users_count' },
    { label: 'Coût mensuel', col: 'monthly_cost' },
    { label: 'Statut', col: 'status' },
]

const CustomSelect = ({ sortBy, setSortBy, setSortOrder }) => {
    const [open, setOpen] = useState(false)
    const selected = sortOptions.find(o => o.col === (sortBy ?? '')) ?? sortOptions[0]

    const handleSelect = (col) => {
        if (col === '') {
            setSortBy(null)
        } else if (sortBy === col) {
            setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(col)
            setSortOrder('asc')
        }
        setOpen(false)
    }

    return (
        <div className="relative flex-1">
            {/* Trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-violet-500 transition-colors"
            >
                <span>{selected.label}</span>
                <ChevronsUpDown size={14} className="text-gray-400 shrink-0" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-xl overflow-hidden">
                    {sortOptions.map(({ label, col }) => (
                        <button
                            key={col}
                            onClick={() => handleSelect(col)}
                            className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${(sortBy ?? '') === col
                                ? 'bg-violet-500/10 text-violet-500 dark:text-violet-400 font-medium'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const StatusBadge = ({ status }) => {
    const styles = {
        active: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
        expiring: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30',
        unused: 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30',
    }
    const labels = {
        active: 'Active',
        expiring: 'Expiring',
        unused: 'Unused',
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.active}`}>
            {labels[status] ?? status}
        </span>
    )
}

const SortIcon = ({ column, sortBy, sortOrder }) => {
    if (sortBy !== column) return <ChevronUp size={14} className="text-gray-300 dark:text-gray-600" />
    return sortOrder === 'asc'
        ? <ChevronUp size={14} className="text-violet-500" />
        : <ChevronDown size={14} className="text-violet-500" />
}

const ToolIcon = ({ tool }) => (
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
        {tool.icon_url
            ? <img src={tool.icon_url} alt={tool.name} className="w-5 h-5 object-contain" onError={e => e.target.style.display = 'none'} />
            : <span className="text-xs text-gray-600 dark:text-white font-bold">{tool.name?.[0]}</span>
        }
    </div>
)

function RecentTools({ tools, search, onView, onEdit, onDelete }) {
    const [sortBy, setSortBy] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')
    const [openMenu, setOpenMenu] = useState(null)
    const [page, setPage] = useState(1)
    const PER_PAGE = 10

    const handleSort = (col) => {
        if (sortBy === col) {
            setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(col)
            setSortOrder('asc')
        }
    }

    const sorted = [...(tools ?? [])].sort((a, b) => {
        if (!sortBy) return 0
        const valA = a[sortBy] ?? ''
        const valB = b[sortBy] ?? ''
        const result = typeof valA === 'number'
            ? valA - valB
            : String(valA).localeCompare(String(valB))
        return sortOrder === 'asc' ? result : -result
    })

    const totalPages = Math.ceil(sorted.length / PER_PAGE)
    const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    return (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
                <h2 className="text-gray-900 dark:text-white font-semibold">Recent Tools</h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={14} />
                    <span>Last 30 days</span>
                </div>
            </div>

            {/* ── MOBILE : Tri selector ── */}
            <div className="sm:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/10">
                <span className="text-xs text-gray-400 shrink-0">Trier par :</span>
                <CustomSelect
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                    sortOrder={sortOrder}
                />
                {sortBy && (
                    <button
                        onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-violet-500 hover:border-violet-400 transition-colors shrink-0"
                    >
                        {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                    </button>
                )}
            </div>

            {/* Empty state */}
            {tools?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-black flex items-center justify-center mb-4">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">Aucun outil trouvé</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Aucun résultat pour <span className="text-violet-500">"{search}"</span>
                    </p>
                </div>
            )}

            {/* ── MOBILE : Card layout ── */}
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-white/5">
                {paginated.map((tool) => (
                    <div
                        key={tool.id}
                        className="flex items-start justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        {/* Left : icon + infos */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <ToolIcon tool={tool} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {tool.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {tool.owner_department ?? '—'}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <StatusBadge status={tool.status} />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {tool.monthly_cost != null ? `€${tool.monthly_cost.toLocaleString()}` : '—'}
                                    </span>
                                    {tool.active_users_count && (
                                        <span className="text-xs text-gray-400">
                                            {tool.active_users_count} users
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right : actions */}
                        <div className="relative ml-2 shrink-0">
                            <button
                                onClick={() => setOpenMenu(openMenu === tool.id ? null : tool.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <MoreVertical size={15} />
                            </button>
                            {openMenu === tool.id && (
                                <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-xl overflow-hidden">
                                    {[
                                        { icon: Eye, label: 'View', fn: onView },
                                        { icon: Pencil, label: 'Edit', fn: onEdit },
                                        { icon: Trash2, label: 'Delete', fn: onDelete, danger: true },
                                    ].map((action) => (
                                        <button
                                            key={action.label}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${action.danger ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
                                            onClick={() => { action.fn(tool); setOpenMenu(null) }}
                                        >
                                            <action.icon size={14} />
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── DESKTOP : Table layout ── */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-white/10">
                            {[
                                { label: 'Tool', col: 'name' },
                                { label: 'Department', col: 'owner_department' },
                                { label: 'Users', col: 'active_users_count' },
                                { label: 'Monthly Cost', col: 'monthly_cost' },
                                { label: 'Status', col: 'status' },
                            ].map(({ label, col }) => (
                                <th
                                    key={col}
                                    onClick={() => handleSort(col)}
                                    className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-white transition-colors select-none"
                                >
                                    <div className="flex items-center gap-1">
                                        {label}
                                        <SortIcon column={col} sortBy={sortBy} sortOrder={sortOrder} />
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((tool) => (
                            <tr
                                key={tool.id}
                                className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <ToolIcon tool={tool} />
                                        <span className="text-sm text-gray-900 dark:text-white font-medium truncate max-w-[160px]">
                                            {tool.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{tool.owner_department ?? '—'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{tool.active_users_count ?? '—'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {tool.monthly_cost != null ? `€${tool.monthly_cost.toLocaleString()}` : '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={tool.status} />
                                </td>
                                <td className="px-6 py-4 relative">
                                    <button
                                        onClick={() => setOpenMenu(openMenu === tool.id ? null : tool.id)}
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <MoreVertical size={15} />
                                    </button>
                                    {openMenu === tool.id && (
                                        <div className="absolute right-6 top-10 z-20 w-36 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-xl overflow-hidden">
                                            {[
                                                { icon: Eye, label: 'View', fn: onView },
                                                { icon: Pencil, label: 'Edit', fn: onEdit },
                                                { icon: Trash2, label: 'Delete', fn: onDelete, danger: true },
                                            ].map((action) => (
                                                <button
                                                    key={action.label}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${action.danger ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}
                                                    onClick={() => { action.fn(tool); setOpenMenu(null) }}
                                                >
                                                    <action.icon size={14} />
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-white/10">
                    <span className="text-xs text-gray-400">
                        Page {page} sur {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 text-xs rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Précédent
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 text-xs rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecentTools