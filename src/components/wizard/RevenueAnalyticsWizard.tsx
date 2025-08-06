import React from 'react';
import { Typography, Layout } from 'antd';
import { WizardProvider } from '@/contexts/WizardContext';
import { WizardContainer } from './WizardContainer';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export function RevenueAnalyticsWizard() {
  return (
    <WizardProvider>
      <Layout style={{ minHeight: '100vh', background: 'hsl(var(--background))' }}>
        <Content style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={1} style={{ color: 'hsl(var(--foreground))', marginBottom: '8px' }}>
              Revenue Analytics Setup
            </Title>
            <Paragraph style={{ color: 'hsl(var(--muted-foreground))' }}>
              Configure your data sources to start analyzing revenue patterns
            </Paragraph>
          </div>
          <WizardContainer />
        </Content>
      </Layout>
    </WizardProvider>
  );
}