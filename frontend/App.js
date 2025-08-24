import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './src/store/store';
import * as Linking from 'expo-linking';
import useNotificationListener from './src/notifications/useNotificationListener';
import { registerForPushNotificationsAsync } from './src/notifications/registerPushToken';
import { updateExpoToken } from './src/store/slices/notification';

const NotificationRegistrar = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)

  useNotificationListener()

  useEffect(() => {
    const register = async () => {
      if (!user) return;

      const token = await registerForPushNotificationsAsync()
      console.log('token got while registering', token)
      if (token) {
        dispatch(updateExpoToken(token))
      }
    }
    register()
  }, [user])

  return null
}

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'myapp://'], // myapp://invite/kitchenId
  config: {
    screens: {
      JoinKitchen: 'invite/:inviteCode',
      Home: 'home',
    },
  },
};

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
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <NotificationRegistrar />
            <NavigationContainer linking={linking} key={Math.random()}>
              <AppNavigator />
            </NavigationContainer>
            <StatusBar style="auto" />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
