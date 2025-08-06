import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type DataSourceType = 'csv' | 'api' | 'stripe' | 'salesforce';

export type DataType = 'hierarchical' | 'invoice_payment' | 'plan_subscription';

export type SourceStatus = 'not_configured' | 'in_progress' | 'configured';

export interface DataSourceConfig {
  id: string;
  type: DataSourceType;
  status: SourceStatus;
  dataType?: DataType;
  config: {
    csv?: {
      uploadedFiles: Array<{ name: string; entityType: string; file: File }>;
      requiredEntities: string[];
    };
    api?: {
      baseUrl: string;
      authType: 'bearer' | 'api_key' | 'basic';
      credentials: Record<string, string>;
      endpoints: Record<string, string>;
    };
    stripe?: {
      secretKey: string;
      webhookEndpoint: string;
    };
    salesforce?: {
      instanceUrl: string;
      username: string;
      password: string;
      securityToken: string;
    };
  };
}

interface WizardState {
  currentStep: number;
  selectedSources: DataSourceType[];
  configurations: Record<string, DataSourceConfig>;
  activeSourceId?: string;
}

type WizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'TOGGLE_SOURCE'; payload: DataSourceType }
  | { type: 'SET_ACTIVE_SOURCE'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: { sourceId: string; config: Partial<DataSourceConfig> } }
  | { type: 'REMOVE_SOURCE'; payload: string }
  | { type: 'LOAD_STATE'; payload: WizardState };

const initialState: WizardState = {
  currentStep: 1,
  selectedSources: [],
  configurations: {},
  activeSourceId: undefined,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'TOGGLE_SOURCE': {
      const sourceType = action.payload;
      const isSelected = state.selectedSources.includes(sourceType);
      
      if (isSelected) {
        // Remove source
        const newSelectedSources = state.selectedSources.filter(s => s !== sourceType);
        const newConfigurations = { ...state.configurations };
        const sourceId = Object.keys(newConfigurations).find(id => 
          newConfigurations[id].type === sourceType
        );
        if (sourceId) {
          delete newConfigurations[sourceId];
        }
        
        return {
          ...state,
          selectedSources: newSelectedSources,
          configurations: newConfigurations,
          activeSourceId: state.activeSourceId === sourceId ? undefined : state.activeSourceId,
        };
      } else {
        // Add source
        const sourceId = `${sourceType}-${Date.now()}`;
        const newConfig: DataSourceConfig = {
          id: sourceId,
          type: sourceType,
          status: 'not_configured',
          config: {},
        };
        
        return {
          ...state,
          selectedSources: [...state.selectedSources, sourceType],
          configurations: {
            ...state.configurations,
            [sourceId]: newConfig,
          },
          activeSourceId: sourceId,
        };
      }
    }
    
    case 'SET_ACTIVE_SOURCE':
      return { ...state, activeSourceId: action.payload };
    
    case 'UPDATE_CONFIG': {
      const { sourceId, config } = action.payload;
      const existingConfig = state.configurations[sourceId];
      
      return {
        ...state,
        configurations: {
          ...state.configurations,
          [sourceId]: {
            ...existingConfig,
            ...config,
          },
        },
      };
    }
    
    case 'REMOVE_SOURCE': {
      const sourceId = action.payload;
      const config = state.configurations[sourceId];
      const newConfigurations = { ...state.configurations };
      delete newConfigurations[sourceId];
      
      return {
        ...state,
        selectedSources: state.selectedSources.filter(s => s !== config.type),
        configurations: newConfigurations,
        activeSourceId: state.activeSourceId === sourceId ? undefined : state.activeSourceId,
      };
    }
    
    case 'LOAD_STATE':
      return action.payload;
    
    default:
      return state;
  }
}

interface WizardContextType {
  state: WizardState;
  setStep: (step: number) => void;
  toggleSource: (source: DataSourceType) => void;
  setActiveSource: (sourceId: string) => void;
  updateConfig: (sourceId: string, config: Partial<DataSourceConfig>) => void;
  removeSource: (sourceId: string) => void;
  getSourceConfig: (sourceId: string) => DataSourceConfig | undefined;
  getSourcesByType: (type: DataSourceType) => DataSourceConfig[];
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('revenue-wizard-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.warn('Failed to load wizard state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('revenue-wizard-state', JSON.stringify(state));
  }, [state]);

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const toggleSource = (source: DataSourceType) => {
    dispatch({ type: 'TOGGLE_SOURCE', payload: source });
  };

  const setActiveSource = (sourceId: string) => {
    dispatch({ type: 'SET_ACTIVE_SOURCE', payload: sourceId });
  };

  const updateConfig = (sourceId: string, config: Partial<DataSourceConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: { sourceId, config } });
  };

  const removeSource = (sourceId: string) => {
    dispatch({ type: 'REMOVE_SOURCE', payload: sourceId });
  };

  const getSourceConfig = (sourceId: string) => {
    return state.configurations[sourceId];
  };

  const getSourcesByType = (type: DataSourceType) => {
    return Object.values(state.configurations).filter(config => config.type === type);
  };

  const value: WizardContextType = {
    state,
    setStep,
    toggleSource,
    setActiveSource,
    updateConfig,
    removeSource,
    getSourceConfig,
    getSourcesByType,
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}