import { X, SlidersHorizontal } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { STATUSES, CATEGORIES } from '@/utils/constants'

const statusLabels = {
    active: 'Active',
    expiring: 'Expiring',
    unused: 'Unused',
}

const statusColors = {
    active: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    expiring: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
    unused: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
}

function FilterSection({ title, children }) {
    return (
        <div className="border-b border-gray-100 dark:border-white/10 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>
            {children}
        </div>
    )
}

function FiltersContent({ filters, setFilters, departments, onReset }) {
    const activeCount = [
        filters.status.length,
        filters.departments.length,
        filters.categories.length,
        filters.costMin || filters.costMax ? 1 : 0,
    ].reduce((a, b) => a + b, 0)

    const toggleItem = (key, value) => {
        setFilters(f => ({
            ...f,
            [key]: f[key].includes(value)
                ? f[key].filter(v => v !== value)
                : [...f[key], value],
        }))
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">Filtres</span>
                    {activeCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold">
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <Button variant="ghost" size="xs" onClick={onReset} className="text-violet-500 hover:text-violet-600">
                        Réinitialiser
                    </Button>
                )}
            </div>

            <div className="overflow-y-auto flex-1">

                {/* Status */}
                <FilterSection title="Statut">
                    <div className="flex flex-col gap-2">
                        {STATUSES.map(status => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.status.includes(status)}
                                    onChange={() => toggleItem('status', status)}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-white/20 accent-violet-500 cursor-pointer"
                                />
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
                                    {statusLabels[status]}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Departments */}
                <FilterSection title="Département">
                    <div className="flex flex-col gap-2">
                        {departments?.map(dept => (
                            <label key={dept.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.departments.includes(dept.name)}
                                    onChange={() => toggleItem('departments', dept.name)}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-white/20 accent-violet-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{dept.name}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Categories */}
                <FilterSection title="Catégorie">
                    <div className="flex flex-col gap-2">
                        {CATEGORIES.map(cat => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(cat)}
                                    onChange={() => toggleItem('categories', cat)}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-white/20 accent-violet-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{cat}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Cost Range */}
                <FilterSection title="Coût mensuel (€)">
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={filters.costMin}
                            onChange={e => setFilters(f => ({ ...f, costMin: e.target.value }))}
                        />
                        <span className="text-gray-400 text-sm shrink-0">—</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={filters.costMax}
                            onChange={e => setFilters(f => ({ ...f, costMax: e.target.value }))}
                        />
                    </div>
                </FilterSection>

            </div>
        </div>
    )
}

function ToolsFilters({ filters, setFilters, departments, drawerOpen, setDrawerOpen }) {
    const onReset = () => setFilters({
        status: [],
        departments: [],
        categories: [],
        costMin: '',
        costMax: '',
    })

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
                <div className="sticky top-20 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black p-4">
                    <FiltersContent
                        filters={filters}
                        setFilters={setFilters}
                        departments={departments}
                        onReset={onReset}
                    />
                </div>
            </aside>

            {/* Mobile drawer */}
            {drawerOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setDrawerOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-black border-r border-gray-200 dark:border-white/10 p-4 lg:hidden flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold text-gray-900 dark:text-white">Filtres</span>
                            <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)}>
                                <X size={16} />
                            </Button>
                        </div>
                        <FiltersContent
                            filters={filters}
                            setFilters={setFilters}
                            departments={departments}
                            onReset={onReset}
                        />
                    </div>
                </>
            )}
        </>
    )
}

export default ToolsFilters