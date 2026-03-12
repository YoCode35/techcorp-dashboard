export const formatCurrency = (value, locale = 'fr-FR') => {
  if (value == null) return '—'
  return `€${value.toLocaleString(locale)}`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatPercent = (value, total) => {
  if (!value || !total) return '—'
  return `${Math.round((value / total) * 100)}%`
}

export const filterBySearch = (items, search, keys) => {
  if (!search) return items
  const q = search.toLowerCase()
  return items.filter(item =>
    keys.some(key => item[key]?.toLowerCase().includes(q))
  )
}

export const sortItems = (items, sortBy, sortOrder) => {
  if (!sortBy) return items
  return [...items].sort((a, b) => {
    const valA = a[sortBy] ?? ''
    const valB = b[sortBy] ?? ''
    const result = typeof valA === 'number'
      ? valA - valB
      : String(valA).localeCompare(String(valB))
    return sortOrder === 'asc' ? result : -result
  })
}

export const getDaysFromTimeRange = (timeRange) => {
  const map = { '30d': 30, '90d': 90, '1y': 365 }
  return map[timeRange] ?? 30
}