import React, { useEffect } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_ID, // from Google Console (OAuth Web client)
  iosClientId: process.env.EXPO_PUBLIC_IOS_ID, // from Google Console (iOS OAuth client)
  offlineAccess: true,
});

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const userInfo = await GoogleSignin.signIn();

      // Get tokens
      const { idToken, accessToken } = await GoogleSignin.getTokens();

      if (idToken) {
        onSuccess?.({ idToken, accessToken, user: userInfo.user });
      } else {
        throw new Error("No idToken received from Google");
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled sign-in");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign-in already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services not available");
      } else {
        console.error("Google Sign-In error:", error);
        onError?.(error);
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={handleGoogleSignIn}
    />
  );
};

export default GoogleLoginButton;
