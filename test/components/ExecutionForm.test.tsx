import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExecutionForm } from '@/components/execution-form'

// Mock the hooks and data
vi.mock('@/lib/mock-data', () => ({
  AGREEMENT_OPTIONS: [
    { value: 'benefit-contracts', label: 'Benefit Contracts' },
    { value: 'provider-imports', label: 'Provider Imports' }
  ],
  SELECTION_QUERY_OPTIONS: [
    { value: 'all-records', label: 'All Records' },
    { value: 'by-contract', label: 'By Contract ID' }
  ]
}))

describe('ExecutionForm', () => {
  const mockOnExecute = vi.fn()
  const mockOnClearResult = vi.fn()

  const defaultProps = {
    onExecute: mockOnExecute,
    isExecuting: false,
    lastResult: null,
    onClearResult: mockOnClearResult
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with all required fields', () => {
    render(<ExecutionForm {...defaultProps} />)
    
    expect(screen.getByText('SSIS Package Execution Architecture')).toBeInTheDocument()
    expect(screen.getByLabelText(/ETL Database Connection/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Source DB Server/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Source DB Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Target DB Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Agreement Type/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Selection Query/)).toBeInTheDocument()
  })

  it('shows SSIS architecture explanation', () => {
    render(<ExecutionForm {...defaultProps} />)
    
    expect(screen.getByText(/connects to the ETL database and executes a SQL script/)).toBeInTheDocument()
  })

  it('validates required fields before submission', async () => {
    const user = userEvent.setup()
    render(<ExecutionForm {...defaultProps} />)
    
    const submitButton = screen.getByRole('button', { name: /execute migration/i })
    await user.click(submitButton)
    
    expect(mockOnExecute).not.toHaveBeenCalled()
  })

  it('shows selection query explanation when criteria is selected', async () => {
    const user = userEvent.setup()
    render(<ExecutionForm {...defaultProps} />)
    
    const criteriaSelect = screen.getByRole('combobox', { name: /selection query/i })
    await user.click(criteriaSelect)
    
    const byContractOption = screen.getByRole('option', { name: /by contract id/i })
    await user.click(byContractOption)
    
    await waitFor(() => {
      expect(screen.getByText(/Select by Contract ID/)).toBeInTheDocument()
      expect(screen.getByText(/Enter one or more contract IDs separated by commas/)).toBeInTheDocument()
    })
  })

  it('shows execution result when lastResult is provided', () => {
    const lastResult = {
      recordCount: 1500,
      executionTime: 45.2,
      message: 'Migration completed successfully'
    }
    
    render(<ExecutionForm {...defaultProps} lastResult={lastResult} />)
    
    expect(screen.getByText('Migration completed successfully')).toBeInTheDocument()
    expect(screen.getByText('1,500 records')).toBeInTheDocument()
    expect(screen.getByText('45.2 seconds')).toBeInTheDocument()
  })

  it('disables form when executing', () => {
    render(<ExecutionForm {...defaultProps} isExecuting={true} />)
    
    const submitButton = screen.getByRole('button', { name: /executing/i })
    expect(submitButton).toBeDisabled()
  })
})