import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { DataSourceSelection } from './steps/DataSourceSelection';
import { DataSourceConfiguration } from './steps/DataSourceConfiguration';
import { WizardSidebar } from './WizardSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function WizardContainer() {
  const { state, setStep } = useWizard();
  const { currentStep, selectedSources } = state;

  const canProceedToStep2 = selectedSources.length > 0;
  const isLastStep = currentStep === 2;

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <WizardSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-card rounded-lg border p-6">
          {/* Step Indicator */}
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium text-foreground">Select Sources</span>
            </div>
            <div className={`w-8 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium text-foreground">Configure</span>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && <DataSourceSelection />}
          {currentStep === 2 && <DataSourceConfiguration />}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-3">
              {currentStep === 1 && (
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Continue to Configuration
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {currentStep === 2 && (
                <Button onClick={() => console.log('Complete setup')}>
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}