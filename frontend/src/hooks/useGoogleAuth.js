import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useEffect, useState } from "react";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleAuth() {
  const [authResult, setAuthResult] = useState(null);

  const ANDROID_CLIENT_ID = Constants.expoConfig.extra.GOOGLE_ANDROID_CLIENT_ID;
  const WEB_CLIENT_ID = Constants.expoConfig.extra.GOOGLE_WEB_CLIENT_ID;
  const IOS_CLIENT_ID = Constants.expoConfig.extra.GOOGLE_IOS_CLIENT_ID;

  // Fix the redirect URI to match what's in Google Console
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // must be true in Expo Go
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
    redirectUri,
    // Additional configuration for better compatibility
    responseType: AuthSession.ResponseType.IdToken,
    additionalParameters: {},
    extraParams: {},
  });

  console.log('redirectUri:', redirectUri);

  useEffect(() => {
    const fetchUserInfo = async (accessToken) => {
      try {
        const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = await res.json();
        setAuthResult((prev) => ({ ...prev, user }));
      } catch (err) {
        console.error("Failed to fetch Google user info:", err);
      }
    };

    if (response?.type === "success") {
      console.log("Google auth success:", response);
      const { authentication } = response;
      setAuthResult({
        idToken: authentication.idToken,
        accessToken: authentication.accessToken,
      });
      if (authentication.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    } else if (response?.type === "error") {
      console.error("Google auth error:", response.error);
    }
  }, [response]);

  const signInWithGoogle = async () => {
    try {
      if (!request) {
        console.error("Google auth request not ready");
        throw new Error("Google auth request not ready");
      }

      console.log("Starting Google sign-in...");
      const result = await promptAsync();

      console.log("Google auth result:", result);

      if (result.type === "success") {
        return {
          idToken: result.authentication?.idToken,
          accessToken: result.authentication?.accessToken,
          user: authResult?.user,
        };
      } else {
        throw new Error(`Google sign-in failed: ${result.type}`);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signOut = () => {
    setAuthResult(null);
  };

  return { ...authResult, signInWithGoogle, signOut, request };
}