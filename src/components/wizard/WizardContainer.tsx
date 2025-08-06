
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
    <Row gutter={32}>
      {/* Sidebar */}
      <Col span={8}>
        <WizardSidebar />
      </Col>

      {/* Main Content */}
      <Col span={16}>
        <Card style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
          {/* Step Indicator */}
          <Steps
            current={currentStep - 1}
            items={steps}
            style={{ marginBottom: '32px' }}
          />

          {/* Step Content */}
          {currentStep === 1 && <DataSourceSelection />}
          {currentStep === 2 && <DataSourceConfiguration />}
          {currentStep === 3 && <RevenueConfiguration />}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <Space>
              {currentStep === 1 && (
                <Button
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
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
                >
                  Continue to Revenue Config
                </Button>
              )}
              
              {currentStep === 3 && (
                <Button 
                  type="primary"
                  onClick={() => console.log('Complete setup')}
                >
                  Complete Setup
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
