import { Settings, User } from "lucide-react";

export function AppHeader() {
  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Settings className="text-primary text-2xl mr-3" />
            <h1 className="text-xl font-semibold text-foreground">Configuration Management Tool</h1>
            <span className="ml-3 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">PROTOTYPE</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">PLEXIS Systems</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="text-primary-foreground text-sm" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
