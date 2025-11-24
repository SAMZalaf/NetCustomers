import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainTabNavigator from '@/navigation/MainTabNavigator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { SyncProvider } from '@/contexts/SyncContext';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <LanguageProvider>
              <ThemeProvider>
                <CustomerProvider>
                  <SyncProvider>
                    <NavigationContainer>
                      <MainTabNavigator />
                    </NavigationContainer>
                    <StatusBar style="auto" />
                  </SyncProvider>
                </CustomerProvider>
              </ThemeProvider>
            </LanguageProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
