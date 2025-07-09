import { useEffect, useRef } from "react";
import * as Notifications from 'expo-notifications'

export default function useNotificationListener() {
    const notificationListener = useRef()
    const responseListener = useRef()

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false
            })
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('📬 Notification received:", notification')
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("👆 Notification tapped:", response);
        })

        return ()=>{
            Notifications.removeNotificationSubscription(notificationListener.current)
            Notifications.removeNotificationSubscription(responseListener.current)
        }
    },[])
}