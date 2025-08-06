import React from 'react';
import { Tabs, Badge, Button, Typography, Space, Card } from 'antd';
import { DatabaseOutlined, GlobalOutlined, CreditCardOutlined, BuildOutlined, CloseOutlined } from '@ant-design/icons';
import { useWizard } from '@/contexts/WizardContext';
import { CSVConfiguration } from '../configurations/CSVConfiguration';
import { APIConfiguration } from '../configurations/APIConfiguration';
import { StripeConfiguration } from '../configurations/StripeConfiguration';
import { SalesforceConfiguration } from '../configurations/SalesforceConfiguration';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const sourceIcons = {
  csv: DatabaseOutlined,
  api: GlobalOutlined,
  stripe: CreditCardOutlined,
  salesforce: BuildOutlined,
};

const sourceLabels = {
  csv: 'Manual CSV Upload',
  api: 'API Integration',
  stripe: 'Stripe Integration',
  salesforce: 'Salesforce Integration',
};

const statusConfig = {
  not_configured: { label: 'Not Configured', color: 'default' as const, icon: '⭕' },
  in_progress: { label: 'In Progress', color: 'processing' as const, icon: '🟡' },
  configured: { label: 'Configured', color: 'success' as const, icon: '✅' },
};

export function DataSourceConfiguration() {
  const { state, setActiveSource } = useWizard();
  const { configurations, activeSourceId } = state;

  const configArray = Object.values(configurations);

  if (configArray.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Text type="secondary">
          No data sources selected. Please go back to select your data sources.
        </Text>
      </div>
    );
  }

  const renderConfiguration = (config: any) => {
    switch (config.type) {
      case 'csv':
        return <CSVConfiguration sourceId={config.id} />;
      case 'api':
        return <APIConfiguration sourceId={config.id} />;
      case 'stripe':
        return <StripeConfiguration sourceId={config.id} />;
      case 'salesforce':
        return <SalesforceConfiguration sourceId={config.id} />;
      default:
        return <div>Unknown configuration type</div>;
    }
  };

  const closeConfiguration = () => {
    setActiveSource('');
  };

  // If a source is active, show tab view
  if (activeSourceId && configurations[activeSourceId]) {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Title level={2} style={{ color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
              Configure Your Data Sources
            </Title>
            <Text type="secondary">
              Switch between data sources using the tabs below. Your progress is saved automatically.
            </Text>
          </div>
          <Button
            size="small"
            icon={<CloseOutlined />}
            onClick={closeConfiguration}
          >
            Close
          </Button>
        </div>

        <Tabs
          activeKey={activeSourceId}
          onChange={setActiveSource}
          type="card"
        >
          {configArray.map((config) => {
            const Icon = sourceIcons[config.type];
            const status = statusConfig[config.status];
            
            return (
              <TabPane
                key={config.id}
                tab={
                  <Space>
                    <Icon />
                    <span style={{ display: window.innerWidth > 640 ? 'inline' : 'none' }}>
                      {sourceLabels[config.type]}
                    </span>
                    <span style={{ fontSize: '12px' }}>{status.icon}</span>
                  </Space>
                }
              >
                {renderConfiguration(config)}
              </TabPane>
            );
          })}
        </Tabs>
      </Space>
    );
  }

  // Default view - collapsed accordions
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <div>
        <Title level={2} style={{ color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
          Configure Your Data Sources
        </Title>
        <Text type="secondary">
          Click on any data source below to start configuring it. All your progress will be saved automatically.
        </Text>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {configArray.map((config) => {
          const Icon = sourceIcons[config.type];
          const status = statusConfig[config.status];
          
          return (
            <Card
              key={config.id}
              hoverable
              style={{ 
                cursor: 'pointer',
                border: '1px solid hsl(var(--border))'
              }}
              onClick={() => setActiveSource(config.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space size="large">
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    background: 'hsl(var(--muted))' 
                  }}>
                    <Icon style={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <Title level={4} style={{ margin: 0, color: 'hsl(var(--foreground))' }}>
                      {sourceLabels[config.type]}
                    </Title>
                    <Space style={{ marginTop: '4px' }}>
                      <span style={{ fontSize: '14px' }}>{status.icon}</span>
                      <Badge color={status.color} text={status.label} />
                    </Space>
                  </div>
                </Space>
                
                <div style={{ textAlign: 'right' }}>
                  {/* Configuration Summary */}
                  {config.status !== 'not_configured' && (
                    <Space direction="vertical" size="small" align="end">
                      {config.dataType && (
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                          Data Type: {config.dataType.replace('_', ' + ')}
                        </Text>
                      )}
                      {config.type === 'csv' && config.config.csv && (
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                          Files: {config.config.csv.uploadedFiles.length}/{config.config.csv.requiredEntities.length}
                        </Text>
                      )}
                      {config.type === 'api' && config.config.api?.baseUrl && (
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                          API: {new URL(config.config.api.baseUrl).hostname}
                        </Text>
                      )}
                      {config.type === 'stripe' && config.config.stripe?.secretKey && (
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                          Mode: {config.config.stripe.secretKey.includes('test') ? 'Test' : 'Live'}
                        </Text>
                      )}
                      {config.type === 'salesforce' && config.config.salesforce?.instanceUrl && (
                        <Text type="secondary" style={{ fontSize: '14px' }}>
                          Org: {new URL(config.config.salesforce.instanceUrl).hostname}
                        </Text>
                      )}
                    </Space>
                  )}
                  <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                    Click to configure →
                  </Text>
                </div>
              </div>
            </Card>
          );
        })}
      </Space>
    </Space>
  );
}