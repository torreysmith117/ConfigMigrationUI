import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConfigurationHistory } from '@/components/configuration-history';
import { useMigration } from '@/hooks/use-migration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History as HistoryIcon, Database } from 'lucide-react';
import type { HistoryRecord } from '@/lib/types';

export default function History() {
  const [historyFilter, setHistoryFilter] = useState('');
  const { updateDescription } = useMigration();

  const { data: historyData = [], refetch } = useQuery<HistoryRecord[]>({
    queryKey: ['/api/migration-configurations'],
  });

  const handleUpdateDescription = async (recordId: number, description: string) => {
    await updateDescription(recordId, description);
    refetch();
  };

  const filteredHistory = historyData.filter(record =>
    historyFilter === '' || record.agreement === historyFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <HistoryIcon className="mr-3 text-primary" />
            Migration History
          </h1>
          <p className="text-muted-foreground">
            Complete history of all import and export operations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              All Migration Records
            </CardTitle>
            <CardDescription>
              View, filter, and manage all historical migration operations including imports and exports
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
      </div>
    </div>
  );
}