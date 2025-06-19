import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMigration } from '@/hooks/use-migration'
import type { MigrationConfig } from '@/lib/types'

// Mock the API request function
vi.mock('@/lib/queryClient', () => ({
  apiRequest: vi.fn()
}))

describe('useMigration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useMigration())
    
    expect(result.current.isExecuting).toBe(false)
    expect(result.current.lastResult).toBe(null)
    expect(typeof result.current.executeMigration).toBe('function')
    expect(typeof result.current.clearResult).toBe('function')
    expect(typeof result.current.updateDescription).toBe('function')
  })

  it('handles successful migration execution', async () => {
    const { apiRequest } = await import('@/lib/queryClient')
    const mockResult = {
      recordCount: 1500,
      executionTime: 45.2,
      success: true,
      message: 'Migration completed successfully'
    }
    vi.mocked(apiRequest).mockResolvedValue(mockResult)

    const { result } = renderHook(() => useMigration())
    
    const mockConfig: MigrationConfig = {
      sourceDbServer: 'SQL-PROD-01',
      sourceDbName: 'PLEXIS_PROD',
      targetDbName: 'CLIENT_STAGING',
      etlDbName: 'PLEXIS_ETL_CONTROL',
      agreement: 'benefit-contracts',
      exportCriteria: 'by-contract',
      selectionParameter: 'CONTRACT001'
    }

    await result.current.executeMigration(mockConfig)
    
    await waitFor(() => {
      expect(result.current.lastResult).toEqual(mockResult)
      expect(result.current.isExecuting).toBe(false)
    })
  })

  it('clears result when clearResult is called', () => {
    const { result } = renderHook(() => useMigration())
    
    result.current.clearResult()
    
    expect(result.current.lastResult).toBe(null)
  })
})