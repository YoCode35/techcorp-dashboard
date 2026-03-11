import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

// Composant extrait pour être testable
const StatusBadge = ({ status }) => {
    const styles = {
        active: 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
        expiring: 'bg-orange-500/20 text-orange-600 border border-orange-500/30',
        unused: 'bg-red-500/20 text-red-600 border border-red-500/30',
    }
    const labels = {
        active: 'Active',
        expiring: 'Expiring',
        unused: 'Unused',
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? styles.active}`}>
            {labels[status] ?? status}
        </span>
    )
}

describe('StatusBadge', () => {
    it('affiche "Active" pour le statut active', () => {
        render(<StatusBadge status="active" />)
        expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('affiche "Expiring" pour le statut expiring', () => {
        render(<StatusBadge status="expiring" />)
        expect(screen.getByText('Expiring')).toBeInTheDocument()
    })

    it('affiche "Unused" pour le statut unused', () => {
        render(<StatusBadge status="unused" />)
        expect(screen.getByText('Unused')).toBeInTheDocument()
    })

    it('affiche le statut brut si inconnu', () => {
        render(<StatusBadge status="unknown" />)
        expect(screen.getByText('unknown')).toBeInTheDocument()
    })
})