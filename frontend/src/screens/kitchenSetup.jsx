import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createKitchen } from "../store/slices/kitchen";
import CustomAlert from "../components/Alert";
import { useNavigation } from "@react-navigation/native";

const KitchenSetupScreen = () => {
  const [name, setName] = useState("");
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    type: "",
    message: "",
    onConfirm: null,
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { loading, error, kitchen } = useSelector((state) => state.kitchen);

  const handleCreate = async () => {
    if (name.trim()) {
      try {
        await dispatch(createKitchen({ name })).unwrap(); // ✅ wait for success

        setAlertConfig({
          visible: true,
          title: "Kitchen Created",
          type: "success",
          message: "Kitchen created successfully!",
          onConfirm: () => {
            setAlertConfig((prev) => ({ ...prev, visible: false }));
            navigation.replace("KitchenHome"); // ✅ Navigate after confirm
          },
        });
      } catch (err) {
        setAlertConfig({
          visible: true,
          title: "Error",
          type: "error",
          message:
            typeof err === "string"
              ? err
              : err.message || "Failed to create kitchen",
          onConfirm: () =>
            setAlertConfig((prev) => ({ ...prev, visible: false })),
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Kitchen Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="My Hostel Kitchen"
      />
      <Button title="Create Kitchen" onPress={handleCreate} />
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        type={alertConfig.type}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 8 },
});

export default KitchenSetupScreen;
