import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { NotificationProvider, useNotifications } from '../context/NotificationContext'

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })

const TestConsumer = () => {
  const ctx = useNotifications()
  return (
    <div>
      <span data-testid="count">{ctx.unreadCount}</span>
      <span data-testid="total">{ctx.notifications.length}</span>
      <button data-testid="add" onClick={() => ctx.addNotification('success', 'Title', 'Msg')}>add</button>
      <button data-testid="markAll" onClick={() => ctx.markAllRead()}>markAll</button>
      <button data-testid="clear" onClick={() => ctx.clearAll()}>clear</button>
      {ctx.notifications.map(n => (
        <div key={n.id}>
          <button data-testid={`read-${n.id}`} onClick={() => ctx.markRead(n.id)}>read</button>
          <button data-testid={`remove-${n.id}`} onClick={() => ctx.remove(n.id)}>remove</button>
        </div>
      ))}
    </div>
  )
}

const renderWithProvider = () =>
  render(<NotificationProvider><TestConsumer /></NotificationProvider>)

describe('Suite 2 - NotificationContext', () => {

  beforeEach(() => localStorageMock.clear())

  it('starts with 0 notifications', () => {
    renderWithProvider()
    expect(screen.getByTestId('total').textContent).toBe('0')
  })

  it('starts with 0 unread count', () => {
    renderWithProvider()
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('addNotification increases count', async () => {
    renderWithProvider()
    await act(async () => { fireEvent.click(screen.getByTestId('add')) })
    expect(screen.getByTestId('total').textContent).toBe('1')
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('markRead decreases unread count', async () => {
    renderWithProvider()
    await act(async () => { fireEvent.click(screen.getByTestId('add')) })
    const readBtn = document.querySelector('[data-testid^="read-"]')
    await act(async () => { fireEvent.click(readBtn) })
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('1')
  })

  it('markAllRead marks all as read', async () => {
    renderWithProvider()
    await act(async () => { fireEvent.click(screen.getByTestId('add')) })
    await act(async () => { fireEvent.click(screen.getByTestId('add')) })
    await act(async () => { fireEvent.click(screen.getByTestId('markAll')) })
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('remove deletes a notification', async () => {
    renderWithProvider()
    await act(async () => { fireEvent.click(screen.getByTestId('add')) })
    const removeBtn = document.querySelector('[data-testid^="remove-"]')
    await act(async () => { fireEvent.click(removeBtn) })
    expect(screen.getByTestId('total').textContent).toBe('0')
  })

  it('clearAll removes all notifications', async () => {
    renderWithProvider()
    await act(async () => { fireEvent.click(screen.getByTestId('add')) })
    await act(async () => { fireEvent.click(screen.getByTestId('add')) })
    await act(async () => { fireEvent.click(screen.getByTestId('clear')) })
    expect(screen.getByTestId('total').textContent).toBe('0')
    expect(screen.getByTestId('count').textContent).toBe('0')
  })
})
