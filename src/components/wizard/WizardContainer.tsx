
import React from 'react';
import { Row, Col, Card, Steps, Button, Space } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useWizard } from '@/contexts/WizardContext';
import { DataSourceSelection } from './steps/DataSourceSelection';
import { DataSourceConfiguration } from './steps/DataSourceConfiguration';
import { RevenueConfiguration } from './steps/RevenueConfiguration';
import { WizardSidebar } from './WizardSidebar';

export function WizardContainer() {
  const { state, setStep } = useWizard();
  const { currentStep, selectedSources, configurations } = state;

  const canProceedToStep2 = selectedSources.length > 0;
  const canProceedToStep3 = Object.values(configurations).some(config => config.status === 'configured');
  const isLastStep = currentStep === 3;

  const steps = [
    {
      title: 'Select Sources',
      description: 'Choose data sources'
    },
    {
      title: 'Configure',
      description: 'Set up connections'
    },
    {
      title: 'Revenue Config',
      description: 'Basic revenue settings'
    }
  ];

  return (
    <Row gutter={[32, 24]}>
      {/* Sidebar */}
      <Col span={8}>
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <WizardSidebar />
        </div>
      </Col>

      {/* Main Content */}
      <Col span={16}>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Card 
            style={{ 
              background: 'var(--gradient-card)',
              border: '1px solid hsl(var(--border))',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
            }}
            bodyStyle={{ padding: '32px' }}
          >
            {/* Step Indicator */}
            <div style={{ 
              background: 'linear-gradient(90deg, hsl(var(--primary) / 0.1), hsl(var(--primary-glow) / 0.1))',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
            }}>
              <Steps
                current={currentStep - 1}
                items={steps}
                style={{ marginBottom: '0' }}
              />
            </div>

            {/* Step Content */}
            <div style={{ minHeight: '400px', marginBottom: '32px' }}>
              {currentStep === 1 && <DataSourceSelection />}
              {currentStep === 2 && <DataSourceConfiguration />}
              {currentStep === 3 && <RevenueConfiguration />}
            </div>

            {/* Navigation */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '20px 0',
              borderTop: '1px solid hsl(var(--border))',
              marginTop: '32px',
            }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => setStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                size="large"
                style={{ 
                  height: '44px',
                  borderRadius: '8px',
                  fontWeight: '500',
                }}
              >
                Previous
              </Button>

              <Space size="large">
                {currentStep === 1 && (
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    iconPosition="end"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    size="large"
                    style={{ 
                      height: '44px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      background: 'var(--gradient-primary)',
                      border: 'none',
                      boxShadow: 'var(--shadow-glow)',
                    }}
                  >
                    Continue to Configuration
                  </Button>
                )}
                
                {currentStep === 2 && (
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    iconPosition="end"
                    onClick={() => setStep(3)}
                    disabled={!canProceedToStep3}
                    size="large"
                    style={{ 
                      height: '44px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      background: 'var(--gradient-primary)',
                      border: 'none',
                      boxShadow: 'var(--shadow-glow)',
                    }}
                  >
                    Continue to Revenue Config
                  </Button>
                )}
                
                {currentStep === 3 && (
                  <Button 
                    type="primary"
                    onClick={() => console.log('Complete setup')}
                    size="large"
                    style={{ 
                      height: '44px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      background: 'var(--gradient-primary)',
                      border: 'none',
                      boxShadow: 'var(--shadow-glow)',
                    }}
                  >
                    Complete Setup
                  </Button>
                )}
              </Space>
            </div>
          </Card>
        </div>
      </Col>
    </Row>
  );
}
