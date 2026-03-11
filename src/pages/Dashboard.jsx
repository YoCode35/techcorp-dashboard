import { useRecentTools, useAnalytics, useAllTools } from '../hooks/useTools'
import KPICards from '../components/KPICards'
import RecentTools from '../components/RecentTools'
import SkeletonDashboard from '../components/SkeletonDashboard'
import ErrorState from '../components/ErrorState'

function Dashboard({ search }) {
  const { data: recentTools, isLoading: loadingTools, isError: errorTools, refetch: refetchTools } = useRecentTools()
  const { data: allTools, isError: errorAllTools } = useAllTools()
  const { data: analytics, isLoading: loadingAnalytics, isError: errorAnalytics, refetch: refetchAnalytics } = useAnalytics()

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
      <KPICards analytics={analytics} tools={allTools} />
      <div className="mt-8">
        <RecentTools tools={filteredTools} search={search} />
      </div>
    </div>
  )
}

export default Dashboard