import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KPICards from '@/components/features/dashboard/KPICards'

const mockAnalytics = {
    budget_overview: {
        current_month_total: 17928,
        monthly_limit: 30000,
    },
    kpi_trends: {
        budget_change: '+2%',
        tools_change: '+9',
        departments_change: '+2',
        cost_per_user_change: '+€6',
    },
    cost_analytics: {
        cost_per_user: 276,
    },
}

const mockTools = [
    { status: 'active' },
    { status: 'active' },
    { status: 'unused' },
    { status: 'expiring' },
]

describe('KPICards', () => {
    it('affiche les 4 cards', () => {
        render(<KPICards analytics={mockAnalytics} tools={mockTools} />)
        expect(screen.getByText('Monthly Budget')).toBeInTheDocument()
        expect(screen.getByText('Active Tools')).toBeInTheDocument()
        expect(screen.getByText('Departments')).toBeInTheDocument()
        expect(screen.getByText('Cost/User')).toBeInTheDocument()
    })

    it('affiche le bon budget', () => {
        render(<KPICards analytics={mockAnalytics} tools={mockTools} />)
        expect(screen.getByText(/17[\s,.]?928/)).toBeInTheDocument()
    })

    it('affiche le bon nombre d\'outils actifs', () => {
        render(<KPICards analytics={mockAnalytics} tools={mockTools} />)
        expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('affiche le bon coût par user', () => {
        render(<KPICards analytics={mockAnalytics} tools={mockTools} />)
        expect(screen.getByText('€276')).toBeInTheDocument()
    })

    it('affiche les badges de tendance', () => {
        render(<KPICards analytics={mockAnalytics} tools={mockTools} />)
        expect(screen.getByText('+2%')).toBeInTheDocument()
        expect(screen.getByText('+9')).toBeInTheDocument()
    })
})