import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, googleLogin } from "../store/slices/user";
import GoogleLoginButton from "../hooks/useGoogleAuth";

export default function Login({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const { signInWithGoogle } = useGoogleAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      console.log("Login successful");
    } else {
      alert(resultAction.payload || "Login failed, please try again");
    }
  };

  const handleGoogleLogin = async ({ idToken, user }) => {
    try {
      if (!idToken) {
        alert("Google Sign-In failed");
        return;
      }
      const resultAction = await dispatch(googleLogin(idToken));
      if (googleLogin.fulfilled.match(resultAction)) {
        console.log("Google Login successful:", user?.name);
      } else {
        alert(resultAction.payload || "Google Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Google Sign-In failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          style={styles.icon}
          source={require("../../assets/images/breakFast.png")}
        />
      </View>
      <Text style={styles.heading}>Let's Sign in</Text>
      <Text style={styles.description}>
        Experience all the recipes from all over the world
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Text>{showPassword ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <GoogleLoginButton
          onSuccess={handleGoogleLogin}
          onError={(err) => alert("Google login failed: " + err.message)}
        />

        <Text style={styles.signupText}>
          Don't have an account?{" "}
          <Text
            style={styles.toSignup}
            onPress={() => navigation.navigate("Signup")}
          >
            Signup
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    textAlign: "center",
    fontFamily: "Primary-Bold",
    fontSize: 30,
    marginTop: 10,
  },
  iconContainer: { height: 80, width: 80 },
  icon: { width: "100%", height: "100%", borderRadius: 15 },
  description: { fontFamily: "Primary-Regular", fontSize: 16 },
  inputContainer: { width: "100%", padding: 20 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 0.8,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "teal",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "white", fontSize: 20, fontFamily: "Primary-ExtraBold" },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
  },
  googleIcon: { width: 24, height: 24, marginRight: 10 },
  googleText: { fontSize: 16, fontFamily: "Primary-Bold" },
  signupText: { marginTop: 20, textAlign: "center", fontSize: 14 },
  toSignup: { color: "blue", fontFamily: "Primary-Bold", fontSize: 18 },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  passwordInput: { flex: 1 },
  eyeButton: { padding: 10 },
});
