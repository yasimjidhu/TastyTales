import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import store from './src/store/store';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Primary-Regular': require('./assets/fonts/Zain/Zain-Regular.ttf'),
    'Primary-Bold': require('./assets/fonts/Zain/Zain-Bold.ttf'),
    'Primary-ExtraBold': require('./assets/fonts/Zain/Zain-ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
