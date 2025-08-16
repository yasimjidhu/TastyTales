import { registerRootComponent } from 'expo';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import Constants from "expo-constants";

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
GoogleSignin.configure({
  webClientId: Constants.expoConfig.extra.GOOGLE_WEB_CLIENT_ID,
  scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: false,
  iosClientId: Constants.expoConfig.extra.GOOGLE_IOS_CLIENT_ID,
});
registerRootComponent(App);

