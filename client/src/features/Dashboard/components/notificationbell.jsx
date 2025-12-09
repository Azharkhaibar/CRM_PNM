import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, X, Eye, Info, AlertTriangle, User, LogIn, LogOut } from 'lucide-react';
import { useUserNotifications } from '../pages/notification/hooks/notification.hook';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth.hook';
import { useDarkMode } from '../../../shared/components/Darkmodecontext';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications, isLoading } = useUserNotifications();
  const { user } = useAuth();
  const { darkMode } = useDarkMode();

  const [isOpen, setIsOpen] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState(new Set());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setVisibleNotifications(new Set());
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(refreshNotifications, 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

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
    if (metadata?.activity_type === 'user_status') {
      return metadata?.action === 'login' ? <LogIn className="w-4 h-4 text-green-500" /> : <LogOut className="w-4 h-4 text-blue-500" />;
    }

    if (metadata?.activity_type === 'login') {
      return <LogIn className="w-4 h-4 text-green-500" />;
    }

    if (metadata?.activity_type === 'logout') {
      return <LogOut className="w-4 h-4 text-blue-500" />;
    }

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
      return metadata?.action === 'login' ? `border-l-green-400 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}` : `border-l-blue-400 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`;
    }

    switch (type) {
      case 'success':
        return `border-l-green-400 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`;
      case 'warning':
        return `border-l-yellow-400 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`;
      case 'error':
        return `border-l-red-400 ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`;
      default:
        return `border-l-blue-400 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`;
    }
  };

  const bellButtonClass = `relative p-2 rounded-lg transition-all duration-200 group ${darkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-700'}`;

  const dropdownClass = `absolute right-0 mt-2 w-96 border rounded-xl shadow-xl z-50 max-h-[80vh] flex flex-col backdrop-blur-sm ${darkMode ? 'bg-gray-800/95 border-gray-700 text-white' : 'bg-white/95 border-gray-200 text-gray-800'}`;

  const headerClass = `p-4 border-b rounded-t-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  const footerClass = `p-3 border-t ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`;

  const markAllButtonClass = `text-sm flex items-center gap-1 transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300 disabled:opacity-50' : 'text-blue-500 hover:text-blue-600 disabled:opacity-50'}`;

  const closeButtonClass = `p-1 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`;

  const emptyStateClass = `p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  const dividerClass = `divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`;

  const notificationTextClass = (read) => (read ? (darkMode ? 'text-gray-400' : 'text-gray-600') : darkMode ? 'text-white' : 'text-gray-900');

  const timeTextClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const messageTextClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const categoryClass = `inline-block mt-2 px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`;

  const viewAllButtonClass = `w-full text-center text-sm font-medium py-2 transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`;

  // Filter notifications
  const recentNotifications = notifications.slice(0, 8);

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
        className={bellButtonClass}
        aria-label={`Notifications ${unreadCount > 0 ? `${unreadCount} unread` : ''}`}
      >
        <Bell className="w-6 h-6 transition-colors" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs min-w-[20px] h-5 flex items-center justify-center px-1 font-medium shadow-lg border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className={dropdownClass}>
            <div className={headerClass}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h3>
                  <p className={`text-sm mt-1 ${timeTextClass}`}>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead} disabled={isLoading} className={markAllButtonClass}>
                      <CheckCircle className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className={closeButtonClass}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading && recentNotifications.length === 0 ? (
                <div className={emptyStateClass}>
                  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
                  <p className="text-sm">Loading notifications...</p>
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className={emptyStateClass}>
                  <Bell className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className="text-sm">No notifications yet</p>
                  <p className="text-xs mt-1 opacity-60">Notifications will appear here when users login/logout</p>
                </div>
              ) : (
                <div className={dividerClass}>
                  {recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 transition-all duration-150 flex gap-3 border-l-4 ${getNotificationColor(notif.type, notif.metadata)} ${notif.read ? 'opacity-75' : 'opacity-100'}`}
                      onMouseEnter={() => handleNotificationVisible(notif.id)}
                    >
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notif.type, notif.metadata)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-medium ${notificationTextClass(notif.read)}`}>{notif.title}</h4>
                          <span className={`text-xs whitespace-nowrap ml-2 ${timeTextClass}`}>{formatTime(notif.timestamp)}</span>
                        </div>
                        <p className={`text-sm mb-2 ${messageTextClass}`}>{notif.message}</p>

                        {notif.metadata && (notif.metadata.activity_type === 'user_status' || notif.metadata.activity_type === 'login' || notif.metadata.activity_type === 'logout') && (
                          <div className="flex items-center gap-2 mt-1">
                            <User className="w-3 h-3 opacity-60" />
                            <span className={`text-xs ${timeTextClass}`}>{notif.metadata.user_name || 'Unknown user'}</span>
                            {notif.metadata.action && (
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  notif.metadata.action === 'login' ? (darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700') : darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {notif.metadata.action}
                              </span>
                            )}
                          </div>
                        )}

                        {notif.category && <span className={categoryClass}>{notif.category}</span>}

                        {!notif.read && visibleNotifications.has(notif.id) && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-green-500">
                            <Eye className="w-3 h-3" />
                            Marked as read
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 8 && (
              <div className={footerClass}>
                <button
                  onClick={() => {
                    navigate('/dashboard/notification');
                    setIsOpen(false);
                  }}
                  className={viewAllButtonClass}
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
