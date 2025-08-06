import React, { useState } from 'react';
import { useWizard, type DataType } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface CSVConfigurationProps {
  sourceId: string;
}

const dataTypeLabels = {
  hierarchical: 'Hierarchical Data',
  invoice_payment: 'Invoice + Payment',
  plan_subscription: 'Plan + Subscription',
};

const dataTypeEntities = {
  hierarchical: ['customers', 'payments', 'invoices', 'plans', 'subscriptions'],
  invoice_payment: ['payments', 'invoices'],
  plan_subscription: ['plans', 'subscriptions'],
};

const requiredEntities = {
  hierarchical: ['customers', 'payments', 'invoices', 'plans', 'subscriptions'],
  invoice_payment: ['payments'],
  plan_subscription: ['plans', 'subscriptions'],
};

const optionalEntities = {
  hierarchical: [],
  invoice_payment: ['invoices'],
  plan_subscription: [],
};

export function CSVConfiguration({ sourceId }: CSVConfigurationProps) {
  const { getSourceConfig, updateConfig } = useWizard();
  const config = getSourceConfig(sourceId);
  
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; entityType: string; file: File }>>(
    config?.config.csv?.uploadedFiles || []
  );

  const dataType = config?.dataType || 'hierarchical';
  const allEntities = dataTypeEntities[dataType] || [];
  const mandatoryEntities = requiredEntities[dataType] || [];
  const optionalEntitiesList = optionalEntities[dataType] || [];

  const handleFileUpload = (entityType: string, file: File) => {
    const newFiles = [...uploadedFiles.filter(f => f.entityType !== entityType), { name: file.name, entityType, file }];
    setUploadedFiles(newFiles);
    
    const allRequiredFilesUploaded = mandatoryEntities.every(entity => 
      newFiles.some(f => f.entityType === entity)
    );
    
    updateConfig(sourceId, {
      status: allRequiredFilesUploaded ? 'configured' : 'in_progress',
      config: {
        ...config?.config,
        csv: {
          uploadedFiles: newFiles,
          requiredEntities: mandatoryEntities,
          optionalEntities: optionalEntitiesList,
          allEntities,
        },
      },
    });
  };

  const handleFileRemove = (entityType: string) => {
    const newFiles = uploadedFiles.filter(f => f.entityType !== entityType);
    setUploadedFiles(newFiles);
    
    const allRequiredFilesUploaded = mandatoryEntities.every(entity => 
      newFiles.some(f => f.entityType === entity)
    );
    
    updateConfig(sourceId, {
      status: allRequiredFilesUploaded ? 'configured' : 'in_progress',
      config: {
        ...config?.config,
        csv: {
          uploadedFiles: newFiles,
          requiredEntities: mandatoryEntities,
          optionalEntities: optionalEntitiesList,
          allEntities,
        },
      },
    });
  };

  const getFileForEntity = (entityType: string) => {
    return uploadedFiles.find(f => f.entityType === entityType);
  };

  return (
    <div className="space-y-6">
      {/* Data Type Display */}
      <Card>
        <CardHeader>
          <CardTitle>Data model configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="font-medium">{dataTypeLabels[dataType]}</h3>
              <p className="text-sm text-muted-foreground">
                {dataType === 'hierarchical' && 'Complete entity relationships'}
                {dataType === 'invoice_payment' && 'Invoice and payment data only'}
                {dataType === 'plan_subscription' && 'Subscription plans and customer subscriptions'}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 ml-auto">
              {allEntities.map((entity) => (
                <Badge 
                  key={entity} 
                  variant={mandatoryEntities.includes(entity) ? "default" : "outline"} 
                  className="text-xs"
                >
                  {entity} {mandatoryEntities.includes(entity) ? "(required)" : "(optional)"}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV Files</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file for each required entity. Files will be validated for proper structure.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allEntities.map((entityType) => {
              const uploadedFile = getFileForEntity(entityType);
              
              return (
                <div key={entityType} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium capitalize">{entityType} CSV</Label>
                      <Badge variant={mandatoryEntities.includes(entityType) ? "destructive" : "secondary"} className="text-xs">
                        {mandatoryEntities.includes(entityType) ? "Required" : "Optional"}
                      </Badge>
                      {uploadedFile && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {uploadedFile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileRemove(entityType)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {uploadedFile ? (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <File className="w-4 h-4" />
                      <span className="text-sm">{uploadedFile.name}</span>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <Label htmlFor={`file-${entityType}`} className="cursor-pointer">
                        <span className="text-sm">Click to upload {entityType}.csv</span>
                        <Input
                          id={`file-${entityType}`}
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(entityType, file);
                            }
                          }}
                        />
                      </Label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Progress: {uploadedFiles.filter(f => mandatoryEntities.includes(f.entityType)).length} of {mandatoryEntities.length} required files uploaded
                {optionalEntitiesList.length > 0 && (
                  <span className="block">
                    Optional: {uploadedFiles.filter(f => optionalEntitiesList.includes(f.entityType)).length} of {optionalEntitiesList.length} files uploaded
                  </span>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}