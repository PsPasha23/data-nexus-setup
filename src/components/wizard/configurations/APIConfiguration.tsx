import React, { useState, useEffect } from 'react';
import { useWizard, type DataType } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface APIConfigurationProps {
  sourceId: string;
}

const dataTypeLabels = {
  hierarchical: 'Hierarchical Data',
  invoice_payment: 'Invoice + Payment',
  plan_subscription: 'Plan + Subscription',
};

const dataTypeEndpoints = {
  hierarchical: ['customers', 'invoices', 'payments', 'plans', 'subscriptions'],
  invoice_payment: ['invoices', 'payments'],
  plan_subscription: ['plans', 'subscriptions'],
};

const authTypes = [
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'api_key', label: 'API Key' },
  { value: 'basic', label: 'Basic Auth' },
];

export function APIConfiguration({ sourceId }: APIConfigurationProps) {
  const { getSourceConfig, updateConfig } = useWizard();
  const config = getSourceConfig(sourceId);
  
  const dataType = config?.dataType || 'hierarchical';
  const requiredEndpoints = dataTypeEndpoints[dataType] || [];
  
  const [baseUrl, setBaseUrl] = useState(config?.config.api?.baseUrl || '');
  const [authType, setAuthType] = useState<'bearer' | 'api_key' | 'basic'>(config?.config.api?.authType || 'bearer');
  const [credentials, setCredentials] = useState(config?.config.api?.credentials || {});
  const [endpoints, setEndpoints] = useState(config?.config.api?.endpoints || {});

  useEffect(() => {
    // Auto-save configuration
    const hasRequiredFields = baseUrl && authType && 
      Object.keys(credentials).length > 0 && 
      requiredEndpoints.every(endpoint => endpoints[endpoint]);

    updateConfig(sourceId, {
      status: dataType && hasRequiredFields ? 'configured' : 
               dataType ? 'in_progress' : 'not_configured',
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
  }, [dataType, baseUrl, authType, credentials, endpoints, requiredEndpoints, sourceId, updateConfig, config?.config]);

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
      {/* Data Type Display */}
      <Card>
        <CardHeader>
          <CardTitle>Data Type Configuration</CardTitle>
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
              {requiredEndpoints.map((endpoint) => (
                <Badge key={endpoint} variant="outline" className="text-xs">
                  {endpoint}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
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
    </div>
  );
}