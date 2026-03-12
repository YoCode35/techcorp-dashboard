import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatPercent,
  filterBySearch,
  sortItems,
  getDaysFromTimeRange,
} from '@/utils/helpers'

describe('formatCurrency', () => {
  it('formate un nombre en euros', () => {
    expect(formatCurrency(1000)).toBe('€1\u202f000')
  })

  it('retourne — si la valeur est null', () => {
    expect(formatCurrency(null)).toBe('—')
  })

  it('retourne — si la valeur est undefined', () => {
    expect(formatCurrency(undefined)).toBe('—')
  })

  it('formate 0 correctement', () => {
    expect(formatCurrency(0)).toBe('€0')
  })
})

describe('formatDate', () => {
  it('formate une date ISO correctement', () => {
    const result = formatDate('2025-03-15')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/2025/)
  })

  it('retourne — si la date est null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('retourne — si la date est undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })
})

describe('formatPercent', () => {
  it('calcule un pourcentage correctement', () => {
    expect(formatPercent(50, 100)).toBe('50%')
  })

  it('arrondit le pourcentage', () => {
    expect(formatPercent(1, 3)).toBe('33%')
  })

  it('retourne — si value est 0', () => {
    expect(formatPercent(0, 100)).toBe('—')
  })

  it('retourne — si total est 0', () => {
    expect(formatPercent(50, 0)).toBe('—')
  })
})

describe('filterBySearch', () => {
  const items = [
    { name: 'Slack', category: 'Communication' },
    { name: 'Figma', category: 'Design' },
    { name: 'GitHub', category: 'Development' },
  ]

  it('filtre par nom', () => {
    const result = filterBySearch(items, 'slack', ['name'])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Slack')
  })

  it('filtre par catégorie', () => {
    const result = filterBySearch(items, 'design', ['category'])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Figma')
  })

  it('est insensible à la casse', () => {
    const result = filterBySearch(items, 'SLACK', ['name'])
    expect(result).toHaveLength(1)
  })

  it('retourne tous les items si search est vide', () => {
    const result = filterBySearch(items, '', ['name'])
    expect(result).toHaveLength(3)
  })

  it('retourne un tableau vide si aucun résultat', () => {
    const result = filterBySearch(items, 'xyz', ['name', 'category'])
    expect(result).toHaveLength(0)
  })
})

describe('sortItems', () => {
  const items = [
    { name: 'Slack', monthly_cost: 500 },
    { name: 'Figma', monthly_cost: 200 },
    { name: 'GitHub', monthly_cost: 800 },
  ]

  it('trie par nombre en ordre croissant', () => {
    const result = sortItems(items, 'monthly_cost', 'asc')
    expect(result[0].name).toBe('Figma')
    expect(result[2].name).toBe('GitHub')
  })

  it('trie par nombre en ordre décroissant', () => {
    const result = sortItems(items, 'monthly_cost', 'desc')
    expect(result[0].name).toBe('GitHub')
    expect(result[2].name).toBe('Figma')
  })

  it('trie par string en ordre croissant', () => {
    const result = sortItems(items, 'name', 'asc')
    expect(result[0].name).toBe('Figma')
    expect(result[2].name).toBe('Slack')
  })

  it('ne modifie pas le tableau original', () => {
    sortItems(items, 'name', 'asc')
    expect(items[0].name).toBe('Slack')
  })

  it('retourne le tableau intact si pas de sortBy', () => {
    const result = sortItems(items, null, 'asc')
    expect(result[0].name).toBe('Slack')
  })
})

describe('getDaysFromTimeRange', () => {
  it('retourne 30 pour 30d', () => {
    expect(getDaysFromTimeRange('30d')).toBe(30)
  })

  it('retourne 90 pour 90d', () => {
    expect(getDaysFromTimeRange('90d')).toBe(90)
  })

  it('retourne 365 pour 1y', () => {
    expect(getDaysFromTimeRange('1y')).toBe(365)
  })

  it('retourne 30 par défaut pour une valeur inconnue', () => {
    expect(getDaysFromTimeRange('unknown')).toBe(30)
  })
})