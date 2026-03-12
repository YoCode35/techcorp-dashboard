import { useRecentTools, useAnalytics, useAllTools, useUpdateTool, useDeleteTool } from '@/hooks/useTools'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui'
import MobilePageHeader from '@/components/layout/MobilePageHeader'
import KPICards from '@/components/features/dashboard/KPICards'
import RecentTools from '@/components/features/dashboard/RecentTools'
import SkeletonDashboard from '@/components/features/dashboard/SkeletonDashboard'
import ErrorState from '@/components/ui/ErrorState'
import ToolsModal from '@/components/features/tools/ToolsModal'
import ToolsDetail from '@/components/features/tools/ToolsDetail'

function Dashboard({ search, onSearch }) {
    const { data: recentTools, isLoading: loadingTools, isError: errorTools, refetch: refetchTools } = useRecentTools()
    const { data: allTools, isError: errorAllTools } = useAllTools()
    const { data: analytics, isLoading: loadingAnalytics, isError: errorAnalytics, refetch: refetchAnalytics } = useAnalytics()
    const updateTool = useUpdateTool()
    const deleteTool = useDeleteTool()
    const [modal, setModal] = useState(null)

    const handleDelete = async (toolOrId) => {
        const id = typeof toolOrId === 'object' ? toolOrId.id : toolOrId
        if (!window.confirm('Supprimer cet outil ?')) return
        await deleteTool.mutateAsync(id)
    }

    const handleSubmit = async (formData) => {
        await updateTool.mutateAsync({ id: modal.tool.id, data: formData })
        setModal(null)
    }

    if (loadingTools || loadingAnalytics) return <SkeletonDashboard />

    if (errorTools || errorAnalytics || errorAllTools) return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Internal Tools Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monitor and manage your organization's software tools and expenses</p>
            </div>
            <ErrorState
                title="Impossible de charger le dashboard"
                message="Le serveur de données est inaccessible. Vérifiez votre connexion et réessayez."
                onRetry={() => { refetchTools(); refetchAnalytics() }}
            />
        </div>
    )

    const filteredTools = (recentTools ?? []).filter(tool =>
        tool.name?.toLowerCase().includes(search.toLowerCase()) ||
        tool.owner_department?.toLowerCase().includes(search.toLowerCase()) ||
        tool.status?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Internal Tools Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monitor and manage your organization's software tools and expenses</p>
            </div>

            <MobilePageHeader
                title="Dashboard"
                placeholder="Search tools..."
                search={search}
                onSearch={onSearch}
            />

            {/* Search mobile */}
            <div className="sm:hidden mb-6">
                <Input
                    icon={Search}
                    type="text"
                    placeholder="Search tools..."
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                />
            </div>

            <KPICards analytics={analytics} tools={allTools} />
            <div className="mt-8">
                <RecentTools
                    tools={filteredTools}
                    search={search}
                    onView={tool => setModal({ mode: 'view', tool })}
                    onEdit={tool => setModal({ mode: 'edit', tool })}
                    onDelete={handleDelete}
                />
            </div>

            {modal && modal.mode === 'edit' && (
                <ToolsModal
                    mode="edit"
                    tool={modal.tool}
                    onClose={() => setModal(null)}
                    onSubmit={handleSubmit}
                    isLoading={updateTool.isPending}
                />
            )}

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

export default Dashboard