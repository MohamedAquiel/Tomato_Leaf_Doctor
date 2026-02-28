import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SolutionPanel from '../components/SolutionPanel'

const richSolution = {
  display_name: 'Early Blight',
  scientific_name: 'Alternaria solani',
  severity: 'Medium',
  is_healthy: false,
  description: 'A common fungal disease causing bull-eye lesions on leaves.',
  symptoms: ['Brown spots on lower leaves', 'Yellow halos around lesions'],
  immediate_actions: ['Remove infected leaves', 'Apply fungicide'],
  chemical_treatment: ['Apply chlorothalonil every 7 days'],
  organic_treatment: ['Use copper-based fungicide', 'Neem oil spray'],
  prevention: ['Crop rotation', 'Drip irrigation'],
  recovery_time: '2-3 weeks with treatment',
}

describe('Suite 1 - SolutionPanel Component', () => {

  describe('with rich object solution', () => {

    it('renders disease display name', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText('Early Blight')).toBeInTheDocument()
    })

    it('renders description text', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText(/common fungal disease/i)).toBeInTheDocument()
    })

    it('renders symptoms section', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText(/Brown spots on lower leaves/i)).toBeInTheDocument()
    })

    it('renders immediate actions section', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText(/Remove infected leaves/i)).toBeInTheDocument()
    })

    it('renders chemical treatment in full mode', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText(/chlorothalonil/i)).toBeInTheDocument()
    })

    it('renders organic treatment in full mode', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText(/copper-based fungicide/i)).toBeInTheDocument()
    })

    it('renders prevention section in full mode', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText(/Crop rotation/i)).toBeInTheDocument()
    })

    it('renders recovery time', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText(/2-3 weeks/i)).toBeInTheDocument()
    })

    it('renders severity badge', () => {
      render(<SolutionPanel solution={richSolution} />)
      expect(screen.getByText(/Medium/i)).toBeInTheDocument()
    })
  })

  describe('with plain string solution', () => {

    it('renders plain string solution text', () => {
      render(<SolutionPanel solution="Apply copper fungicide and remove infected leaves." />)
      expect(screen.getByText(/Apply copper fungicide/i)).toBeInTheDocument()
    })
  })

  describe('compact mode', () => {

    it('renders in compact mode without chemical treatment', () => {
      render(<SolutionPanel solution={richSolution} compact />)
      expect(screen.queryByText(/chlorothalonil/i)).not.toBeInTheDocument()
    })

    it('shows description in compact mode', () => {
      render(<SolutionPanel solution={richSolution} compact />)
      expect(screen.getByText(/common fungal disease/i)).toBeInTheDocument()
    })
  })

  describe('null/undefined handling', () => {

    it('renders nothing for null solution', () => {
      const { container } = render(<SolutionPanel solution={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing for undefined solution', () => {
      const { container } = render(<SolutionPanel solution={undefined} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing for empty string', () => {
      const { container } = render(<SolutionPanel solution="" />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('healthy plant', () => {

    it('renders healthy plant message', () => {
      const healthySolution = { ...richSolution, is_healthy: true, display_name: 'Healthy Plant' }
      render(<SolutionPanel solution={healthySolution} />)
      expect(screen.getByText(/Healthy Plant/i)).toBeInTheDocument()
    })
  })
})
