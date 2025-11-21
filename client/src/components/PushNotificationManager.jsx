import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "./Toast";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState("default");
  const { success, error, warning } = useToast();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkPermission();
      checkSubscription();
    }
  }, []);

  const checkPermission = async () => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  };

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      warning("Push notifications are not supported in your browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === "granted") {
        success("Push notification permission granted!");
        await subscribeToPush();
      } else if (permission === "denied") {
        error("Push notification permission denied. Please enable it in browser settings.");
      }
    } catch (err) {
      console.error("Error requesting permission:", err);
      error("Failed to request push notification permission.");
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from server
      const response = await fetch("/api/notifications/vapid-public-key");
      const { publicKey } = await response.json();
      
      if (!publicKey || publicKey === "BHrFpK3vXZJ7xYz2...") {
        warning("Push notifications require VAPID key configuration on server.");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey || "test-key"),
      });

      // Send subscription to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setIsSubscribed(true);
      success("Push notifications enabled!");
    } catch (err) {
      console.error("Error subscribing to push:", err);
      error("Failed to enable push notifications.");
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await fetch("/api/notifications/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });

        setIsSubscribed(false);
        success("Push notifications disabled.");
      }
    } catch (err) {
      console.error("Error unsubscribing from push:", err);
      error("Failed to disable push notifications.");
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <Bell className="w-5 h-5 text-green-600" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-400" />
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Push Notifications</h3>
            <p className="text-xs text-gray-600">
              {isSubscribed
                ? "Enabled - Get real-time updates"
                : permission === "denied"
                ? "Permission denied - Enable in browser settings"
                : "Get real-time updates on your device"}
            </p>
          </div>
        </div>
        {!isSubscribed && permission !== "granted" ? (
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-[#003865] text-white rounded hover:bg-[#004d8c] transition-colors text-sm font-semibold"
          >
            Enable
          </button>
        ) : isSubscribed ? (
          <button
            onClick={unsubscribeFromPush}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-semibold"
          >
            Disable
          </button>
        ) : null}
      </div>
    </div>
  );
}

