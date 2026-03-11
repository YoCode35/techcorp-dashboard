const SkeletonBox = ({ className }) => (
    <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-white/10 ${className}`} />
)

const SkeletonKPICard = () => (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-5">
        <div className="flex items-start justify-between mb-4">
            <SkeletonBox className="h-4 w-28" />
            <SkeletonBox className="w-9 h-9 rounded-lg" />
        </div>
        <SkeletonBox className="h-8 w-36 mb-2" />
        <SkeletonBox className="h-5 w-12 rounded-full mb-3" />
        <SkeletonBox className="h-1.5 w-full rounded-full" />
    </div>
)

const SkeletonRow = () => (
    <tr className="border-b border-gray-50 dark:border-white/5">
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <SkeletonBox className="w-8 h-8 rounded-lg shrink-0" />
                <SkeletonBox className="h-4 w-32" />
            </div>
        </td>
        <td className="px-6 py-4"><SkeletonBox className="h-4 w-24" /></td>
        <td className="px-6 py-4"><SkeletonBox className="h-4 w-10" /></td>
        <td className="px-6 py-4"><SkeletonBox className="h-4 w-16" /></td>
        <td className="px-6 py-4"><SkeletonBox className="h-5 w-16 rounded-full" /></td>
        <td className="px-6 py-4"><SkeletonBox className="w-7 h-7 rounded-lg" /></td>
    </tr>
)

const SkeletonCard = () => (
    <div className="flex items-start justify-between p-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-start gap-3 flex-1">
            <SkeletonBox className="w-8 h-8 rounded-lg shrink-0" />
            <div className="flex-1">
                <SkeletonBox className="h-4 w-32 mb-2" />
                <SkeletonBox className="h-3 w-20 mb-2" />
                <div className="flex items-center gap-3 mt-2">
                    <SkeletonBox className="h-5 w-14 rounded-full" />
                    <SkeletonBox className="h-3 w-12" />
                    <SkeletonBox className="h-3 w-16" />
                </div>
            </div>
        </div>
        <SkeletonBox className="w-7 h-7 rounded-lg ml-2" />
    </div>
)

function SkeletonDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">

            {/* Title */}
            <div className="mb-8">
                <SkeletonBox className="h-8 w-64 mb-2" />
                <SkeletonBox className="h-4 w-96" />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <SkeletonKPICard key={i} />)}
            </div>

            {/* Recent Tools */}
            <div className="mt-8 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
                    <SkeletonBox className="h-5 w-32" />
                    <SkeletonBox className="h-4 w-24" />
                </div>

                {/* Desktop */}
                <div className="hidden sm:block">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/10">
                                {[...Array(6)].map((_, i) => (
                                    <th key={i} className="px-6 py-3">
                                        <SkeletonBox className="h-3 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="sm:hidden">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>

            </div>
        </div>
    )
}

export default SkeletonDashboard