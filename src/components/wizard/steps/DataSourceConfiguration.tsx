import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Database, Globe, CreditCard, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Configure Your Data Sources
        </h2>
        <p className="text-muted-foreground">
          Expand each data source to configure it. Your progress will be saved automatically.
        </p>
      </div>

      <Accordion 
        type="single" 
        collapsible 
        value={activeSourceId}
        onValueChange={(value) => {
          if (value) {
            setActiveSource(value);
          }
        }}
        className="w-full space-y-4"
      >
        {configArray.map((config) => {
          const Icon = sourceIcons[config.type];
          const status = statusConfig[config.status];
          
          return (
            <AccordionItem 
              key={config.id} 
              value={config.id}
              className="border rounded-lg px-6 py-2"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">
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
                  
                  {/* Configuration Summary */}
                  {config.status !== 'not_configured' && (
                    <div className="text-right text-xs text-muted-foreground mr-4">
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
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6 pb-4">
                {renderConfiguration(config)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}