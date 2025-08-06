import React, { useState } from 'react';
import { Card, Radio, Badge, Collapse, Space, Typography, Row, Col } from 'antd';
import { DatabaseOutlined, GlobalOutlined, CreditCardOutlined, BuildOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useWizard, type DataSourceType, type DataType } from '@/contexts/WizardContext';

const { Text, Title } = Typography;
const { Panel } = Collapse;

const dataSourceOptions = [
  {
    type: 'csv' as DataSourceType,
    title: 'Manual CSV Upload',
    description: 'Upload CSV files for your revenue data entities',
    icon: DatabaseOutlined,
    features: ['Upload multiple files', 'Entity mapping', 'Data validation'],
    requiresDataType: true,
  },
  {
    type: 'api' as DataSourceType,
    title: 'API Integration',
    description: 'Connect to your existing API endpoints',
    icon: GlobalOutlined,
    features: ['REST API support', 'Authentication methods', 'Real-time sync'],
    requiresDataType: true,
  },
  {
    type: 'stripe' as DataSourceType,
    title: 'Stripe Integration',
    description: 'Import data directly from your Stripe account',
    icon: CreditCardOutlined,
    features: ['Payment data', 'Subscription metrics', 'Customer insights'],
    requiresDataType: false,
  },
  {
    type: 'salesforce' as DataSourceType,
    title: 'Salesforce Integration',
    description: 'Connect to your Salesforce CRM data',
    icon: BuildOutlined,
    features: ['Lead tracking', 'Opportunity data', 'Account management'],
    requiresDataType: false,
  },
];

const dataTypeOptions = [
  {
    value: 'invoice_payment' as DataType,
    label: 'Payments',
    description: 'Invoice and payment data',
    entities: ['invoices', 'payments'],
    requiredEntities: ['payments'],
    optionalEntities: ['invoices'],
  },
  {
    value: 'hierarchical' as DataType,
    label: 'Complete Revenue Data',
    description: 'Complete entity relationships (customers, invoices, payments, plans, subscriptions) - Coming Soon',
    entities: ['customers', 'invoices', 'payments', 'plans', 'subscriptions'],
    disabled: true,
  },
  {
    value: 'plan_subscription' as DataType,
    label: 'Plan + Subscription',
    description: 'Subscription plans and customer subscriptions - Coming Soon',
    entities: ['plans', 'subscriptions'],
    disabled: true,
  },
];

export function DataSourceSelection() {
  const { state, toggleSource, updateConfig } = useWizard();
  const { selectedSources, configurations } = state;
  
  const [selectedDataType, setSelectedDataType] = useState<DataType | undefined>();

  const requiresDataTypeSelection = selectedSources.some(source => 
    source === 'csv' || source === 'api'
  );

  const handleSourceClick = (sourceType: DataSourceType) => {
    toggleSource(sourceType);
  };

  const handleDataTypeChange = (dataType: DataType) => {
    setSelectedDataType(dataType);
    
    // Update all CSV and API configurations with the selected data type
    Object.values(configurations).forEach(config => {
      if (config.type === 'csv' || config.type === 'api') {
        updateConfig(config.id, {
          dataType: dataType,
          status: 'in_progress',
        });
      }
    });
  };


  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Collapse defaultActiveKey={['data-sources']} size="large">
        <Panel 
          header={<Title level={3} style={{ margin: 0 }}>1. Select data sources</Title>} 
          key="data-sources"
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Text type="secondary">
              Select one or more data sources to connect to your revenue analytics dashboard.
              You can configure each source individually in the next step.
            </Text>

            <Row gutter={[16, 16]}>
              {dataSourceOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedSources.includes(option.type);

                return (
                  <Col span={12} key={option.type}>
                    <Card
                      hoverable
                      style={{
                        cursor: 'pointer',
                        border: isSelected ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                        background: isSelected ? 'hsl(var(--primary) / 0.05)' : 'transparent'
                      }}
                      onClick={() => handleSourceClick(option.type)}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <Space>
                          <div style={{ 
                            padding: '8px', 
                            borderRadius: '8px', 
                            background: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                            color: isSelected ? 'hsl(var(--primary-foreground))' : 'inherit'
                          }}>
                            <Icon style={{ fontSize: '20px' }} />
                          </div>
                          <Title level={5} style={{ margin: 0, color: 'hsl(var(--foreground))' }}>
                            {option.title}
                          </Title>
                        </Space>
                        {isSelected && (
                          <div style={{ 
                            padding: '4px', 
                            borderRadius: '50%', 
                            background: 'hsl(var(--primary))', 
                            color: 'hsl(var(--primary-foreground))' 
                          }}>
                            <CheckCircleOutlined style={{ fontSize: '12px' }} />
                          </div>
                        )}
                      </div>
                      
                      <Text type="secondary" style={{ fontSize: '14px', marginBottom: '16px', display: 'block' }}>
                        {option.description}
                      </Text>
                      
                      <Space direction="vertical" size="small">
                        {option.features.map((feature, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '4px', 
                              height: '4px', 
                              borderRadius: '50%', 
                              background: 'hsl(var(--primary))' 
                            }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>{feature}</Text>
                          </div>
                        ))}
                      </Space>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {selectedSources.length > 0 && (
              <div style={{ 
                padding: '16px', 
                background: 'hsl(var(--muted) / 0.5)', 
                borderRadius: '8px' 
              }}>
                <Title level={5} style={{ color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
                  Selected Sources ({selectedSources.length})
                </Title>
                <Space wrap>
                  {selectedSources.map((sourceType) => {
                    const option = dataSourceOptions.find(opt => opt.type === sourceType);
                    const Icon = option?.icon;
                    return (
                      <div
                        key={sourceType}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '4px 12px',
                          background: 'hsl(var(--background))',
                          borderRadius: '6px',
                          border: '1px solid hsl(var(--border))',
                          fontSize: '14px'
                        }}
                      >
                        {Icon && <Icon style={{ fontSize: '12px' }} />}
                        {option?.title}
                      </div>
                    );
                  })}
                </Space>
              </div>
            )}
          </Space>
        </Panel>

        {/* Data Type Selection - Required for CSV and API */}
        {requiresDataTypeSelection && (
          <Panel 
            header={<Title level={3} style={{ margin: 0 }}>2. Select Your Data Model</Title>} 
            key="data-type"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Space style={{ marginBottom: '8px' }}>
                  <Badge color="red" text="Required" />
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    for Manual CSV Upload and API Integration
                  </Text>
                </Space>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Different calculation mechanisms will be considered based on the data type you select. 
                  This determines which entities and relationships will be configured for your data sources.
                </Text>
              </div>
              
              <Radio.Group 
                value={selectedDataType} 
                onChange={(e) => handleDataTypeChange(e.target.value as DataType)}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {dataTypeOptions.map((option) => (
                    <div key={option.value} style={{ opacity: option.disabled ? 0.5 : 1 }}>
                      <Radio 
                        value={option.value} 
                        disabled={option.disabled}
                        style={{ alignItems: 'flex-start' }}
                      >
                        <Space direction="vertical" size="small" style={{ marginLeft: '8px' }}>
                          <Text strong style={{ cursor: option.disabled ? 'not-allowed' : 'pointer' }}>
                            {option.label}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '14px' }}>
                            {option.description}
                          </Text>
                          <Space wrap>
                            {option.entities.map((entity) => (
                              <Badge key={entity} color="default" text={entity} />
                            ))}
                          </Space>
                        </Space>
                      </Radio>
                    </div>
                  ))}
                </Space>
              </Radio.Group>
            </Space>
          </Panel>
        )}
      </Collapse>
    </Space>
  );
}