import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { NotificationProvider } from '../../context/NotificationContext'
import PredictPage from '../../pages/user/PredictPage'

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

import * as predictionsApi from '../../api/predictions'

const mockPredictionResponse = {
  data: {
    data: {
      _id: 'pred123',
      disease: 'Early Blight',
      confidence: 87.5,
      isHealthy: false,
      solution: {
        display_name: 'Early Blight',
        scientific_name: 'Alternaria solani',
        severity: 'Medium',
        is_healthy: false,
        description: 'A fungal disease causing lesions on tomato leaves.',
        symptoms: ['Brown spots', 'Yellow halos'],
        immediate_actions: ['Remove infected leaves', 'Apply fungicide'],
        chemical_treatment: ['Chlorothalonil every 7 days'],
        organic_treatment: ['Neem oil spray'],
        prevention: ['Crop rotation', 'Drip irrigation'],
        recovery_time: '2-3 weeks with treatment',
      },
    }
  }
}

const renderPredictFlow = (user = null) =>
  render(
    <MemoryRouter initialEntries={['/predict']}>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/history" element={<div>History Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </MemoryRouter>
  )

// Helper to create a mock image file
const createMockImageFile = (name = 'leaf.jpg', type = 'image/jpeg') =>
  new File(['fake-image-content'], name, { type })

describe('Integration — Predict Flow', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  // ── Render ───────────────────────────────────────────────────────────────
  it('renders the predict page with upload area', () => {
    renderPredictFlow()
    expect(screen.getByText(/drag & drop/i)).toBeInTheDocument()
  })

  it('renders the Analyze Image button', () => {
    renderPredictFlow()
    expect(screen.getByRole('button', { name: /analyze image/i })).toBeInTheDocument()
  })

  // ── File Upload ──────────────────────────────────────────────────────────
  it('accepts a valid JPG file via file input', async () => {
    renderPredictFlow()
    const file = createMockImageFile('leaf.jpg', 'image/jpeg')
    const input = document.querySelector('input[type="file"]')
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    await waitFor(() => {
      expect(screen.getByText(/leaf\.jpg/i)).toBeInTheDocument()
    })
  })

  it('rejects a non-image file and shows error', async () => {
    renderPredictFlow()
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' })
    const input = document.querySelector('input[type="file"]')
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    await waitFor(() => {
      expect(screen.getByText(/only jpg, png/i)).toBeInTheDocument()
    })
  })

  it('rejects a file larger than 5MB', async () => {
    renderPredictFlow()
    const largeContent = new Array(6 * 1024 * 1024).fill('a').join('')
    const file = new File([largeContent], 'huge.jpg', { type: 'image/jpeg' })
    const input = document.querySelector('input[type="file"]')
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    await waitFor(() => {
      expect(screen.getByText(/5mb/i)).toBeInTheDocument()
    })
  })

  // ── No File Selected ─────────────────────────────────────────────────────
  it('shows error when Analyze is clicked without a file', async () => {
    renderPredictFlow()
    fireEvent.click(screen.getByRole('button', { name: /analyze image/i }))
    await waitFor(() => {
      expect(screen.getByText(/please select an image/i)).toBeInTheDocument()
    })
  })

  // ── Successful Prediction ────────────────────────────────────────────────
  it('calls createPrediction API with the uploaded file', async () => {
    predictionsApi.createPrediction.mockResolvedValueOnce(mockPredictionResponse)
    renderPredictFlow()
    const file = createMockImageFile()
    const input = document.querySelector('input[type="file"]')
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /analyze image/i }))
    })
    await waitFor(() => {
      expect(predictionsApi.createPrediction).toHaveBeenCalledTimes(1)
    })
  })

  it('displays disease name in result after successful prediction', async () => {
    predictionsApi.createPrediction.mockResolvedValueOnce(mockPredictionResponse)
    renderPredictFlow()
    const file = createMockImageFile()
    const input = document.querySelector('input[type="file"]')
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /analyze image/i }))
    })
    await waitFor(() => {
      expect(screen.getByText(/early blight/i)).toBeInTheDocument()
    })
  })

  it('displays confidence percentage in result', async () => {
    predictionsApi.createPrediction.mockResolvedValueOnce(mockPredictionResponse)
    renderPredictFlow()
    const file = createMockImageFile()
    const input = document.querySelector('input[type="file"]')
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /analyze image/i }))
    })
    await waitFor(() => {
      expect(screen.getByText(/87\.5/i)).toBeInTheDocument()
    })
  })

  // ── API Error Handling ───────────────────────────────────────────────────
  it('shows offline error when ML service is unavailable', async () => {
    predictionsApi.createPrediction.mockRejectedValueOnce({
      response: { status: 503, data: { message: 'The AI prediction service is currently offline. Please try again later' } }
    })
    renderPredictFlow()
    const file = createMockImageFile()
    const input = document.querySelector('input[type="file"]')
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /analyze image/i }))
    })
    await waitFor(() => {
      expect(screen.getByText(/offline|unavailable|try again later/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during prediction analysis', async () => {
    predictionsApi.createPrediction.mockImplementation(() => new Promise(() => {}))
    renderPredictFlow()
    const file = createMockImageFile()
    const input = document.querySelector('input[type="file"]')
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /analyze image/i }))
    })
    await waitFor(() => {
      expect(screen.getByText(/analyzing|loading/i)).toBeInTheDocument()
    })
  })
})
