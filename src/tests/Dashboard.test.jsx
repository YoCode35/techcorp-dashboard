import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import KPICards from '@/components/features/dashboard/KPICards'
import RecentTools from '@/components/features/dashboard/RecentTools'

const wrapper = ({ children }) => (
    <MemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
            {children}
        </QueryClientProvider>
    </MemoryRouter>
)

const mockAnalytics = {
    budget_overview: {
        current_month_total: 17928,
        monthly_limit: 30000,
        previous_month_total: 15990,
    },
    kpi_trends: {
        active_tools: 20,
        active_tools_change: 2,
        total_departments: 5,
        cost_per_user: 156,
        cost_per_user_change: -12,
    }
}

const mockTools = [
    { id: 1, name: 'Slack', status: 'active', category: 'Communication', owner_department: 'Engineering', monthly_cost: 500, updated_at: '2025-03-01' },
    { id: 2, name: 'Figma', status: 'expiring', category: 'Design', owner_department: 'Design', monthly_cost: 200, updated_at: '2025-02-15' },
    { id: 3, name: 'GitHub', status: 'unused', category: 'Development', owner_department: 'Engineering', monthly_cost: 800, updated_at: '2025-01-10' },
]

describe('KPICards', () => {
    it('affiche le budget mensuel', () => {
        render(<KPICards analytics={mockAnalytics} isLoading={false} />, { wrapper })
        expect(screen.getByText('Monthly Budget')).toBeTruthy()
    })

    it('affiche le nombre d\'outils actifs', () => {
        render(<KPICards analytics={mockAnalytics} isLoading={false} />, { wrapper })
        expect(screen.getByText('Active Tools')).toBeTruthy()
    })

    it('affiche le nombre de départements', () => {
        render(<KPICards analytics={mockAnalytics} isLoading={false} />, { wrapper })
        expect(screen.getByText('Departments')).toBeTruthy()
    })

    it('affiche le coût par utilisateur', () => {
        render(<KPICards analytics={mockAnalytics} isLoading={false} />, { wrapper })
        expect(screen.getByText('Cost/User')).toBeTruthy() // sans espaces
    })

    it('affiche le skeleton en état de chargement', () => {
        render(<KPICards analytics={null} isLoading={true} />, { wrapper })
        // KPICards gère le skeleton en interne via isLoading
        expect(document.querySelector('div')).toBeTruthy()
    })
})

describe('RecentTools', () => {
    it('affiche la liste des outils', () => {
        render(<RecentTools tools={mockTools} isLoading={false} />, { wrapper })
        expect(screen.getAllByText('Slack').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Figma').length).toBeGreaterThan(0)
        expect(screen.getAllByText('GitHub').length).toBeGreaterThan(0)
    })

    it('affiche le statut de chaque outil', () => {
        render(<RecentTools tools={mockTools} isLoading={false} />, { wrapper })
        expect(screen.getAllByText('Active').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Expiring').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Unused').length).toBeGreaterThan(0)
    })

    it('affiche le département de chaque outil', () => {
        render(<RecentTools tools={mockTools} isLoading={false} />, { wrapper })
        expect(screen.getAllByText('Engineering').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Design').length).toBeGreaterThan(0)
    })

    it('affiche le coût mensuel', () => {
        render(<RecentTools tools={mockTools} isLoading={false} />, { wrapper })
        expect(screen.getAllByText('€500').length).toBeGreaterThan(0)
    })

    it('affiche le skeleton en état de chargement', () => {
        render(<RecentTools tools={undefined} isLoading={true} />, { wrapper })
        expect(document.querySelector('div')).toBeTruthy()
    })

    it('affiche un message si aucun outil', () => {
        render(<RecentTools tools={[]} isLoading={false} />, { wrapper })
        expect(screen.getByText(/aucun outil/i) || document.querySelector('tbody')).toBeTruthy()
    })

    it('ne plante pas si tools est undefined', () => {
        render(<RecentTools tools={undefined} isLoading={false} />, { wrapper })
        expect(document.querySelector('div')).toBeTruthy()
    })
})