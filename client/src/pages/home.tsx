import { AppHeader } from "@/components/app-header";
import { ExecutionForm } from "@/components/execution-form";
import { ConfigurationHistory } from "@/components/configuration-history";
import { useMigration } from "@/hooks/use-migration";

export default function Home() {
  const {
    isExecuting,
    lastResult,
    historyData,
    isLoading,
    executeMigration,
    filterHistory,
    updateDescription,
    clearResult
  } = useMigration();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExecutionForm
          onExecute={executeMigration}
          isExecuting={isExecuting}
          lastResult={lastResult}
          onClearResult={clearResult}
        />
        
        <ConfigurationHistory
          historyData={historyData}
          onFilterChange={filterHistory}
          onUpdateDescription={updateDescription}
        />
      </main>
    </div>
  );
}
