import React from 'react';
import { Typography, Layout } from 'antd';
import { WizardProvider } from '@/contexts/WizardContext';
import { WizardContainer } from './WizardContainer';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export function RevenueAnalyticsWizard() {
  return (
    <WizardProvider>
      <Layout style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, hsl(var(--background)), hsl(240, 10%, 96%))'
      }}>
        <Content style={{ 
          padding: '40px 32px 32px', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '40px',
            padding: '20px',
            borderRadius: '16px',
            background: 'var(--gradient-card)',
            boxShadow: 'var(--shadow-md)',
          }} className="animate-fade-in">
            <Title 
              level={1} 
              style={{ 
                color: 'hsl(var(--foreground))', 
                marginBottom: '12px',
                fontSize: '2.5rem',
                fontWeight: '700',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Revenue Analytics Setup
            </Title>
            <Paragraph style={{ 
              color: 'hsl(var(--muted-foreground))',
              fontSize: '16px',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}>
              Configure your data sources to start analyzing revenue patterns and unlock powerful insights
            </Paragraph>
          </div>
          <div className="animate-slide-up">
            <WizardContainer />
          </div>
        </Content>
      </Layout>
    </WizardProvider>
  );
}