"use client";
import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { motion } from "framer-motion";
import formatTimeAgo from "../../utils/formatTimeAgo";

interface NotificationsProps {
    token: null | string;
    id: null | string;
}

interface NotificationProps {
    _id: null | string;
    content: null | string;
    createdAt: null | string; // Expecting an ISO date string
}

const Notifications: React.FC<NotificationsProps> = ({ id, token }) => {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [bellShake, setBellShake] = useState(false);

    const deleteNotifications = (notifId: string | null) => {
        if (!notifId) return;

        fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/notifications/deletenotification/${id}/${notifId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete notification");
                }
                return response.json(); // Ensure response is parsed before moving to the next `.then()`
            })
            .then(() => {
                // ✅ Remove notification from state correctly
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notif) => notif._id !== notifId)
                );
            })
            .catch((error) => {
                console.error("Error deleting Notification:", error);
            });
    };

    useEffect(() => {
        if (notifications.length > 0) {
            setBellShake(true);
            setTimeout(() => setBellShake(false), 800);
        }
    }, [notifications]);

    useEffect(() => {
        if (!id || !token) return;

        const fetchNotifications = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/notifications/getallnotifications/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setNotifications(data.allNotifs ? data.allNotifs : []);
                console.log(data.allNotifs);
            } catch (error) {
                console.log("Error getting notifications", error);
            }
        };

        fetchNotifications();
    }, [id, token]);

    return (
        <div className="relative mr-1 mt-1">
            <motion.button
                className="relative p-2 rounded focus:outline-none"
                onClick={() => setNotificationOpen(!notificationOpen)}
                animate={bellShake ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
            >
                <Bell
                    className={`w-7 h-7 ${
                        notifications.length > 0
                            ? "text-red-500"
                            : "text-gray-500"
                    }`}
                />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {notifications.length}
                    </span>
                )}
            </motion.button>

            {notificationOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-white border shadow-lg rounded-lg overflow-hidden z-50"
                >
                    <div className="p-3 text-black font-semibold border-b bg-gray-100">
                        Inbox
                    </div>

                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="flex justify-between items-start p-3 border-b last:border-0 hover:bg-gray-300 transition"
                            >
                                <div>
                                    <span className="text-black block">
                                        {notification.content}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {notification.createdAt
                                            ? formatTimeAgo(
                                                  new Date(
                                                      notification.createdAt
                                                  )
                                              )
                                            : "Unknown Time"}
                                    </span>
                                </div>
                                <button
                                    className="text-gray-400 hover:text-red-500 transition"
                                    onClick={() => {
                                        deleteNotifications(notification._id);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="p-3 text-gray-500 text-sm">
                            No new notifications
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Notifications;
