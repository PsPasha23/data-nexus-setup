import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Globe, CreditCard, Building2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CSVConfiguration } from '../configurations/CSVConfiguration';
import { APIConfiguration } from '../configurations/APIConfiguration';
import { StripeConfiguration } from '../configurations/StripeConfiguration';
import { SalesforceConfiguration } from '../configurations/SalesforceConfiguration';

const sourceIcons = {
  csv: Database,
  api: Globe,
  stripe: CreditCard,
  salesforce: Building2,
};

const sourceLabels = {
  csv: 'Manual CSV Upload',
  api: 'API Integration',
  stripe: 'Stripe Integration',
  salesforce: 'Salesforce Integration',
};

const statusConfig = {
  not_configured: { label: 'Not Configured', color: 'secondary' as const, icon: '⭕' },
  in_progress: { label: 'In Progress', color: 'default' as const, icon: '🟡' },
  configured: { label: 'Configured', color: 'default' as const, icon: '✅' },
};

export function DataSourceConfiguration() {
  const { state, setActiveSource } = useWizard();
  const { configurations, activeSourceId } = state;

  const configArray = Object.values(configurations);

  if (configArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No data sources selected. Please go back to select your data sources.
        </p>
      </div>
    );
  }

  const renderConfiguration = (config: any) => {
    switch (config.type) {
      case 'csv':
        return <CSVConfiguration sourceId={config.id} />;
      case 'api':
        return <APIConfiguration sourceId={config.id} />;
      case 'stripe':
        return <StripeConfiguration sourceId={config.id} />;
      case 'salesforce':
        return <SalesforceConfiguration sourceId={config.id} />;
      default:
        return <div>Unknown configuration type</div>;
    }
  };

  const closeConfiguration = () => {
    setActiveSource('');
  };

  // If a source is active, show tab view
  if (activeSourceId && configurations[activeSourceId]) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Configure Your Data Sources
            </h2>
            <p className="text-muted-foreground">
              Switch between data sources using the tabs below. Your progress is saved automatically.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={closeConfiguration}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
        </div>

        <Tabs
          value={activeSourceId}
          onValueChange={setActiveSource}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1 bg-muted/50">
            {configArray.map((config) => {
              const Icon = sourceIcons[config.type];
              const status = statusConfig[config.status];
              
              return (
                <TabsTrigger
                  key={config.id}
                  value={config.id}
                  className="flex items-center gap-2 p-3 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{sourceLabels[config.type]}</span>
                  <span className="text-xs">{status.icon}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {configArray.map((config) => (
            <TabsContent key={config.id} value={config.id} className="mt-6">
              {renderConfiguration(config)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  // Default view - collapsed accordions
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Configure Your Data Sources
        </h2>
        <p className="text-muted-foreground">
          Click on any data source below to start configuring it. All your progress will be saved automatically.
        </p>
      </div>

      <div className="space-y-4">
        {configArray.map((config) => {
          const Icon = sourceIcons[config.type];
          const status = statusConfig[config.status];
          
          return (
            <div
              key={config.id}
              className="border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setActiveSource(config.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-lg">
                      {sourceLabels[config.type]}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">{status.icon}</span>
                      <Badge variant={status.color} className="text-xs">
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {/* Configuration Summary */}
                  {config.status !== 'not_configured' && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      {config.dataType && (
                        <p>Data Type: {config.dataType.replace('_', ' + ')}</p>
                      )}
                      {config.type === 'csv' && config.config.csv && (
                        <p>Files: {config.config.csv.uploadedFiles.length}/{config.config.csv.requiredEntities.length}</p>
                      )}
                      {config.type === 'api' && config.config.api?.baseUrl && (
                        <p>API: {new URL(config.config.api.baseUrl).hostname}</p>
                      )}
                      {config.type === 'stripe' && config.config.stripe?.secretKey && (
                        <p>Mode: {config.config.stripe.secretKey.includes('test') ? 'Test' : 'Live'}</p>
                      )}
                      {config.type === 'salesforce' && config.config.salesforce?.instanceUrl && (
                        <p>Org: {new URL(config.config.salesforce.instanceUrl).hostname}</p>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Click to configure →
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}