
import React from 'react';
import { Card, Typography, Checkbox, Radio, Space } from 'antd';
import { useWizard } from '@/contexts/WizardContext';
import type { StatusRecognition, TaxHandling } from '@/contexts/WizardContext';

const { Title, Text } = Typography;

const statusOptions = [
  { label: 'Success', value: 'success' as StatusRecognition },
  { label: 'Paid', value: 'paid' as StatusRecognition },
  { label: 'Refund', value: 'refund' as StatusRecognition },
  { label: 'Chargeback', value: 'chargeback' as StatusRecognition },
];

const taxOptions = [
  { label: "Don't Include", value: 'dont_include' as TaxHandling },
  { label: 'Include', value: 'include' as TaxHandling },
];

export function RevenueConfiguration() {
  const { state, updateRevenueConfig } = useWizard();
  const { revenueConfig } = state;

  const handleStatusChange = (checkedValues: StatusRecognition[]) => {
    updateRevenueConfig({ statusRecognition: checkedValues });
  };

  const handleTaxChange = (e: any) => {
    updateRevenueConfig({ taxHandling: e.target.value });
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <div>
        <Title level={2} style={{ color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
          Basic Revenue Configuration
        </Title>
        <Text type="secondary">
          Configure how you want to recognize revenue and handle tax calculations
        </Text>
      </div>

      <Card 
        title="How do you want to recognize your status?"
        style={{ border: '1px solid hsl(var(--border))' }}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
          Select which transaction statuses should be recognized as revenue
        </Text>
        
        <Checkbox.Group
          options={statusOptions}
          value={revenueConfig.statusRecognition}
          onChange={handleStatusChange}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px' 
          }}
        />
      </Card>

      <Card 
        title="Configure how you want to handle tax in MRR calculation"
        style={{ border: '1px solid hsl(var(--border))' }}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
          Choose whether to include or exclude tax in Monthly Recurring Revenue calculations
        </Text>
        
        <Radio.Group
          options={taxOptions}
          value={revenueConfig.taxHandling}
          onChange={handleTaxChange}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px' 
          }}
        />
      </Card>
    </Space>
  );
}
