import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createKitchen } from "../store/slices/kitchen";

const CreateKitchenScreen = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { loading, kitchens } = useSelector((state) => state.kitchen);

  const handleCreate = () => {
    if (name.trim()) dispatch(createKitchen(name));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Kitchen</Text>
      <TextInput
        placeholder="Enter kitchen name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Button title="Create" onPress={handleCreate} disabled={loading} />

      {kitchens.length > 0 && (
        <View style={styles.inviteBox}>
          <Text style={styles.inviteTitle}>Your Kitchens:</Text>
          {kitchens.map((k) => (
            <Text key={k._id}>
              {k.name} - Invite Link: https://myapp.com/join/{k.inviteCode}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
  inviteBox: { marginTop: 20 },
  inviteTitle: { fontSize: 18, fontWeight: "600" },
});

export default CreateKitchenScreen;
