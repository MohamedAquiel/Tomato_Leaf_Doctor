import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import TreatmentModal from '../components/TreatmentModal'

vi.mock('../components/SolutionPanel', () => ({
  default: ({ solution }) => <div data-testid="solution-panel">Solution: {solution?.description || solution}</div>
}))

const mockSolution = {
  display_name: 'Early Blight',
  description: 'A fungal disease affecting tomatoes.',
  symptoms: ['Brown spots'],
  immediate_actions: ['Apply fungicide'],
  chemical_treatment: ['Chlorothalonil'],
  organic_treatment: ['Neem oil'],
  prevention: ['Crop rotation'],
  recovery_time: '2-3 weeks',
  severity: 'Medium',
  is_healthy: false,
}

describe('Suite 1 - TreatmentModal Component', () => {

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.style.overflow = ''
  })

  it('renders the modal', () => {
    render(<TreatmentModal solution={mockSolution} diseaseName="Early Blight" onClose={() => {}} />)
    expect(screen.getByText('Treatment Plan')).toBeInTheDocument()
  })

  it('shows disease name in header', () => {
    render(<TreatmentModal solution={mockSolution} diseaseName="Early Blight" onClose={() => {}} />)
    expect(screen.getByText('Early Blight')).toBeInTheDocument()
  })

  it('shows loading spinner initially', () => {
    render(<TreatmentModal solution={mockSolution} diseaseName="Test" onClose={() => {}} />)
    expect(screen.getByText(/Loading treatment plan/i)).toBeInTheDocument()
  })

  it('hides spinner and shows solution after 600ms', async () => {
    render(<TreatmentModal solution={mockSolution} diseaseName="Test" onClose={() => {}} />)
    expect(screen.queryByTestId('solution-panel')).not.toBeInTheDocument()
    await act(async () => { vi.advanceTimersByTime(600) })
    expect(screen.getByTestId('solution-panel')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<TreatmentModal solution={mockSolution} diseaseName="Test" onClose={onClose} />)
    fireEvent.click(screen.getByTitle('Close (Esc)'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay (backdrop) clicked', () => {
    const onClose = vi.fn()
    render(<TreatmentModal solution={mockSolution} diseaseName="Test" onClose={onClose} />)
    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when modal content clicked', () => {
    const onClose = vi.fn()
    render(<TreatmentModal solution={mockSolution} diseaseName="Test" onClose={onClose} />)
    fireEvent.click(screen.getByText('Treatment Plan'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape key pressed', () => {
    const onClose = vi.fn()
    render(<TreatmentModal solution={mockSolution} diseaseName="Test" onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll on open', () => {
    render(<TreatmentModal solution={mockSolution} diseaseName="Test" onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll on unmount', () => {
    const { unmount } = render(<TreatmentModal solution={mockSolution} diseaseName="Test" onClose={() => {}} />)
    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
