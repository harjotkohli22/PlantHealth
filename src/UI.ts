// UI exports - complete screens and navigator
export { HomeScreen, ScanScreen, ResultScreen, HistoryScreen, RootNavigator } from './screens';

// Re-export provider for convenience
export { HistoryProvider } from './contexts/HistoryContext';

// Re-export utilities needed by the screens
export { classifier } from './services/classifier';
export { getDiseaseInfo } from './services/diseaseData';
export { useFrameClassifier } from './hooks/useFrameClassifier';
export { useHistory } from './hooks/useHistory';