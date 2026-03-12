import { useState, useMemo } from 'react'
import { Plus, SlidersHorizontal, Search } from 'lucide-react'
import MobilePageHeader from '@/components/layout/MobilePageHeader'
import { useAllTools, useDepartments, useCreateTool, useUpdateTool, useDeleteTool } from '@/hooks/useTools'
import ToolsFilters from '@/components/features/tools/ToolsFilters'
import ToolsTable from '@/components/features/tools/ToolsTable'
import ToolsModal from '@/components/features/tools/ToolsModal'
import ErrorState from '@/components/ui/ErrorState'
import ToolsDetail from '@/components/features/tools/ToolsDetail'
import { Button, Input } from '@/components/ui'
import { useLocation } from 'react-router-dom'

const SkeletonBox = ({ className }) => (
    <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-white/10 ${className}`} />
)

function ToolsSkeleton() {

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <SkeletonBox className="h-8 w-48 mb-2" />
                    <SkeletonBox className="h-4 w-72" />
                </div>
                <SkeletonBox className="h-9 w-36 rounded-lg" />
            </div>
            <div className="flex gap-6">
                <SkeletonBox className="hidden lg:block w-56 h-96 rounded-xl shrink-0" />
                <div className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-white/5">
                            <SkeletonBox className="w-8 h-8 rounded-lg shrink-0" />
                            <SkeletonBox className="h-4 w-32" />
                            <SkeletonBox className="h-4 w-20 ml-auto" />
                            <SkeletonBox className="h-5 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function Tools({ search }) {
    const location = useLocation()

    const [filters, setFilters] = useState({
        status: [],
        departments: [],
        categories: [],
        costMin: '',
        costMax: '',
    })
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [modal, setModal] = useState(null) // null | { mode: 'add'|'edit'|'view', tool? }
    const [localSearch, setLocalSearch] = useState('')
    const [toast, setToast] = useState(null)

    const { data: tools, isLoading, isError, refetch } = useAllTools()
    const { data: departments } = useDepartments()
    const createTool = useCreateTool()
    const updateTool = useUpdateTool()
    const deleteTool = useDeleteTool()

    // Filtres effectifs = URL params + sidebar filters
    const effectiveFilters = useMemo(() => {
        const params = new URLSearchParams(location.search)
        const urlStatus = params.get('status')
        console.log('location.search:', location.search)
        console.log('urlStatus:', urlStatus)
        return {
            ...filters,
            status: urlStatus ? [urlStatus] : filters.status,
        }
    }, [location.search, filters])

    // filteredTools ICI — après tous les hooks
    const filteredTools = useMemo(() => {
        if (!tools) return []
        const q = (search || localSearch).toLowerCase()
        return tools.filter(tool => {
            if (q && !(
                tool.name?.toLowerCase().includes(q) ||
                tool.owner_department?.toLowerCase().includes(q) ||
                tool.category?.toLowerCase().includes(q) ||
                tool.vendor?.toLowerCase().includes(q) ||
                tool.status?.toLowerCase().includes(q)
            )) return false
            if (effectiveFilters.status.length > 0 && !effectiveFilters.status.includes(tool.status)) return false
            if (effectiveFilters.departments.length > 0 && !effectiveFilters.departments.includes(tool.owner_department)) return false
            if (effectiveFilters.categories.length > 0 && !effectiveFilters.categories.includes(tool.category)) return false
            if (effectiveFilters.costMin !== '' && (tool.monthly_cost ?? 0) < Number(effectiveFilters.costMin)) return false
            if (effectiveFilters.costMax !== '' && (tool.monthly_cost ?? 0) > Number(effectiveFilters.costMax)) return false
            return true
        })
    }, [tools, search, localSearch, effectiveFilters])

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleSubmit = async (formData) => {
        try {
            if (modal.mode === 'add') {
                await createTool.mutateAsync(formData)
                showToast('Outil ajouté avec succès !')
            } else {
                await updateTool.mutateAsync({ id: modal.tool.id, data: formData })
                showToast('Outil modifié avec succès !')
            }
            setModal(null)
        } catch {
            showToast('Une erreur est survenue', 'error')
        }
    }

    const handleDelete = async (toolOrId) => {
        const id = typeof toolOrId === 'object' ? toolOrId.id : toolOrId
        if (!window.confirm('Supprimer cet outil ?')) return
        try {
            await deleteTool.mutateAsync(id)
            showToast('Outil supprimé')
        } catch {
            showToast('Erreur lors de la suppression', 'error')
        }
    }

    const handleToggle = async (tool) => {
        const newStatus = tool.status === 'unused' ? 'active' : 'unused'
        try {
            await updateTool.mutateAsync({ id: tool.id, data: { status: newStatus } })
            showToast(`Outil ${newStatus === 'active' ? 'activé' : 'désactivé'} !`)
        } catch {
            showToast('Erreur lors de la mise à jour', 'error')
        }
    }

    const activeFiltersCount = [
        filters.status.length,
        filters.departments.length,
        filters.categories.length,
        filters.costMin || filters.costMax ? 1 : 0,
    ].reduce((a, b) => a + b, 0)

    if (isLoading) return <ToolsSkeleton />

    if (isError) return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
            <ErrorState
                title="Impossible de charger les outils"
                message="Le serveur est inaccessible. Vérifiez votre connexion."
                onRetry={refetch}
            />
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">

            <MobilePageHeader
                title="Tools Catalog"
                placeholder="Search in tools catalog..."
                search={localSearch}
                onSearch={setLocalSearch}
            />

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                    {toast.message}
                </div>
            )}

            {/* Page header */}
            <div className="flex items-start justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tools Catalog</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Gérez et supervisez tous vos outils SaaS
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="md"
                    onClick={() => setModal({ mode: 'add' })}
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Ajouter un outil</span>
                    <span className="sm:hidden">Ajouter</span>
                </Button>
            </div>

            {/* Search + filter bar mobile */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        icon={Search}
                        type="text"
                        placeholder="Search in tools catalog..."
                        value={localSearch}
                        onChange={e => setLocalSearch(e.target.value)}
                    />
                </div>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setDrawerOpen(true)}
                    className="relative shrink-0"
                >
                    <SlidersHorizontal size={15} />
                    <span>Filtres</span>
                    {activeFiltersCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Results count */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{filteredTools.length}</span> outil{filteredTools.length > 1 ? 's' : ''} trouvé{filteredTools.length > 1 ? 's' : ''}
                    {activeFiltersCount > 0 && <span className="text-violet-500"> · {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}</span>}
                </p>
            </div>

            {/* Layout */}
            <div className="flex gap-6 items-start">

                {/* Sidebar filters */}
                <ToolsFilters
                    filters={effectiveFilters}
                    setFilters={setFilters}
                    departments={departments}
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                />

                {/* Table */}
                <div className="w-full max-w-5xl mx-auto">
                    {filteredTools.length === 0
                        ? (
                            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black">
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-black flex items-center justify-center mb-4">
                                        <Search size={20} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-medium">Aucun outil trouvé</p>
                                    <p className="text-gray-400 text-sm mt-1">Modifiez vos filtres ou votre recherche</p>
                                </div>
                            </div>
                        )
                        : (
                            <ToolsTable
                                tools={filteredTools}
                                onEdit={tool => setModal({ mode: 'edit', tool })}
                                onDelete={handleDelete}
                                onView={tool => setModal({ mode: 'view', tool })}
                                onToggle={handleToggle}
                            />
                        )
                    }
                </div>

            </div>

            {/* Modal Add/Edit */}
            {modal && modal.mode !== 'view' && (
                <ToolsModal
                    mode={modal.mode}
                    tool={modal.tool}
                    onClose={() => setModal(null)}
                    onSubmit={handleSubmit}
                    isLoading={createTool.isPending || updateTool.isPending}
                />
            )}

            {/* Detail view */}
            {modal && modal.mode === 'view' && (
                <ToolsDetail
                    tool={modal.tool}
                    onClose={() => setModal(null)}
                    onEdit={tool => setModal({ mode: 'edit', tool })}
                />
            )}

        </div>
    )

}

export default Tools