import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '@/components/ui/Button'
describe('Button', () => {
  it('affiche le texte correctement', () => {
    render(<Button>Cliquer</Button>)
    expect(screen.getByText('Cliquer')).toBeTruthy()
  })

  it('applique le variant primary par défaut', () => {
    render(<Button>Primary</Button>)
    const btn = screen.getByText('Primary')
    expect(btn.className).toContain('bg-violet-500')
  })

  it('applique le variant secondary', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByText('Secondary')
    expect(btn.className).toContain('border-gray-200')
  })

  it('applique le variant danger', () => {
    render(<Button variant="danger">Danger</Button>)
    const btn = screen.getByText('Danger')
    expect(btn.className).toContain('bg-red-500')
  })

  it('est désactivé quand disabled=true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled').closest('button')).toBeDisabled()
  })

  it('appelle onClick quand cliqué', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('ne déclenche pas onClick quand disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applique une className personnalisée', () => {
    render(<Button className="custom-class">Custom</Button>)
    expect(screen.getByText('Custom').className).toContain('custom-class')
  })
})