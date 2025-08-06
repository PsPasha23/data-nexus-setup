import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Database, Globe, CreditCard, Building2, X } from 'lucide-react';
import type { DataSourceType } from '@/contexts/WizardContext';

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

export function WizardSidebar() {
  const { state, setStep, removeSource, setActiveSource } = useWizard();
  const { selectedSources, configurations, activeSourceId, currentStep } = state;

  const configArray = Object.values(configurations);

  const handleAddSource = () => {
    setStep(1);
  };

  const handleSourceClick = (sourceId: string) => {
    setActiveSource(sourceId);
    if (currentStep === 1) {
      setStep(2);
    }
  };

  const handleRemoveSource = (e: React.MouseEvent, sourceId: string) => {
    e.stopPropagation();
    const config = configurations[sourceId];
    if (config && (config.status === 'not_configured' || confirm('Are you sure you want to remove this data source? All configuration will be lost.'))) {
      removeSource(sourceId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Data Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Sources List */}
        {configArray.length > 0 && (
          <div className="space-y-2">
            {configArray.map((config) => {
              const Icon = sourceIcons[config.type];
              const status = statusConfig[config.status];
              const isActive = config.id === activeSourceId;
              
              return (
                <div
                  key={config.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors group ${
                    isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSourceClick(config.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {sourceLabels[config.type]}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs">{status.icon}</span>
                          <Badge variant={status.color} className="text-xs">
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={(e) => handleRemoveSource(e, config.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {/* Configuration Summary */}
                  {config.status !== 'not_configured' && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        {config.dataType && `Data Type: ${config.dataType.replace('_', ' + ')}`}
                      </p>
                      {config.type === 'csv' && config.config.csv && (
                        <p className="text-xs text-muted-foreground">
                          Files: {config.config.csv.uploadedFiles.length}/{config.config.csv.requiredEntities.length}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Another Source Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddSource}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Data Source
        </Button>

        {/* Progress Summary */}
        {configArray.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">Progress Summary</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Total Sources:</span>
                <span>{configArray.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Configured:</span>
                <span>{configArray.filter(c => c.status === 'configured').length}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span>{configArray.filter(c => c.status === 'in_progress').length}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}