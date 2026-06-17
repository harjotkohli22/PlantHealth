// Main entry point for plant-health-lib
// Re-export all public APIs

export * from './components/index';
export * from './hooks/index';
export * from './services/index';
export * from './theme/index';
export * from './utils/index';
export * from './contexts/HistoryContext';

// UI exports - screens and navigator
export * from './screens/index';

// Convenience UI module with complete interface
export * as UI from './UI';

// You can also explicitly export types if needed
export type { } from './contexts/HistoryContext';
