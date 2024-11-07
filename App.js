// App.js

import React from 'react';
import AppNavigator from './app/AppNavigator';
import { AuthProvider } from './app/AuthProvider'; // Adjust the path if necessary
import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Merriweather_400Regular, Merriweather_700Bold } from '@expo-google-fonts/merriweather';

export default function App() {
  // Load fonts using useFonts hook
  const [fontsLoaded] = useFonts({
    Merriweather_400Regular,
    Merriweather_700Bold,
  });

  // Show a loading indicator or SplashScreen until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff9800" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
