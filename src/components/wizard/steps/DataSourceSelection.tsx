import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Globe, CreditCard, Building2, Check } from 'lucide-react';
import type { DataSourceType } from '@/contexts/WizardContext';

const dataSourceOptions = [
  {
    type: 'csv' as DataSourceType,
    title: 'Manual CSV Upload',
    description: 'Upload CSV files for your revenue data entities',
    icon: Database,
    features: ['Upload multiple files', 'Entity mapping', 'Data validation'],
  },
  {
    type: 'api' as DataSourceType,
    title: 'API Integration',
    description: 'Connect to your existing API endpoints',
    icon: Globe,
    features: ['REST API support', 'Authentication methods', 'Real-time sync'],
  },
  {
    type: 'stripe' as DataSourceType,
    title: 'Stripe Integration',
    description: 'Import data directly from your Stripe account',
    icon: CreditCard,
    features: ['Payment data', 'Subscription metrics', 'Customer insights'],
  },
  {
    type: 'salesforce' as DataSourceType,
    title: 'Salesforce Integration',
    description: 'Connect to your Salesforce CRM data',
    icon: Building2,
    features: ['Lead tracking', 'Opportunity data', 'Account management'],
  },
];

export function DataSourceSelection() {
  const { state, toggleSource } = useWizard();
  const { selectedSources } = state;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Which data sources would you like to configure?
        </h2>
        <p className="text-muted-foreground">
          Select one or more data sources to connect to your revenue analytics dashboard.
          You can configure each source individually in the next step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSourceOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedSources.includes(option.type);

          return (
            <Card
              key={option.type}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'
              }`}
              onClick={() => toggleSource(option.type)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{option.title}</h3>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-primary text-primary-foreground">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {option.description}
                </p>
                
                <div className="space-y-1">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSources.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Selected Sources ({selectedSources.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSources.map((sourceType) => {
              const option = dataSourceOptions.find(opt => opt.type === sourceType);
                  const Icon = option?.icon;
                  return (
                    <div
                      key={sourceType}
                      className="flex items-center gap-2 px-3 py-1 bg-background rounded-md border text-sm"
                    >
                      {Icon && <Icon className="w-3 h-3" />}
                      {option?.title}
                    </div>
                  );
            })}
          </div>
        </div>
      )}
    </div>
  );
}