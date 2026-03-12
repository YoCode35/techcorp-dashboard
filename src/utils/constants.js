export const API_BASE_URL = 'https://tt-jsonserver-01.alt-tools.tech'

export const STATUSES = ['active', 'expiring', 'unused']

export const STATUS_LABELS = {
  active: 'Active',
  expiring: 'Expiring',
  unused: 'Unused',
}

export const STATUS_COLORS = {
  active: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  expiring: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30',
  unused: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
}

export const CATEGORIES = [
  'Communication', 'Design', 'Development', 'Productivity',
  'Project Management', 'Sales & Marketing', 'Security',
  'Analytics', 'Finance', 'HR'
]

export const DEPARTMENTS = [
  'Engineering', 'Design', 'Marketing', 'Operations', 'Communication'
]

export const TIME_RANGES = [
  { label: '30j', value: '30d' },
  { label: '90j', value: '90d' },
  { label: '1an', value: '1y' },
]

export const CHART_COLORS = [
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'
]

export const PER_PAGE = 10