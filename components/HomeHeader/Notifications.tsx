import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react"; // Import Bell & Close icons
import { motion } from "framer-motion"; // For smooth animation

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New message received" },
        { id: 2, message: "Your document has been uploaded" },
        { id: 3, message: "Friend request accepted" },
    ]);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [bellShake, setBellShake] = useState(false);

    // Function to remove a notification
    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    // Bell animation effect when new notifications arrive
    useEffect(() => {
        if (notifications.length > 0) {
            setBellShake(true);
            setTimeout(() => setBellShake(false), 800); // Stop shaking after 800ms
        }
    }, [notifications]);

    return (
        <div className="relative mr-1 mt-1">
            {/* Bell Icon Button */}
            <motion.button
                className="relative p-2 rounded focus:outline-none"
                onClick={() => setNotificationOpen(!notificationOpen)}
                animate={bellShake ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
                onBlur={() => setNotificationOpen(false)}
            >
                <Bell
                    className={`w-7 h-7 ${
                        notifications.length > 0
                            ? "text-red-500"
                            : "text-gray-500"
                    }`}
                />{" "}
                {/* Bell Icon */}
                {/* Notification Count Badge */}
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {notifications.length}
                    </span>
                )}
            </motion.button>

            {/* Notifications Dropdown */}
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
                                key={notification.id}
                                className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-gray-300 transition"
                            >
                                <span className="text-black">
                                    {notification.message}
                                </span>
                                <button
                                    className="text-gray-400 hover:text-red-500 transition"
                                    onClick={() =>
                                        removeNotification(notification.id)
                                    }
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
