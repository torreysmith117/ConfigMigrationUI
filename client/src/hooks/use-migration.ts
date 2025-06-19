import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MigrationConfig, MigrationResult, HistoryRecord } from '@/lib/types';
import { generateMockFileName, getAgreementLabel, getCriteriaLabel } from '@/lib/mock-data';
import { apiRequest } from '@/lib/queryClient';

export function useMigration() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<MigrationResult | null>(null);
  const [agreementFilter, setAgreementFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Fetch migration configurations from database
  const { data: historyData = [], isLoading } = useQuery({
    queryKey: ['/api/migration-configurations', agreementFilter],
    refetchOnWindowFocus: false,
  });

  // Create migration configuration mutation
  const createMigrationMutation = useMutation({
    mutationFn: (config: any) => apiRequest('/api/migration-configurations', 'POST', config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/migration-configurations'] });
    },
  });

  // Update description mutation
  const updateDescriptionMutation = useMutation({
    mutationFn: ({ id, description }: { id: number; description: string }) => 
      apiRequest(`/api/migration-configurations/${id}/description`, 'PATCH', { description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/migration-configurations'] });
    },
  });

  const executeMigration = useCallback(async (config: MigrationConfig): Promise<MigrationResult> => {
    setIsExecuting(true);
    setLastResult(null);

    // Simulate API call delay
    const delay = 2000 + Math.random() * 3000; // 2-5 seconds
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Generate mock success data
        const recordCount = Math.floor(Math.random() * 50000) + 5000;
        const executionTime = Math.round(delay);
        
        const result: MigrationResult = {
          recordCount,
          executionTime,
          success: true,
          message: `Successfully migrated ${recordCount.toLocaleString()} records using ${getAgreementLabel(config.agreement)} with ${getCriteriaLabel(config.exportCriteria)} criteria.`
        };

        // Create database entry
        const migrationRecord = {
          fileName: generateMockFileName(config.agreement),
          sourceDbServer: config.sourceDbServer,
          sourceDbName: config.sourceDbName,
          targetDbName: config.targetDbName,
          etlDbName: config.etlDbName,
          agreement: config.agreement,
          agreementLabel: getAgreementLabel(config.agreement),
          exportCriteria: config.exportCriteria,
          criteriaLabel: getCriteriaLabel(config.exportCriteria),
          selectionParameter: config.selectionParameter || null,
          exportDirectory: config.exportDirectory || null,
          logDirectory: config.logDirectory || null,
          agreementNotes: config.agreementNotes || null,
          status: 'completed' as const,
          description: config.agreementNotes || '',
          recordCount,
          executionTime
        };

        try {
          await createMigrationMutation.mutateAsync(migrationRecord);
          setLastResult(result);
        } catch (error) {
          console.error('Failed to save migration record:', error);
          setLastResult({
            ...result,
            success: false,
            message: 'Migration completed but failed to save record to database.'
          });
        }

        setIsExecuting(false);
        resolve(result);
      }, delay);
    });
  }, [createMigrationMutation]);

  const filterHistory = useCallback((filter: string) => {
    setAgreementFilter(filter);
  }, []);

  const updateDescription = useCallback(async (recordId: number, description: string) => {
    try {
      await updateDescriptionMutation.mutateAsync({ id: recordId, description });
    } catch (error) {
      console.error('Failed to update description:', error);
    }
  }, [updateDescriptionMutation]);

  return {
    isExecuting,
    lastResult,
    historyData,
    isLoading,
    executeMigration,
    filterHistory,
    updateDescription,
    clearResult: () => setLastResult(null)
  };
}
