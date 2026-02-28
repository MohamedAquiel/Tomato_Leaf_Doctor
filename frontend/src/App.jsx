import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import NotFoundPage from './pages/public/NotFoundPage'
import EducationPage from './pages/public/EducationPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import PredictPage from './pages/user/PredictPage'
import HistoryPage from './pages/user/HistoryPage'
import ProfilePage from './pages/user/ProfilePage'
import ComparePage from './pages/user/ComparePage'
import NotificationsPage from './pages/user/NotificationsPage'
import SettingsPage from './pages/user/SettingsPage'
import AdminPage from './pages/admin/AdminPage'
import AdminDashboard from './pages/admin/sections/AdminDashboard'
import AdminAnalytics from './pages/admin/sections/AdminAnalytics'
import AdminModelMonitoring from './pages/admin/sections/AdminModelMonitoring'
import AdminPredictions from './pages/admin/sections/AdminPredictions'
import AdminUsers from './pages/admin/sections/AdminUsers'
import AdminDiseaseCMS from './pages/admin/sections/AdminDiseaseCMS'
import AdminSystemSettings from './pages/admin/sections/AdminSystemSettings'

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {}
          <Route path="/predict" element={<PredictPage />} />

          {}
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/model" element={<ProtectedRoute adminOnly><AdminModelMonitoring /></ProtectedRoute>} />
          <Route path="/admin/predictions" element={<ProtectedRoute adminOnly><AdminPredictions /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/cms" element={<ProtectedRoute adminOnly><AdminDiseaseCMS /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSystemSettings /></ProtectedRoute>} />

          {}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
