import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

export async function registerForPushNotificationsAsync() {
    let token;
    console.log('registerfor push notification called')

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        console.log('final status', finalStatus)
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }

        if (finalStatus !== "granted") {
            alert("failed to get push token")
            return null
        }
        console.log('about to get token')
        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log('notification push token got :', token);
            return token;
        } catch (err) {
            console.error('❌ Error while getting push token:', err);
            return null;
        }
        console.log('notification push token got :', token)
        return token
    } else {
        alert("Must use physical device for Push Notifications")
        return null
    }
}