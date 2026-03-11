import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ErrorState from '../components/ErrorState'

describe('ErrorState', () => {
    it('affiche le titre par défaut', () => {
        render(<ErrorState />)
        expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument()
    })

    it('affiche un titre personnalisé', () => {
        render(<ErrorState title="Erreur personnalisée" />)
        expect(screen.getByText('Erreur personnalisée')).toBeInTheDocument()
    })

    it('affiche un message personnalisé', () => {
        render(<ErrorState message="Connexion impossible" />)
        expect(screen.getByText('Connexion impossible')).toBeInTheDocument()
    })

    it('affiche le bouton Réessayer si onRetry est fourni', () => {
        const onRetry = vi.fn()
        render(<ErrorState onRetry={onRetry} />)
        expect(screen.getByText('Réessayer')).toBeInTheDocument()
    })

    it('appelle onRetry au clic sur Réessayer', () => {
        const onRetry = vi.fn()
        render(<ErrorState onRetry={onRetry} />)
        fireEvent.click(screen.getByText('Réessayer'))
        expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('ne affiche pas le bouton Réessayer sans onRetry', () => {
        render(<ErrorState />)
        expect(screen.queryByText('Réessayer')).not.toBeInTheDocument()
    })
})