import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchNotifications, markAllNotificationsRead } from "../store/slices/notification";

const NotificationScreen = ({ navigation }) => {
  const { notifications, loading } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotifications()).then(()=>{
      dispatch(markAllNotificationsRead())
    })
  }, [dispatch]);

  const renderItem = ({ item }) => {
    let actionText = "";
    if (item.type === "follow") actionText = "started following you";
    if (item.type === "like") actionText = "liked your recipe";
    if (item.type === "comment") actionText = "commented on your recipe";

    return (
      <TouchableOpacity style={styles.notificationItem} activeOpacity={0.7}>
        <Image
          source={{
            uri: item.senderImage || "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            <Text style={styles.bold}>{item.senderName || "Someone"}</Text>{" "}
            {actionText}
          </Text>
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="teal" />
      ) : notifications?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={50} color="gray" />
          <Text style={{ color: "gray", marginTop: 10 }}>
            No notifications yet  
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications || []}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 15,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "teal",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});