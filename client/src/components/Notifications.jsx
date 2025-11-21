import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Bell, CheckCircle2, RefreshCw, Camera, Megaphone } from "lucide-react";

export default function Notifications() {
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const { data } = await api.get("/notifications/unread-count");
      return data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.put("/notifications/all/read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const unreadNotifications = notifications?.filter((n) => !n.read) || [];
  const readNotifications = notifications?.filter((n) => n.read) || [];

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-white hover:text-yellow-300 transition-colors rounded-lg hover:bg-white/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount?.count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-blue-900">
            {unreadCount.count > 9 ? "9+" : unreadCount.count}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Notifications</h3>
              {unreadNotifications.length > 0 && (
                <button
                  onClick={() => markAllAsReadMutation.mutate()}
                  className="text-xs text-blue-700 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Mark all as read
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            ) : (
              <div>
                {unreadNotifications.length > 0 && (
                  <div className="p-2 bg-blue-50">
                    <p className="text-xs font-semibold text-blue-800 px-2">
                      New ({unreadNotifications.length})
                    </p>
                  </div>
                )}
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={() => markAsReadMutation.mutate(notification._id)}
                  />
                ))}
                {readNotifications.length > 0 && (
                  <div className="p-2 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-600 px-2">
                      Earlier
                    </p>
                  </div>
                )}
                {readNotifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkAsRead={() => markAsReadMutation.mutate(notification._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function NotificationItem({ notification, onMarkAsRead }) {
  const getIcon = (type) => {
    switch (type) {
      case "issue_resolved":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "issue_in_progress":
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      case "before_after_uploaded":
        return <Camera className="w-5 h-5 text-purple-600" />;
      default:
        return <Megaphone className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <Link
      to={notification.issue ? `/issue/${notification.issue._id}` : "#"}
      onClick={!notification.read ? onMarkAsRead : undefined}
      className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
        !notification.read ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm">
            {notification.title}
          </p>
          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        {!notification.read && (
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
        )}
      </div>
    </Link>
  );
}

