import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const NotificationContext = createContext(null)

const STORAGE_KEY = 'tld_notifications'

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  const addNotification = useCallback((type, title, message, meta = {}) => {
    const notif = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      title,
      message,
      meta,
      read: false,
      createdAt: new Date().toISOString(),
    }
    setNotifications(prev => [notif, ...prev].slice(0, 50))
    return notif.id
  }, [])

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const remove = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => setNotifications([]), [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markRead,
      markAllRead,
      remove,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
