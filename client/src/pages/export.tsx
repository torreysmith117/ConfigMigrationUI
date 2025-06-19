import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExecutionForm } from '@/components/execution-form';
import { ConfigurationHistory } from '@/components/configuration-history';
import { useMigration } from '@/hooks/use-migration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, History } from 'lucide-react';
import type { MigrationConfig, HistoryRecord } from '@/lib/types';

export default function Export() {
  const [historyFilter, setHistoryFilter] = useState('');
  const { 
    executeMigration, 
    isExecuting, 
    lastResult, 
    clearResult,
    updateDescription 
  } = useMigration();

  const { data: historyData = [], refetch } = useQuery<HistoryRecord[]>({
    queryKey: ['/api/migration-configurations'],
  });

  // Filter for export operations only
  const exportHistory = historyData.filter(record => 
    record.fileName.toLowerCase().includes('export') || 
    record.description.toLowerCase().includes('export')
  );

  const handleExecute = async (config: MigrationConfig) => {
    await executeMigration(config);
    refetch();
  };

  const handleUpdateDescription = async (recordId: number, description: string) => {
    await updateDescription(recordId, description);
    refetch();
  };

  const filteredHistory = exportHistory.filter(record =>
    historyFilter === '' || record.agreement === historyFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Upload className="mr-3 text-primary" />
            Data Extract Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure SSIS package parameters for data extraction operations via ETL database
          </p>
        </div>

        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Configure Extract
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Extract History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configure">
            <Card>
              <CardHeader>
                <CardTitle>Extract Configuration</CardTitle>
                <CardDescription>
                  Set up data extraction parameters and destination configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExecutionForm
                  onExecute={handleExecute}
                  isExecuting={isExecuting}
                  lastResult={lastResult}
                  onClearResult={clearResult}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Export History</CardTitle>
                <CardDescription>
                  View and manage previous export operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationHistory
                  historyData={filteredHistory}
                  onFilterChange={setHistoryFilter}
                  onUpdateDescription={handleUpdateDescription}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}