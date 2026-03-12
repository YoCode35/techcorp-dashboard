import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import InsightKPI from '@/components/insights/InsightKPI'
import AlertCard from '@/components/insights/AlertCard'
import { DollarSign } from 'lucide-react'

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
)

describe('InsightKPI', () => {
  it('affiche le label', () => {
    render(<InsightKPI label="Budget mensuel" value="€17,928" />, { wrapper })
    expect(screen.getByText('Budget mensuel')).toBeTruthy()
  })

  it('affiche la valeur', () => {
    render(<InsightKPI label="Budget" value="€17,928" />, { wrapper })
    expect(screen.getByText('€17,928')).toBeTruthy()
  })

  it('affiche le sous-titre', () => {
    render(<InsightKPI label="Budget" value="€17,928" sub="€30,000" />, { wrapper })
    expect(screen.getByText('/€30,000')).toBeTruthy()
  })

  it('affiche le trend positif', () => {
    render(<InsightKPI label="Budget" value="€17,928" trend={1} trendLabel="+12%" />, { wrapper })
    expect(screen.getByText('+12%')).toBeTruthy()
  })

  it('affiche le trend négatif', () => {
    render(<InsightKPI label="Budget" value="€17,928" trend={-1} trendLabel="-€12" />, { wrapper })
    expect(screen.getByText('-€12')).toBeTruthy()
  })

    it('affiche l\'icône', () => {
    render(<InsightKPI label="Budget" value="€17,928" icon={DollarSign} iconBg="bg-emerald-500" />, { wrapper })
    expect(screen.getByText('Budget')).toBeTruthy()
    expect(document.querySelector('.bg-emerald-500')).toBeTruthy()
    })
})

describe('AlertCard', () => {
  it('affiche le titre', () => {
    render(<AlertCard variant="warning" title="Budget critique" message="90% consommé" />, { wrapper })
    expect(screen.getByText('Budget critique')).toBeTruthy()
  })

  it('affiche le message', () => {
    render(<AlertCard variant="warning" title="Alerte" message="90% consommé" />, { wrapper })
    expect(screen.getByText('90% consommé')).toBeTruthy()
  })

  it('affiche le count', () => {
    render(<AlertCard variant="warning" title="Alerte" message="msg" count={3} />, { wrapper })
    expect(screen.getByText('3')).toBeTruthy()
  })

  it('affiche le lien si linkTo est fourni', () => {
    render(
      <AlertCard
        variant="warning"
        title="Alerte"
        message="msg"
        linkTo="/tools"
        linkLabel="Voir les outils"
      />,
      { wrapper }
    )
    expect(screen.getByText('Voir les outils')).toBeTruthy()
  })

  it('n\'affiche pas de lien si linkTo est absent', () => {
    render(<AlertCard variant="warning" title="Alerte" message="msg" />, { wrapper })
    expect(screen.queryByRole('link')).toBeNull()
  })

it('applique le variant danger', () => {
  render(<AlertCard variant="danger" title="Danger" message="msg" />, { wrapper })
  const card = document.querySelector('[class*="red"]')
  expect(card).toBeTruthy()
})

it('applique le variant info', () => {
  render(<AlertCard variant="info" title="Info" message="msg" />, { wrapper })
  const card = document.querySelector('[class*="violet"]')
  expect(card).toBeTruthy()
})
})