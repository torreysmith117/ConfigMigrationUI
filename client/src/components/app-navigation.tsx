import { Link, useLocation } from 'wouter';
import { Download, Upload, History, Building, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppNavigation() {
  const [location] = useLocation();

  const navigationItems = [
    {
      href: '/export',
      label: 'Extract',
      icon: Upload,
      description: 'Data Extract Operations'
    },
    {
      href: '/import',
      label: 'Import',
      icon: Download,
      description: 'Data Import Operations'
    },
    {
      href: '/history',
      label: 'History',
      icon: History,
      description: 'Migration History'
    }
  ];

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/import" className="flex items-center space-x-2 text-foreground hover:text-primary">
              <Building className="w-8 h-8 text-primary" />
              <div>
                <div className="font-bold text-lg">PLEXIS</div>
                <div className="text-xs text-muted-foreground">Configuration Management</div>
              </div>
            </Link>
          </div>
          
          <div className="flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs opacity-75">{item.description}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}