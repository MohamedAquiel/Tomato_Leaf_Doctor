import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { NotificationProvider } from '../../context/NotificationContext'
import RegisterPage from '../../pages/public/RegisterPage'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
}))

import * as authApi from '../../api/auth'

const renderRegisterFlow = () =>
  render(
    <MemoryRouter initialEntries={['/register']}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/predict" element={<div>Predict Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  )

describe('Integration — Register Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ── Render ───────────────────────────────────────────────────────────────
  it('renders all registration form fields', () => {
    renderRegisterFlow()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders link to login page', () => {
    renderRegisterFlow()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  // ── Client-side Validation ───────────────────────────────────────────────
  it('shows all required field errors on empty submit', async () => {
    renderRegisterFlow()
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument()
    })
  })

  it('shows error for name shorter than 2 characters', async () => {
    renderRegisterFlow()
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'A' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid email format', async () => {
    renderRegisterFlow()
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'invalidemail' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('shows error when passwords do not match', async () => {
    renderRegisterFlow()
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'DifferentPass!' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('shows error for short password', async () => {
    renderRegisterFlow()
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('clears field error when user corrects input', async () => {
    renderRegisterFlow()
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getByText(/name is required/i)).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'John Doe' } })
    await waitFor(() => expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument())
  })

  // ── Successful Registration ──────────────────────────────────────────────
  it('calls auth.register with correct data on valid submit', async () => {
    authApi.register.mockResolvedValueOnce({ data: { token: 'fake-jwt', user: { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' } } })
    authApi.getMe.mockResolvedValueOnce({ data: { data: { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' } } })
    renderRegisterFlow()
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      })
    })
  })

  it('shows success screen with username after registration', async () => {
    authApi.register.mockResolvedValueOnce({ data: { token: 'fake-jwt', user: { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' } } })
    authApi.getMe.mockResolvedValueOnce({ data: { data: { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' } } })
    renderRegisterFlow()
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/welcome, john/i)).toBeInTheDocument()
    })
  })

  it('shows loading button state during registration', async () => {
    authApi.register.mockImplementation(() => new Promise(() => {})) // never resolves
    renderRegisterFlow()
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  // ── API Error Handling ───────────────────────────────────────────────────
  it('shows API error for duplicate email', async () => {
    authApi.register.mockRejectedValueOnce({ response: { status: 409, data: { message: 'Email already registered' } } })
    renderRegisterFlow()
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'name', value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/email already registered/i)
    })
  })
})
