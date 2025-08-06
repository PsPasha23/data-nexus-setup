import React, { useState } from 'react';
import { useWizard, type DataSourceType, type DataType } from '@/contexts/WizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  
  const [selectedDataType, setSelectedDataType] = useState<DataType | undefined>();

  const requiresDataTypeSelection = selectedSources.some(source => 
    source === 'csv' || source === 'api'
  );

  const handleSourceClick = (sourceType: DataSourceType) => {
    toggleSource(sourceType);
  };

  const handleDataTypeChange = (dataType: DataType) => {
    setSelectedDataType(dataType);
    
    // Update all CSV and API configurations with the selected data type
    Object.values(configurations).forEach(config => {
      if (config.type === 'csv' || config.type === 'api') {
        updateConfig(config.id, {
          dataType: dataType,
          status: 'in_progress',
        });
      }
    });
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

      {/* Data Type Selection - Required for CSV and API */}
      {requiresDataTypeSelection && (
        <Card className="mt-8 border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                What kind of data do you maintain?
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive" className="text-xs">Required</Badge>
                <span className="text-sm text-muted-foreground">
                  for Manual CSV Upload and API Integration
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Different calculation mechanisms will be considered based on the data type you select. 
                Click on an option below to select your data structure.
              </p>
            </div>
            
            <Accordion 
              type="single" 
              collapsible 
              value={selectedDataType}
              onValueChange={(value) => {
                if (value) {
                  handleDataTypeChange(value as DataType);
                }
              }}
              className="w-full space-y-3"
            >
              {dataTypeOptions.map((option, index) => (
                <AccordionItem 
                  key={option.value} 
                  value={option.value}
                  className={`border rounded-lg ${selectedDataType === option.value ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <AccordionTrigger className="hover:no-underline px-4 py-3">
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedDataType === option.value 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-foreground">{option.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                      {selectedDataType === option.value && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="mt-2 p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-medium text-sm mb-3">Required Data Entities:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {option.entities.map((entity) => (
                          <Badge key={entity} variant="outline" className="text-xs justify-center py-1">
                            {entity}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-background border rounded-md">
                        <p className="text-xs text-muted-foreground">
                          <strong>Calculation Method:</strong> {' '}
                          {option.value === 'hierarchical' && 'Full customer lifecycle analysis with complete entity relationships and revenue attribution across all touchpoints.'}
                          {option.value === 'invoice_payment' && 'Transaction-based revenue tracking focusing on billing cycles and payment reconciliation.'}
                          {option.value === 'plan_subscription' && 'Subscription-based metrics including MRR, churn analysis, and plan performance tracking.'}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

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