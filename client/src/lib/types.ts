export interface MigrationConfig {
  sourceDbServer: string;
  sourceDbName: string;
  targetDbName: string;
  etlDbName: string;
  agreement: string;
  exportCriteria: string;
  selectionParameter?: string;
  exportDirectory?: string;
  logDirectory?: string;
  agreementNotes?: string;
}

export interface HistoryRecord {
  id: number;
  fileName: string;
  agreement: string;
  agreementLabel: string;
  exportCriteria: string;
  criteriaLabel: string;
  selectionParameter?: string;
  exportDate: string;
  status: 'completed' | 'failed' | 'running';
  description: string;
  recordCount: number;
  executionTime: number;
  createdAt: string;
  sourceDbServer: string;
  sourceDbName: string;
  targetDbName: string;
  etlDbName: string;
  exportDirectory?: string;
  logDirectory?: string;
  agreementNotes?: string;
}

export interface MigrationResult {
  recordCount: number;
  executionTime: number;
  success: boolean;
  message: string;
}

export interface AgreementOption {
  value: string;
  label: string;
}

export interface ExportCriteriaOption {
  value: string;
  label: string;
}
