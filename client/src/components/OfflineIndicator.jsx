import { useState, useEffect } from "react";
import { Wifi, WifiOff, Cloud, CloudOff } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check for unsynced issues
    const checkUnsynced = () => {
      try {
        const offlineIssues = JSON.parse(localStorage.getItem("offline_issues") || "[]");
        const unsynced = offlineIssues.filter((issue) => !issue.synced);
        setUnsyncedCount(unsynced.length);
      } catch (error) {
        console.error("Error checking unsynced issues:", error);
      }
    };

    checkUnsynced();
    const interval = setInterval(checkUnsynced, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && unsyncedCount === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg border-2 flex items-center gap-2 ${
        isOnline
          ? "bg-green-50 border-green-300 text-green-800"
          : "bg-orange-50 border-orange-300 text-orange-800"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-5 h-5" />
          {unsyncedCount > 0 ? (
            <span className="text-sm font-semibold">
              Syncing {unsyncedCount} offline issue{unsyncedCount > 1 ? "s" : ""}...
            </span>
          ) : (
            <span className="text-sm font-semibold">Online</span>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5" />
          <span className="text-sm font-semibold">Offline Mode</span>
          {unsyncedCount > 0 && (
            <span className="text-xs bg-orange-200 px-2 py-0.5 rounded">
              {unsyncedCount} pending
            </span>
          )}
        </>
      )}
    </div>
  );
}

