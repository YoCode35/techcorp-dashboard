import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Search } from 'lucide-react'
import Input from '@/components/ui/Input'

describe('Input', () => {
  it('affiche le placeholder', () => {
    render(<Input placeholder="Rechercher..." />)
    expect(screen.getByPlaceholderText('Rechercher...')).toBeTruthy()
  })

  it('affiche la valeur', () => {
    render(<Input value="test" onChange={() => {}} />)
    expect(screen.getByDisplayValue('test')).toBeTruthy()
  })

  it('appelle onChange quand on tape', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('affiche avec une icône', () => {
    render(<Input icon={Search} placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeTruthy()
  })

  it('applique une className personnalisée', () => {
    render(<Input className="custom-class" placeholder="test" />)
    expect(screen.getByPlaceholderText('test').className).toContain('custom-class')
  })

  it('accepte le type number', () => {
    render(<Input type="number" placeholder="0" />)
    expect(screen.getByPlaceholderText('0').type).toBe('number')
  })
})