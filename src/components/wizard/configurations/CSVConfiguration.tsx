import React, { useState } from 'react';
import { useWizard, type DataType } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface CSVConfigurationProps {
  sourceId: string;
}

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

export function CSVConfiguration({ sourceId }: CSVConfigurationProps) {
  const { getSourceConfig, updateConfig } = useWizard();
  const config = getSourceConfig(sourceId);
  
  const [selectedDataType, setSelectedDataType] = useState<DataType | undefined>(config?.dataType);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; entityType: string; file: File }>>(
    config?.config.csv?.uploadedFiles || []
  );

  const selectedOption = dataTypeOptions.find(option => option.value === selectedDataType);
  const requiredEntities = selectedOption?.entities || [];

  const handleDataTypeChange = (dataType: DataType) => {
    setSelectedDataType(dataType);
    const option = dataTypeOptions.find(opt => opt.value === dataType);
    
    updateConfig(sourceId, {
      dataType,
      status: 'in_progress',
      config: {
        ...config?.config,
        csv: {
          uploadedFiles: [],
          requiredEntities: option?.entities || [],
        },
      },
    });
    
    setUploadedFiles([]);
  };

  const handleFileUpload = (entityType: string, file: File) => {
    const newFiles = [...uploadedFiles.filter(f => f.entityType !== entityType), { name: file.name, entityType, file }];
    setUploadedFiles(newFiles);
    
    const allFilesUploaded = requiredEntities.every(entity => 
      newFiles.some(f => f.entityType === entity)
    );
    
    updateConfig(sourceId, {
      status: allFilesUploaded ? 'configured' : 'in_progress',
      config: {
        ...config?.config,
        csv: {
          uploadedFiles: newFiles,
          requiredEntities,
        },
      },
    });
  };

  const handleFileRemove = (entityType: string) => {
    const newFiles = uploadedFiles.filter(f => f.entityType !== entityType);
    setUploadedFiles(newFiles);
    
    updateConfig(sourceId, {
      status: newFiles.length === requiredEntities.length ? 'configured' : 'in_progress',
      config: {
        ...config?.config,
        csv: {
          uploadedFiles: newFiles,
          requiredEntities,
        },
      },
    });
  };

  const getFileForEntity = (entityType: string) => {
    return uploadedFiles.find(f => f.entityType === entityType);
  };

  return (
    <div className="space-y-6">
      {/* Data Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>What kind of data do you maintain?</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedDataType} onValueChange={handleDataTypeChange}>
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
        </CardContent>
      </Card>

      {/* File Upload Section */}
      {selectedDataType && (
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV Files</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload a CSV file for each required entity. Files will be validated for proper structure.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requiredEntities.map((entityType) => {
                const uploadedFile = getFileForEntity(entityType);
                
                return (
                  <div key={entityType} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium capitalize">{entityType} CSV</Label>
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
                  Progress: {uploadedFiles.length} of {requiredEntities.length} files uploaded
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}