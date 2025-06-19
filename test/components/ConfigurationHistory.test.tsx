import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfigurationHistory } from '@/components/configuration-history'
import type { HistoryRecord } from '@/lib/types'

const mockHistoryData: HistoryRecord[] = [
  {
    id: 1,
    fileName: 'BCExport_2024_Q1.ssis',
    agreement: 'benefit-contracts',
    agreementLabel: 'Benefit Contracts',
    exportCriteria: 'by-contract',
    criteriaLabel: 'By Contract ID',
    selectionParameter: 'CONTRACT001',
    exportDate: '2024-03-15',
    status: 'completed',
    description: 'Q1 benefit contract export for client migration',
    recordCount: 15420,
    executionTime: 127.5,
    createdAt: '2024-03-15T10:30:00Z',
    sourceDbServer: 'SQL-PROD-01',
    sourceDbName: 'PLEXIS_PROD',
    targetDbName: 'CLIENT_STAGING',
    etlDbName: 'PLEXIS_ETL_CONTROL'
  },
  {
    id: 2,
    fileName: 'ProviderImport_2024_03.ssis',
    agreement: 'provider-imports',
    agreementLabel: 'Provider Imports',
    exportCriteria: 'all-records',
    criteriaLabel: 'All Records',
    exportDate: '2024-03-14',
    status: 'failed',
    description: 'Monthly provider data import - connection timeout',
    recordCount: 0,
    executionTime: 0,
    createdAt: '2024-03-14T14:15:00Z',
    sourceDbServer: 'SQL-PROD-02',
    sourceDbName: 'PROVIDER_DB',
    targetDbName: 'PLEXIS_STAGING',
    etlDbName: 'PLEXIS_ETL_CONTROL'
  }
]

describe('ConfigurationHistory', () => {
  const mockOnFilterChange = vi.fn()
  const mockOnUpdateDescription = vi.fn()

  const defaultProps = {
    historyData: mockHistoryData,
    onFilterChange: mockOnFilterChange,
    onUpdateDescription: mockOnUpdateDescription
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders history table with all records', () => {
    render(<ConfigurationHistory {...defaultProps} />)
    
    expect(screen.getByText('BCExport_2024_Q1.ssis')).toBeInTheDocument()
    expect(screen.getByText('ProviderImport_2024_03.ssis')).toBeInTheDocument()
    expect(screen.getByText('Benefit Contracts')).toBeInTheDocument()
    expect(screen.getByText('Provider Imports')).toBeInTheDocument()
  })

  it('displays correct status badges', () => {
    render(<ConfigurationHistory {...defaultProps} />)
    
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  it('shows formatted record counts and execution times', () => {
    render(<ConfigurationHistory {...defaultProps} />)
    
    expect(screen.getByText('15,420')).toBeInTheDocument()
    expect(screen.getByText('127.5s')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('calls onFilterChange when filter is selected', async () => {
    const user = userEvent.setup()
    render(<ConfigurationHistory {...defaultProps} />)
    
    const filterSelect = screen.getByRole('combobox')
    await user.click(filterSelect)
    
    const benefitOption = screen.getByRole('option', { name: /benefit contracts/i })
    await user.click(benefitOption)
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('benefit-contracts')
  })

  it('allows editing description inline', async () => {
    const user = userEvent.setup()
    render(<ConfigurationHistory {...defaultProps} />)
    
    const editButtons = screen.getAllByRole('button', { name: /edit description/i })
    await user.click(editButtons[0])
    
    const input = screen.getByDisplayValue('Q1 benefit contract export for client migration')
    await user.clear(input)
    await user.type(input, 'Updated description')
    
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)
    
    expect(mockOnUpdateDescription).toHaveBeenCalledWith(1, 'Updated description')
  })

  it('shows selection parameters when available', () => {
    render(<ConfigurationHistory {...defaultProps} />)
    
    expect(screen.getByText('CONTRACT001')).toBeInTheDocument()
  })

  it('displays empty state when no data provided', () => {
    render(<ConfigurationHistory {...defaultProps} historyData={[]} />)
    
    expect(screen.getByText(/no migration records found/i)).toBeInTheDocument()
  })

  it('handles canceling description edit', async () => {
    const user = userEvent.setup()
    render(<ConfigurationHistory {...defaultProps} />)
    
    const editButtons = screen.getAllByRole('button', { name: /edit description/i })
    await user.click(editButtons[0])
    
    const input = screen.getByDisplayValue('Q1 benefit contract export for client migration')
    await user.clear(input)
    await user.type(input, 'Changed text')
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    
    expect(mockOnUpdateDescription).not.toHaveBeenCalled()
    expect(screen.getByText('Q1 benefit contract export for client migration')).toBeInTheDocument()
  })
})