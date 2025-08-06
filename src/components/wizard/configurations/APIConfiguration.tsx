import React, { useState, useEffect } from 'react';
import { useWizard, type DataType } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface APIConfigurationProps {
  sourceId: string;
}

const dataTypeOptions = [
  {
    value: 'hierarchical' as DataType,
    label: 'Hierarchical Data',
    description: 'Complete entity relationships',
    endpoints: ['customers', 'invoices', 'payments', 'plans', 'subscriptions'],
  },
  {
    value: 'invoice_payment' as DataType,
    label: 'Invoice + Payment',
    description: 'Invoice and payment data only',
    endpoints: ['invoices', 'payments'],
  },
  {
    value: 'plan_subscription' as DataType,
    label: 'Plan + Subscription',
    description: 'Subscription plans and customer subscriptions',
    endpoints: ['plans', 'subscriptions'],
  },
];

const authTypes = [
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'api_key', label: 'API Key' },
  { value: 'basic', label: 'Basic Auth' },
];

export function APIConfiguration({ sourceId }: APIConfigurationProps) {
  const { getSourceConfig, updateConfig } = useWizard();
  const config = getSourceConfig(sourceId);
  
  const [selectedDataType, setSelectedDataType] = useState<DataType | undefined>(config?.dataType);
  const [baseUrl, setBaseUrl] = useState(config?.config.api?.baseUrl || '');
  const [authType, setAuthType] = useState<'bearer' | 'api_key' | 'basic'>(config?.config.api?.authType || 'bearer');
  const [credentials, setCredentials] = useState(config?.config.api?.credentials || {});
  const [endpoints, setEndpoints] = useState(config?.config.api?.endpoints || {});

  const selectedOption = dataTypeOptions.find(option => option.value === selectedDataType);
  const requiredEndpoints = selectedOption?.endpoints || [];

  useEffect(() => {
    // Auto-save configuration
    const hasRequiredFields = baseUrl && authType && 
      Object.keys(credentials).length > 0 && 
      requiredEndpoints.every(endpoint => endpoints[endpoint]);

    updateConfig(sourceId, {
      dataType: selectedDataType,
      status: selectedDataType && hasRequiredFields ? 'configured' : 
               selectedDataType ? 'in_progress' : 'not_configured',
      config: {
        ...config?.config,
        api: {
          baseUrl,
          authType,
          credentials,
          endpoints,
        },
      },
    });
  }, [selectedDataType, baseUrl, authType, credentials, endpoints, requiredEndpoints, sourceId, updateConfig, config?.config]);

  const handleDataTypeChange = (dataType: DataType) => {
    setSelectedDataType(dataType);
    setEndpoints({}); // Reset endpoints when data type changes
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const handleEndpointChange = (endpointType: string, value: string) => {
    setEndpoints(prev => ({ ...prev, [endpointType]: value }));
  };

  const getCredentialFields = () => {
    switch (authType) {
      case 'bearer':
        return [{ key: 'token', label: 'Bearer Token', type: 'password' }];
      case 'api_key':
        return [
          { key: 'key', label: 'API Key', type: 'password' },
          { key: 'header', label: 'Header Name (optional)', type: 'text', placeholder: 'X-API-Key' }
        ];
      case 'basic':
        return [
          { key: 'username', label: 'Username', type: 'text' },
          { key: 'password', label: 'Password', type: 'password' }
        ];
      default:
        return [];
    }
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
                      {option.endpoints.map((endpoint) => (
                        <Badge key={endpoint} variant="outline" className="text-xs">
                          {endpoint}
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

      {/* API Configuration */}
      {selectedDataType && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>API Connection Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Base URL */}
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  placeholder="https://api.example.com/v1"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
              </div>

              {/* Authentication Type */}
              <div className="space-y-2">
                <Label>Authentication Type</Label>
                <Select value={authType} onValueChange={(value) => setAuthType(value as 'bearer' | 'api_key' | 'basic')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {authTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Credentials */}
              <div className="space-y-3">
                <Label>Credentials</Label>
                {getCredentialFields().map((field) => (
                  <div key={field.key} className="space-y-1">
                    <Label htmlFor={field.key} className="text-sm">
                      {field.label}
                    </Label>
                    <Input
                      id={field.key}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={credentials[field.key] || ''}
                      onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Endpoint Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure the specific endpoints for each data type
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {requiredEndpoints.map((endpointType) => (
                <div key={endpointType} className="space-y-2">
                  <Label htmlFor={`endpoint-${endpointType}`} className="capitalize">
                    {endpointType} Endpoint
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 px-3 py-2 bg-muted rounded-l-md border border-r-0 text-sm text-muted-foreground">
                      {baseUrl || 'https://api.example.com/v1'}
                    </div>
                    <Input
                      id={`endpoint-${endpointType}`}
                      placeholder={`/${endpointType}`}
                      value={endpoints[endpointType] || ''}
                      onChange={(e) => handleEndpointChange(endpointType, e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              ))}
              
              {requiredEndpoints.length > 0 && (
                <>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Endpoint Examples:</p>
                    {requiredEndpoints.map((endpoint) => (
                      <div key={endpoint} className="font-mono text-xs bg-muted p-2 rounded mb-1">
                        GET {baseUrl || 'https://api.example.com/v1'}{endpoints[endpoint] || `/${endpoint}`}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Test Connection */}
          <Card>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                disabled={!baseUrl || !authType || Object.keys(credentials).length === 0}
                onClick={() => console.log('Test connection')}
              >
                Test Connection
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Test your API configuration before proceeding
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}