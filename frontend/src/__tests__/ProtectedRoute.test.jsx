import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

const renderWithRouter = (ui, { initialEntries = ['/protected'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/protected" element={ui} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Suite 4 - ProtectedRoute Component', () => {

  it('renders children when user is authenticated', () => {
    useAuth.mockReturnValue({ user: { name: 'Test', role: 'user' }, loading: false })
    renderWithRouter(
      <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when no user', () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    renderWithRouter(
      <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
    )
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('shows loading state when loading is true', () => {
    useAuth.mockReturnValue({ user: null, loading: true })
    renderWithRouter(
      <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
    )
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('renders children for admin user on admin-only route', () => {
    useAuth.mockReturnValue({ user: { name: 'Admin', role: 'admin' }, loading: false })
    renderWithRouter(
      <ProtectedRoute adminOnly><div>Admin Panel</div></ProtectedRoute>
    )
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('redirects non-admin user from admin-only route', () => {
    useAuth.mockReturnValue({ user: { name: 'User', role: 'user' }, loading: false })
    renderWithRouter(
      <ProtectedRoute adminOnly><div>Admin Panel</div></ProtectedRoute>
    )
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
  })

  it('redirects unauthenticated user from admin-only route', () => {
    useAuth.mockReturnValue({ user: null, loading: false })
    renderWithRouter(
      <ProtectedRoute adminOnly><div>Admin Panel</div></ProtectedRoute>
    )
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
