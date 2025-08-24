import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard"; // for copying to clipboard
import { Alert } from "react-native";

export const KitchenHeader = ({ kitchen, handleAddKitchen }) => {
  const handleCopyInvite = () => {
    const inviteLink = `https://yourapp.com/join/${kitchen._id}`;
    Clipboard.setStringAsync(inviteLink);
    Alert.alert("Copied!", "Invite link copied to clipboard.");
  };

  return (
    <View style={styles.header}>    
      <Text style={styles.headerTitle}>{kitchen?.name}</Text>

      {kitchen ? (
        // Show copy invite button if kitchen exists
        <TouchableOpacity onPress={handleCopyInvite} style={styles.addButton}>
          <Ionicons name="copy-outline" size={26} color="#3B82F6" />
        </TouchableOpacity>
      ) : (
        // Otherwise show add button to create kitchen
        <TouchableOpacity onPress={handleAddKitchen} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={28} color="#3B82F6" />
        </TouchableOpacity>
      )}
    </View>
  );
};