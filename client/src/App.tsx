import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppNavigation } from "@/components/app-navigation";
import Import from "@/pages/import";
import Export from "@/pages/export";
import History from "@/pages/history";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <AppNavigation />
      <Switch>
        <Route path="/" component={Export} />
        <Route path="/export" component={Export} />
        <Route path="/import" component={Import} />
        <Route path="/history" component={History} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
