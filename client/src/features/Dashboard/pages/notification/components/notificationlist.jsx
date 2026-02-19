// NotificationList.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { BellOff, Loader2, RefreshCw, CheckSquare, Square } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { useState } from 'react';

export default function NotificationList({ darkMode, notifications, selectedNotifications, getNotificationIcon, getTypeColor, formatTime, onSelectNotification, onMarkAsRead, onDelete, onRefresh, isLoading = false, isRefreshing = false }) {
  const cardClass = `rounded-2xl border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  const handleRefresh = async () => {
    console.log('🔄 Refreshing notifications...');
    try {
      if (onRefresh) {
        await onRefresh();
        console.log('✅ Refresh completed');
      }
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    }
  };

  const handleSelectNotification = (notificationId, isSelected) => {
    console.log('🔘 Selection update:', { notificationId, isSelected });
    if (onSelectNotification) {
      onSelectNotification(notificationId, isSelected);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      console.log('❌ Deselecting all notifications');
      // Pass all IDs with false to deselect all
      notifications.forEach((notif) => {
        if (onSelectNotification) {
          onSelectNotification(notif.id, false);
        }
      });
    } else {
      console.log('✅ Selecting all notifications:', notifications.length);
      // Pass all IDs with true to select all
      notifications.forEach((notif) => {
        if (onSelectNotification) {
          onSelectNotification(notif.id, true);
        }
      });
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    console.log('📝 Marking as read:', notificationId);
    try {
      if (onMarkAsRead) {
        await onMarkAsRead(notificationId);
        console.log('✅ Marked as read:', notificationId);
      }
    } catch (error) {
      console.error('❌ Failed to mark as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    console.log('🗑️ Deleting notification:', notificationId);
    try {
      if (onDelete) {
        await onDelete(notificationId);
        console.log('✅ Deleted notification:', notificationId);
      }
    } catch (error) {
      console.error('❌ Failed to delete notification:', error);
      alert('Failed to delete notification. Please try again.');
    }
  };

  if (isLoading && notifications.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${cardClass} p-12 text-center`}>
        <Loader2 className={`w-16 h-16 mx-auto mb-4 animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        <h3 className="text-xl font-semibold mb-2">Loading notifications...</h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Please wait while we fetch your notifications</p>
      </motion.div>
    );
  }

  if (notifications.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`${cardClass} p-12 text-center`}>
        <BellOff className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className="text-xl font-semibold mb-2">No notifications found</h3>
        <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{isLoading ? 'Loading...' : "You're all caught up!"}</p>
        {!isLoading && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </motion.div>
    );
  }

  const allSelected = selectedNotifications.length === notifications.length && notifications.length > 0;
  const someSelected = selectedNotifications.length > 0 && selectedNotifications.length < notifications.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Notifications ({notifications.length})<span className="ml-2 text-sm font-normal text-gray-500">• {notifications.filter((n) => !n.read).length} unread</span>
          </motion.h2>

          {notifications.length > 0 && (
            <button
              onClick={handleSelectAll}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                allSelected
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : someSelected
                  ? darkMode
                    ? 'bg-blue-900/50 text-blue-300'
                    : 'bg-blue-100 text-blue-700'
                  : darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={allSelected ? 'Deselect all' : 'Select all notifications'}
            >
              {allSelected ? <CheckSquare className="w-4 h-4" /> : someSelected ? <div className="w-4 h-4 border-2 border-current rounded" /> : <Square className="w-4 h-4" />}
              {allSelected ? 'All Selected' : someSelected ? `${selectedNotifications.length} Selected` : 'Select All'}
            </button>
          )}
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} ${
            isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Syncing...' : 'Sync'}
        </button>
      </div>

      {selectedNotifications.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
          <div className="text-sm font-medium">
            {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={index}
              darkMode={darkMode}
              isSelected={selectedNotifications.includes(notification.id)}
              getNotificationIcon={getNotificationIcon}
              getTypeColor={getTypeColor}
              formatTime={formatTime}
              onSelect={handleSelectNotification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className={`text-center pt-4 border-t ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
        <p className="text-sm">
          Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          {notifications.some((n) => n.metadata?.is_local_fallback) && <span className="ml-2 text-yellow-600 dark:text-yellow-400">• Some notifications are stored locally</span>}
          {selectedNotifications.length > 0 && <span className="ml-2 text-blue-600 dark:text-blue-400">• {selectedNotifications.length} selected</span>}
        </p>
      </motion.div>
    </div>
  );
}
