import React, { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';

interface StripeConfigurationProps {
  sourceId: string;
}

export function StripeConfiguration({ sourceId }: StripeConfigurationProps) {
  const { getSourceConfig, updateConfig } = useWizard();
  const config = getSourceConfig(sourceId);
  
  const [secretKey, setSecretKey] = useState(config?.config.stripe?.secretKey || '');
  const [webhookEndpoint, setWebhookEndpoint] = useState(config?.config.stripe?.webhookEndpoint || '');
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    // Auto-save configuration
    const isConfigured = secretKey.startsWith('sk_') && webhookEndpoint;
    
    updateConfig(sourceId, {
      dataType: 'plan_subscription', // Stripe typically handles subscriptions
      status: isConfigured ? 'configured' : 
               (secretKey || webhookEndpoint) ? 'in_progress' : 'not_configured',
      config: {
        ...config?.config,
        stripe: {
          secretKey,
          webhookEndpoint,
        },
      },
    });
  }, [secretKey, webhookEndpoint, sourceId, updateConfig, config?.config]);

  return (
    <div className="space-y-6">
      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Stripe Integration
            <Badge variant="outline">Subscription Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Connect your Stripe account to automatically import subscription and payment data.
              This integration will provide access to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Customer subscription data</li>
              <li>Payment transactions</li>
              <li>Revenue metrics</li>
              <li>Plan and pricing information</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Secret Key */}
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <div className="relative">
              <Input
                id="secretKey"
                type={showSecretKey ? 'text' : 'password'}
                placeholder="sk_live_... or sk_test_..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowSecretKey(!showSecretKey)}
              >
                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Find your secret key in the{' '}
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Stripe Dashboard
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Webhook Endpoint */}
          <div className="space-y-2">
            <Label htmlFor="webhookEndpoint">Webhook Endpoint</Label>
            <Input
              id="webhookEndpoint"
              placeholder="https://your-app.com/webhooks/stripe"
              value={webhookEndpoint}
              onChange={(e) => setWebhookEndpoint(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Configure this URL in your Stripe webhook settings for real-time updates
            </p>
          </div>

          {/* Validation Status */}
          {secretKey && (
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  secretKey.startsWith('sk_live_') ? 'bg-green-500' :
                  secretKey.startsWith('sk_test_') ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">
                  {secretKey.startsWith('sk_live_') ? 'Live Mode' :
                   secretKey.startsWith('sk_test_') ? 'Test Mode' : 'Invalid Key Format'}
                </span>
              </div>
              {secretKey.startsWith('sk_test_') && (
                <p className="text-xs text-muted-foreground mt-1">
                  Using test mode. Switch to live keys for production.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Access Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Required Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground mb-3">
              This integration requires the following Stripe permissions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'Read customers',
                'Read subscriptions',
                'Read invoices',
                'Read payment methods',
                'Read products and prices',
                'Read payment intents',
              ].map((permission) => (
                <div key={permission} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{permission}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Connection */}
      <Card>
        <CardContent className="pt-6">
          <Button
            variant="outline"
            disabled={!secretKey.startsWith('sk_')}
            onClick={() => console.log('Test Stripe connection')}
          >
            Test Connection
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Verify your Stripe credentials and permissions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}