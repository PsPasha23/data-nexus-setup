import React from 'react';
import { Card, Button, Badge, Typography, Space, Divider } from 'antd';
import { PlusOutlined, DatabaseOutlined, GlobalOutlined, CreditCardOutlined, TeamOutlined, CloseOutlined } from '@ant-design/icons';
import { useWizard } from '@/contexts/WizardContext';
import type { DataSourceType } from '@/contexts/WizardContext';

const { Title, Text } = Typography;

const sourceIcons = {
  csv: DatabaseOutlined,
  api: GlobalOutlined,
  stripe: CreditCardOutlined,
  salesforce: TeamOutlined,
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
    <Card 
      title={<Title level={4} style={{ margin: 0 }}>Data Sources</Title>}
      style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Selected Sources List */}
        {configArray.length > 0 && (
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {configArray.map((config) => {
              const Icon = sourceIcons[config.type];
              const status = statusConfig[config.status];
              const isActive = config.id === activeSourceId;
              
              return (
                <Card
                  key={config.id}
                  size="small"
                  hoverable
                  style={{ 
                    cursor: 'pointer',
                    border: isActive ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                    background: isActive ? 'hsl(var(--primary) / 0.05)' : 'transparent'
                  }}
                  onClick={() => handleSourceClick(config.id)}
                  extra={
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={(e) => handleRemoveSource(e, config.id)}
                      style={{ opacity: 0.7 }}
                    />
                  }
                >
                  <Space>
                    <Icon style={{ color: 'hsl(var(--muted-foreground))' }} />
                    <div>
                      <Text strong style={{ fontSize: '14px', color: 'hsl(var(--foreground))' }}>
                        {sourceLabels[config.type]}
                      </Text>
                      <div style={{ marginTop: '4px' }}>
                        <Space size="small">
                          <span style={{ fontSize: '12px' }}>{status.icon}</span>
                          <Badge color={status.color} text={status.label} />
                        </Space>
                      </div>
                    </div>
                  </Space>
                  
                  {/* Configuration Summary */}
                  {config.status !== 'not_configured' && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid hsl(var(--border))' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {config.dataType && `Data Type: ${config.dataType.replace('_', ' + ')}`}
                      </Text>
                      {config.type === 'csv' && config.config.csv && (
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Files: {config.config.csv.uploadedFiles.length}/{config.config.csv.requiredEntities.length}
                          </Text>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </Space>
        )}

        {/* Add Another Source Button */}
        <Button
          block
          icon={<PlusOutlined />}
          onClick={handleAddSource}
        >
          Add Data Source
        </Button>

        {/* Progress Summary */}
        {configArray.length > 0 && (
          <>
            <Divider />
            <div>
              <Title level={5} style={{ color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
                Progress Summary
              </Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Total Sources:</Text>
                  <Text style={{ fontSize: '12px' }}>{configArray.length}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Configured:</Text>
                  <Text style={{ fontSize: '12px' }}>{configArray.filter(c => c.status === 'configured').length}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>In Progress:</Text>
                  <Text style={{ fontSize: '12px' }}>{configArray.filter(c => c.status === 'in_progress').length}</Text>
                </div>
              </Space>
            </div>
          </>
        )}
      </Space>
    </Card>
  );
}