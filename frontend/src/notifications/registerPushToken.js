import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

export async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }

        if (finalStatus !== "granted") {
            alert("failed to get push token")
            return null
        }
        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
            return token;
        } catch (err) {
            console.error('❌ Error while getting push token:', err);
            return null;
        }
        return token
    } else {
        alert("Must use physical device for Push Notifications")
        return null
    }
}