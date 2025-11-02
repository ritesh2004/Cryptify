// src/hooks/usePushNotifications.js
import { useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (isMounted.current) {
          setExpoPushToken(token || "");
        }
      } catch (error) {
        console.warn('Error getting push token:', error);
        if (isMounted.current) {
          setExpoPushToken("");
        }
      }

      // Add notification listeners
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log("Notification received (hook):", notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log("Notification tapped:", response);
      });
    };

    setupNotifications();

    return () => {
      isMounted.current = false;
      
      // Safely remove listeners
      if (notificationListener.current) {
        try {
          Notifications.removeNotificationSubscription(notificationListener.current);
        } catch (e) {
          console.warn('Error removing notification listener:', e);
        }
      }
      
      if (responseListener.current) {
        try {
          Notifications.removeNotificationSubscription(responseListener.current);
        } catch (e) {
          console.warn('Error removing response listener:', e);
        }
      }
    };
  }, []);

  return expoPushToken;
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (!Device.isDevice) {
    console.warn("Must use physical device for push notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notification permission not granted");
    return;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    console.warn("Project ID not found");
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log("Expo Push Token:", token);
  return token;
}
