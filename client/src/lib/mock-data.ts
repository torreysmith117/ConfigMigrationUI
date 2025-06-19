import { HistoryRecord, AgreementOption, ExportCriteriaOption } from './types';

export const AGREEMENT_OPTIONS: AgreementOption[] = [
  { value: 'benefit-contract-export', label: 'Benefit Contract Export' },
  { value: 'provider-import', label: 'Provider Import' },
  { value: 'member-enrollment', label: 'Member Enrollment' },
  { value: 'claims-processing', label: 'Claims Processing' },
  { value: 'fee-schedule-sync', label: 'Fee Schedule Sync' },
];

export const SELECTION_QUERY_OPTIONS: ExportCriteriaOption[] = [
  { value: 'all-records', label: 'All Records' },
  { value: 'by-contract', label: 'Select by Contract ID' },
  { value: 'by-date', label: 'Select by Date Range' },
  { value: 'by-provider', label: 'Select by Provider ID' },
  { value: 'incremental', label: 'Incremental Changes Only' },
  { value: 'custom-query', label: 'Custom SQL Query' },
];

export const INITIAL_HISTORY_DATA: HistoryRecord[] = [
  {
    id: 1,
    fileName: 'BCExport_20241201_001.dtsx',
    agreement: 'benefit-contract-export',
    agreementLabel: 'Benefit Contract Export',
    exportCriteria: 'all-fee-schedules',
    criteriaLabel: 'All Fee Schedules',
    exportDate: '2024-12-01',
    status: 'completed',
    description: 'Q4 benefit contract export for annual renewal',
    recordCount: 15420
  },
  {
    id: 2,
    fileName: 'ProvImport_20241125_003.dtsx',
    agreement: 'provider-import',
    agreementLabel: 'Provider Import',
    exportCriteria: 'by-contract',
    criteriaLabel: 'By Contract',
    exportDate: '2024-11-25',
    status: 'completed',
    description: 'New provider network additions for region 5',
    recordCount: 8330
  },
  {
    id: 3,
    fileName: 'MemberEnroll_20241120_002.dtsx',
    agreement: 'member-enrollment',
    agreementLabel: 'Member Enrollment',
    exportCriteria: 'by-date',
    criteriaLabel: 'By Date Range',
    exportDate: '2024-11-20',
    status: 'completed',
    description: '',
    recordCount: 4250
  },
  {
    id: 4,
    fileName: 'ClaimsProc_20241115_001.dtsx',
    agreement: 'claims-processing',
    agreementLabel: 'Claims Processing',
    exportCriteria: 'incremental',
    criteriaLabel: 'Incremental Changes',
    exportDate: '2024-11-15',
    status: 'failed',
    description: 'Monthly claims batch processing',
    recordCount: 0
  },
  {
    id: 5,
    fileName: 'FeeSchedule_20241110_004.dtsx',
    agreement: 'fee-schedule-sync',
    agreementLabel: 'Fee Schedule Sync',
    exportCriteria: 'by-provider',
    criteriaLabel: 'By Provider',
    exportDate: '2024-11-10',
    status: 'completed',
    description: 'Updated fee schedules for Q4 contracts',
    recordCount: 22150
  }
];

export function getAgreementLabel(agreementValue: string): string {
  const option = AGREEMENT_OPTIONS.find(opt => opt.value === agreementValue);
  return option?.label || agreementValue;
}

export function getCriteriaLabel(criteriaValue: string): string {
  const option = SELECTION_QUERY_OPTIONS.find(opt => opt.value === criteriaValue);
  return option?.label || criteriaValue;
}

export function generateMockFileName(agreement: string): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  const prefix = agreement.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  return `${prefix}_${date}_${sequence}.dtsx`;
}
