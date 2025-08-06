import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';

interface SalesforceConfigurationProps {
  sourceId: string;
}

export function SalesforceConfiguration({ sourceId }: SalesforceConfigurationProps) {
  const { getSourceConfig, updateConfig } = useWizard();
  const config = getSourceConfig(sourceId);
  
  const [instanceUrl, setInstanceUrl] = useState(config?.config.salesforce?.instanceUrl || '');
  const [username, setUsername] = useState(config?.config.salesforce?.username || '');
  const [password, setPassword] = useState(config?.config.salesforce?.password || '');
  const [securityToken, setSecurityToken] = useState(config?.config.salesforce?.securityToken || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    // Auto-save configuration
    const isConfigured = instanceUrl && username && password && securityToken;
    
    updateConfig(sourceId, {
      dataType: 'hierarchical', // Salesforce typically has full CRM data
      status: isConfigured ? 'configured' : 
               (instanceUrl || username || password || securityToken) ? 'in_progress' : 'not_configured',
      config: {
        ...config?.config,
        salesforce: {
          instanceUrl,
          username,
          password,
          securityToken,
        },
      },
    });
  }, [instanceUrl, username, password, securityToken, sourceId, updateConfig, config?.config]);

  return (
    <div className="space-y-6">
      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Salesforce Integration
            <Badge variant="outline">CRM Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Connect your Salesforce CRM to import customer and sales data.
              This integration will provide access to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Account and contact information</li>
              <li>Opportunity and lead data</li>
              <li>Sales pipeline metrics</li>
              <li>Custom objects and fields</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instance URL */}
          <div className="space-y-2">
            <Label htmlFor="instanceUrl">Instance URL</Label>
            <Input
              id="instanceUrl"
              placeholder="https://your-org.my.salesforce.com"
              value={instanceUrl}
              onChange={(e) => setInstanceUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your Salesforce instance URL (found in your Salesforce setup)
            </p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="email"
              placeholder="your-username@company.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your Salesforce password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Security Token */}
          <div className="space-y-2">
            <Label htmlFor="securityToken">Security Token</Label>
            <div className="relative">
              <Input
                id="securityToken"
                type={showToken ? 'text' : 'password'}
                placeholder="Your security token"
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your security token from{' '}
              <a
                href="https://help.salesforce.com/s/articleView?id=sf.user_security_token.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Salesforce Settings
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Access Information */}
      <Card>
        <CardHeader>
          <CardTitle>API Access Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>To use this integration, ensure your Salesforce org has:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'API access enabled',
                'User has API permissions',
                'Required object permissions',
                'IP address allowlisted (if restricted)',
              ].map((requirement) => (
                <div key={requirement} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Objects */}
      <Card>
        <CardHeader>
          <CardTitle>Available Data Objects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'Accounts',
              'Contacts',
              'Opportunities',
              'Leads',
              'Cases',
              'Products',
              'Quotes',
              'Contracts',
              'Campaigns',
            ].map((object) => (
              <Badge key={object} variant="outline" className="justify-center">
                {object}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Connection */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="outline"
            disabled={!instanceUrl || !username || !password || !securityToken}
            onClick={() => console.log('Test Salesforce connection')}
          >
            Test Connection
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Verify your Salesforce credentials and API access
          </p>
        </CardContent>
      </Card>
    </div>
  );
}