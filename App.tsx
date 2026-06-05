import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { HistoryProvider } from './src/contexts/HistoryContext';
import { classifier } from './src/services/classifier';
import { colors } from './src/theme';

export default function App() {
  // Warm up the model on launch so the first scan is instant.
  useEffect(() => {
    classifier.load().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <HistoryProvider>
          <RootNavigator />
        </HistoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
