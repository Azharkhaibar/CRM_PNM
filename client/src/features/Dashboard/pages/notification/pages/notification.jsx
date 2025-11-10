import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, CheckCircle, AlertTriangle, Info, X, Search, Trash2, Settings, RefreshCw } from 'lucide-react';
import { useUserNotifications } from '../hooks/notification.hook';
import { useDarkMode } from '../../../../../shared/components/Darkmodecontext';
export default function NotificationPage() {
  const { darkMode } = useDarkMode();
  const { notifications = [], unreadCount = 0, markAsRead, markAllAsRead, removeNotification } = useUserNotifications();

  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter = filter === 'all' || (filter === 'unread' && !notif.read) || (filter === 'read' && notif.read);

    const matchesCategory = categoryFilter === 'all' || notif.category === categoryFilter;

    const matchesSearch = searchTerm === '' || notif.title?.toLowerCase().includes(searchTerm.toLowerCase()) || notif.message?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesCategory && matchesSearch;
  });

  const categories = [...new Set(notifications.map((n) => n.category).filter(Boolean))];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'system':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsLoading(true);
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeNotification(id);
      setSelectedNotifications((prev) => prev.filter((item) => item !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsLoading(true);
      await Promise.all(selectedNotifications.map((id) => removeNotification(id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
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

  const containerClass = `min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`;

  const cardClass = `rounded-2xl border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  const inputClass = `w-full px-4 py-2 rounded-lg border transition-colors duration-300 ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
  }`;

  const buttonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`;

  const primaryButtonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`;

  if (!notifications) {
    return (
      <div className={containerClass}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
              <Bell className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {unreadCount} unread of {notifications.length} total
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {selectedNotifications.length > 0 && (
              <>
                <button onClick={handleBulkDelete} disabled={isLoading} className={`${buttonClass} text-red-600 hover:text-red-700`}>
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedNotifications.length})
                </button>
                <button onClick={() => setSelectedNotifications([])} className={buttonClass}>
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}

            {selectedNotifications.length === 0 && (
              <>
                <button onClick={handleMarkAllAsRead} disabled={isLoading || unreadCount === 0} className={primaryButtonClass}>
                  <CheckCircle className="w-4 h-4" />
                  Mark All Read
                </button>
                <button onClick={() => setShowSettings(!showSettings)} className={buttonClass}>
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`${cardClass} p-6 mb-6 overflow-hidden`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Push Notifications</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span>Email Notifications</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span>Sound Alerts</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Auto-cleanup</h3>
                  <select className={inputClass}>
                    <option>Keep all notifications</option>
                    <option>Auto-delete after 30 days</option>
                    <option>Auto-delete after 7 days</option>
                    <option>Auto-delete read notifications</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`${cardClass} p-6 mb-6`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search notifications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${inputClass} pl-10`} />
            </div>

            {/* Status Filter */}
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={inputClass}>
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>

            {/* Category Filter */}
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={inputClass}>
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={handleSelectAll} className={`text-sm px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
              {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`text-sm px-3 py-1 rounded ${categoryFilter === category ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`${cardClass} p-12 text-center`}>
                <BellOff className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className="text-xl font-semibold mb-2">No notifications found</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {searchTerm || filter !== 'all' || categoryFilter !== 'all' ? 'Try adjusting your filters or search terms' : "You're all caught up! New notifications will appear here."}
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${cardClass} p-6 transition-all duration-300 ${
                    selectedNotifications.includes(notification.id)
                      ? darkMode
                        ? 'ring-2 ring-blue-500 bg-blue-900/20'
                        : 'ring-2 ring-blue-500 bg-blue-50'
                      : notification.read
                      ? darkMode
                        ? 'opacity-60'
                        : 'opacity-70'
                      : darkMode
                      ? 'ring-1 ring-blue-400/30'
                      : 'ring-1 ring-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox for selection */}
                    <input type="checkbox" checked={selectedNotifications.includes(notification.id)} onChange={() => handleSelectNotification(notification.id)} className="mt-1 rounded" />

                    {/* Notification Icon */}
                    <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className={`font-semibold ${!notification.read ? 'font-bold' : ''}`}>{notification.title}</h3>
                          {notification.category && <span className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(notification.type)}`}>{notification.category}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatTime(notification.timestamp)}</span>
                          {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                        </div>
                      </div>

                      <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{notification.message}</p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        {!notification.read && (
                          <button onClick={() => handleMarkAsRead(notification.id)} className={`text-sm px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                            Mark as Read
                          </button>
                        )}
                        <button onClick={() => handleDelete(notification.id)} className={`text-sm px-3 py-1 rounded ${darkMode ? 'bg-red-900/50 hover:bg-red-800 text-red-300' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Load More / Pagination */}
        {filteredNotifications.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center mt-8">
            <button className={`${buttonClass} ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}>
              <RefreshCw className="w-4 h-4" />
              Load More
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
