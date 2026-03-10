import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { NotificationProvider } from '../../context/NotificationContext'
import LoginPage from '../../pages/public/LoginPage'

// Mock the auth API
vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
}))

import * as authApi from '../../api/auth'

const renderLoginFlow = (initialEntries = ['/login']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/predict" element={<div>Predict Page</div>} />
            <Route path="/register" element={<div>Register Page</div>} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  )

describe('Integration — Login Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ── Render ──────────────────────────────────────────────────────────────
  it('renders login form with all fields', () => {
    renderLoginFlow()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders link to register page', () => {
    renderLoginFlow()
    expect(screen.getByRole('link', { name: /create one free/i })).toBeInTheDocument()
  })

  it('renders guest predict link', () => {
    renderLoginFlow()
    expect(screen.getByRole('link', { name: /predict without an account/i })).toBeInTheDocument()
  })

  // ── Client-side Validation ───────────────────────────────────────────────
  it('shows validation errors when submitting empty form', async () => {
    renderLoginFlow()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('shows invalid email error for bad email format', async () => {
    renderLoginFlow()
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'notanemail' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('shows password too short error', async () => {
    renderLoginFlow()
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('clears field error when user starts typing', async () => {
    renderLoginFlow()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText(/email is required/i)).toBeInTheDocument())
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'j@j.com' } })
    await waitFor(() => expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument())
  })

  // ── Successful Login ─────────────────────────────────────────────────────
  it('calls auth.login with correct credentials on submit', async () => {
    authApi.login.mockResolvedValueOnce({ data: { token: 'fake-jwt', user: { _id: '1', name: 'John', email: 'john@example.com', role: 'user' } } })
    authApi.getMe.mockResolvedValueOnce({ data: { data: { _id: '1', name: 'John', email: 'john@example.com', role: 'user' } } })
    renderLoginFlow()
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({ email: 'john@example.com', password: 'Password123!' })
    })
  })

  it('redirects to /predict on successful login', async () => {
    authApi.login.mockResolvedValueOnce({ data: { token: 'fake-jwt', user: { _id: '1', name: 'John', email: 'john@example.com', role: 'user' } } })
    authApi.getMe.mockResolvedValueOnce({ data: { data: { _id: '1', name: 'John', email: 'john@example.com', role: 'user' } } })
    renderLoginFlow()
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByText('Predict Page')).toBeInTheDocument()
    })
  })

  it('shows loading spinner on the button while login is in progress', async () => {
    authApi.login.mockImplementation(() => new Promise(() => {})) // never resolves
    renderLoginFlow()
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  // ── API Error Handling ───────────────────────────────────────────────────
  it('shows 401 error message for wrong password', async () => {
    authApi.login.mockRejectedValueOnce({ response: { status: 401, data: { message: 'Invalid credentials' } } })
    renderLoginFlow()
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'WrongPass123!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i)
    })
  })

  it('shows 403 error message for deactivated account', async () => {
    authApi.login.mockRejectedValueOnce({ response: { status: 403, data: { message: 'Account deactivated' } } })
    renderLoginFlow()
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/deactivated/i)
    })
  })

  it('shows generic error message for server errors', async () => {
    authApi.login.mockRejectedValueOnce({ response: { status: 500, data: { message: 'Server error' } } })
    renderLoginFlow()
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { name: 'password', value: 'Password123!' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/server error/i)
    })
  })
})
