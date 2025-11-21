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
        className="relative p-2 text-white hover:text-blue-200 transition-colors rounded-lg hover:bg-white/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount?.count > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#DC143C] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#003865]">
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
          <div className="absolute right-0 mt-2 w-96 bg-white rounded border-2 border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
            {/* Official Government Header */}
            <div className="bg-[#003865] border-b-4 border-[#DC143C] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-bold text-sm uppercase tracking-wide">Notifications</h3>
                  {unreadCount?.count > 0 && (
                    <span className="bg-[#DC143C] text-white text-xs font-bold px-2 py-0.5 rounded">
                      {unreadCount.count}
                    </span>
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => markAllAsReadMutation.mutate()}
                    className="text-xs text-blue-100 hover:text-white font-semibold px-2 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1 border border-white/20"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#003865] mx-auto"></div>
                <p className="text-sm text-gray-600 mt-4">Loading notifications...</p>
              </div>
            ) : notifications?.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-semibold">No notifications</p>
                <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div>
                {unreadNotifications.length > 0 && (
                  <div className="p-3 bg-blue-50 border-b-2 border-blue-200">
                    <p className="text-xs font-bold text-[#003865] uppercase tracking-wide px-2">
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
                  <div className="p-3 bg-gray-50 border-b-2 border-gray-200">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide px-2">
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
        return <RefreshCw className="w-5 h-5 text-[#003865]" />;
      case "before_after_uploaded":
        return <Camera className="w-5 h-5 text-[#003865]" />;
      default:
        return <Megaphone className="w-5 h-5 text-[#DC143C]" />;
    }
  };

  return (
    <Link
      to={notification.issue ? `/issue/${notification.issue._id}` : "#"}
      onClick={!notification.read ? onMarkAsRead : undefined}
      className={`block p-4 border-b border-gray-200 hover:bg-gray-50 transition ${
        !notification.read ? "bg-blue-50 border-l-4 border-l-[#003865]" : "bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5 p-1.5 bg-gray-100 rounded border border-gray-200">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-bold text-sm ${
              !notification.read ? "text-[#003865]" : "text-gray-800"
            }`}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="w-2 h-2 bg-[#DC143C] rounded-full mt-1 flex-shrink-0"></span>
            )}
          </div>
          <p className="text-xs text-gray-700 mt-1 leading-relaxed">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            {new Date(notification.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}

