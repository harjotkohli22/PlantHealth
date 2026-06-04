import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, font } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ResultScreen from '../screens/ResultScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.bg, text: colors.text },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800', fontSize: font.h3 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ headerTransparent: true, headerTitle: '', headerTintColor: '#fff' }}
        />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Diagnosis' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Scan History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
