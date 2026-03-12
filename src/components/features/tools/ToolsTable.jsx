import { useState } from 'react'
import { ChevronUp, ChevronDown, MoreVertical, Eye, Pencil, Trash2, CheckSquare, Square, Power } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { sortItems, formatCurrency, formatDate } from '@/utils/helpers'

export const StatusBadge = ({ status }) => (
    <Badge variant={status}>
        {status === 'active' ? 'Active' : status === 'expiring' ? 'Expiring' : 'Unused'}
    </Badge>
)

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

function ToolsTable({ tools, onEdit, onDelete, onView, onToggle }) {
    const [sortBy, setSortBy] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc')
    const [openMenu, setOpenMenu] = useState(null)
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(1)
    const PER_PAGE = 10

    const handleSort = (col) => {
        if (sortBy === col) {
            setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(col)
            setSortOrder('asc')
        }
        setPage(1)
    }

    const sorted = sortItems(tools ?? [], sortBy, sortOrder)

    const totalPages = Math.ceil(sorted.length / PER_PAGE)
    const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    const toggleSelect = (id) => {
        setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])
    }

    const toggleAll = () => {
        const pageIds = paginated.map(t => t.id)
        const allSelected = pageIds.every(id => selected.includes(id))
        setSelected(allSelected ? selected.filter(id => !pageIds.includes(id)) : [...new Set([...selected, ...pageIds])])
    }

    const allPageSelected = paginated.length > 0 && paginated.every(t => selected.includes(t.id))

    const columns = [
        { label: 'Outil', col: 'name' },
        { label: 'Catégorie', col: 'category' },
        { label: 'Département', col: 'owner_department' },
        { label: 'Utilisateurs', col: 'active_users_count' },
        { label: 'Coût/mois', col: 'monthly_cost' },
        { label: 'Mise à jour', col: 'updated_at' },
        { label: 'Statut', col: 'status' },
    ]

    return (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black overflow-hidden">

            {/* Bulk actions bar */}
            {selected.length > 0 && (
                <div className="flex items-center gap-4 px-6 py-3 bg-violet-500/10 border-b border-violet-500/20">
                    <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                        {selected.length} outil{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-2 ml-auto flex-wrap">

                        {/* Actions mono-outil — uniquement si 1 seul sélectionné */}
                        {selected.length === 1 && (() => {
                            const tool = tools.find(t => t.id === selected[0])
                            return tool ? (
                                <>
                                    <Button variant="secondary" size="sm" onClick={() => { onView(tool); setSelected([]) }}>
                                        <Eye size={13} />
                                        Voir
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={() => { onEdit(tool); setSelected([]) }}>
                                        <Pencil size={13} />
                                        Modifier
                                    </Button>
                                    <Button variant="warning" size="sm" onClick={() => { onToggle(tool); setSelected([]) }}>
                                        <Power size={13} />
                                        {tool.status === 'unused' ? 'Activer' : 'Désactiver'}
                                    </Button>
                                </>
                            ) : null
                        })()}

                        {/* Supprimer — toujours disponible */}
                        <Button variant="danger" size="sm" onClick={() => {
                            if (window.confirm(`Supprimer ${selected.length} outil(s) ?`)) {
                                selected.forEach(id => onDelete(id))
                                setSelected([])
                            }
                        }}>
                            <Trash2 size={13} />
                            Supprimer
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setSelected([])}>
                            Annuler
                        </Button>
                    </div>
                </div>
            )}

            {/* ── DESKTOP table ── */}
            <div className="hidden sm:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-white/10">
                            {/* Checkbox all */}
                            <th className="pl-6 pr-2 py-3 w-10">
                                <button onClick={toggleAll} className="text-gray-400 hover:text-violet-500 transition-colors">
                                    {allPageSelected
                                        ? <CheckSquare size={16} className="text-violet-500" />
                                        : <Square size={16} />
                                    }
                                </button>
                            </th>
                            {columns.map(({ label, col }) => (
                                <th
                                    key={col}
                                    onClick={() => handleSort(col)}
                                    className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-white transition-colors select-none"
                                >
                                    <div className="flex items-center gap-1">
                                        {label}
                                        <SortIcon column={col} sortBy={sortBy} sortOrder={sortOrder} />
                                    </div>
                                </th>
                            ))}
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(tool => (
                            <tr
                                key={tool.id}
                                className={`group border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-150 ${selected.includes(tool.id) ? 'bg-violet-500/5' : ''}`}
                            >
                                {/* Checkbox avec barre gauche */}
                                <td className="pl-6 pr-2 py-4 relative">
                                    {/* Barre gauche */}
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

                                    <button onClick={() => toggleSelect(tool.id)} className="text-gray-400 hover:text-violet-500 transition-colors">
                                        {selected.includes(tool.id)
                                            ? <CheckSquare size={16} className="text-violet-500" />
                                            : <Square size={16} />
                                        }
                                    </button>
                                </td>

                                {/* Tool */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <ToolIcon tool={tool} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]">{tool.name}</p>
                                            <p className="text-xs text-gray-400 truncate max-w-[140px]">{tool.vendor}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Category */}
                                <td className="px-4 py-4">
                                    <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                                        {tool.category ?? '—'}
                                    </span>
                                </td>

                                {/* Department */}
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{tool.owner_department ?? '—'}</td>

                                {/* Users */}
                                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{tool.active_users_count ?? '—'}</td>

                                {/* Cost */}
                                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                                    {formatCurrency(tool.monthly_cost)}
                                </td>

                                {/* Status */}
                                <td className="px-4 py-4">
                                    <StatusBadge status={tool.status} />
                                </td>

                                {/* Last update */}
                                <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(tool.updated_at)}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setOpenMenu(openMenu === tool.id ? null : tool.id)}
                                    >
                                        <MoreVertical size={15} />
                                    </Button>
                                    {openMenu === tool.id && (
                                        <div className="absolute right-4 top-10 z-20 w-36 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-xl overflow-hidden">
                                            {[
                                                { icon: Eye, label: 'Voir', fn: onView },
                                                { icon: Pencil, label: 'Modifier', fn: onEdit },
                                                {
                                                    icon: Power,
                                                    label: tool.status === 'unused' ? 'Activer' : 'Désactiver',
                                                    fn: onToggle,
                                                    warning: true,
                                                },
                                                { icon: Trash2, label: 'Supprimer', fn: onDelete, danger: true },
                                            ].map(action => (
                                                <button
                                                    key={action.label}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${action.danger ? 'text-red-500' : action.warning ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300'
                                                        }`}
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

            {/* ── MOBILE cards ── */}
            <div className="sm:hidden divide-y divide-gray-100 dark:divide-white/5">
                {paginated.map(tool => (
                    <div
                        key={tool.id}
                        className={`flex items-start justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${selected.includes(tool.id) ? 'bg-violet-500/5' : ''}`}
                    >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <button onClick={() => toggleSelect(tool.id)} className="text-gray-400 hover:text-violet-500 transition-colors mt-0.5">
                                {selected.includes(tool.id)
                                    ? <CheckSquare size={16} className="text-violet-500" />
                                    : <Square size={16} />
                                }
                            </button>
                            <ToolIcon tool={tool} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{tool.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{tool.owner_department ?? '—'}</p>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                    <StatusBadge status={tool.status} />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatCurrency(tool.monthly_cost)}
                                    </span>
                                    {tool.active_users_count && (
                                        <span className="text-xs text-gray-400">{tool.active_users_count} users</span>
                                    )}
                                </div>
                            </div>
                        </div>
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
                                        { icon: Eye, label: 'Voir', fn: onView },
                                        { icon: Pencil, label: 'Modifier', fn: onEdit },
                                        {
                                            icon: Power,
                                            label: tool.status === 'unused' ? 'Activer' : 'Désactiver',
                                            fn: onToggle,
                                            warning: true,
                                        },
                                        { icon: Trash2, label: 'Supprimer', fn: onDelete, danger: true },
                                    ].map(action => (
                                        <button
                                            key={action.label}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${action.danger ? 'text-red-500' : action.warning ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300'
                                                }`}
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-white/10">
                <span className="text-xs text-gray-400">
                    {tools?.length ?? 0} outils · Page {page} sur {totalPages || 1}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Précédent
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || totalPages === 0}
                    >
                        Suivant
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default ToolsTable