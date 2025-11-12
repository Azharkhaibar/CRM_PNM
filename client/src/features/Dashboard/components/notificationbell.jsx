import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, X, Eye, Info, AlertTriangle, User, LogIn, LogOut } from 'lucide-react';
import { useUserNotifications } from '../pages/notification/hooks/notification.hook';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth.hook';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications, isLoading } = useUserNotifications();

  const { user } = useAuth(); // Tambahkan ini untuk mendapatkan user info
  const [isOpen, setIsOpen] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState(new Set());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setVisibleNotifications(new Set());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto refresh notifications setiap 10 detik ketika dropdown terbuka
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        refreshNotifications();
      }, 10000); // Refresh setiap 10 detik

      return () => clearInterval(interval);
    }
  }, [isOpen, refreshNotifications]);

  // Auto mark as read ketika notification visible
  const handleNotificationVisible = (id) => {
    if (!visibleNotifications.has(id)) {
      setVisibleNotifications((prev) => new Set([...prev, id]));
      markAsRead(id);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refreshNotifications();
  };

  const formatTime = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now.getTime() - notifDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notifDate.toLocaleDateString();
  };

  const getNotificationIcon = (type, metadata) => {
    // ✅ FIX: Prioritize action-based icons untuk login/logout
    if (metadata?.activity_type === 'user_status') {
      return metadata?.action === 'login' ? <LogIn className="w-4 h-4 text-green-500" /> : <LogOut className="w-4 h-4 text-blue-500" />;
    }

    if (metadata?.activity_type === 'login') {
      return <LogIn className="w-4 h-4 text-green-500" />;
    }

    if (metadata?.activity_type === 'logout') {
      return <LogOut className="w-4 h-4 text-blue-500" />;
    }

    // Fallback ke type-based icons
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type, metadata) => {
    if (metadata?.activity_type === 'user_status') {
      return metadata?.action === 'login' ? 'border-l-green-400 bg-green-50 dark:bg-green-900/20' : 'border-l-blue-400 bg-blue-50 dark:bg-blue-900/20';
    }

    switch (type) {
      case 'success':
        return 'border-l-green-400 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-l-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'border-l-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-l-blue-400 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  // Filter notifications untuk exclude yang dari user sendiri (jika perlu)
  const filteredNotifications = notifications.filter((notif) => {
    // Tampilkan semua notifikasi, termasuk broadcast dan dari user lain
    return true;
  });

  const recentNotifications = filteredNotifications.slice(0, 8); // Tampilkan lebih banyak

  // Debug: Log notifications untuk troubleshooting
  useEffect(() => {
    if (isOpen) {
      console.log('🔔 Current notifications:', {
        total: notifications.length,
        unread: unreadCount,
        notifications: notifications.map((n) => ({
          id: n.id,
          title: n.title,
          userId: n.userId,
          metadata: n.metadata,
          read: n.read,
        })),
      });
    }
  }, [isOpen, notifications, unreadCount]);

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
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group"
        aria-label={`Notifications ${unreadCount > 0 ? `${unreadCount} unread` : ''}`}
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center px-1 font-medium shadow-lg border-2 border-white dark:border-gray-900"
          >
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
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-xl">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} disabled={isLoading} className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 flex items-center gap-1 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
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
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Notifications will appear here when users login/logout</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      className={`p-4 transition-all duration-150 flex gap-3 border-l-4 ${getNotificationColor(notif.type, notif.metadata)} ${notif.read ? 'opacity-75' : 'opacity-100'}`}
                      onMouseEnter={() => handleNotificationVisible(notif.id)}
                    >
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notif.type, notif.metadata)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-medium ${notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{notif.title}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">{formatTime(notif.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notif.message}</p>

                        {/* Metadata info untuk debug */}
                        {notif.metadata && (notif.metadata.activity_type === 'user_status' || notif.metadata.activity_type === 'login' || notif.metadata.activity_type === 'logout') && (
                          <div className="flex items-center gap-2 mt-1">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">{notif.metadata.user_name || 'Unknown user'}</span>
                            {notif.metadata.action && (
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  notif.metadata.action === 'login' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}
                              >
                                {notif.metadata.action}
                              </span>
                            )}
                          </div>
                        )}

                        {notif.category && <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">{notif.category}</span>}

                        {!notif.read && visibleNotifications.has(notif.id) && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                            <Eye className="w-3 h-3" />
                            Marked as read
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 8 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                <button
                  onClick={() => {
                    navigate('/dashboard/notification');
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
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
