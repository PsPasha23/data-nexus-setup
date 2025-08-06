import React from 'react';
import { WizardProvider } from '@/contexts/WizardContext';
import { WizardContainer } from './WizardContainer';

export function RevenueAnalyticsWizard() {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Revenue Analytics Setup
            </h1>
            <p className="text-muted-foreground">
              Configure your data sources to start analyzing revenue patterns
            </p>
          </div>
          <WizardContainer />
        </div>
      </div>
    </WizardProvider>
  );
}