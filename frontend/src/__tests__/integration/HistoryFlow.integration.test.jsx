import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { NotificationProvider } from '../../context/NotificationContext'
import HistoryPage from '../../pages/user/HistoryPage'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
}))

vi.mock('../../api/predictions', () => ({
  createPrediction: vi.fn(),
  getMyPredictions: vi.fn(),
  deletePrediction: vi.fn(),
  updateNotes: vi.fn(),
}))

import * as authApi from '../../api/auth'
import * as predictionsApi from '../../api/predictions'

const mockUser = { _id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'user' }

const mockPredictions = [
  {
    _id: 'p1',
    disease: 'Early Blight',
    confidence: 87.5,
    isHealthy: false,
    createdAt: new Date().toISOString(),
    imageUrl: '',
    notes: '',
    solution: {
      display_name: 'Early Blight',
      scientific_name: 'Alternaria solani',
      severity: 'Medium',
      is_healthy: false,
      description: 'A fungal disease causing lesions on tomato leaves.',
      symptoms: ['Brown spots', 'Yellow halos'],
      immediate_actions: ['Remove infected leaves'],
      chemical_treatment: ['Chlorothalonil'],
      organic_treatment: ['Neem oil'],
      prevention: ['Crop rotation'],
      recovery_time: '2-3 weeks',
    },
  },
  {
    _id: 'p2',
    disease: 'Late Blight',
    confidence: 92.1,
    isHealthy: false,
    createdAt: new Date().toISOString(),
    imageUrl: '',
    notes: 'Some existing notes',
    solution: {
      display_name: 'Late Blight',
      severity: 'High',
      is_healthy: false,
      description: 'Caused by Phytophthora infestans.',
      symptoms: ['Dark lesions'],
      immediate_actions: ['Destroy infected plants'],
      chemical_treatment: ['Mancozeb'],
      organic_treatment: ['Copper spray'],
      prevention: ['Resistant varieties'],
      recovery_time: '3-4 weeks',
    },
  },
]

const renderHistoryFlow = () => {
  authApi.getMe.mockResolvedValue({ data: { data: mockUser } })
  localStorage.setItem('authToken', 'fake-token')

  return render(
    <MemoryRouter initialEntries={['/history']}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/predict" element={<div>Predict Page</div>} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Integration — History Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ── Loading & Render ─────────────────────────────────────────────────────
  it('shows loading state while fetching predictions', async () => {
    predictionsApi.getMyPredictions.mockImplementation(() => new Promise(() => {}))
    renderHistoryFlow()
    await waitFor(() => {
      expect(screen.getByText(/loading|fetching/i)).toBeInTheDocument()
    })
  })

  it('renders prediction cards after data loads', async () => {
    predictionsApi.getMyPredictions.mockResolvedValueOnce({
      data: { data: mockPredictions, pagination: { total: 2, pages: 1, page: 1 } }
    })
    renderHistoryFlow()
    await waitFor(() => {
      expect(screen.getByText(/early blight/i)).toBeInTheDocument()
      expect(screen.getByText(/late blight/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when user has no predictions', async () => {
    predictionsApi.getMyPredictions.mockResolvedValueOnce({
      data: { data: [], pagination: { total: 0, pages: 0, page: 1 } }
    })
    renderHistoryFlow()
    await waitFor(() => {
      expect(screen.getByText(/no predictions yet|start predicting/i)).toBeInTheDocument()
    })
  })

  it('displays confidence percentage on prediction cards', async () => {
    predictionsApi.getMyPredictions.mockResolvedValueOnce({
      data: { data: mockPredictions, pagination: { total: 2, pages: 1, page: 1 } }
    })
    renderHistoryFlow()
    await waitFor(() => {
      expect(screen.getByText(/87\.5/i)).toBeInTheDocument()
    })
  })

  // ── Treatment Modal ──────────────────────────────────────────────────────
  it('opens treatment modal when View Treatment is clicked', async () => {
    predictionsApi.getMyPredictions.mockResolvedValueOnce({
      data: { data: mockPredictions, pagination: { total: 2, pages: 1, page: 1 } }
    })
    renderHistoryFlow()
    await waitFor(() => screen.getByText(/early blight/i))
    const viewBtns = screen.getAllByRole('button', { name: /view treatment/i })
    fireEvent.click(viewBtns[0])
    await waitFor(() => {
      expect(screen.getByText(/treatment plan/i)).toBeInTheDocument()
    })
  })

  it('closes treatment modal when close button is clicked', async () => {
    predictionsApi.getMyPredictions.mockResolvedValueOnce({
      data: { data: mockPredictions, pagination: { total: 2, pages: 1, page: 1 } }
    })
    renderHistoryFlow()
    await waitFor(() => screen.getByText(/early blight/i))
    const viewBtns = screen.getAllByRole('button', { name: /view treatment/i })
    fireEvent.click(viewBtns[0])
    await waitFor(() => screen.getByTitle(/close/i))
    fireEvent.click(screen.getByTitle(/close/i))
    await waitFor(() => {
      expect(screen.queryByText(/treatment plan/i)).not.toBeInTheDocument()
    })
  })

  it('closes treatment modal when Escape key is pressed', async () => {
    predictionsApi.getMyPredictions.mockResolvedValueOnce({
      data: { data: mockPredictions, pagination: { total: 2, pages: 1, page: 1 } }
    })
    renderHistoryFlow()
    await waitFor(() => screen.getByText(/early blight/i))
    const viewBtns = screen.getAllByRole('button', { name: /view treatment/i })
    fireEvent.click(viewBtns[0])
    await waitFor(() => screen.getByText(/treatment plan/i))
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByText(/treatment plan/i)).not.toBeInTheDocument()
    })
  })

  // ── Delete Prediction ─────────────────────────────────────────────────────
  it('removes prediction card after delete is confirmed', async () => {
    predictionsApi.getMyPredictions.mockResolvedValueOnce({
      data: { data: mockPredictions, pagination: { total: 2, pages: 1, page: 1 } }
    })
    predictionsApi.deletePrediction.mockResolvedValueOnce({})
    renderHistoryFlow()
    await waitFor(() => screen.getByText(/early blight/i))
    const deleteBtns = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteBtns[0])
    // confirm in modal
    await waitFor(() => screen.getByRole('button', { name: /confirm/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    await waitFor(() => {
      expect(predictionsApi.deletePrediction).toHaveBeenCalledWith('p1')
    })
  })

  // ── Notes Editing ────────────────────────────────────────────────────────
  it('saves updated notes when Save Notes is clicked', async () => {
    predictionsApi.getMyPredictions.mockResolvedValueOnce({
      data: { data: mockPredictions, pagination: { total: 2, pages: 1, page: 1 } }
    })
    predictionsApi.updateNotes.mockResolvedValueOnce({})
    renderHistoryFlow()
    await waitFor(() => screen.getByText(/early blight/i))
    // click edit icon
    const editBtns = screen.getAllByRole('button', { name: /edit|notes/i })
    fireEvent.click(editBtns[0])
    const textarea = await screen.findByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'My updated notes' } })
    fireEvent.click(screen.getByRole('button', { name: /save notes/i }))
    await waitFor(() => {
      expect(predictionsApi.updateNotes).toHaveBeenCalledWith('p1', 'My updated notes')
    })
  })

  // ── API Error ─────────────────────────────────────────────────────────────
  it('shows error message when predictions fail to load', async () => {
    predictionsApi.getMyPredictions.mockRejectedValueOnce(new Error('Network error'))
    renderHistoryFlow()
    await waitFor(() => {
      expect(screen.getByText(/error|failed|something went wrong/i)).toBeInTheDocument()
    })
  })
})
