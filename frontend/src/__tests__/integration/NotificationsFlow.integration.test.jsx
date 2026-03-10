import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { NotificationProvider, useNotifications } from '../../context/NotificationContext'
import NotificationsPage from '../../pages/user/NotificationsPage'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
}))

import * as authApi from '../../api/auth'

const mockUser = { _id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'user' }

// Helper component to seed notifications before rendering NotificationsPage
const NotificationSeeder = ({ count = 0, types = [], children }) => {
  const ctx = useNotifications()
  const seeded = vi.fn()
  if (ctx.notifications.length === 0 && count > 0) {
    types.forEach((type, i) => ctx.addNotification(type, `Title ${i + 1}`, `Message ${i + 1}`))
  }
  return children
}

const renderNotificationsFlow = (seedCount = 0, seedTypes = []) => {
  authApi.getMe.mockResolvedValue({ data: { data: mockUser } })
  localStorage.setItem('authToken', 'fake-token')

  return render(
    <MemoryRouter initialEntries={['/notifications']}>
      <AuthProvider>
        <NotificationProvider>
          <NotificationSeeder count={seedCount} types={seedTypes}>
            <Routes>
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </NotificationSeeder>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Integration — Notifications Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ── Empty State ──────────────────────────────────────────────────────────
  it('shows empty state when there are no notifications', () => {
    renderNotificationsFlow(0)
    expect(screen.getByText(/no notifications/i)).toBeInTheDocument()
  })

  // ── Render Notifications ─────────────────────────────────────────────────
  it('renders notification items after they are added via context', async () => {
    renderNotificationsFlow(2, ['success', 'warning'])
    await waitFor(() => {
      expect(screen.getByText(/title 1/i)).toBeInTheDocument()
      expect(screen.getByText(/title 2/i)).toBeInTheDocument()
    })
  })

  it('shows unread count badge in the notification list', async () => {
    renderNotificationsFlow(3, ['success', 'warning', 'error'])
    await waitFor(() => {
      expect(screen.getByText(/3 unread|unread.*3/i)).toBeInTheDocument()
    })
  })

  // ── Mark as Read ─────────────────────────────────────────────────────────
  it('marks a notification as read when clicked', async () => {
    renderNotificationsFlow(1, ['success'])
    await waitFor(() => screen.getByText(/title 1/i))
    fireEvent.click(screen.getByText(/title 1/i))
    await waitFor(() => {
      // unread count should drop to 0
      expect(screen.queryByText(/1 unread/i)).not.toBeInTheDocument()
    })
  })

  // ── Clear All ─────────────────────────────────────────────────────────────
  it('clears all notifications when Clear All is clicked and confirmed', async () => {
    renderNotificationsFlow(2, ['success', 'info'])
    await waitFor(() => screen.getByText(/title 1/i))
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }))
    await waitFor(() => {
      expect(screen.queryByText(/title 1/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/title 2/i)).not.toBeInTheDocument()
      expect(screen.getByText(/no notifications/i)).toBeInTheDocument()
    })
  })

  // ── Dismiss Individual ────────────────────────────────────────────────────
  it('removes a single notification when dismiss button is clicked', async () => {
    renderNotificationsFlow(2, ['success', 'warning'])
    await waitFor(() => screen.getByText(/title 1/i))
    const dismissBtns = screen.getAllByRole('button', { name: /dismiss|remove|×|close/i })
    fireEvent.click(dismissBtns[0])
    await waitFor(() => {
      expect(screen.queryByText(/title 1/i)).not.toBeInTheDocument()
      expect(screen.getByText(/title 2/i)).toBeInTheDocument()
    })
  })

  // ── Filter ────────────────────────────────────────────────────────────────
  it('filters to show only unread notifications', async () => {
    renderNotificationsFlow(2, ['success', 'warning'])
    await waitFor(() => screen.getByText(/title 1/i))
    // mark first notification as read by clicking it
    fireEvent.click(screen.getByText(/title 1/i))
    // then filter by unread
    const unreadFilter = screen.getByRole('button', { name: /unread/i })
    fireEvent.click(unreadFilter)
    await waitFor(() => {
      expect(screen.queryByText(/title 1/i)).not.toBeInTheDocument()
      expect(screen.getByText(/title 2/i)).toBeInTheDocument()
    })
  })

  it('shows all notifications when All filter is selected', async () => {
    renderNotificationsFlow(2, ['success', 'warning'])
    await waitFor(() => screen.getByText(/title 1/i))
    const allFilter = screen.getByRole('button', { name: /^all$/i })
    fireEvent.click(allFilter)
    await waitFor(() => {
      expect(screen.getByText(/title 1/i)).toBeInTheDocument()
      expect(screen.getByText(/title 2/i)).toBeInTheDocument()
    })
  })
})
