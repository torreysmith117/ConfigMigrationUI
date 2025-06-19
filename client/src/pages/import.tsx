import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExecutionForm } from '@/components/execution-form';
import { ConfigurationHistory } from '@/components/configuration-history';
import { useMigration } from '@/hooks/use-migration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, History } from 'lucide-react';
import type { MigrationConfig, HistoryRecord } from '@/lib/types';

export default function Import() {
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

  // Filter for import operations only
  const importHistory = historyData.filter(record => 
    record.fileName.toLowerCase().includes('import') || 
    record.description.toLowerCase().includes('import')
  );

  const handleExecute = async (config: MigrationConfig) => {
    await executeMigration(config);
    refetch();
  };

  const handleUpdateDescription = async (recordId: number, description: string) => {
    await updateDescription(recordId, description);
    refetch();
  };

  const filteredHistory = importHistory.filter(record =>
    historyFilter === '' || record.agreement === historyFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Download className="mr-3 text-primary" />
            Data Import Configuration
          </h1>
          <p className="text-muted-foreground">
            Promote config set into a target database
          </p>
        </div>

        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Configure Import
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Import History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configure">
            <Card>
              <CardHeader>
                <CardTitle>Import Configuration</CardTitle>
                <CardDescription>
                  Set up data import parameters and source configurations
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
                <CardTitle>Import History</CardTitle>
                <CardDescription>
                  View and manage previous import operations
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