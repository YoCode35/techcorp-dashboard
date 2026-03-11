import { X, ExternalLink, Users, DollarSign, Tag, Building2, Globe } from 'lucide-react'
import { StatusBadge } from './ToolsTable'

function DetailRow({ icon, label, value }) {
    if (!value && value !== 0) return null
    const Icon = icon
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-black flex items-center justify-center shrink-0">
                <Icon size={15} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    )
}

function ToolsDetail({ tool, onClose, onEdit }) {
    if (!tool) return null

    const costEvolution = tool.previous_month_cost
        ? Math.round(((tool.monthly_cost - tool.previous_month_cost) / tool.previous_month_cost) * 100)
        : null

    return (
        <div>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent border-b border-gray-100 dark:border-white/10">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                {tool.icon_url
                                    ? <img src={tool.icon_url} alt={tool.name} className="w-9 h-9 object-contain" onError={e => { e.target.style.display = 'none' }} />
                                    : <span className="text-xl font-bold text-gray-600 dark:text-white">{tool.name?.[0]}</span>
                                }
                            </div>

                            <div className="flex-1 min-w-0 pr-8">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{tool.name}</h2>
                                <p className="text-sm text-gray-400 mt-0.5">{tool.vendor || '—'}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <StatusBadge status={tool.status} />
                                    {tool.category && (
                                        <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                                            {tool.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {tool.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                                {tool.description}
                            </p>
                        )}
                    </div>

                    {/* KPI mini cards */}
                    <div className="grid grid-cols-3 gap-3 px-6 py-4 bdark:bg-blackorder-b border-gray-100 dark:border-white/10">
                        <div className="rounded-lg bg-gray-50 dark:bg-black p-3 text-center">
                            <p className="text-xs text-gray-400 mb-1">Coût/mois</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {tool.monthly_cost != null ? `€${tool.monthly_cost.toLocaleString()}` : '—'}
                            </p>
                            {costEvolution !== null && (
                                <span className={`text-xs font-medium ${costEvolution > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {costEvolution > 0 ? '+' : ''}{costEvolution}%
                                </span>
                            )}
                        </div>

                        <div className="rounded-lg bg-gray-50 dark:bg-black p-3 text-center">
                            <p className="text-xs text-gray-400 mb-1">Utilisateurs</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {tool.active_users_count ?? '—'}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 dark:bg-black p-3 text-center">
                            <p className="text-xs text-gray-400 mb-1">Coût/user</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                {tool.monthly_cost && tool.active_users_count
                                    ? `€${Math.round(tool.monthly_cost / tool.active_users_count)}`
                                    : '—'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="px-6 py-2 max-h-[30vh] overflow-y-auto">
                        <DetailRow icon={Building2} label="Département" value={tool.owner_department} />
                        <DetailRow icon={Tag} label="Catégorie" value={tool.category} />
                        <DetailRow icon={DollarSign} label="Coût mois précédent" value={tool.previous_month_cost != null ? `€${tool.previous_month_cost.toLocaleString()}` : null} />
                        <DetailRow icon={Users} label="Utilisateurs actifs" value={tool.active_users_count} />
                        <DetailRow icon={Globe} label="Site web" value={tool.website_url} />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/10">
                        {tool.website_url && (
                            <a href={tool.website_url}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-violet-500 hover:text-violet-600 transition-colors"
                            >
                                <ExternalLink size={14} />
                                Visiter le site
                            </a>
                        )}
                        <button
                            onClick={() => { onClose(); onEdit(tool) }}
                            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
                        >
                            Modifier
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ToolsDetail