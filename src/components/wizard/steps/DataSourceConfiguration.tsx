import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Globe, CreditCard, Building2 } from 'lucide-react';
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
  csv: 'CSV Upload',
  api: 'API Integration',
  stripe: 'Stripe',
  salesforce: 'Salesforce',
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

  const activeConfig = activeSourceId ? configurations[activeSourceId] : configArray[0];
  const defaultValue = activeConfig?.id || configArray[0].id;

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Configure Your Data Sources
        </h2>
        <p className="text-muted-foreground">
          Set up each data source individually. Your progress will be saved automatically.
        </p>
      </div>

      <Tabs
        value={defaultValue}
        onValueChange={setActiveSource}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1">
          {configArray.map((config) => {
            const Icon = sourceIcons[config.type];
            const statusIcon = config.status === 'configured' ? '✅' : 
                             config.status === 'in_progress' ? '🟡' : '⭕';
            
            return (
              <TabsTrigger
                key={config.id}
                value={config.id}
                className="flex items-center gap-2 p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{sourceLabels[config.type]}</span>
                <span className="text-xs">{statusIcon}</span>
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