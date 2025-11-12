import { motion, AnimatePresence } from 'framer-motion';
import { BellOff, Loader2 } from 'lucide-react';
import NotificationItem from './notificationitem';

export default function NotificationList({ darkMode, notifications, selectedNotifications, getNotificationIcon, getTypeColor, formatTime, onSelectNotification, onMarkAsRead, onDelete, isLoading = false }) {
  const cardClass = `rounded-2xl border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

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
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{isLoading ? 'Loading...' : 'Try adjusting your filters or search terms'}</p>
      </motion.div>
    );
  }

  return (
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
            onSelect={() => onSelectNotification(notification.id)}
            onMarkAsRead={() => onMarkAsRead(notification.id)}
            onDelete={() => onDelete(notification.id)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

