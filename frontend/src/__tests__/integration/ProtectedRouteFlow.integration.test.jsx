import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { NotificationProvider } from '../../context/NotificationContext'
import ProtectedRoute from '../../components/ProtectedRoute'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
}))

import * as authApi from '../../api/auth'

const SettingsPage = () => <div>Settings Page</div>
const AdminPage    = () => <div>Admin Page</div>
const LoginPage    = () => <div>Login Page</div>
const HomePage     = () => <div>Home Page</div>

const renderFlow = (initialPath = '/settings') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/"        element={<HomePage />} />
            <Route path="/login"   element={<LoginPage />} />
            <Route path="/settings" element={
              <ProtectedRoute><SettingsPage /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
            } />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  )

describe('Integration — Protected Route Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ── Unauthenticated User ─────────────────────────────────────────────────
  it('redirects unauthenticated user from /settings to /login', async () => {
    authApi.getMe.mockRejectedValueOnce({ response: { status: 401 } })
    renderFlow('/settings')
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
      expect(screen.queryByText('Settings Page')).not.toBeInTheDocument()
    })
  })

  it('redirects unauthenticated user from /admin to /login', async () => {
    authApi.getMe.mockRejectedValueOnce({ response: { status: 401 } })
    renderFlow('/admin')
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
      expect(screen.queryByText('Admin Page')).not.toBeInTheDocument()
    })
  })

  it('does not expose protected content to unauthenticated users', async () => {
    authApi.getMe.mockRejectedValueOnce({ response: { status: 401 } })
    renderFlow('/settings')
    await waitFor(() => {
      expect(screen.queryByText('Settings Page')).not.toBeInTheDocument()
    })
  })

  // ── Authenticated Regular User ────────────────────────────────────────────
  it('grants authenticated user access to /settings', async () => {
    authApi.getMe.mockResolvedValueOnce({
      data: { data: { _id: 'u1', name: 'John', email: 'john@example.com', role: 'user' } }
    })
    localStorage.setItem('authToken', 'fake-jwt')
    renderFlow('/settings')
    await waitFor(() => {
      expect(screen.getByText('Settings Page')).toBeInTheDocument()
    })
  })

  it('blocks regular user from /admin and redirects', async () => {
    authApi.getMe.mockResolvedValueOnce({
      data: { data: { _id: 'u1', name: 'John', email: 'john@example.com', role: 'user' } }
    })
    localStorage.setItem('authToken', 'fake-jwt')
    renderFlow('/admin')
    await waitFor(() => {
      expect(screen.queryByText('Admin Page')).not.toBeInTheDocument()
    })
  })

  // ── Authenticated Admin User ──────────────────────────────────────────────
  it('grants admin user access to /admin', async () => {
    authApi.getMe.mockResolvedValueOnce({
      data: { data: { _id: 'a1', name: 'Admin', email: 'admin@example.com', role: 'admin' } }
    })
    localStorage.setItem('authToken', 'admin-jwt')
    renderFlow('/admin')
    await waitFor(() => {
      expect(screen.getByText('Admin Page')).toBeInTheDocument()
    })
  })

  it('grants admin user access to /settings', async () => {
    authApi.getMe.mockResolvedValueOnce({
      data: { data: { _id: 'a1', name: 'Admin', email: 'admin@example.com', role: 'admin' } }
    })
    localStorage.setItem('authToken', 'admin-jwt')
    renderFlow('/settings')
    await waitFor(() => {
      expect(screen.getByText('Settings Page')).toBeInTheDocument()
    })
  })

  // ── Loading State ─────────────────────────────────────────────────────────
  it('does not render protected content while auth is loading', () => {
    authApi.getMe.mockImplementation(() => new Promise(() => {})) // never resolves
    localStorage.setItem('authToken', 'fake-jwt')
    renderFlow('/settings')
    expect(screen.queryByText('Settings Page')).not.toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  // ── Token in localStorage ─────────────────────────────────────────────────
  it('uses token from localStorage to restore session on refresh', async () => {
    localStorage.setItem('authToken', 'persisted-jwt')
    authApi.getMe.mockResolvedValueOnce({
      data: { data: { _id: 'u1', name: 'John', email: 'john@example.com', role: 'user' } }
    })
    renderFlow('/settings')
    await waitFor(() => {
      expect(authApi.getMe).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Settings Page')).toBeInTheDocument()
    })
  })
})
