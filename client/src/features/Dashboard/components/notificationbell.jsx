import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, X, Eye } from 'lucide-react';
import { useUserNotifications } from '../pages/notification/hooks/notification.hook';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead, markAllAsRead, refreshNotifications, isLoading } = useUserNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState(new Set());
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset visible notifications when closing
        setVisibleNotifications(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark notification as read when it becomes visible
  const handleNotificationVisible = (notificationId) => {
    if (!visibleNotifications.has(notificationId)) {
      setVisibleNotifications((prev) => new Set([...prev, notificationId]));
      // Auto-mark as read when user sees the notification
      markAsRead(notificationId);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    // Refresh to get updated counts
    refreshNotifications();
  };

  const formatTime = (date) => {
    if (!date) return 'Unknown';

    const now = new Date();
    const notificationDate = new Date(date);
    const diff = now.getTime() - notificationDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { icon: 'CheckCircle', color: 'text-green-500' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-yellow-500' };
      case 'error':
        return { icon: 'AlertTriangle', color: 'text-red-500' };
      default:
        return { icon: 'Info', color: 'text-blue-500' };
    }
  };

  // Get latest 5 notifications
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            refreshNotifications();
          }
        }}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label={`Notifications ${unreadCount > 0 ? `${unreadCount} unread` : ''}`}
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center px-1 font-medium shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead} disabled={isLoading} className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && recentNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                      onMouseEnter={() => handleNotificationVisible(notification.id)}
                    >
                      <div className="flex gap-3">
                        {/* Notification Icon */}
                        <div className={`w-2 rounded-full ${notification.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500'}`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-semibold'}`}>{notification.title}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">{formatTime(notification.timestamp)}</span>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{notification.message}</p>

                          {notification.category && <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">{notification.category}</span>}

                          {/* Auto-read indicator */}
                          {!notification.read && visibleNotifications.has(notification.id) && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                              <Eye className="w-3 h-3" />
                              <span>Marked as read</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 5 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={() => {
                    // Navigate to full notifications page
                    window.location.href = '/notifications';
                  }}
                  className="w-full text-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2"
                >
                  View all notifications ({notifications.length})
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple NotificationItem component for the dropdown
const NotificationItem = ({ notification, onMarkAsRead }) => {
  return (
    <div className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={() => onMarkAsRead(notification.id)}>
      <div className="flex justify-between items-start mb-1">
        <span className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>{notification.title}</span>
        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0 mt-1.5" />}
      </div>
      <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
      <span className="text-xs text-gray-400 mt-1 block">{formatTime(notification.timestamp)}</span>
    </div>
  );
};
