import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../components/Input'

describe('Suite 1 - Input Component', () => {

  it('renders input element', () => {
    render(<Input name="email" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input name="email" label="Email Address" />)
    expect(screen.getByText('Email Address')).toBeInTheDocument()
  })

  it('shows required asterisk when required=true', () => {
    render(<Input name="email" label="Email" required={true} />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not show asterisk when required=false', () => {
    render(<Input name="email" label="Email" required={false} />)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('shows error message when error prop provided', () => {
    render(<Input name="email" error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('does not show error when error prop is empty', () => {
    render(<Input name="email" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const onChange = vi.fn()
    render(<Input name="email" value="" onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test@email.com' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('renders placeholder text', () => {
    render(<Input name="email" placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('renders disabled state', () => {
    render(<Input name="email" disabled={true} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('renders password type', () => {
    render(<Input name="password" type="password" label="Password" />)
    const input = document.querySelector('input[type="password"]')
    expect(input).toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(<Input name="email" label="Email" />)
    const label = screen.getByText('Email').closest('label')
    expect(label).toHaveAttribute('for', 'email')
  })
})
