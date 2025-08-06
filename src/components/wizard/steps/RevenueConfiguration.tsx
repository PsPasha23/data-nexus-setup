
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
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Title 
          level={2} 
          style={{ 
            color: 'hsl(var(--foreground))', 
            marginBottom: '12px',
            fontSize: '1.75rem',
            fontWeight: '600',
          }}
        >
          Revenue Configuration
        </Title>
        <Text 
          type="secondary" 
          style={{ 
            fontSize: '16px',
            lineHeight: '1.6',
          }}
        >
          Configure how you want to recognize revenue and handle tax calculations
        </Text>
      </div>

      <Card 
        title={
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            color: 'hsl(var(--foreground))',
          }}>
            Revenue Status Recognition
          </span>
        }
        style={{ 
          border: '1px solid hsl(var(--border))',
          borderRadius: '12px',
          background: 'var(--gradient-card)',
          boxShadow: 'var(--shadow-elegant)',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Text 
          type="secondary" 
          style={{ 
            display: 'block', 
            marginBottom: '20px',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          Select which transaction statuses should be recognized as revenue
        </Text>
        
        <Checkbox.Group
          options={statusOptions}
          value={revenueConfig.statusRecognition}
          onChange={handleStatusChange}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '14px' 
          }}
        />
      </Card>

      <Card 
        title={
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            color: 'hsl(var(--foreground))',
          }}>
            Tax Handling in MRR Calculation
          </span>
        }
        style={{ 
          border: '1px solid hsl(var(--border))',
          borderRadius: '12px',
          background: 'var(--gradient-card)',
          boxShadow: 'var(--shadow-elegant)',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Text 
          type="secondary" 
          style={{ 
            display: 'block', 
            marginBottom: '20px',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          Choose whether to include or exclude tax in Monthly Recurring Revenue calculations
        </Text>
        
        <Radio.Group
          options={taxOptions}
          value={revenueConfig.taxHandling}
          onChange={handleTaxChange}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '14px' 
          }}
        />
      </Card>
    </Space>
  );
}
