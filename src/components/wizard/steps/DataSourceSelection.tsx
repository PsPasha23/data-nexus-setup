import React, { useState } from 'react';
import { useWizard, type DataSourceType, type DataType } from '@/contexts/WizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Database, Globe, CreditCard, Building2, Check, ArrowRight } from 'lucide-react';

const dataSourceOptions = [
  {
    type: 'csv' as DataSourceType,
    title: 'Manual CSV Upload',
    description: 'Upload CSV files for your revenue data entities',
    icon: Database,
    features: ['Upload multiple files', 'Entity mapping', 'Data validation'],
    requiresDataType: true,
  },
  {
    type: 'api' as DataSourceType,
    title: 'API Integration',
    description: 'Connect to your existing API endpoints',
    icon: Globe,
    features: ['REST API support', 'Authentication methods', 'Real-time sync'],
    requiresDataType: true,
  },
  {
    type: 'stripe' as DataSourceType,
    title: 'Stripe Integration',
    description: 'Import data directly from your Stripe account',
    icon: CreditCard,
    features: ['Payment data', 'Subscription metrics', 'Customer insights'],
    requiresDataType: false,
  },
  {
    type: 'salesforce' as DataSourceType,
    title: 'Salesforce Integration',
    description: 'Connect to your Salesforce CRM data',
    icon: Building2,
    features: ['Lead tracking', 'Opportunity data', 'Account management'],
    requiresDataType: false,
  },
];

const dataTypeOptions = [
  {
    value: 'hierarchical' as DataType,
    label: 'Hierarchical Data',
    description: 'Complete entity relationships (customers, invoices, payments, plans, subscriptions)',
    entities: ['customers', 'invoices', 'payments', 'plans', 'subscriptions'],
  },
  {
    value: 'invoice_payment' as DataType,
    label: 'Invoice + Payment',
    description: 'Invoice and payment data only',
    entities: ['invoices', 'payments'],
  },
  {
    value: 'plan_subscription' as DataType,
    label: 'Plan + Subscription',
    description: 'Subscription plans and customer subscriptions',
    entities: ['plans', 'subscriptions'],
  },
];

export function DataSourceSelection() {
  const { state, toggleSource, updateConfig } = useWizard();
  const { selectedSources, configurations } = state;
  
  const [pendingSource, setPendingSource] = useState<DataSourceType | null>(null);
  const [selectedDataType, setSelectedDataType] = useState<DataType | undefined>();

  const handleSourceClick = (sourceType: DataSourceType) => {
    const option = dataSourceOptions.find(opt => opt.type === sourceType);
    
    if (option?.requiresDataType && !selectedSources.includes(sourceType)) {
      // Show data type selection for CSV and API
      setPendingSource(sourceType);
      setSelectedDataType(undefined);
    } else {
      // Directly add/remove for Stripe and Salesforce, or if already selected
      toggleSource(sourceType);
    }
  };

  const handleDataTypeConfirm = () => {
    if (pendingSource && selectedDataType) {
      toggleSource(pendingSource);
      
      // Update the configuration with the selected data type
      setTimeout(() => {
        const sourceConfigs = Object.values(configurations).filter(c => c.type === pendingSource);
        if (sourceConfigs.length > 0) {
          const config = sourceConfigs[sourceConfigs.length - 1]; // Get the latest one
          updateConfig(config.id, {
            dataType: selectedDataType,
            status: 'in_progress',
          });
        }
      }, 100);
      
      setPendingSource(null);
      setSelectedDataType(undefined);
    }
  };

  const handleDataTypeCancel = () => {
    setPendingSource(null);
    setSelectedDataType(undefined);
  };

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

      {/* Data Type Selection Modal */}
      {pendingSource && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                What kind of data do you maintain?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                This helps us configure the right data structure for your{' '}
                {dataSourceOptions.find(opt => opt.type === pendingSource)?.title}.
              </p>
              
              <RadioGroup value={selectedDataType} onValueChange={(value) => setSelectedDataType(value as DataType)}>
                <div className="space-y-4">
                  {dataTypeOptions.map((option) => (
                    <div key={option.value} className="flex items-start space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={option.value} className="font-medium cursor-pointer">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {option.entities.map((entity) => (
                            <Badge key={entity} variant="outline" className="text-xs">
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={handleDataTypeCancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleDataTypeConfirm}
                  disabled={!selectedDataType}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
              onClick={() => handleSourceClick(option.type)}
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