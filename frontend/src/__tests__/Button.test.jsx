import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../components/Button'

describe('Suite 1 - Button Component', () => {

  it('renders children text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('renders with primary variant by default', () => {
    render(<Button>Primary</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
  })

  it('shows loading spinner when loading=true', () => {
    render(<Button loading={true}>Submit</Button>)
    const btn = screen.getByRole('button')
    expect(btn.querySelector('span')).toBeTruthy()
  })

  it('is disabled when loading=true', () => {
    render(<Button loading={true}>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when disabled=true', () => {
    render(<Button disabled={true}>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled={true} onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn()
    render(<Button loading={true} onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders danger variant', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('renders outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByText('Outline')).toBeInTheDocument()
  })

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByText('Ghost')).toBeInTheDocument()
  })

  it('renders with submit type', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
