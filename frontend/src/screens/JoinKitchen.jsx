// screens/JoinKitchenScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { joinKitchen } from "../store/slices/kitchen";

const JoinKitchenScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [inviteCode, setInviteCode] = useState("");

  const { _id: kitchenId } = useSelector((state) => state.kitchen?.kitchen);

  // Auto-fill if opened via deep link
  useEffect(() => {
    if (route.params?.inviteCode) {
      setInviteCode(route.params.inviteCode);
    }
  }, [route.params]);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Error", "Please enter a valid Kitchen UUID.");
      return;
    }

    try {
      await dispatch(joinKitchen({ kitchenId, inviteCode })).unwrap();
      Alert.alert("Success", "You have joined the kitchen!");
      navigation.replace("KitchenHome");
    } catch (err) {
      Alert.alert("Failed", err.message || "Could not join kitchen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Kitchen</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Kitchen UUID"
        value={inviteCode}
        onChangeText={setInviteCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoin}>
        <Text style={styles.buttonText}>
          {route.params?.inviteCode ? "Join from Invite" : "Join Kitchen"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default JoinKitchenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
