import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '@/components/ui/Badge'

describe('Badge', () => {
  it('affiche le texte children', () => {
    render(<Badge>Mon badge</Badge>)
    expect(screen.getByText('Mon badge')).toBeTruthy()
  })

  it('applique le variant active', () => {
    render(<Badge variant="active" />)
    const badge = screen.getByText('Active')
    expect(badge.className).toContain('emerald')
  })

  it('applique le variant expiring', () => {
    render(<Badge variant="expiring" />)
    const badge = screen.getByText('Expiring')
    expect(badge.className).toContain('orange')
  })

  it('applique le variant unused', () => {
    render(<Badge variant="unused" />)
    const badge = screen.getByText('Unused')
    expect(badge.className).toContain('red')
  })

  it('applique le variant gray par défaut', () => {
    render(<Badge>Gray</Badge>)
    const badge = screen.getByText('Gray')
    expect(badge.className).toContain('gray')
  })

  it('affiche le label par défaut du variant si pas de children', () => {
    render(<Badge variant="active" />)
    expect(screen.getByText('Active')).toBeTruthy()
  })

  it('affiche children si fourni même avec un variant', () => {
    render(<Badge variant="active">Custom</Badge>)
    expect(screen.getByText('Custom')).toBeTruthy()
  })
})